import { GetServerSideProps, GetStaticProps } from "next"
import { getClient } from "../services/prismic"
import * as prismic from '@prismicio/client' 
import { Modal } from "../components/Home/Modal"

export default function Test({linkImgModal, altImgModal, modalLink}: any){
    return(
        <>
        <Modal image={linkImgModal} alt={altImgModal} modalLink={modalLink}/>
        </>
    )
}



export const getServerSideProps: GetServerSideProps = async () => {

        const response = await getClient().getByUID('images', 'modal', {})
        const responseTwo = await getClient().getByType('posts', {
         predicates: [
       
         ]
        })
       const imageModal = response.data.image
       const linkImgModal = response.data.image.url
       const altImgModal = response.data.image.alt
       const modalLink = response.data.link
        return {
        props: {
            linkImgModal,
            altImgModal,
            modalLink
        }
        }
    

}