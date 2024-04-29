import styles from './loading.module.scss'

export function Loading(){
  return (
    <div className={`d-flex justify-content-center align-items-center text-primary ${styles.loadingDiv}`}>
    <div className={`spinner-border ${styles.spinner}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
  )
}