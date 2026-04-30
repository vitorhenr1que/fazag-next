import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../services/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { ano, year } = req.query;
    
    // Support both Portuguese and English names
    const targetYear = Number(ano || year) || new Date().getFullYear();
    
    try {
      // Always look for the unified "anual" record first
      let calendar = await prisma.academicCalendar.findFirst({
        where: { 
          year: targetYear,
          semester: 'anual'
        }
      });

      // Fallback: If no unified record, look for any record for this year (migration/legacy support)
      if (!calendar) {
        calendar = await prisma.academicCalendar.findFirst({
          where: { year: targetYear },
          orderBy: { semester: 'asc' }
        });
      }

      if (!calendar) {
        return res.status(200).json({ data: [], year: targetYear });
      }
      
      const { full } = req.query;
      return res.status(200).json(full ? calendar : calendar.data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar calendário' });
    }
  }

  if (req.method === 'POST') {
    const { calendarData, ano, year, data } = req.body;

    const targetYear = Number(ano || year || calendarData?.year);
    const targetData = data || calendarData?.data;

    if (!targetYear || !targetData) {
      return res.status(400).json({ 
        error: 'Dados incompletos', 
        received: { targetYear, hasData: !!targetData } 
      });
    }

    try {
      // Always save as "anual" to unify the whole year
      const existing = await prisma.academicCalendar.findFirst({
        where: { 
          year: targetYear, 
          semester: 'anual' 
        }
      });

      let result;
      if (existing) {
        result = await prisma.academicCalendar.update({
          where: { id: existing.id },
          data: {
            data: targetData,
          }
        });
      } else {
        result = await prisma.academicCalendar.create({
          data: {
            year: targetYear,
            semester: 'anual',
            data: targetData,
          }
        });
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao salvar calendário' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
