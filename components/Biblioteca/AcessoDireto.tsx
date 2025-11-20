'use client'
import Image, { StaticImageData } from 'next/image'
import styles from './style.module.scss'
import Link from 'next/link'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Loading } from '../Loading'

interface CardProps{
    title: string,
    image: StaticImageData,
    paragraph: string, 
}

export function AcessoDireto({title, image, paragraph, ...rest}: CardProps){
    const [urlBiblioteca, setUrlBiblioteca] = useState('')
    

    useEffect(() => {
        async function getUrlBiblioteca(){
            const response = await axios.post('/api/biblioteca/acesso-direto')
            setUrlBiblioteca(response.data.url)
        }
        getUrlBiblioteca()
    },[])
   return (
            <div className={styles.cardContainer}> 
                <Link href={`${urlBiblioteca}`} target='_blank' className={styles.linkTitle} {...rest}>       
                    <span className={styles.cardTitle}>{title}</span>
                </Link>
            <Link href={`${urlBiblioteca}`} target='_blank' className={styles.divImageCard} {...rest}>
                <Image src={image} className={styles.cardImage} alt='Imagem da Biblioteca'/>
            </Link>
            <span className={styles.paragraph}>
                {paragraph}
            </span>
            {urlBiblioteca !== '' ? <Link href={`${urlBiblioteca}`} target='_blank' className={styles.link} {...rest}>
                Acesse Aqui
            </Link> : <Loading/>}
            
            </div>
    )
}