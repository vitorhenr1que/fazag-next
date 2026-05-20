import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../services/prisma';
import { deleteFromR2 } from '../../../services/r2';

const parseNullableDate = (value: any) => {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID invÃƒÂ¡lido' });
  }

  if (req.method === 'PUT') {
    try {
      const { title, category, description, published, order, alwaysPublished, publishAt, unpublishAt } = req.body;
      const nextAlwaysPublished = alwaysPublished === undefined ? undefined : Boolean(alwaysPublished);
      const parsedPublishAt = parseNullableDate(publishAt);
      const parsedUnpublishAt = parseNullableDate(unpublishAt);
      const now = new Date();

      if (
        nextAlwaysPublished === false &&
        parsedPublishAt === null &&
        publishAt !== undefined &&
        publishAt !== null &&
        publishAt !== ''
      ) {
        return res.status(400).json({ error: 'Data de publicaÃ§Ã£o invÃ¡lida' });
      }

      if (
        nextAlwaysPublished === false &&
        parsedUnpublishAt === null &&
        unpublishAt !== undefined &&
        unpublishAt !== null &&
        unpublishAt !== ''
      ) {
        return res.status(400).json({ error: 'Data de despublicaÃ§Ã£o invÃ¡lida' });
      }

      const currentPublication = await prisma.institutionalPublication.findUnique({
        where: { id },
        select: {
          publishAt: true,
          unpublishAt: true,
          alwaysPublished: true,
        },
      });

      if (!currentPublication) {
        return res.status(404).json({ error: 'PublicaÃ§Ã£o nÃ£o encontrada' });
      }

      const effectiveAlwaysPublished =
        nextAlwaysPublished === undefined ? currentPublication.alwaysPublished : nextAlwaysPublished;

      const finalPublishAt =
        effectiveAlwaysPublished === true
          ? null
          : nextAlwaysPublished === false
          ? parsedPublishAt === undefined
            ? currentPublication.publishAt || now
            : parsedPublishAt
          : parsedPublishAt === undefined
          ? currentPublication.publishAt
          : parsedPublishAt;

      const finalUnpublishAt =
        effectiveAlwaysPublished === true
          ? null
          : parsedUnpublishAt === undefined
          ? currentPublication.unpublishAt
          : parsedUnpublishAt;

      if (finalPublishAt && finalUnpublishAt && finalPublishAt.getTime() >= finalUnpublishAt.getTime()) {
        return res.status(400).json({ error: 'A data de publicaÃ§Ã£o deve ser anterior Ã  data de despublicaÃ§Ã£o' });
      }

      const publication = await prisma.institutionalPublication.update({
        where: { id },
        data: {
          ...(title !== undefined ? { title } : {}),
          ...(category !== undefined ? { category } : {}),
          ...(description !== undefined ? { description: description || null } : {}),
          ...(published !== undefined ? { published: Boolean(published) } : {}),
          ...(order !== undefined ? { order: Number(order) || 0 } : {}),
          ...(nextAlwaysPublished !== undefined || parsedPublishAt !== undefined || parsedUnpublishAt !== undefined
            ? {
                alwaysPublished: effectiveAlwaysPublished,
                publishAt: finalPublishAt,
                unpublishAt: finalUnpublishAt,
              }
            : {}),
        },
      });

      return res.status(200).json(publication);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar publicaÃƒÂ§ÃƒÂ£o' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const publication = await prisma.institutionalPublication.findUnique({ where: { id } });
      if (!publication) {
        return res.status(404).json({ error: 'PublicaÃƒÂ§ÃƒÂ£o nÃƒÂ£o encontrada' });
      }

      await deleteFromR2(publication.fileKey);
      await prisma.institutionalPublication.delete({ where: { id } });

      return res.status(204).end();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao excluir publicaÃƒÂ§ÃƒÂ£o' });
    }
  }

  return res.status(405).json({ error: 'MÃƒÂ©todo nÃƒÂ£o permitido' });
}
