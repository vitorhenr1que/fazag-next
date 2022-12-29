import { PrismicRichText } from "@prismicio/react"
import { PrismicImage } from "@prismicio/react/dist/PrismicImage"
import { GetStaticProps } from "next"
import { getClient } from "../../services/prismic"
import styles from '../../styles/id.module.scss'

export default function PostsDinamicos({response, posts}: any){
    return (
        <>
        <main className={`${styles.postContainer} container`}>
        
        <h1 className={styles.title}>{posts.title}</h1>
        <PrismicRichText field={response.data.content} components={
            {
                heading1: ({children}) => <p className={styles.heading}>{children}</p>,
                paragraph: ({children}) => <p className={styles.paragraph}>{children}</p>
            }
    
        }/>
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
    const response = await getClient().getByUID('posts', id, {}) 
    const posts = {
        id,
        title: response.data.title,
        content: response.data.content,
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
    })}

    return {
        props: {
            response,
            posts,
        }
    }
}