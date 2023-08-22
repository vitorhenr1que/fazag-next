import { Cross2Icon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import styles from './modal.module.scss'
import { useEffect, useState } from "react";
import Image from 'next/image'
import Link from "next/link";



export function Modal({image, alt, modalLink}: any) {

        const [openModal, setOpenModal] = useState(false)
        console.log(modalLink)
        useEffect(() => { // O modal do radix da erro de Hidratação se começar com o valor "true" de início
            setOpenModal(true) // por isso foi preciso alterar no momento que a página abre
        }, [])
       


        
        return (
            <>
              <Dialog.Root open={openModal} onOpenChange={(open) => {
                if(open === true){
                  setOpenModal(true)
                }else {
                  setOpenModal(false)
                }
              }}>

    <Dialog.Portal>
      <Dialog.Overlay className={styles.dialogOverlay} />
      <Dialog.Content className={styles.dialogContent}>
      {/* Se estiver vazio o campo de link no prismic */}
       {modalLink.link_type === 'Any' && <Image src={image} alt={alt} quality={100} fill/>}
       {/* Se for a opção de arquivo de mídia (para download) */}
       {modalLink.link_type === 'Media' && <Link target="_blank" download={modalLink.name} href={modalLink.url}><Image src={image} alt={alt} quality={100} fill/></Link>}
       {/* Se for a opção de link de redirecionamento web */}
       {modalLink.link_type === 'Web' && <Link href={modalLink.url}><Image src={image} alt={alt} quality={100} fill/></Link>}

        <Dialog.Close asChild className={styles.close}>
          <button className={styles.IconButton} aria-label="Close">
            <Cross2Icon className={styles.crossIcon} />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root> 
            </>
        )
    
}