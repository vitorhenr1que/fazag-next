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
            <div className={styles.containerEgressos}>
                <h1>Egressos</h1>
                <ModalEgressos/>
            </div>
            <p>Compartilhe sua jornada pós-faculdade conosco! Conte como sua formação moldou seu percurso profissional e inspire outros egressos e futuros graduados com sua história única.</p>
        <div className={`${styles.containerPosts}`}>
            <section className={styles.containerDestaque}>
                <PostDestaqueEgresso name={postDestaque.nome} description={postDestaque.text} imageUrl={postDestaque.imageUrl} postName={postDestaque.postName}/>
            </section>
            <section className={styles.containerPosts}>
                {posts.map((index, position) => {
                    if(position > 0)
                    return (
                        <PostEgresso key={index.id} name={index.nome} description={index.text} imageUrl={index.imageUrl} postName={index.postName}/>
                    )
                })}
            </section>
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