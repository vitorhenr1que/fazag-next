import { NextApiRequest, NextApiResponse } from "next";
import { mailOptions, transporter } from "../../../services/nodemailder";
import bannermail from '../../../public/images/bannermail.png'
export default async function (req: NextApiRequest, res: NextApiResponse) {



if(req.method === 'POST'){

    
    const data: any = req.body
    const course = data.course[0].toUpperCase() + data.course.substring(1)
    const courseLowerCase = data.course.toLowerCase()
    const {from} = mailOptions
    console.log('from', from)
    console.log('course', course)
    console.log('lowerCase', courseLowerCase)
    console.log('dataEmail: ', data.email)
    try {
        await transporter.sendMail({
           from: from,
           to: data.email,
           text: '',
           subject: `🗣️ FAZAG | Matriz Curricular do curso de ${course}`,
           html: `<div style=" padding: 50px 10px;
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
                <img src="${bannermail}" alt="Logo da Fazag" width=600px />
           </a>
               
           
               <h1>Matriz Curricular | ${course}</h1>
               </div>
               
               <p>Olá<strong> ${data.nome}</strong>, baixe a matriz do seu curso abaixo:</p>
               <p>Estamos à disposição para esclarecer qualquer dúvida relacionada à faculdade ou ao curso.</p>
               <div style="
               position: relative;
               margin-top: 3rem;
               width: 100%;
               height: 50px;
               ">
                    <a href="https://fazag.edu.br/static/matrizes/${courseLowerCase}.pdf" style="
                        position: absolute;
                        margin: 0 auto;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
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
                
               
               
           
               </div>
           
               <div>
           
               </div>
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