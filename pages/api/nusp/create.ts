import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../services/prisma";



export default async function (req: NextApiRequest, res: NextApiResponse){

    const data: any = req.body
    console.log('ESSE É A DATA: ', data)

    if (req.method === 'POST') {
        const { nome, email, vinculo, horario, dataAgendada } = data;

        // Check if appointment already exists
        const existingAppointment = await prisma.nusp.findFirst({
            where: {
                dataAgendada,
                horario
            }
        });

        if (existingAppointment) {
            return res.status(400).json({ error: 'Este horário já está agendado para esta data.' });
        }

        const createNusp = await prisma.nusp.create({
            data: {
                nome,
                email,
                vinculo,
                horario,
                dataAgendada
            }
        });

        return res.status(201).json({ createNusp })
    } else {
        return res.status(405).json({ error: 'Método não permitido' })
    }

}