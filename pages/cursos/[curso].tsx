import { PrismicRichText, PrismicText } from "@prismicio/react";
import { GetStaticProps } from "next";
import { Buttons } from "../../components/Cursos/Buttons";
import { getClient } from "../../services/prismic";
import styles from '../../styles/cursos.module.scss'

export default function Curso({post, response}: any){
    console.log(response)
    return (
        <div className={`${styles.container} container`}>

            <h1>{post.title}</h1>
            <Buttons curso={post.id} title={post.title}/>
            <PrismicRichText field={post.content} components={
                {
                heading1: ({children}) => <p className={styles.infoCourse}>{children}</p>,
                heading2: ({children}) => <p className={styles.headingTwo}>{children}</p>,
                heading3: ({children}) => <p className={styles.headingTree}>{children}</p>,
                paragraph: ({children}) => <p className={styles.paragraph}>{children}</p>,
                }
            }/>
        </div>
    )
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
    const {curso}: any = params
    console.log(`Esse é o parâmetro ${curso}`)
   const response = await getClient().getByUID('posts', curso, {})
   const post = {
    id: curso,
    title: response.data.title,
    content: response.data.content
   }
   return {
    props: {
        response,
        post,
    }
   }
}