import styles from './destaqueegresso.module.scss'
import Image from "next/image";
import portalaluno from '../../public/images/511-1320x350.jpg'
import { PostEgressoProps } from './PostDestaqueEgresso';
import Link from 'next/link';

export function PostEgresso({name, description, imageUrl, postName}: PostEgressoProps){
    return (
        <Link href={`/egressos/${postName}`} className={styles.containerDestaque}>
            <Image src={`${imageUrl}`} width={500} height={500} className={styles.imageDestaque} alt="Foto Do Egresso"/>

            <h3>{name}</h3>
            <p>{description}</p>
        </Link>
    )
}