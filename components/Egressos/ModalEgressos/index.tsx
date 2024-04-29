import { Cross2Icon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import styles from './style.module.scss'
import * as ToggleGroup  from "@radix-ui/react-toggle-group";
import { FormEvent, useState } from "react";
import { api } from "../../../services/api";
import { Loading } from "../../Loading";
import { ImageUpload } from "../../Firebase/ImageUpload";

export function ModalEgressos() {
        const [openModal, setOpenModal] = useState(false)
        const [file, setFile] = useState<any>()




        function handleChangeFile(e: FormEvent){ // Ao alterar a imagem
          const input = e.target as HTMLInputElement
          if (!input.files?.length){ //se não houver nenhuma imagem no input saia da função
            return
          }
          setFile(input.files[0])
        }

        async function handleSubmit(e: FormEvent){
          e.preventDefault()
       
          
          const formData = new FormData(e.target as HTMLFormElement)
          const data = Object.fromEntries(formData)


          try {


            //Todas as requisições (nodemailer e prisma) estão indo para o ImageUpload
            await ImageUpload({nameFile: file.name, file: file, nome: data.nome, curso: data.curso, email: data.email, text: data.text})
            
            
            setOpenModal(false)
          } catch(err){
            console.log(err, 'Erro com a validação do formulário')
       
          }
        }
        
        return (
            <>
              <Dialog.Root open={openModal} onOpenChange={(open) => {
                if(open === true){
                  setOpenModal(true)
                }else {
                  setOpenModal(false)
                }
              }}>
    <Dialog.Trigger asChild >
      <button className={`${styles.btnOuvidoria} btn btn-primary`}>
        
        <span>Compartilhar História</span>
      </button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.DialogOverlay} />
      <Dialog.Content className={styles.DialogContent}>

       
        
        <Dialog.Title className={styles.DialogTitle}>Compartilhe sua história</Dialog.Title>

        <form onSubmit={handleSubmit} className={styles.form}>
          
          <label htmlFor="name" className={styles.labels}>Nome <span>*</span></label>
          <input type="text" name="nome" id="name" placeholder="Nome" className={`${styles.input}`} required/>
          
         {/* <label htmlFor="cpf" className={styles.labels}>CPF (Opcional)</label>
          <input type="text" id="cpf" placeholder="CPF" className={`${styles.input}`} /> */}

          <label htmlFor="email" className={styles.labels}>E-mail <span>*</span></label>
          <input type="text" name="email" id="email" placeholder="E-mail" className={`${styles.input}`} required/>

          <label htmlFor="curso" className={styles.labels}>Curso <span>*</span></label>
          <input type="text" name="curso" id="curso" placeholder="Curso" className={`${styles.input}`} required/>

          
          <div className="mb-3">
          <label htmlFor="formFile" className={`${styles.labels} form-label`}>Envie sua foto: <span>*</span></label>
          <input className="form-control" type="file" id="formFile" accept="image/jpg, image/jpeg, image/png" onChange={handleChangeFile}/>
          </div>

          <label htmlFor="text" className={styles.labels}>Conte-nos sua história: <span>*</span></label>
          <textarea name="text" id="text" rows={5} className={styles.textArea} required></textarea>
          <button className={styles.enviarButton} type='submit'><span>Enviar</span></button>
        </form>
        
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