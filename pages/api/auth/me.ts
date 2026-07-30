import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdminUser } from '../../../services/adminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido' });
  const user = await getAdminUser(req);
  if (!user) return res.status(401).json({ error: 'Sessão inválida' });
  return res.status(200).json({ user });
}
