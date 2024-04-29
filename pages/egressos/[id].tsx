
import { GetStaticProps } from "next"
import styles from '../../styles/egressos.module.scss'
import { prisma } from "../../services/prisma"
import Image from "next/image"

interface responseProps{
    response: {
        id: String,
        postName: String,
        nome: String,
        email: String,
        curso: String,
        text: String,
        imageUrl: String
    }
}

export default function PostsDinamicos({response}: responseProps){
    return (
        <>
        <main className={`${styles.postContainer} container`}>
        <Image src={`${response.imageUrl}`} className={styles.postImage} width={1000} height={500} alt="foto-do-egresso"/>
        <h1>{response.nome} - Egresso de {response.curso}</h1>
        <div className={styles.divP}>
            <p>{response.text}</p>
        </div>
        </main>
        </>
        
    )
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
       
    
}

export const getStaticProps: GetStaticProps = async ({params}) => {
    const { id }: any = params
   const response = await prisma.egressos.findFirst({
    where: {
        postName: id
    }
   })
   console.log(response)
  return{
    props: {
        response: JSON.parse(JSON.stringify(response))
    }
  }
}