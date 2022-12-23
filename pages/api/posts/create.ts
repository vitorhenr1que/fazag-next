import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../services/prisma"

type PostProps = {
    
        author: string,
        content: string,
        description?: string,
        image: string,
        published: boolean,
        title: string,
        date: string,
        avatar?: string,
    
}

export default async (req: NextApiRequest,res: NextApiResponse) => {

if(req.method === 'POST'){
    
       return res.status(200).json({})
} else {
    res.send('Erro')
}



   
}