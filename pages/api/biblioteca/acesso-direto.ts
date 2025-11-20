import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../services/prisma";
import axios from "axios";



export default async function (req: NextApiRequest, res: NextApiResponse){

    const data: any = req.body

if(req.method === 'POST'){
   
        const sort = Math.floor(Math.random() * 300)

        const xmlData = `<?xml version="1.0" encoding="utf-8"?>
                            <CreateAuthenticatedUrlRequest xmlns="http://dli.zbra.com.br"
                            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                            <FirstName>Aluno</FirstName>
                            <LastName>FAZAG</LastName>
                            <Email>aluno${sort}</Email>
                        </CreateAuthenticatedUrlRequest>`

            console.log('TESTE DO XML -->> ', xmlData)
        const AuthURL = await axios.post('https://integracao.dli.minhabiblioteca.com.br/DigitalLibraryIntegrationService/AuthenticatedUrl', 
            xmlData, {
            headers: { 
                "Content-Type": "application/xml",
                "X-DigitalLibraryIntegration-API-Key": process.env.MINHA_BIBLIOTECA_API_KEY,
                
            },
            
        })

        const match = AuthURL.data.match(/<AuthenticatedUrl>(.*?)<\/AuthenticatedUrl>/);
        const url = match ? match[1] : null;


    return res.status(201).json({url})
} else {
   return res.send('erro')
}

}