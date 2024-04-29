import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../services/prisma";



export default async function (req: NextApiRequest, res: NextApiResponse){

    const data: any = req.body
    console.log('ESSE É A DATA: ', data)

if(req.method === 'POST'){
    const createEgressos = await prisma.egressos.create(
        {
            data:{
                nome: data.nome,
                curso: data.curso,
                email: data.email,
                imageUrl: data.imageUrl,
                text: data.text,
                postName: data.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().replaceAll(' ', '-') // transformar o nome "João Conceição Souza" em "joao-conceicao-souza"
            }
        }
    )

    return res.status(201).json({createEgressos})
} else {
   return res.send('erro')
}

}