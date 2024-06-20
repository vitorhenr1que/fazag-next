import { NextApiRequest, NextApiResponse } from "next";
import { mailOptions, transporter } from "../../../services/nodemailder";



export default async function (req: NextApiRequest, res: NextApiResponse) {
    const courses: any = {
        "Administração": "O curso de Administração é ideal para quem possui habilidades em liderança, gestão e planejamento estratégico. Se você gosta de trabalhar com pessoas, gerenciar recursos e tem um espírito empreendedor, este curso pode ser a escolha perfeita para você.",
        "Ciências Contábeis": "Se você tem aptidão para números, análise financeira e um olhar atento para os detalhes, Ciências Contábeis pode ser o curso certo. Esta área oferece diversas oportunidades em empresas de todos os setores, além de possibilitar carreira como contador independente.",
        "Educação Física": "Para aqueles que são apaixonados por esportes, saúde e bem-estar, o curso de Educação Física é uma excelente opção. Este curso prepara profissionais para atuar em academias, escolas, clubes esportivos e diversas outras áreas relacionadas à atividade física e qualidade de vida.",
        "Engenharia Civil": "O curso de Engenharia Civil é voltado para quem tem interesse em construir e planejar obras, como edifícios, pontes e estradas. Este curso oferece uma sólida formação em matemática e física, preparando profissionais para enfrentar desafios na construção civil.",
        "Estética e Cosmética": "Se você é apaixonado por beleza e bem-estar, o curso de Estética e Cosmética pode ser a escolha certa. Este curso capacita profissionais para trabalhar em salões de beleza, clínicas de estética, spas e em consultoria de imagem pessoal.",
        "Enfermagem": "O curso de Enfermagem é ideal para quem tem vocação para cuidar das pessoas e interesse em trabalhar na área da saúde. Este curso prepara profissionais para atuar em hospitais, clínicas, postos de saúde e em atendimento domiciliar.",
        "Farmácia": "Se você tem interesse em ciências biológicas e químicas e deseja trabalhar na área de saúde, o curso de Farmácia é uma excelente opção. Este curso capacita profissionais para atuar na produção e controle de medicamentos, em farmácias, laboratórios e indústrias farmacêuticas.",
        "Fisioterapia": "Para quem tem interesse em reabilitação e promoção da saúde, o curso de Fisioterapia é uma ótima escolha. Este curso prepara profissionais para atuar na recuperação de pacientes, em clínicas, hospitais, academias e centros de reabilitação.",
        "Nutrição": "O curso de Nutrição é ideal para quem se preocupa com a alimentação saudável e deseja ajudar as pessoas a melhorar sua qualidade de vida através da alimentação. Este curso prepara profissionais para trabalhar em hospitais, clínicas, empresas e como autônomos.",
        "Pedagogia": "Se você tem paixão pela educação e deseja contribuir para a formação de crianças e jovens, o curso de Pedagogia é a escolha certa. Este curso prepara profissionais para atuar como professores, coordenadores pedagógicos e em gestão escolar.",
        "Psicologia": "O curso de Psicologia é ideal para quem tem interesse em compreender o comportamento humano e ajudar as pessoas a enfrentar desafios emocionais. Este curso prepara profissionais para atuar em clínicas, hospitais, escolas, empresas e em consultório próprio.",
        "Serviço Social": "Para aqueles que desejam trabalhar com a promoção da justiça social e auxiliar comunidades e indivíduos em situação de vulnerabilidade, o curso de Serviço Social é uma excelente opção. Este curso prepara profissionais para atuar em ONGs, órgãos públicos e empresas."
    }
if(req.method === 'POST'){
    const data = req.body

    try {
        await transporter.sendMail({
           ...mailOptions,
           subject: '🗣️ Resultado do Teste Vocacional | FAZAG 🗣️',
           cc: data.email,
           text: data.text,
           replyTo: 'matriculas@fazag.edu.br',
           html: `    <div style=" padding: 50px 10px;
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

        <h1 style="color: #0044cc;">Parabéns por concluir o teste vocacional</h1>
        </div>
        
        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <p>Olá <strong>${data.nome.split(" ")[0]}</strong>,</p>
            <p>Temos o prazer de compartilhar com você os cursos que mais se alinham com suas aptidões e interesses. Após uma análise detalhada das suas respostas, identificamos que os três cursos que mais combinam com seu perfil são:</p>
            
            <h2 style="color: #0044cc;">1. ${data.courseOne}</h2>
            <p>${courses[data.courseOne]}</p>
            
            <h2 style="color: #0044cc;">2. ${data.courseTwo}</h2>
            <p>${courses[data.courseTwo]}</p>
            
            <h2 style="color: #0044cc;">3. ${data.courseTree}</h2>
            <p>${courses[data.courseTree]}</p>
            
            <h2 style="color: #0044cc;">Próximos Passos</h2>
            <p>Se você deseja obter mais informações sobre algum desses cursos, tirar dúvidas ou se matricular, nossa equipe de atendimento está à disposição para ajudá-lo. Clique no botão abaixo para falar conosco:</p>
            
            <a href="https://api.whatsapp.com/send?phone=5575981048077&text=Ol%C3%A1,%20gostaria%20de%20tirar%20algumas%20d%C3%BAvidas" style="display: inline-block; background-color: #0044cc; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Fale Conosco</a>
            
            <p style="margin-top: 20px;">Aguardamos seu contato e estamos prontos para ajudá-lo a tomar a melhor decisão para o seu futuro acadêmico e profissional.</p>
            
            <p>Atenciosamente,</p>
            
            <p>Equipe de Atendimento ao Aluno<br>Faculdade Zacarias de Góes<br>(75) 98104-8077<br>matriculas@fazag.edu.br</p>
        </div>
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