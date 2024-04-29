import { NextApiRequest, NextApiResponse } from "next";
import { mailOptions, transporter } from '../../../services/nodemailerPs'
export default async function (req: NextApiRequest, res: NextApiResponse) {



if(req.method === 'POST'){

    
    const data: any = req.body
    const {from, to} = mailOptions
    console.log('from', from)
    console.log('dataEmail: ', data.email)

    try {
        await transporter.sendMail({
           from: from,
           to: to,
           replyTo: data.email,
           text: '',
           subject: `🗣️ FAZAG | Nova Inscrição | ${data.course}`,
           html: `    <div style=" padding: 8px 10px;
           background: #ececec;
           font-family:'Open Sans','Roboto','Helvetica Neue','Helvetica','Arial', sans-serif;
           color: #757575;">
               <div style="max-width: 600px;
               margin: auto;
           padding: 15px 30px 25px 30px;
           background: white;
           border-radius: 4px;
           text-align: justify;">
               <div style="
           display: block;
           text-align: center;
           margin-top: 1rem;
           margin-bottom: 1rem;">
           <a href="/">
                <img src="https://www.fazag.edu.br/images/novainscricao.png" style="border-radius: 16px;" alt="Logo da Fazag" width=600px />
           </a>
               
           
               <h1 style="font-size: 36px;">Nova Inscrição</h1>
               </div>

               <div style="font-size: 16px;">
                    <strong>Nome:</strong> ${data.nome}
               </div>
               <div style="font-size: 16px; margin-top: 16px;">
                <strong>Celular / Whatsapp:</strong> ${data.tel}
            </div>
            <div style="font-size: 16px; margin-top: 16px;">
                <strong>E-mail:</strong> ${data.email}
            </div>
            <div style="font-size: 16px; margin-top: 16px;">
                <strong>Cidade:</strong> ${data.city}
            </div>
            <div style="font-size: 16px; margin-top: 16px;">
                <strong>Como conheceu a FAZAG:</strong> ${data.conheceu}
            </div>
            <div style="font-size: 16px; margin-top: 16px;">
                <strong>Forma de Ingresso:</strong> ${data.ingresso}
            </div>
            <div style="font-size: 16px; margin-top: 16px;">
                <strong>Curso desejado:</strong> ${data.course}
            </div>
               </div>

           </div>
           
           <div style=" padding: 8px 10px;
           background: #ececec;
           font-family:'Open Sans','Roboto','Helvetica Neue','Helvetica','Arial', sans-serif;
           color: #757575;">
               <div style="max-width: 600px;
               margin: auto;
           padding: 15px 30px 25px 30px;
           background: white;
           border-radius: 4px;
           text-align: justify;">
               <div style="
           display: block;
           text-align: center;
           margin-top: 1rem;
           margin-bottom: 1rem;">
           <h2 style="text-align: center;"> Redação </h2>

           ${data.text}
        </div>`
           
        })

        return res.status(200).json({success: true})
       }catch(err){
           console.log(err)
           return res.status(400).json({message: err})
       }
}



return res.status(400).send('Bad Request')
}