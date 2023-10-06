import { prisma } from "../../../services/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse){
    const data = req.body

    const setNumberVencace = await prisma.vagas.update({
        where: {
            id: 'b90b0686-f9fa-4d3f-a8f9-35c5223346fa'
        },
        select: data.course,
        data: data.value
    })

    return res.status(200).json({setNumberVencace})
}