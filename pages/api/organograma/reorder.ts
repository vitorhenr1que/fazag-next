import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../services/prisma';
import { requireAdmin } from '../../../services/adminAuth';

const wouldCreateCycle = (
  nodeId: string,
  parentId: string | null,
  nodes: Array<{ id: string; parentId: string | null }>
) => {
  const parentById = new Map(nodes.map((node) => [node.id, node.parentId]));
  let currentId = parentId;
  const visited = new Set<string>();

  while (currentId) {
    if (currentId === nodeId || visited.has(currentId)) return true;
    visited.add(currentId);
    currentId = parentById.get(currentId) || null;
  }
  return false;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });
  if (!(await requireAdmin(req, res, 'organization_chart'))) return;

  const nodeId = String(req.body.nodeId || '');
  const parentId = req.body.parentId ? String(req.body.parentId) : null;
  const requestedPosition = Number(req.body.position);

  if (!nodeId) return res.status(400).json({ error: 'Item inválido.' });

  const nodes = await prisma.organizationNode.findMany({
    select: { id: true, parentId: true, order: true },
  });
  const movingNode = nodes.find((node) => node.id === nodeId);
  if (!movingNode) return res.status(404).json({ error: 'Item não encontrado.' });
  if (parentId && !nodes.some((node) => node.id === parentId)) {
    return res.status(400).json({ error: 'O novo superior não existe.' });
  }
  if (wouldCreateCycle(nodeId, parentId, nodes)) {
    return res.status(400).json({ error: 'Esse movimento criaria um ciclo no organograma.' });
  }

  const byOrder = (a: { order: number; id: string }, b: { order: number; id: string }) =>
    a.order - b.order || a.id.localeCompare(b.id);
  const destinationSiblings = nodes
    .filter((node) => node.parentId === parentId && node.id !== nodeId)
    .sort(byOrder);
  const position = Number.isFinite(requestedPosition)
    ? Math.max(0, Math.min(Math.trunc(requestedPosition), destinationSiblings.length))
    : destinationSiblings.length;

  destinationSiblings.splice(position, 0, movingNode);

  const operations = destinationSiblings.map((node, order) =>
    prisma.organizationNode.update({
      where: { id: node.id },
      data: node.id === nodeId ? { parentId, order } : { order },
    })
  );

  if (movingNode.parentId !== parentId) {
    nodes
      .filter((node) => node.parentId === movingNode.parentId && node.id !== nodeId)
      .sort(byOrder)
      .forEach((node, order) => {
        operations.push(
          prisma.organizationNode.update({
            where: { id: node.id },
            data: { order },
          })
        );
      });
  }

  try {
    await prisma.$transaction(operations);
    return res.status(200).json({ message: 'Organograma reorganizado com sucesso.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao reorganizar o organograma.' });
  }
}
