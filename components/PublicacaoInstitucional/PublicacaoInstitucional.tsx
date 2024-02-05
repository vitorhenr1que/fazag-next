import styles from "../../styles/publicInstitucionais.module.scss"
interface PublicacaoInstitucionalProps {
    label: string;
    downloadName: string;
    destination: string;
    svgPath: string;
    viewBox?: string

}
export function PublicacaoInstitucional({ label, downloadName, destination, svgPath, viewBox}: PublicacaoInstitucionalProps){
    
    return (
    <>
                <a className={styles.publicationItem} download={`${downloadName}`} href={`${destination}`}>
                <svg xmlns={"http://www.w3.org/2000/svg"} viewBox={`${viewBox}`} fill={'red'} height={"40"} width={"40"}><path d={`${svgPath}`} /></svg>
                    <p>{label}</p>
                </a>
    </>
    )
}
