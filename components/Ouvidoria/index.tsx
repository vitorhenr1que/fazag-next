import { Cross2Icon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import styles from './style.module.scss'
import * as ToggleGroup  from "@radix-ui/react-toggle-group";
import { FormEvent, useState } from "react";
import { api } from "../../services/api";



export function Ouvidoria() {
        const [procurouFAZAG, setProcurouFAZAG] = useState('sim')
        console.log(procurouFAZAG)

        async function handleSubmit(e: FormEvent){
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const data = Object.fromEntries(formData)
          console.log(data.email)

          try {
            await api.post('/ouvidoria/create', {
              nome: data.nome,
              email: data.email,
              motivo: data.motivo,
              text: data.text,
              vinculo: data.vinculo,
              procurouSetor: procurouFAZAG
            })

            alert('Mensagem enviada!')
          } catch(err){
            console.log(err)
          }
        }
        
        return (
            <>
              <Dialog.Root>
    <Dialog.Trigger asChild >
      <button className={`${styles.btnOuvidoria} btn btn-light`}>
        Ouvidoria
      </button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.DialogOverlay} />
      <Dialog.Content className={styles.DialogContent}>
        <Dialog.Title className={styles.DialogTitle}>Ouvidoria FAZAG</Dialog.Title>
        <Dialog.Description className="DialogDescription">
          Ajuda a FAZAG a melhorar cada vez mais.
        </Dialog.Description>
        <form onSubmit={handleSubmit} className={styles.form}>
          
          <label htmlFor="name" className={styles.labels}>Nome <span>*</span></label>
          <input type="text" name="nome" id="name" placeholder="Nome" className={`${styles.input}`} required/>
          
         {/* <label htmlFor="cpf" className={styles.labels}>CPF (Opcional)</label>
          <input type="text" id="cpf" placeholder="CPF" className={`${styles.input}`} /> */}

          <label htmlFor="email" className={styles.labels}>E-mail <span>*</span></label>
          <input type="text" name="email" id="email" placeholder="E-mail" className={`${styles.input}`} required/>

          <div className={styles.selectArea}>

          <fieldset>
          <label htmlFor="vinculo" className={styles.labels}>Seu Vínculo <span>*</span></label>
          <select name="vinculo" id="vinculo" className={styles.select} required>
            <option value="servidor">Servidor</option>
            <option value="aluno">Aluno</option>
            <option value="professor">Professor</option>
            <option value="terceirizado">Terceirizado</option>
            <option value="outros">Usuário/Outros</option>
          </select>
          </fieldset>

          <fieldset>
          <label htmlFor="motivo" className={styles.labels}>Motivo <span>*</span></label>
          <select name="motivo" id="motivo" className={styles.select} required>
            <option value="critica">Crítica</option>
            <option value="denuncia">Denúncia</option>
            <option value="elogio">Elogio</option>
            <option value="informacao">Informação</option>
            <option value="reclamacao">Reclamação</option>
            <option value="solicitacao">Solicitação</option>
            <option value="sugestao">Sugestão</option>
          </select>
          </fieldset>
          </div>

          <fieldset>
          <label htmlFor="procurei" className={styles.labels}>Você procurou o setor envolvido na manifestação, antes de recorrer à Ouvidoria? <span>*</span></label>
            <ToggleGroup.Root className={styles.toggleGroupRoot} type="single" defaultValue="sim" onValueChange={setProcurouFAZAG}>
              <ToggleGroup.Item value="sim" id="procurei" className={`${procurouFAZAG.includes('sim') ? styles.toggleGroupItemSelected : styles.toggleGroupItem} `} title="Sim">Sim</ToggleGroup.Item>
              <ToggleGroup.Item value="nao" className={`${procurouFAZAG.includes('nao') ? styles.toggleGroupItemSelected : styles.toggleGroupItem} `} title="Não">Não</ToggleGroup.Item>
            </ToggleGroup.Root>
          </fieldset>

          <label htmlFor="text" className={styles.labels}>Utilize o quadro abaixo para relatar seu motivo de procura: <span>*</span></label>
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