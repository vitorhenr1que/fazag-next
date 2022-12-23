import { Post } from '../Post'
import styles from './style.module.scss'


export function Postlist({props}: any){
return (
    

    <div className={styles.postListContainer}>
        
        { props.map((item: any, position: any) => {
            switch (position) {
                case 1:
                    return (<div key={item.id} className={`${styles.post} ${styles.postB}`}> <Post receberVariavel={item}/></div>)
                    
                case 2:
                    return (<div key={item.id} className={`${styles.post} ${styles.postC}`}> <Post receberVariavel={item}/></div>)
                    
                case 3:
                    return (<div key={item.id} className={`${styles.post} ${styles.postD}`}> <Post receberVariavel={item}/></div>)
                    
                case 4:
                    return (<div key={item.id} className={`${styles.post} ${styles.postE}`}> <Post receberVariavel={item}/></div>)
                    
                default:
                    break;
            }
            
        })}



    </div>

)

}