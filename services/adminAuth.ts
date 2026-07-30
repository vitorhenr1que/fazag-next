import crypto from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from './prisma';

export const ADMIN_PERMISSIONS = [
  'courses',
  'academic_calendar',
  'nusp',
  'ombudsman',
  'institutional_publications',
  'organization_chart',
] as const;

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number];

export interface AdminSessionUser {
  id: string;
  email: string;
  name: string | null;
  isSuperAdmin: boolean;
  permissions: AdminPermission[];
}

const COOKIE_NAME = 'fazag_admin_session';
const SESSION_DURATION_SECONDS = 60 * 60 * 12;

const getSessionSecret = () => {
  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.REVALIDATE_TOKEN ||
    process.env.DATABASE_URL;

  if (!secret) throw new Error('Configure ADMIN_SESSION_SECRET para habilitar as sessões administrativas.');
  return secret;
};

const encode = (value: string) => Buffer.from(value).toString('base64url');
const sign = (value: string) =>
  crypto.createHmac('sha256', getSessionSecret()).update(value).digest('base64url');

const parseCookies = (req: NextApiRequest) =>
  Object.fromEntries(
    String(req.headers.cookie || '')
      .split(';')
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const separator = cookie.indexOf('=');
        return [cookie.slice(0, separator), decodeURIComponent(cookie.slice(separator + 1))];
      })
  );

const normalizePermissions = (permissions: unknown): AdminPermission[] => {
  if (!Array.isArray(permissions)) return [];
  return permissions.filter((permission): permission is AdminPermission =>
    ADMIN_PERMISSIONS.includes(permission as AdminPermission)
  );
};

export const publicAdminUser = (user: {
  id: string;
  email: string;
  name: string | null;
  isSuperAdmin: boolean;
  permissions: unknown;
}): AdminSessionUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  isSuperAdmin: user.isSuperAdmin,
  permissions: user.isSuperAdmin ? [...ADMIN_PERMISSIONS] : normalizePermissions(user.permissions),
});

export const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64);
  return `scrypt:${salt}:${hash.toString('hex')}`;
};

export const verifyPassword = (password: string, storedPassword: string) => {
  if (storedPassword.startsWith('scrypt:')) {
    const [, saltHex, hashHex] = storedPassword.split(':');
    if (!saltHex || !hashHex) return false;
    const expected = Buffer.from(hashHex, 'hex');
    const actual = crypto.scryptSync(password, saltHex, expected.length);
    return expected.length === actual.length && crypto.timingSafeEqual(expected as any, actual as any);
  }

  // Compatibilidade com os usuários criados pela versão anterior.
  const legacyHash = crypto.createHash('sha256').update(password).digest('hex');
  const expected = Buffer.from(storedPassword);
  const actual = Buffer.from(legacyHash);
  return expected.length === actual.length && crypto.timingSafeEqual(expected as any, actual as any);
};

export const isLegacyPassword = (password: string) => !password.startsWith('scrypt:');

export const setAdminSession = (
  res: NextApiResponse,
  user: { id: string; sessionVersion: number }
) => {
  const payload = encode(
    JSON.stringify({
      userId: user.id,
      version: user.sessionVersion,
      expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000,
    })
  );
  const token = `${payload}.${sign(payload)}`;
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DURATION_SECONDS}${
      process.env.NODE_ENV === 'production' ? '; Secure' : ''
    }`
  );
};

export const clearAdminSession = (res: NextApiResponse) => {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${
      process.env.NODE_ENV === 'production' ? '; Secure' : ''
    }`
  );
};

export const getAdminUser = async (req: NextApiRequest): Promise<AdminSessionUser | null> => {
  try {
    const token = parseCookies(req)[COOKIE_NAME];
    if (!token) return null;
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return null;

    const expectedSignature = sign(payload);
    const expected = Buffer.from(expectedSignature);
    const actual = Buffer.from(signature);
    if (expected.length !== actual.length || !crypto.timingSafeEqual(expected as any, actual as any)) return null;

    const session = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (!session.userId || !session.expiresAt || session.expiresAt <= Date.now()) return null;

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user || !user.active || user.sessionVersion !== session.version) return null;
    return publicAdminUser(user);
  } catch {
    return null;
  }
};

export const requireAdmin = async (
  req: NextApiRequest,
  res: NextApiResponse,
  permission?: AdminPermission
) => {
  const user = await getAdminUser(req);
  if (!user) {
    res.status(401).json({ error: 'Sua sessão expirou. Entre novamente.' });
    return null;
  }
  if (permission && !user.isSuperAdmin && !user.permissions.includes(permission)) {
    res.status(403).json({ error: 'Você não tem permissão para acessar esta área.' });
    return null;
  }
  return user;
};

export const requireSuperAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await requireAdmin(req, res);
  if (!user) return null;
  if (!user.isSuperAdmin) {
    res.status(403).json({ error: 'Apenas superadministradores podem gerenciar usuários.' });
    return null;
  }
  return user;
};
