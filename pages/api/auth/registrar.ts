import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../services/prisma';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Check if any user exists
    const userCount = await prisma.user.count();
    
    // For security, only allow creating the first user if none exist
    // Or if a secret key is provided (optional)
    if (userCount > 0) {
      return res.status(403).json({ error: 'Um usuário já existe. Use o painel para gerenciar outros usuários.' });
    }

    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Hash password using crypto (simple implementation)
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return res.status(201).json({ 
      message: 'Usuário administrador criado com sucesso!',
      user: { email: user.email, name: user.name }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao criar usuário' });
  }
}
