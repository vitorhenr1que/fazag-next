import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../services/prisma";



export default async function (req: NextApiRequest, res: NextApiResponse){

    const data: any = req.body
    console.log('ESSE É A DATA: ', data)
     
if(req.method === 'POST'){
    const findNusp = await prisma.nusp.findMany(
        {
            where: {
                dataAgendada: data.dataAgendada
            }
        }
    )

    return res.status(201).json(findNusp)
} else {
   return res.send('erro')
}

}