import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../services/prisma';
import { requireAdmin } from '../../../services/adminAuth';

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const courseData = (body: any) => ({
  name: String(body.name || '').trim(),
  slug: slugify(String(body.slug || body.name || '')),
  summary: body.summary ? String(body.summary).trim() : null,
  description: body.description ? String(body.description).trim() : null,
  degree: body.degree ? String(body.degree).trim() : null,
  modality: body.modality ? String(body.modality).trim() : null,
  duration: body.duration ? String(body.duration).trim() : null,
  shift: body.shift ? String(body.shift).trim() : null,
  coordinator: body.coordinator ? String(body.coordinator).trim() : null,
  active: body.active !== false,
  featured: Boolean(body.featured),
  order: Number(body.order) || 0,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const admin = req.query.admin === 'true';
      if (admin && !(await requireAdmin(req, res, 'courses'))) return;
      const courses = await prisma.course.findMany({
        where: admin ? undefined : { active: true },
        include: { documents: { orderBy: [{ category: 'asc' }, { order: 'asc' }] } },
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
      });
      return res.status(200).json(courses);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar cursos.' });
    }
  }

  if (req.method === 'POST') {
    if (!(await requireAdmin(req, res, 'courses'))) return;
    try {
      const data = courseData(req.body);
      if (!data.name || !data.slug) {
        return res.status(400).json({ error: 'Informe o nome e o endereço do curso.' });
      }
      const course = await prisma.course.create({ data });
      return res.status(201).json(course);
    } catch (error: any) {
      console.error(error);
      if (error?.code === 'P2002') {
        return res.status(409).json({ error: 'Já existe um curso com este endereço.' });
      }
      return res.status(500).json({ error: 'Erro ao criar curso.' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido.' });
}

export { courseData };
