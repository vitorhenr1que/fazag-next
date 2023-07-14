import { NextApiRequest, NextApiResponse } from "next";
import { mailOptions, transporter } from "../../../services/nodemailder";


export default async function (req: NextApiRequest, res: NextApiResponse) {
if(req.method === 'POST'){
    const data: any = req.body
    const course = data.course[0].toUpperCase() + data.course.substring(1)
    try {
        await transporter.sendMail({
           ...mailOptions,
           subject: `🗣️ FAZAG | Matriz Curricular do curso de ${course}`,
           text: data.text,
           replyTo: data.email,
           cc: data.emailCoordenador,
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
               <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKVUkhi1d74Fvy0zYLwNECJ_RZRyL17BqVc7WkNElKsKTK3Dx05TXoldW6hw8tdsxxIyg&usqp=CAU" alt="Logo da Fazag" width=150px />
   
               <h1>Mensagem | Coordenadores</h1>
               </div>
               
               <p><strong>Nome: </strong>
               <br/>${data.nome}</p><hr />
   
               <p><strong>E-mail: </strong>
               <br/>${data.email}</p><hr />
   
               <p><strong>Curso: </strong>
               <br/>${data.curso}</p><hr />
   
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