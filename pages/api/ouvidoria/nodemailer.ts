import { NextApiRequest, NextApiResponse } from "next";
import { mailOptions, transporter } from "../../../services/nodemailder";


export default async function (req: NextApiRequest, res: NextApiResponse) {
if(req.method === 'POST'){
    const data = req.body

    try {
        await transporter.sendMail({
           ...mailOptions,
           subject: '🗣️ Ouvidoria | Nova mensagem 🗣️',
           cc: 'ouvidoria@fazag.edu.br',
           //bcc: 'caroll_moutinho@hotmail.com',
           text: data.text,
           replyTo: data.email,
           html: `
           <div style=" padding: 50px 10px;
           background: #fca253;
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
               <img src="https://www.fazag.edu.br/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo-fazag.64827973.png&w=256&q=75" alt="Logo da Fazag" width=150px />
   
               <h1>Mensagem | Ouvidoria</h1>
               </div>
               
               <p><strong>Nome: </strong>
               <br/>${data.nome}</p><hr />
   
               <p><strong>E-mail: </strong>
               <br/>${data.email}</p><hr />
   
               <p><strong>Vínculo: </strong>
               <br/>${data.vinculo}</p><hr />
   
               <p><strong>Motivo: </strong>
               <br/>${data.motivo}</p><hr />
   
               <p><strong>Procurou setor responsável: </strong>
               <br/>${data.procurouSetor}</p><hr />
   
               <p><strong>Mensagem: </strong>
               <br/>${data.text}</p>
               </div>
   
               <div>
   
               </div>
           </div>`,
           
        })
        return res.status(200).json({success: true})
       }catch(err){
           console.log(err)
           return res.status(400).json({message: err})
       }
}



return res.status(400).send('Bad Request')
}