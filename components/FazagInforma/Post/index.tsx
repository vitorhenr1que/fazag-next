import Link from 'next/dist/client/link'
import styles from './style.module.scss'


export interface receberVariavelProps {
    receberVariavel: {
        id: string
        image: string
        updatedAt: string
        title: string
        content: string
    }
 
}

export function Post({receberVariavel}:receberVariavelProps){
return (
            <Link href={`/fazaginforma/${receberVariavel.id}`}>
            <img className={styles.postSecImage} src={receberVariavel.image} alt={"Imagem Paisagem"} />
                <div className={styles.postSecTexts}>
                    <p className={styles.postSecDate}>{receberVariavel.updatedAt}</p>
                    <h4 className={styles.postSecTitle}>{receberVariavel.title}</h4>
                    <p className={styles.postSecDescription}>{receberVariavel.content}</p>
            </div>
            </Link>
)
}