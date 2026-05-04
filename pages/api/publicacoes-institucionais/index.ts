import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../services/prisma';
import { uploadToR2 } from '../../../services/r2';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '30mb',
    },
  },
};

const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
  .replace(/^-+|-+$/g, '');

const parseNullableDate = (value: any) => {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
};

const buildPublicVisibilityFilter = (now: Date) => ({
  published: true,
  OR: [
    { alwaysPublished: true },
    {
      alwaysPublished: false,
      publishAt: { lte: now },
      OR: [{ unpublishAt: null }, { unpublishAt: { gt: now } }],
    },
  ],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const includeDrafts = req.query.admin === 'true';
      const now = new Date();

      const publications = await prisma.institutionalPublication.findMany({
        where: includeDrafts ? undefined : buildPublicVisibilityFilter(now),
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      });

      return res.status(200).json(publications);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar publicaÃ§Ãµes institucionais' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, category, description, fileName, mimeType, fileBase64, published, order, alwaysPublished, publishAt, unpublishAt } =
        req.body;

      if (!title || !category || !fileName || !mimeType || !fileBase64) {
        return res.status(400).json({ error: 'Preencha tÃ­tulo, categoria e arquivo' });
      }

      if (!allowedMimeTypes.includes(mimeType)) {
        return res.status(400).json({ error: 'Envie apenas PDF, JPG, PNG ou WEBP' });
      }

      const body = Buffer.from(String(fileBase64), 'base64');
      const fileType = mimeType === 'application/pdf' ? 'pdf' : 'image';
      const key = `publicacoes-institucionais/${Date.now()}-${slugify(fileName)}`;
      const fileUrl = await uploadToR2({
        key,
        body,
        contentType: mimeType,
      });

      const nextAlwaysPublished = alwaysPublished === undefined ? true : Boolean(alwaysPublished);
      const parsedPublishAt = parseNullableDate(publishAt);
      const parsedUnpublishAt = parseNullableDate(unpublishAt);
      const now = new Date();

      if (!nextAlwaysPublished && parsedPublishAt === null && publishAt !== undefined && publishAt !== null && publishAt !== '') {
        return res.status(400).json({ error: 'Data de publicação inválida' });
      }

      if (!nextAlwaysPublished && parsedUnpublishAt === null && unpublishAt !== undefined && unpublishAt !== null && unpublishAt !== '') {
        return res.status(400).json({ error: 'Data de despublicação inválida' });
      }

      if (!nextAlwaysPublished && parsedPublishAt && parsedUnpublishAt && parsedPublishAt.getTime() >= parsedUnpublishAt.getTime()) {
        return res.status(400).json({ error: 'A data de publicação deve ser anterior à data de despublicação' });
      }

      const normalizedPublishAt = nextAlwaysPublished
        ? null
        : parsedPublishAt
          ? parsedPublishAt
          : now;

      const publication = await prisma.institutionalPublication.create({
        data: {
          title,
          category,
          description: description || null,
          fileName,
          fileKey: key,
          fileUrl,
          fileType,
          mimeType,
          size: body.length,
          published: published !== false,
          order: Number(order) || 0,
          alwaysPublished: nextAlwaysPublished,
          publishAt: normalizedPublishAt,
          unpublishAt: nextAlwaysPublished ? null : parsedUnpublishAt,
        },
      });

      return res.status(201).json(publication);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar publicaÃ§Ã£o institucional' });
    }
  }

  return res.status(405).json({ error: 'MÃ©todo nÃ£o permitido' });
}
