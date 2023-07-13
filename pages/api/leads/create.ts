
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../services/prisma";


export default async function (req: NextApiRequest, res: NextApiResponse){

    const data = req.body

if(req.method === 'POST'){
    const leadsCreate = await prisma.leads.create({
        data: {
            nome: data.nome,
            course: data.course,
            tel: data.tel,
            email: data.email
        }
    })

    return res.status(201).json(leadsCreate)
} else {
   return res.send('erro')
}

}