import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../services/prisma';

const fields = [
  'nome_aluno',
  'curso_aluno',
  'cpf_aluno',
  'numero_matricula',
  'nome_indicado',
  'curso_indicado',
  'telefone_indicado',
] as const;

type FormData = Record<typeof fields[number], string>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const body: unknown = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Envie um formulário válido' });
  }

  const values = body as Record<string, unknown>;
  const data = {} as FormData;

  for (const field of fields) {
    const value = values[field];
    if (typeof value !== 'string' || !value.trim() || value.trim().length > 191) {
      return res.status(400).json({
        error: `O campo ${field} é obrigatório e deve ser um texto de até 191 caracteres`,
      });
    }
    data[field] = value.trim();
  }

  try {
    const createJunteSeANos = await prisma.junteSeANos.create({ data });
    return res.status(201).json({ createJunteSeANos });
  } catch {
    return res.status(500).json({ error: 'Erro ao registrar indicação' });
  }
}
