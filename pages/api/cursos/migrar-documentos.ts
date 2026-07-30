import type { NextApiRequest, NextApiResponse } from 'next';
import { readFile } from 'fs/promises';
import path from 'path';
import { prisma } from '../../../services/prisma';
import { uploadToR2 } from '../../../services/r2';

const requiredR2Variables = [
  'R2_ACCOUNT_ID',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET_NAME',
  'R2_PUBLIC_BASE_URL',
];

const isR2Configured = () => requiredR2Variables.every((name) => Boolean(process.env[name]));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pending = await prisma.courseDocument.count({ where: { fileKey: '' } });

  if (req.method === 'GET') {
    return res.status(200).json({ configured: isR2Configured(), pending });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  if (!isR2Configured()) {
    return res.status(503).json({
      error: 'Configure as variáveis do Cloudflare R2 antes de migrar os documentos.',
      missing: requiredR2Variables.filter((name) => !process.env[name]),
    });
  }

  const documents = await prisma.courseDocument.findMany({
    where: { fileKey: '' },
    include: { course: { select: { slug: true } } },
    orderBy: { createdAt: 'asc' },
  });
  const publicDirectory = path.resolve(process.cwd(), 'public');
  const results: Array<{ id: string; status: 'migrated' | 'failed'; error?: string }> = [];

  for (const document of documents) {
    try {
      if (!document.fileUrl.startsWith('/static/')) {
        throw new Error('O documento legado não aponta para um arquivo local.');
      }

      const localPath = path.resolve(publicDirectory, document.fileUrl.replace(/^\//, ''));
      if (!localPath.startsWith(`${publicDirectory}${path.sep}`)) {
        throw new Error('Caminho de documento inválido.');
      }

      const body = await readFile(localPath);
      const safeName = document.fileName.replace(/[^a-zA-Z0-9._-]+/g, '-').toLowerCase();
      const key = `cursos/${document.course.slug}/${Date.now()}-${document.id}-${safeName}`;
      const fileUrl = await uploadToR2({ key, body, contentType: 'application/pdf' });

      await prisma.courseDocument.update({
        where: { id: document.id },
        data: { fileKey: key, fileUrl, size: body.length },
      });
      results.push({ id: document.id, status: 'migrated' });
    } catch (error: any) {
      console.error(`Erro ao migrar o documento ${document.id}:`, error);
      results.push({ id: document.id, status: 'failed', error: error?.message || 'Erro desconhecido.' });
    }
  }

  const migrated = results.filter((result) => result.status === 'migrated').length;
  const failed = results.length - migrated;
  return res.status(failed ? 207 : 200).json({ migrated, failed, results });
}
