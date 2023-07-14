
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../services/prisma";
import { PrismaClient } from "@prisma/client";


export default async function (req: NextApiRequest, res: NextApiResponse){

    const data = req.body

if(req.method === 'POST'){
    const createMatriculas = await prisma.matriculas.create({
        data: {
            nome: data.nome,
            email: data.email,
            tel: data.tel,
            cidade: data.cidade,
            como_soube: data.como_soube,
            form_ingresso: data.form_ingresso,
            curso: data.curso, //Deixei "curso" e não "course"
            redacao: data.redacao
        }
    })

    return res.status(201).json({createMatriculas})
} else {
   return res.send('erro')
}

}