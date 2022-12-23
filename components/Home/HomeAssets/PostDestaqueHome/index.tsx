import React, { useState, useEffect } from "react";
import styles from './style.module.scss'
import { api } from "../../../../services/api";

interface postDestaqueProps {
        title: string,
        image: string,
        date: string,
        description: string,
        avatar?: string,
        author: string
}

export function PostDestaqueHome(){

    const [postDestaque, setPostDestaque] = useState<postDestaqueProps[]>([])

    useEffect(()=> {
        async function getPost(){
            try {
              const response = await api.get('posts/allposts')
              const { allPosts } = await response.data
              setPostDestaque(allPosts.reverse())
            } catch(error){
                console.log(error)
            }
        }

        getPost() 
    },[])

    return (
        
            <div className={styles.postDestaqueHome}>
                <a href='/'><img className={styles.pdHomeImg} src={postDestaque[0]?.image}/></a>
    
                <div className={styles.pdHomeContent}>
                    <div className={styles.pdHomeTexts}>
                        <p className={styles.pdHomeDate}>{new Date(postDestaque[0]?.date).toLocaleString("pt-BR")}</p>

                        <a href="/" className={styles.link}><h2 className={styles.pdHomeTitle}>{postDestaque[0]?.title}</h2></a>
                        <p className={styles.pdHomeDescription}>{postDestaque[0]?.description}</p>
                    </div>
                    <div className={styles.pdHomeAuthor}>
                        <img className={styles.pdHomeAv} src={postDestaque[0]?.avatar} alt={""} />
                        <p><strong>FAZAG</strong></p>
                        <p>{postDestaque[0]?.author}</p>
    
                    </div>
                </div>
            </div> 
    )
    }