import styles from './style.module.scss'
import estilo from '../PostList/style.module.scss'

type variavelRecebidaProps = {
        variavelRecebida: {
        image: string
        date: string
        title: string
        description: string
        avatar: string 
        }
}

export function PostDestaque({variavelRecebida}:any){
    return (
        
            <div className={`${styles.postDestaque} ${estilo.postA}`}>
                <a><img className={styles.imgPrincipal} src={variavelRecebida.image} alt={"Imagem Paisagem"} /></a>
    
                <div className={styles.postContent}>
                    <div className={styles.postTexts}>
                        <p className={styles.postDate}>{new Date(variavelRecebida.date).toLocaleString("pt-BR")}</p>
                        <a><h2 className={styles.postTitle}>{variavelRecebida.title}</h2></a>
                        <p className={styles.postDescription}>{variavelRecebida.description}</p>
                    </div>
                    <div className={styles.author}>
                        <img className={styles.avFazag} src={variavelRecebida.avatar} alt={"avatar"} />
                        <p><strong>FAZAG</strong></p>
                        <p>Faculdade Zacarias de Góes</p>
    
                    </div>
                </div>
            </div> 
    )
    }
    
    