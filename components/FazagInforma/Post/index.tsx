import styles from './style.module.scss'

export interface receberVariavelProps {
    receberVariavel: {
        image: string
        date: string
        title: string
        description: string
    }
}

export function Post({receberVariavel}:receberVariavelProps){
return (
    
        <div className={styles.postSecBody}>
             
            <a><img className={styles.postSecImage} src={receberVariavel.image} alt={"Imagem Paisagem"} /></a>
           
            <div className={styles.postSecContent}>
                <div className={styles.postSecTexts}>
                    <p className={styles.postSecDate}>{new Date(receberVariavel.date).toLocaleString("pt-BR")}</p>
                    <h4 className={styles.postSecTitle}>{receberVariavel.title}</h4>
                    <p className={styles.postSecDescription}>{receberVariavel.description}</p>
                </div>
            </div>
        </div> 
)
}