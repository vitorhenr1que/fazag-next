import { Post } from "../../components/FazagInforma/Post"
import { PostDestaque } from "../../components/FazagInforma/PostDestaque"
import { getClient } from "../../services/prismic"
import styles from '../../styles/fazaginfo.module.scss'

export default function FazagInforma({response, posts}: any){
    {console.log(posts)}
    return (
        <div>
            
        <div className={styles.cabecalho}>
        <h1 className={styles.title}>FAZAG Informa</h1>
        <hr className={styles.hr} />
        </div>

    <div className={`${styles.fazaginforma} container`}>
    
    <PostDestaque variavelRecebida={posts[0]}/>
    
        <div className={styles.postListContainer}>
        {posts.map((index: any, position: number) => {
            if(position === 0){
                return
            }
            return(
                    <div key={index.id}>
                    <Post  receberVariavel={index}/>
                    </div>
            )
        })}
        </div>
        
    </div>
    </div>

    )
}

export const getStaticProps = async () => {

    const response = await getClient().getByType('posts', {
        pageSize: 9
    })

    const posts = response.results.map(post => {
        return {
            id: post.uid,
            title: post.data.title,
            content: post.data.content.find((index: {type: string}) => index.type === 'paragraph')?.text ?? '',
            image: post.data.image.url,
            author: post.data.author,
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-br', {day: "2-digit", month: "long", year: "numeric"})
        }
    })

    return {
        props: {
            posts: posts,
            response: response
        }
    }
}