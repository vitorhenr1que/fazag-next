import type { NextApiRequest, NextApiResponse } from 'next';
import { clearAdminSession } from '../../../services/adminAuth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });
  clearAdminSession(res);
  return res.status(204).end();
}
