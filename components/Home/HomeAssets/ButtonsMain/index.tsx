import Image, { StaticImageData } from 'next/image'
import styles from './style.module.scss'

interface ButtonsMainProps {
    url: string,
    src: StaticImageData,
    title: string,
    description: string,
    
}

export function ButtonsMain(props: ButtonsMainProps){
    return (
        <a href={props.url} className={`${styles.botoesBox} shadow rounded img-fluid`}>
            <Image src={props.src} className={"shadow rounded img-fluid"} alt={"..."} />
            <div className={`position-absolute p-3 ${styles.pBox}`}>
              <h2>{props.title}</h2>
              <p>{props.description}</p>
            </div>
          </a>
    )
}