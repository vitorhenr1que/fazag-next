import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../services/prisma';
import { requireAdmin } from '../../../services/adminAuth';
import { normalizeNode } from './index';

const createsCycle = async (nodeId: string, parentId: string | null) => {
  let currentId = parentId;
  const visited = new Set<string>();

  while (currentId) {
    if (currentId === nodeId || visited.has(currentId)) return true;
    visited.add(currentId);
    const parent = await prisma.organizationNode.findUnique({
      where: { id: currentId },
      select: { parentId: true },
    });
    if (!parent) return false;
    currentId = parent.parentId;
  }
  return false;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await requireAdmin(req, res, 'organization_chart'))) return;
  const id = String(req.query.id || '');
  if (!id) return res.status(400).json({ error: 'Item inválido.' });

  if (req.method === 'PUT') {
    const existing = await prisma.organizationNode.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Item não encontrado.' });

    const data = normalizeNode(req.body);
    if (!data.title) return res.status(400).json({ error: 'Informe o nome do cargo ou setor.' });
    if (await createsCycle(id, data.parentId)) {
      return res.status(400).json({ error: 'Este vínculo criaria um ciclo no organograma.' });
    }

    try {
      const node = await prisma.organizationNode.update({ where: { id }, data });
      return res.status(200).json(node);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar item do organograma.' });
    }
  }

  if (req.method === 'DELETE') {
    const children = await prisma.organizationNode.count({ where: { parentId: id } });
    if (children) {
      return res.status(409).json({
        error: 'Este item possui setores vinculados. Mova ou exclua os setores subordinados primeiro.',
      });
    }

    try {
      await prisma.organizationNode.delete({ where: { id } });
      return res.status(204).end();
    } catch (error: any) {
      if (error?.code === 'P2025') return res.status(404).json({ error: 'Item não encontrado.' });
      console.error(error);
      return res.status(500).json({ error: 'Erro ao excluir item do organograma.' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido.' });
}
