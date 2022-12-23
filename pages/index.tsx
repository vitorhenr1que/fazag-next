import axios, { AxiosRequestConfig } from 'axios'
import { GetServerSideProps, GetStaticProps, NextApiRequest } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { NextRequest, NextResponse } from 'next/server'
import { title } from 'process'
import { Header } from '../components/Header'
import HomeMain from '../components/Home/HomeMain'
import { api } from '../services/api'
import { prisma } from '../services/prisma'
import styles from '../styles/home.module.scss'

interface Posts {
  posts: string
}

type Post = {
  title: string,
  avatar: string,
  description: string,
  date: string,
  author?: string
  image: string
}

export default function Home({posts}: Posts) {
 const post: Post[] = JSON.parse(posts)
 
 async function handleAxios(){
  const response = await api.get('posts')
  const mostrar = await console.log(response.data)
  return mostrar 
 }
  return (
    
    <>
    {post.map((index) => {
      console.log(index)
    })}
      <Head>
        <title>Inicio | FAZAG</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.mainContainer}>
        <HomeMain/>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {


  const posts = await prisma.post.findMany({
    where: {published: true}
  })


  
  return {
    props: {
      posts: JSON.stringify(posts),
    }
  }

}
