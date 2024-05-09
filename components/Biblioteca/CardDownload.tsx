import Image, { StaticImageData } from 'next/image'
import styles from './style.module.scss'
import Link from 'next/link'

interface CardDownloadProps{
    title: string,
    image: StaticImageData,
    paragraph: string,
    link: string,
    downloadName: string 
}

export function CardDownload({title, image, paragraph, link, downloadName}: CardDownloadProps){
   return (
            <div className={styles.cardContainer}> 
                <Link href={`${link}`} target='_blank' className={styles.linkTitle} download={downloadName}>       
                    <span className={styles.cardTitle}>{title}</span>
                </Link>
            <Link href={`${link}`} target='_blank' className={styles.divImageCard} download={downloadName}>
                <Image src={image} className={styles.cardImage} alt='Imagem da Biblioteca'/>
            </Link>
            <span className={styles.paragraph}>
                {paragraph}
            </span>
            <Link href={`${link}`} target='_blank' className={styles.link} download={downloadName}>
                Acesse Aqui
            </Link>
            </div>
    )
}