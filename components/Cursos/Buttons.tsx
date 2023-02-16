import styles from './style.module.scss'

export function Buttons(){
return (
    <div className={styles.buttonsContainer}>
        <div className={styles.buttonContainer}>
        <a type="button" className={styles.button} data-bs-toggle="collapse" href="#collapseGrade" role="button" aria-expanded="false" aria-controls="collapseGrade">Grade e Corpo Docente</a>
        <div className="collapse" id="collapseGrade">
            <div>Esse é o Grade</div>
        </div>
        </div>

        <div className={styles.buttonContainer}>
        <a type="button" className={styles.button} data-bs-toggle="collapse" href="#collapsePPC" role="button" aria-expanded="false" aria-controls="collapsePPC">PPC</a>
        <div className="collapse" id="collapsePPC">
            <div>Esse é o PPC</div>
        </div>
        </div>
        
        <div className={styles.buttonContainer}>
        <a type="button" className={styles.button} data-bs-toggle="collapse" href="#collapseMatriz" role="button" aria-expanded="false" aria-controls="collapseMatriz">Matriz Curricular</a>
        <div className="collapse" id="collapseMatriz">
            <div>Esse é o Grade</div>
        </div>
        </div>

    </div>
)
}