import styles from './loading.module.scss'

export function LoadingDiv(){
  return (
    <div className={styles.containerInDiv}>
        <div className={`d-flex justify-content-center align-items-center text-primary ${styles.loadingInDiv}`}>
            <div className={`spinner-border ${styles.spinner}`} role="status">
            <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
    
  )
}