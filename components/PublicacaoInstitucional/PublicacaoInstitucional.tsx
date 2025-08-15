import Image from "next/image";
import styles from "../../styles/publicInstitucionais.module.scss"
import iconLink from '../../public/images/icons/icon-link.png'

interface PublicacaoInstitucionalProps {
    label: string;
    downloadName?: string;
    destination: string;
    svgPath: string;
    viewBox?: string
    type?: string;
}
export function PublicacaoInstitucional({ label, downloadName, destination, svgPath, viewBox, type}: PublicacaoInstitucionalProps){
    
    switch(type) {
        case "image":
            return  (
                <>
                            <a className={styles.publicationItem} download={`${downloadName}`} href={`${destination}`}>
                            <svg xmlns={"http://www.w3.org/2000/svg"} viewBox={`${viewBox}`} fill={'red'} height={"40"} width={"40"}><path d={`${svgPath}`} /></svg>
                                <p>{label}</p>
                            </a>
                </>
                )
   
        case "pdf":
           return (
                <>
                            <a className={styles.publicationItem} download={`${downloadName}`} href={`${destination}`}>
                                
                            <svg xmlns={"http://www.w3.org/2000/svg"} viewBox={`${viewBox}`} fill={'red'} height={"40"} width={"40"}><path d={`${svgPath}`} /></svg>
                                <p>{label}</p>
                            </a>
                </>
                )
    
        case "link":
            return (
                <>
                            <a className={styles.publicationItem} href={`${destination}`} target="_blank">
                            <Image src={iconLink} alt="icon-link" height={24} width={24}/>
                                <p>{label}</p>
                            </a>
                </>
                )
     default: 
     return (
        <>
                    <a className={styles.publicationItem} download={`${downloadName}`} href={`${destination}`}>
                    <svg xmlns={"http://www.w3.org/2000/svg"} viewBox={`${viewBox}`} fill={'red'} height={"40"} width={"40"}><path d={`${svgPath}`} /></svg>
                        <p>{label}</p>
                    </a>
        </>
        )
    }

}
