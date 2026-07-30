import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../services/prisma';
import { uploadToR2 } from '../../../../services/r2';

export const config = { api: { bodyParser: { sizeLimit: '30mb' } } };

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });

  try {
    const courseId = String(req.query.id || '');
    const { title, category, fileName, mimeType, fileBase64, order } = req.body;
    if (!courseId || !title || !category || !fileName || !fileBase64 || mimeType !== 'application/pdf') {
      return res.status(400).json({ error: 'Informe título, categoria e um arquivo PDF.' });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return res.status(404).json({ error: 'Curso não encontrado.' });

    const body = Buffer.from(String(fileBase64), 'base64');
    if (!body.length) return res.status(400).json({ error: 'O arquivo está vazio.' });

    const key = `cursos/${course.slug}/${Date.now()}-${slugify(String(fileName))}`;
    const fileUrl = await uploadToR2({ key, body, contentType: 'application/pdf' });
    const document = await prisma.courseDocument.create({
      data: {
        courseId,
        title: String(title).trim(),
        category: String(category),
        fileName: String(fileName),
        fileKey: key,
        fileUrl,
        mimeType: 'application/pdf',
        size: body.length,
        order: Number(order) || 0,
      },
    });
    return res.status(201).json(document);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao enviar documento.' });
  }
}
