import { Cross2Icon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import styles from './modal.module.scss'
import { useEffect, useState } from "react";
import Image from 'next/image'



export function Modal({image}: any) {

        const [openModal, setOpenModal] = useState(false)


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


        
       <Image src={image} alt="" quality={100} fill/> 
        
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