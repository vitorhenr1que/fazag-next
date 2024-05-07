import Image, { StaticImageData } from 'next/image'
import styles from './style.module.scss'
import Link from 'next/link'

interface CardProps{
    title: string,
    image: StaticImageData,
    paragraph: string,
    link: string
}

export function Card({title, image, paragraph, link}: CardProps){
    return (
<div className={styles.cardContainer}> 
    <Link href={`${link}`} target='_blank' className={styles.linkTitle}>       
        <span className={styles.cardTitle}>{title}</span>
    </Link>
<Link href={`${link}`} target='_blank' className={styles.divImageCard}>
    <Image src={image} className={styles.cardImage} alt='Imagem da Biblioteca'/>
</Link>
<span className={styles.paragraph}>
    {paragraph}
</span>
<Link href={`${link}`} target='_blank' className={styles.link}>
    Acesse Aqui
</Link>
</div>
    )
}