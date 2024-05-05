import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../services/prisma";



export default async function (req: NextApiRequest, res: NextApiResponse){

    const data: any = req.body
    console.log('ESSE É A DATA: ', data)

if(req.method === 'POST'){
    const createNusp = await prisma.nusp.create(
        {
            data:{
                nome: data.nome,
                email: data.email,
                vinculo: data.vinculo,
                horario: data.horario,
                dataAgendada: data.dataAgendada
            }
        }
    )

    return res.status(201).json({createNusp})
} else {
   return res.send('erro')
}

}