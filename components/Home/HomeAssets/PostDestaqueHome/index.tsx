import React, { useState, useEffect } from "react";
import { PostsProps } from "../../../../pages";
import styles from './style.module.scss'
import Link from 'next/link'
import Image from "next/image";


export function PostDestaqueHome({posts}: PostsProps){


    return (
        <>
            <Link href={`/fazaginforma/${posts.id}`} className={styles.postDestaqueHome}>
                <Image width={1080} quality={100} height={1080} alt={""} className={styles.pdHomeImg} src={posts?.image}/>

                <div className={styles.pdHomeContent}>
                    <div className={styles.pdHomeTexts}>
                        <p className={styles.pdHomeDate}>{posts?.updatedAt}</p>

                        <h2 className={styles.pdHomeTitle}>{posts?.title}</h2>
                        <p className={styles.pdHomeDescription}>{posts?.content}</p>
                    </div>
                    <div className={styles.pdHomeAuthor}>
                        
                        <div><p>FAZAG</p></div>
                        <p>{posts?.author}</p>
    
                    </div>
                </div>
            </Link> 
            </>
    )
    }