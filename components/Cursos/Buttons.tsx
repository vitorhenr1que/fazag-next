import { FileArrowDown, FilePdf } from 'phosphor-react';
import styles from './style.module.scss'

interface ButtonsProps {
    curso: string;
    title: string;
}

export function Buttons(props: ButtonsProps){
return (
    <div className={styles.buttonsContainer}>
        <div className={styles.buttonContainer}>
        <a type="button" className={styles.button} data-bs-toggle="collapse" href="#collapseGrade" role="button" aria-expanded="false" aria-controls="collapseGrade">Grade e Corpo Docente</a>
        <div className="collapse" id="collapseGrade">
            <div className={styles.linkContainer}>
                <a className={styles.linkDownload} href={`/static/grade${props.curso}.pdf`} download={`grade-${props.curso}.pdf`} >
                    <FileArrowDown size={28} />
                    <span>Grade de {props.title}</span>
                </a>
            </div>
        </div>
        </div>

        <div className={styles.buttonContainer}>
        <a type="button" className={styles.button} data-bs-toggle="collapse" href="#collapsePPC" role="button" aria-expanded="false" aria-controls="collapsePPC">PPC</a>
        <div className="collapse" id="collapsePPC">
            <div className={styles.linkContainer}>
                <a className={styles.linkDownload} href={`/static/ppc${props.curso}.pdf`} download={`ppc-${props.curso}.pdf`} >
                    <FileArrowDown size={28} />
                    <span>PPC de {props.title}</span>
                </a>
            </div>
        </div>
        </div>
        
        <div className={styles.buttonContainer}>
        <a type="button" className={styles.button} data-bs-toggle="collapse" href="#collapseMatriz" role="button" aria-expanded="false" aria-controls="collapseMatriz">Matriz Curricular</a>
        <div className="collapse" id="collapseMatriz">
            <div className={styles.linkContainer}>
                <a className={styles.linkDownload} href={`/static/matriz${props.curso}.pdf`} download={`matriz-${props.curso}.pdf`} >
                    <FileArrowDown size={28} />
                    <span>Matriz de {props.title}</span>
                    </a>
            </div>
        </div>
        </div>

    </div>
)
}