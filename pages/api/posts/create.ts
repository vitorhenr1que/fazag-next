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
const data = req.body
if(req.method === 'POST'){
    const createPost = await prisma.post.create({
        data: {
            title: data.title,
            description: data.description,
            author: data.author,
            content: data.content,
            image: data.image,
            published: data.published,
            avatar: data.avatar,
        }
    })
       return res.status(200).json({createPost})
} else {
    res.send('Erro')
}



   
}