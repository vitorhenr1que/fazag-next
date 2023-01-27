import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../services/prisma";


export default async function (req: NextApiRequest, res: NextApiResponse){
if(req.method === 'POST'){
    const data = req.body
    const coord = await prisma.coordenador.create({
        data: {
            nome: data.nome,
            email: data.email,
            curso: data.curso,
            text: data.text
        }
    })
    return res.status(200).json({coord})
} else {
    return res.send('erro')
}
}