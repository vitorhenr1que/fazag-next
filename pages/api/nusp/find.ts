import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../services/prisma";



export default async function (req: NextApiRequest, res: NextApiResponse){

    const data: any = req.body
    console.log('ESSE É A DATA: ', data)
     console.log('method: ', req.method)
if(req.method === 'POST'){
    const findNusp = await prisma.nusp.findMany(
        {
            where: {
                dataAgendada: data.dataAgendada
            }
        }
    )
    console.log('find nusp: ', findNusp)
    return res.status(201).json(findNusp)
} else {
   return res.send('erro')
}

}