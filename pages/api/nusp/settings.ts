import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../services/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      let settings = await prisma.nuspSettings.findUnique({
        where: { id: 'settings' }
      });

      if (!settings) {
        settings = await prisma.nuspSettings.create({
          data: { id: 'settings', availableDays: '3' }
        });
      }

      return res.status(200).json(settings);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar configurações' });
    }
  }

  if (req.method === 'POST') {
    const { availableDays } = req.body;

    try {
      const settings = await prisma.nuspSettings.upsert({
        where: { id: 'settings' },
        update: { availableDays: availableDays || "" },
        create: { id: 'settings', availableDays: availableDays || "" }
      });

      return res.status(200).json(settings);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao salvar configurações' });
    }
  }

  return res.status(405).end();
}
