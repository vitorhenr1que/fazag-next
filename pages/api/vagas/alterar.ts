import { prisma } from "../../../services/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse){
    const data = req.body

    const setNumberVencace = await prisma.vagas.update({
        where: {
            id: '74a46aa1-da7c-4723-ac13-fe14ffeeaf47'
        },
        select: data.course,
        data: data.value
    })

    return res.status(200).json({setNumberVencace})
}