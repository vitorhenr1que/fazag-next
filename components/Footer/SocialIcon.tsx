import Link from 'next/link';
import styles from './style.module.scss'

interface SocialIconProps{
    buttonColor: string;
    logo: any;
    link: string;
}

export function SocialIcon({buttonColor, logo, link}: SocialIconProps){
    return (
        <Link className={styles.icon} style={{background: `${buttonColor}`}} href={link} target={'_blank'} rel={'noreferrer'}>{logo}</Link>
    )
}