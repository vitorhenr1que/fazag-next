import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../services/prisma"


export default async (req: NextApiRequest,res: NextApiResponse) => {
   const allPosts = await prisma.post.findMany()

   return res.status(200).json({allPosts})
}