import { FileArrowDown, FilePdf } from 'phosphor-react';
import styles from './style.module.scss'

interface ButtonsProps {
    curso: string;
    title: string;
}

export function Buttons(props: ButtonsProps){
if(props.curso === 'educacao-fisica'){ {/* se for o curso de Educação Física */}
    return (
        <div className={styles.buttonsContainer}>
            <div className={styles.buttonContainer}>
            <a type="button" className={styles.button} data-bs-toggle="collapse" href="#collapseGrade" role="button" aria-expanded="false" aria-controls="collapseGrade">Grade e Corpo Docente</a>
            <div className="collapse" id="collapseGrade">
                <div className={styles.linkContainer}>
                    <a className={styles.linkDownload} href={`/static/horarios/grade-${props.curso}-licenciatura.pdf`} download={`grade-${props.curso}.pdf`} >
                        <FileArrowDown size={28} />
                        <span>Grade de {props.title} Licenciatura</span>
                    </a>
                    <a className={styles.linkDownload} href={`/static/horarios/grade-${props.curso}-bacharelado.pdf`} download={`grade-${props.curso}.pdf`} >
                        <FileArrowDown size={28} />
                        <span>Grade de {props.title} Bacharelado</span>
                    </a>
                    <a className={styles.linkDownload} href={`/static/horarios/grade-${props.curso}-complementacao.pdf`} download={`grade-${props.curso}.pdf`} >
                        <FileArrowDown size={28} />
                        <span>Grade de {props.title} Complementação</span>
                    </a>
                </div>
            </div>
            </div>
    
            {/*<div className={styles.buttonContainer}>
            <a type="button" className={styles.button} data-bs-toggle="collapse" href="#collapsePPC" role="button" aria-expanded="false" aria-controls="collapsePPC">PPC</a>
            <div className="collapse" id="collapsePPC">
                <div className={styles.linkContainer}>
                    <a className={styles.linkDownload} href={`/static/ppc${props.curso}.pdf`} download={`ppc-${props.curso}.pdf`} >
                        <FileArrowDown size={28} />
                        <span>PPC de {props.title}</span>
                    </a>
                </div>
            </div>
            </div>*/}
            
            <div className={styles.buttonContainer}>
            <a type="button" className={styles.button} data-bs-toggle="collapse" href="#collapseMatriz" role="button" aria-expanded="false" aria-controls="collapseMatriz">Matriz Curricular</a>
            <div className="collapse" id="collapseMatriz">
                <div className={styles.linkContainer}>
                    <a className={styles.linkDownload} href={`/static/matrizes/${props.curso}-licenciatura.pdf`} download={`matriz-${props.curso}.pdf`} >
                        <FileArrowDown size={28} />
                        <span>Matriz de {props.title} Licenciatura</span>
                        </a>
                        <a className={styles.linkDownload} href={`/static/matrizes/${props.curso}-bacharelado.pdf`} download={`matriz-${props.curso}.pdf`} >
                        <FileArrowDown size={28} />
                        <span>Matriz de {props.title} Bacharelado</span>
                        </a>
                        <a className={styles.linkDownload} href={`/static/matrizes/${props.curso}-complementacao.pdf`} download={`matriz-${props.curso}.pdf`} >
                        <FileArrowDown size={28} />
                        <span>Matriz de {props.title} Complementação</span>
                        </a>
                </div>
            </div>
            </div>
    
        </div>
    )
}
        {/* Demais Cursos */}
return ( 
    <div className={styles.buttonsContainer}>
        <div className={styles.buttonContainer}>
        <a type="button" className={styles.button} data-bs-toggle="collapse" href="#collapseGrade" role="button" aria-expanded="false" aria-controls="collapseGrade">Grade e Corpo Docente</a>
        <div className="collapse" id="collapseGrade">
            <div className={styles.linkContainer}>
                <a className={styles.linkDownload} href={`/static/horarios/grade-${props.curso}.pdf`} download={`grade-${props.curso}.pdf`} >
                    <FileArrowDown size={28} />
                    <span>Grade de {props.title}</span>
                </a>
            </div>
        </div>
        </div>

        {/*<div className={styles.buttonContainer}>
        <a type="button" className={styles.button} data-bs-toggle="collapse" href="#collapsePPC" role="button" aria-expanded="false" aria-controls="collapsePPC">PPC</a>
        <div className="collapse" id="collapsePPC">
            <div className={styles.linkContainer}>
                <a className={styles.linkDownload} href={`/static/ppc${props.curso}.pdf`} download={`ppc-${props.curso}.pdf`} >
                    <FileArrowDown size={28} />
                    <span>PPC de {props.title}</span>
                </a>
            </div>
        </div>
        </div>*/}
        
        <div className={styles.buttonContainer}>
        <a type="button" className={styles.button} data-bs-toggle="collapse" href="#collapseMatriz" role="button" aria-expanded="false" aria-controls="collapseMatriz">Matriz Curricular</a>
        <div className="collapse" id="collapseMatriz">
            <div className={styles.linkContainer}>
                <a className={styles.linkDownload} href={`/static/matrizes/${props.curso}.pdf`} download={`matriz-${props.curso}.pdf`} >
                    <FileArrowDown size={28} />
                    <span>Matriz de {props.title}</span>
                    </a>
            </div>
            
        </div>
        </div>

    </div>
)

}