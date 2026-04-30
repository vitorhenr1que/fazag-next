import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../services/prisma';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== hashedPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // In a real app, you would set a session cookie or JWT here.
    // For this implementation, we'll return the user info and handle session in AuthContext.
    return res.status(200).json({ 
      message: 'Login realizado com sucesso!',
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao realizar login' });
  }
}
