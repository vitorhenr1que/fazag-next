
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../services/prisma";

interface DataProps {
    nome: string
    city: string
    conheceu: string
    course: string
    email: string
    ingresso: string
    tel: string
    
}

export default async function (req: NextApiRequest, res: NextApiResponse){

    const data: DataProps = req.body
    console.log(req.method)
if(req.method === 'POST' || req.method === 'post' ){
    const novoinscrito = await prisma.inscricao.create({
        data: {
            nome: data.nome,
            cidade: data.city,
            conheceu: data.conheceu,
            curso: data.course,
            email: data.email,
            ingresso: data.ingresso,
            telefone: data.tel
        }
    })

    return res.status(200).json(novoinscrito)
} else {
   return res.send('erro')
}

}