import { GetStaticProps } from "next"
import { getClient } from "../services/prismic"
import * as prismic from '@prismicio/client' 
import { Modal } from "../components/Home/Modal"

export default function Test({imageModal}: any){
    return(
        <>
        {console.log(imageModal)}
        <Modal image={imageModal}/>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
 const response = await getClient().getByUID('images', 'modal', {})
 const responseTwo = await getClient().getByType('posts', {
  predicates: [

  ]
 })
const imageModal = response.data.image
 return {
 props: {
    imageModal: imageModal.url
 }
 }
}