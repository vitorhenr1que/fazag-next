import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';
import { prisma } from '../../../services/prisma';
import {
  ADMIN_PERMISSIONS,
  hashPassword,
  publicAdminUser,
  requireSuperAdmin,
} from '../../../services/adminAuth';

const normalizePermissions = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((permission) => ADMIN_PERMISSIONS.includes(permission as any))
    : [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const currentUser = await requireSuperAdmin(req, res);
  if (!currentUser) return;
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Método não permitido.' });

  const id = String(req.query.id || '');
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return res.status(404).json({ error: 'Usuário não encontrado.' });

  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const active = req.body.active !== false;
  const permissions = normalizePermissions(req.body.permissions);

  if (!name || !email) return res.status(400).json({ error: 'Preencha nome e e-mail.' });
  if (password && password.length < 8) {
    return res.status(400).json({ error: 'A nova senha deve ter pelo menos 8 caracteres.' });
  }
  if (!target.isSuperAdmin && !permissions.length) {
    return res.status(400).json({ error: 'Selecione pelo menos uma permissão.' });
  }
  if (id === currentUser.id && !active) {
    return res.status(400).json({ error: 'Você não pode desativar o próprio usuário.' });
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        active,
        ...(target.isSuperAdmin
          ? {}
          : { permissions: permissions as Prisma.InputJsonValue }),
        ...(password
          ? {
              password: hashPassword(password),
              sessionVersion: { increment: 1 },
            }
          : {}),
      },
    });
    return res.status(200).json({ ...publicAdminUser(user), active: user.active, createdAt: user.createdAt });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ error: 'Já existe um usuário com este e-mail.' });
    }
    console.error(error);
    return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
}
