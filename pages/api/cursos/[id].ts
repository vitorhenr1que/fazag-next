import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../services/prisma';
import { deleteFromR2 } from '../../../services/r2';
import { courseData } from './index';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = String(req.query.id || '');
  if (!id) return res.status(400).json({ error: 'Curso inválido.' });

  if (req.method === 'GET') {
    const course = await prisma.course.findUnique({
      where: { id },
      include: { documents: { orderBy: [{ category: 'asc' }, { order: 'asc' }] } },
    });
    return course
      ? res.status(200).json(course)
      : res.status(404).json({ error: 'Curso não encontrado.' });
  }

  if (req.method === 'PUT') {
    try {
      const data = courseData(req.body);
      if (!data.name || !data.slug) {
        return res.status(400).json({ error: 'Informe o nome e o endereço do curso.' });
      }
      const course = await prisma.course.update({ where: { id }, data });
      return res.status(200).json(course);
    } catch (error: any) {
      console.error(error);
      if (error?.code === 'P2002') {
        return res.status(409).json({ error: 'Já existe um curso com este endereço.' });
      }
      return res.status(500).json({ error: 'Erro ao atualizar curso.' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const course = await prisma.course.findUnique({ where: { id }, include: { documents: true } });
      if (!course) return res.status(404).json({ error: 'Curso não encontrado.' });

      const cleanup = await Promise.allSettled(
        course.documents.filter((document) => document.fileKey).map((document) => deleteFromR2(document.fileKey))
      );
      cleanup.forEach((result) => {
        if (result.status === 'rejected') console.error('Erro ao remover documento do R2:', result.reason);
      });
      await prisma.course.delete({ where: { id } });
      return res.status(204).end();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao excluir curso.' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido.' });
}
