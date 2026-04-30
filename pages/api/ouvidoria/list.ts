import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../services/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { 
        page = '1', 
        limit = '10', 
        search = '', 
        motivo = '', 
        vinculo = '', 
        startDate,
        endDate,
        semester,
        year
      } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const where: any = {};

      if (search) {
        const searchStr = String(search);
        // Split by OR operator (+)
        const orGroups = searchStr.split('+').map(s => s.trim()).filter(Boolean);
        
        if (orGroups.length > 0) {
          where.OR = orGroups.map(group => {
            // Split by AND operator (*)
            const andTerms = group.split('*').map(s => s.trim()).filter(Boolean);
            
            if (andTerms.length > 1) {
              return {
                AND: andTerms.map(term => ({
                  OR: [
                    { nome: { contains: term } },
                    { email: { contains: term } },
                    { text: { contains: term } }
                  ]
                }))
              };
            } else {
              return {
                OR: [
                  { nome: { contains: andTerms[0] } },
                  { email: { contains: andTerms[0] } },
                  { text: { contains: andTerms[0] } }
                ]
              };
            }
          });
        }
      }

      if (motivo) {
        where.motivo = String(motivo);
      }

      if (vinculo) {
        where.vinculo = String(vinculo);
      }

      if (startDate && endDate) {
        where.data = {
          gte: new Date(String(startDate)),
          lte: new Date(String(endDate))
        };
      } else if (semester && year) {
        const y = Number(year);
        if (semester === '1') {
          where.data = {
            gte: new Date(y, 0, 1),
            lte: new Date(y, 5, 30, 23, 59, 59)
          };
        } else if (semester === '2') {
          where.data = {
            gte: new Date(y, 6, 1),
            lte: new Date(y, 11, 31, 23, 59, 59)
          };
        }
      }

      const [records, total] = await Promise.all([
        prisma.ouvidoria.findMany({
          where,
          orderBy: {
            data: 'desc'
          },
          skip,
          take
        }),
        prisma.ouvidoria.count({ where })
      ]);

      return res.status(200).json({
        records,
        total,
        hasMore: skip + take < total
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar registros da ouvidoria' });
    }
  }

  return res.status(405).end();
}
