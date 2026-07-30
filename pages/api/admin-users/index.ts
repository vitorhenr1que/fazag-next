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
  if (!(await requireSuperAdmin(req, res))) return;

  if (req.method === 'GET') {
    const users = await prisma.user.findMany({
      orderBy: [{ isSuperAdmin: 'desc' }, { name: 'asc' }, { email: 'asc' }],
    });
    return res.status(200).json(
      users.map((user) => ({
        ...publicAdminUser(user),
        active: user.active,
        createdAt: user.createdAt,
      }))
    );
  }

  if (req.method === 'POST') {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const permissions = normalizePermissions(req.body.permissions);

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Preencha nome, e-mail e senha.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres.' });
    }
    if (!permissions.length) {
      return res.status(400).json({ error: 'Selecione pelo menos uma permissão.' });
    }

    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashPassword(password),
          isSuperAdmin: false,
          permissions: permissions as Prisma.InputJsonValue,
        },
      });
      return res.status(201).json({ ...publicAdminUser(user), active: user.active, createdAt: user.createdAt });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        return res.status(409).json({ error: 'Já existe um usuário com este e-mail.' });
      }
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar usuário.' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido.' });
}
