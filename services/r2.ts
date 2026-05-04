import crypto from 'crypto';

type R2UploadInput = {
  key: string;
  body: Buffer;
  contentType: string;
};

const getEnv = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variavel de ambiente ausente: ${name}`);
  }
  return value;
};

const toBinary = (value: Buffer | Uint8Array | string) =>
  typeof value === 'string' ? value : new Uint8Array(value);

const hmac = (key: Uint8Array | string, value: string) =>
  new Uint8Array(crypto.createHmac('sha256', key).update(value).digest());
const hash = (value: Buffer | Uint8Array | string) =>
  crypto.createHash('sha256').update(toBinary(value)).digest('hex');

const encodeKey = (key: string) => key.split('/').map(encodeURIComponent).join('/');

const getSigningKey = (secret: string, dateStamp: string) => {
  const dateKey = hmac(`AWS4${secret}`, dateStamp);
  const regionKey = hmac(dateKey, 'auto');
  const serviceKey = hmac(regionKey, 's3');
  return hmac(serviceKey, 'aws4_request');
};

const createSignedRequest = ({
  method,
  key,
  body,
  contentType,
  contentDisposition,
}: {
  method: 'PUT' | 'DELETE';
  key: string;
  body?: Buffer;
  contentType?: string;
  contentDisposition?: string;
}) => {
  const accountId = getEnv('R2_ACCOUNT_ID');
  const accessKeyId = getEnv('R2_ACCESS_KEY_ID');
  const secretAccessKey = getEnv('R2_SECRET_ACCESS_KEY');
  const bucketName = getEnv('R2_BUCKET_NAME');
  const host = `${accountId}.r2.cloudflarestorage.com`;
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = body ? hash(body) : hash('');
  const canonicalUri = `/${bucketName}/${encodeKey(key)}`;

  const headers: Record<string, string> = {
    host,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate,
  };

  if (contentType) headers['content-type'] = contentType;
  if (contentDisposition) headers['content-disposition'] = contentDisposition;

  const sortedHeaderNames = Object.keys(headers).sort();
  const canonicalHeaders = sortedHeaderNames.map((header) => `${header}:${headers[header]}\n`).join('');
  const signedHeaders = sortedHeaderNames.join(';');
  const canonicalRequest = [
    method,
    canonicalUri,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const scope = `${dateStamp}/auto/s3/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    scope,
    hash(canonicalRequest),
  ].join('\n');

  const signature = crypto.createHmac('sha256', getSigningKey(secretAccessKey, dateStamp)).update(stringToSign).digest('hex');

  headers.authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return {
    url: `https://${host}${canonicalUri}`,
    headers,
  };
};

export const getR2PublicUrl = (key: string) => {
  const baseUrl = getEnv('R2_PUBLIC_BASE_URL').replace(/\/$/, '');
  return `${baseUrl}/${encodeKey(key)}`;
};

export const uploadToR2 = async ({ key, body, contentType }: R2UploadInput) => {
  const signed = createSignedRequest({
    method: 'PUT',
    key,
    body,
    contentType,
  });

  const response = await fetch(signed.url, {
    method: 'PUT',
    headers: signed.headers,
    body: toBinary(body),
  });

  if (!response.ok) {
    throw new Error(`Erro ao enviar arquivo para o R2: ${response.status} ${await response.text()}`);
  }

  return getR2PublicUrl(key);
};

export const deleteFromR2 = async (key: string) => {
  const signed = createSignedRequest({ method: 'DELETE', key });
  const response = await fetch(signed.url, {
    method: 'DELETE',
    headers: signed.headers,
  });

  if (!response.ok && response.status !== 404) {
    throw new Error(`Erro ao remover arquivo do R2: ${response.status} ${await response.text()}`);
  }
};
