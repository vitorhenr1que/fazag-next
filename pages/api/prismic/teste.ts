import type { NextApiRequest, NextApiResponse } from "next";

type Trigger = {
  type?: string;
  domain?: string;
  apiUrl?: string;
  secret?: string;
  [k: string]: unknown;
};

function sanitizeHeaders(h: NextApiRequest["headers"]) {
  const clone: Record<string, string | string[] | undefined> = { ...h };
  if (clone.authorization) clone.authorization = "[redacted]";
  if (clone["x-prismic-secret"]) clone["x-prismic-secret"] = "[redacted]";
  if (clone.cookie) clone.cookie = "[redacted]";
  return clone;
}

function parseBody(input: unknown): unknown {
  if (typeof input === "string") {
    try { return JSON.parse(input); } catch { return input; }
  }
  return input ?? null;
}

function buildTriggerFromQuery(q: NextApiRequest["query"]): Trigger | null {
  // Se o Prismic estiver chamando via GET sem body, tentamos montar um "trigger" a partir da query
  const type   = typeof q.type === "string" ? q.type : undefined;
  const domain = typeof q.domain === "string" ? q.domain : undefined;
  const apiUrl = typeof q.apiUrl === "string" ? q.apiUrl : undefined;
  const secret = typeof q.secret === "string" ? q.secret : undefined;

  const hasAny = type || domain || apiUrl || secret;
  return hasAny ? { type, domain, apiUrl, secret } : null;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const bodyParsed = parseBody(req.body);

  // Se o body já for um objeto no formato do trigger, usamos ele;
  // senão, tentamos montar o trigger a partir da query string.
  const triggerFromBody =
    bodyParsed && typeof bodyParsed === "object" ? (bodyParsed as Trigger) : null;
  const triggerFromQuery = buildTriggerFromQuery(req.query);

  const info = {
    method: req.method,
    url: req.url,
    query: req.query,
    headers: sanitizeHeaders(req.headers),
    bodyType: typeof req.body,
    body: bodyParsed,            // pode ser objeto, string ou null
    trigger: triggerFromBody ?? triggerFromQuery ?? null, // <--- AQUI
    now: Date.now(),
  };

  // Log seguro no servidor
  console.log("[debug-webhook]", JSON.stringify(info, null, 2));

  return res.status(200).json(info);
}