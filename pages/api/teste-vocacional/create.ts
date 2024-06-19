
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../services/prisma";



export default async function (req: NextApiRequest, res: NextApiResponse){

    const data: any = req.body

if(req.method === 'POST'){
    const createVocacional = await prisma.vocacional.create({
        data: {
            nome: data.nome,
            email: data.email,
            courseOne: data.courseOne,
            courseTwo: data.courseTwo,
            courseTree: data.courseTree,
            tel: data.tel
        }
    })

    return res.status(201).json({createVocacional})
} else {
   return res.send('erro')
}

}