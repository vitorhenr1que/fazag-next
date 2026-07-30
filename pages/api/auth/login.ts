import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../services/prisma';
import {
  hashPassword,
  isLegacyPassword,
  publicAdminUser,
  setAdminSession,
  verifyPassword,
} from '../../../services/adminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const user = await prisma.user.findUnique({
      where: { email: String(email).trim().toLowerCase() },
    });

    if (!user || !user.active || !verifyPassword(String(password), user.password)) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    if (isLegacyPassword(user.password)) {
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashPassword(String(password)) },
      });
    }

    setAdminSession(res, user);
    return res.status(200).json({ 
      message: 'Login realizado com sucesso!',
      user: publicAdminUser(user),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao realizar login' });
  }
}
