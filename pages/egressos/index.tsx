import { GetStaticProps } from 'next'
import { PostDestaqueEgresso } from '../../components/Egressos/PostDestaqueEgresso'
import { PostEgresso } from '../../components/Egressos/PostEgresso'
import styles from '../../styles/egressos.module.scss'
import { prisma } from '../../services/prisma'
import { Key } from 'react'
import { ModalEgressos } from '../../components/Egressos/ModalEgressos'


interface postsProps {
    postDestaque: {
        nome: String,
		curso: String,
		text: String,
	    imageUrl: String,
        postName: String
    },
    posts: [
        {
            id: Key,
            nome: String,
		    curso: String,
		    text: String,
	        imageUrl: String,
            postName: String
        }
    ]
}

export default function Egressos({postDestaque, posts}: postsProps){

    return(
        <div className={`container ${styles.container}`}>
            <div className={styles.modalA}>
                <ModalEgressos/>
            </div>
            
        <ul className={`nav nav-tabs ${styles.ulOqE}`} id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
                <button className={`nav-link ${styles.navLink} active`} id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">O que é?</button>
            </li>
            <li className="nav-item" role="presentation">
                <button className={`nav-link ${styles.navLink}`} id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Ex-alunos em foco</button>
            </li>
            <div className={styles.modalB}>
                <ModalEgressos/>
            </div>
            
        </ul>
        
            <div className="tab-content" id="myTabContent">
            <div className={`tab-pane fade show active ${styles.containerOqE}`} id="home" role="tabpanel" aria-labelledby="home-tab">
            
            <h3>Bem-vindo à Comunidade de Egressos da Faculdade Fazag</h3>

            <p>Parabéns por fazer parte da família Fazag! Como egresso, você faz parte de uma rede de profissionais talentosos e dedicados que estão fazendo a diferença em diversas áreas.</p>

            <p>Estamos comprometidos em manter um vínculo forte com nossos ex-alunos e em ajudá-los a alcançar o sucesso contínuo em suas carreiras. </p>

            <p>Ao participar do nosso programa de acompanhamento, os ex-alunos têm a oportunidade de contribuir ativamente para o aprimoramento contínuo dos cursos e projetos da Faculdade Fazag. Seja através do feedback sobre as propostas curriculares, do compartilhamento de experiências profissionais ou do envolvimento em eventos institucionais, valorizamos e incentivamos a participação ativa dos nossos egressos.</p>

            <p>Estamos interessados em ouvir suas experiências após a graduação! Compartilhe suas histórias de sucesso, desafios superados e lições aprendidas conosco e com seus colegas de turma. Sua jornada pode inspirar outros alunos e ajudá-los a navegar em suas próprias carreiras com mais confiança e determinação.</p>

            <p>Além disso, estamos felizes em anunciar que os nossos egressos têm a oportunidade de retornar à Faculdade Fazag para uma segunda graduação com um desconto especial de 50%! Reconhecemos o valor de continuar sua jornada educacional e queremos facilitar esse processo para você.</p>

            </div>
            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">

            <div className={styles.containerEgressos}>
                <h1>Egressos</h1>
            </div>
            <p>Compartilhe sua jornada pós-faculdade conosco! Conte como sua formação moldou seu percurso profissional e inspire outros egressos e futuros graduados com sua história única.</p>
        <div className={`${styles.containerPosts}`}>

            <section className={styles.containerPosts}>
                {posts.map((index, position) => {
    
                    return (
                        <PostEgresso key={index.id} name={index.nome} description={index.text} imageUrl={index.imageUrl} postName={index.postName}/>
                    )
                })}
            </section>
        </div>
            </div>
    </div>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const posts = await prisma.egressos.findMany({
        where: {
            publicated: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    console.log(posts)



    return{
        props: {
            postDestaque: JSON.parse(JSON.stringify(posts[0])), // As props não aceitam DateTime então converti tudo em string e fiz o parse
            posts: JSON.parse(JSON.stringify(posts))
        }
    }
}