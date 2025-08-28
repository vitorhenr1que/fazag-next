import { GetStaticProps } from 'next'
import Head from 'next/head'
import HomeMain from '../components/Home/HomeMain'
import { getClient } from '../services/prismic'
import styles from '../styles/home.module.scss'
import { Modal } from '../components/Home/Modal'


export interface PostsProps {
  posts: {
    id: string,
    title: string,
    avatar: string,
    content: string,
    image: string,
    updatedAt: string,
    author?: string,
  },
  linkImgModal?: string,
  altImgModal?: string,
  modalLink?: {
    link_type: string,
    name?: string,
    kind?: string,
    url?: string,
    size?: string
  }
}



export default function Home({posts, linkImgModal, altImgModal, modalLink}: PostsProps) {

  return (
    
<>
      <Head>
        <title>Inicio | FAZAG</title>
      </Head>
      <main className={styles.mainContainer}>
        <Modal image={linkImgModal} alt={altImgModal} modalLink={modalLink}/>
        <HomeMain posts={posts}/>
      </main>
</>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const response = await getClient().getByType('posts', {
    orderings: {
        field: 'document.first_publication_date',
        direction: 'desc'
      },
      pageSize: 1,
})
const posts = response.results.map(post => {
    return {
        id: post.uid,
        title: post.data.title,
        content: post.data.content.find((index: {type: string}) => index.type === 'paragraph')?.text ?? '',
        image: post.data.image.url,
        author: post.data.author,
        updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-br', {day: "2-digit", month: "long", year: "numeric"})
    }
})

const responseModal = await getClient().getByUID('images', 'modal', {})

const linkImgModal = responseModal.data.image.url
const altImgModal = responseModal.data.image.alt
const modalLink = responseModal.data.link

return {
  props: {
    posts: posts[0],
    linkImgModal,
    altImgModal,
    modalLink
  }
}
}
