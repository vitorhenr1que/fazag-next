import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../services/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { 
        startDate, 
        endDate, 
        semester, 
        year,
        search = '' // Added search to stats
      } = req.query;

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

      const records = await prisma.ouvidoria.findMany({ where });

      // Stats by Motivo
      const byMotivoObj = records.reduce((acc: any, curr) => {
        acc[curr.motivo] = (acc[curr.motivo] || 0) + 1;
        return acc;
      }, {});

      // Stats by Vinculo
      const byVinculoObj = records.reduce((acc: any, curr) => {
        acc[curr.vinculo] = (acc[curr.vinculo] || 0) + 1;
        return acc;
      }, {});

      // Stats by Month
      const byMonthObj = records.reduce((acc: any, curr) => {
        const date = new Date(curr.data);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        acc[monthYear] = (acc[monthYear] || 0) + 1;
        return acc;
      }, {});

      const formatChartData = (obj: any) => 
        Object.entries(obj).map(([name, value]) => ({ name, value }))
          .sort((a: any, b: any) => b.value - a.value);

      return res.status(200).json({
        total: records.length,
        byMotivo: formatChartData(byMotivoObj),
        byVinculo: formatChartData(byVinculoObj),
        byMonth: Object.entries(byMonthObj)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => a.name.localeCompare(b.name))
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
  }

  return res.status(405).end();
}
