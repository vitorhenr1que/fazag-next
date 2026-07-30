import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../services/prisma';
import { getOrganizationChart } from '../../../services/organizationChart';
import { requireAdmin } from '../../../services/adminAuth';
import {
  ORGANIZATION_NODE_TYPES,
  OrganizationNodeType,
} from '../../../types/organizationChart';

const normalizeNode = (body: any) => {
  const type = String(body.type || 'DEPARTMENT') as OrganizationNodeType;
  return {
    title: String(body.title || '').trim(),
    personName: body.personName ? String(body.personName).trim() : null,
    description: body.description ? String(body.description).trim() : null,
    type: ORGANIZATION_NODE_TYPES.includes(type) ? type : 'DEPARTMENT',
    parentId: body.parentId ? String(body.parentId) : null,
    order: Number.isFinite(Number(body.order)) ? Math.max(0, Number(body.order)) : 0,
    active: body.active !== false,
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const includeInactive = req.query.admin === 'true';
    if (includeInactive && !(await requireAdmin(req, res, 'organization_chart'))) return;
    try {
      return res.status(200).json(await getOrganizationChart(includeInactive));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao carregar o organograma.' });
    }
  }

  if (req.method === 'POST') {
    if (!(await requireAdmin(req, res, 'organization_chart'))) return;
    const data = normalizeNode(req.body);
    if (!data.title) return res.status(400).json({ error: 'Informe o nome do cargo ou setor.' });

    if (data.parentId) {
      const parent = await prisma.organizationNode.findUnique({ where: { id: data.parentId } });
      if (!parent) return res.status(400).json({ error: 'O vínculo superior selecionado não existe.' });
    }

    try {
      const node = await prisma.organizationNode.create({ data });
      return res.status(201).json(node);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar item do organograma.' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido.' });
}

export { normalizeNode };
