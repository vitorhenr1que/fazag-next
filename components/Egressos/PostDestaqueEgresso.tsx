import Link from 'next/link';
import styles from './destaqueegresso.module.scss'
import Image from "next/image";

export interface PostEgressoProps {
    name: String,
    description: String,
    imageUrl: String,
    postName: String
}

export function PostDestaqueEgresso({name, description, imageUrl, postName}: PostEgressoProps){
    return (
        <Link href={`/egressos/${postName}`} className={styles.containerDestaque}>
            <Image src={`${imageUrl}`} width={1000} height={500} className={styles.imageDestaque} alt="Foto do Egresso"/>

            <h3>{name}</h3>
            <p>{description}</p>
        </Link>
    )
}