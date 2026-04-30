import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../services/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const appointments = await prisma.nusp.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });

      return res.status(200).json(appointments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
  }

  return res.status(405).end();
}
