import styles from './style.module.scss'
import Link from 'next/dist/client/link'

type variavelRecebidaProps = {
        variavelRecebida: {
        id: string
        image?: string
        updatedAt: string
        title: string
        content: string
        avatar?: string 
        author: string
        }
}

export function PostDestaque({variavelRecebida}:variavelRecebidaProps){
    return (
        
            
                <Link href={`/fazaginforma/${variavelRecebida.id}`} className={`${styles.postDestaque}`}>
               <img className={styles.imgPrincipal} src={variavelRecebida.image} alt={"Imagem Paisagem"} />
                <div className={styles.postContent}>
                    <div className={styles.postTexts}>
                        <p className={styles.postDate}>{variavelRecebida.updatedAt}</p>
                        <h2 className={styles.postTitle}>{variavelRecebida.title}</h2>
                        <p className={styles.postDescription}>{variavelRecebida.content}</p>
                    </div>
                    <div className={styles.author}>
                        <img className={styles.avFazag} src={variavelRecebida.avatar} alt={"avatar"} />
                        <p><strong>FAZAG</strong></p>
                        <p>Faculdade Zacarias de Góes</p>
    
                    </div>
                </div>
                </Link>
            
    )
    }
    
    