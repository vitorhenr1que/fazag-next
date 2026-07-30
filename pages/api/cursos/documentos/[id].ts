import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../services/prisma';
import { deleteFromR2 } from '../../../../services/r2';
import { requireAdmin } from '../../../../services/adminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Método não permitido.' });
  if (!(await requireAdmin(req, res, 'courses'))) return;

  try {
    const id = String(req.query.id || '');
    const document = await prisma.courseDocument.findUnique({ where: { id } });
    if (!document) return res.status(404).json({ error: 'Documento não encontrado.' });

    if (document.fileKey) await deleteFromR2(document.fileKey);
    await prisma.courseDocument.delete({ where: { id } });
    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao excluir documento.' });
  }
}
