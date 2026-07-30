import type { NextApiRequest, NextApiResponse } from 'next';
import { readFile } from 'fs/promises';
import path from 'path';
import { prisma } from '../../../services/prisma';
import { deleteFromR2, downloadFromR2, uploadToR2 } from '../../../services/r2';
import { getCourseDocumentFolder } from '../../../services/courseDocuments';

const requiredR2Variables = [
  'R2_ACCOUNT_ID',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET_NAME',
  'R2_PUBLIC_BASE_URL',
];

const isR2Configured = () => requiredR2Variables.every((name) => Boolean(process.env[name]));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allDocuments = await prisma.courseDocument.findMany({
    include: { course: { select: { slug: true } } },
    orderBy: { createdAt: 'asc' },
  });
  const documents = allDocuments.filter((document) => {
    const folder = getCourseDocumentFolder(document.category);
    return !document.fileKey.startsWith(`${folder}/`);
  });
  const pending = documents.length;

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

  const publicDirectory = path.resolve(process.cwd(), 'public');
  const results: Array<{ id: string; status: 'migrated' | 'failed'; error?: string }> = [];

  for (const document of documents) {
    try {
      const folder = getCourseDocumentFolder(document.category);
      const legacyRelativePath = document.fileUrl.startsWith('/static/')
        ? document.fileUrl.replace(/^\//, '')
        : document.category === 'GRADE_DOCENTE'
          ? `static/horarios/${document.fileName}`
          : document.category === 'MATRIZ_CURRICULAR'
            ? `static/matrizes/${document.fileName}`
            : '';
      if (!legacyRelativePath) throw new Error('Não foi possível localizar o arquivo original.');

      const localPath = path.resolve(publicDirectory, legacyRelativePath);
      if (!localPath.startsWith(`${publicDirectory}${path.sep}`)) {
        throw new Error('Caminho de documento inválido.');
      }

      let body: Buffer;
      try {
        body = await readFile(localPath);
      } catch (localError: any) {
        if (!document.fileKey || localError?.code !== 'ENOENT') throw localError;
        body = await downloadFromR2(document.fileKey);
      }
      const safeName = document.fileName.replace(/[^a-zA-Z0-9._-]+/g, '-').toLowerCase();
      const key = `${folder}/${safeName}`;
      const fileUrl = await uploadToR2({ key, body, contentType: 'application/pdf' });
      const previousKey = document.fileKey;

      await prisma.courseDocument.update({
        where: { id: document.id },
        data: { fileKey: key, fileUrl, size: body.length },
      });
      if (previousKey && previousKey !== key) {
        try {
          await deleteFromR2(previousKey);
        } catch (cleanupError) {
          console.error(`Documento migrado, mas o objeto antigo ${previousKey} não pôde ser removido:`, cleanupError);
        }
      }
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
