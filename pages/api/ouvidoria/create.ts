
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../services/prisma";



export default async function (req: NextApiRequest, res: NextApiResponse){

    const data = req.body

if(req.method === 'POST'){
    const createOuvidoria = await prisma.ouvidoria.create({
        data: {
            nome: data.nome,
            email: data.email,
            motivo: data.motivo,
            procurouSetor: data.procurouSetor,
            text: data.text,
            vinculo: data.vinculo
        }
    })

    return res.status(201).json({createOuvidoria})
} else {
   return res.send('erro')
}

}