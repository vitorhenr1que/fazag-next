import { prisma } from "../../../services/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse){
    const  {course}  = req.body
    console.log(course)
    const getNumberVencace = await prisma.vagas.findUnique({
        where: {
            id: 'b90b0686-f9fa-4d3f-a8f9-35c5223346fa'
        },
        select: course
    })


    return res.status(200).json({getNumberVencace})
}