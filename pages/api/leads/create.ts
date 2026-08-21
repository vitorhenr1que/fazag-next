
import type { NextApiRequest, NextApiResponse } from 'next'
import { PROCESSO_SELETIVO_2027_1_COURSES } from '../../../data/processoSeletivo20271'
import { prisma } from '../../../services/prisma'

type LeadBody = {
  nome?: unknown
  email?: unknown
  tel?: unknown
  course?: unknown
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ message: 'Método não permitido.' })
  }

  const body = (req.body ?? {}) as LeadBody
  const nome = typeof body.nome === 'string' ? body.nome.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const tel = typeof body.tel === 'string' ? body.tel.replace(/\D/g, '') : ''
  const course = typeof body.course === 'string' ? body.course.trim() : ''

  if (nome.length < 3 || nome.length > 120) {
    return res.status(422).json({ message: 'Informe seu nome completo.' })
  }

  if (!emailPattern.test(email) || email.length > 160) {
    return res.status(422).json({ message: 'Informe um e-mail válido.' })
  }

  if (tel.length !== 11 || tel[2] !== '9') {
    return res.status(422).json({ message: 'Informe um WhatsApp válido no formato (XX) 9XXXX-XXXX.' })
  }

  if (!PROCESSO_SELETIVO_2027_1_COURSES.some((availableCourse) => availableCourse === course)) {
    return res.status(422).json({ message: 'Selecione um curso válido.' })
  }

  try {
    const lead = await prisma.leads.create({
      data: { nome, email, tel, course },
      select: { id: true },
    })

    return res.status(201).json({ success: true, id: lead.id })
  } catch (error) {
    console.error('Erro ao cadastrar lead:', error)
    return res.status(500).json({ message: 'Não foi possível enviar seus dados. Tente novamente.' })
  }
}
