import { NextApiRequest, NextApiResponse } from "next";
import { mailOptions, transporter } from "../../../services/nodemailder";


export default async function (req: NextApiRequest, res: NextApiResponse) {
if(req.method === 'POST'){
    const data = req.body
    const course = data.course[0].toUpperCase() + data.course.substring(1)
    const courseLowerCase = data.course.toLowerCase()
    try {
        await transporter.sendMail({
           ...mailOptions,
           subject: `🗣️ FAZAG | Matriz Curricular do curso de ${course}`,
           text: data.text,
           replyTo: data.email,
           cc: data.emailCoordenador,
           html: `<div style=" padding: 50px 10px;
           background: #121212;
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
           
               <h1>Matriz Curricular | ${course}</h1>
               </div>
               
               <p>Olá<strong> ${data.nome}</strong>, baixe a matriz do seu curso abaixo:</p>
               <p>Estamos à disposição para esclarecer qualquer dúvida relacionada à faculdade ou ao curso.</p>
               <a href="https://fazag.edu.br/static/matrizes/${courseLowerCase}.pdf" style="
                   cursor: pointer;
                   text-decoration: none;
                   text-align: center;
                   background: #479eff;
                   padding: 1rem;
                   border-radius: 50px;
                   width: 45%;
                   color: #fff;
                   font-weight: 600;
                   font-size: 1rem;
                   transition: .2s;
                   border: none;
               ">Baixar matriz curricular</a>
           
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