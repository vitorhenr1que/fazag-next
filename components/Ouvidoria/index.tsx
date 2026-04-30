import { Cross2Icon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import styles from './style.module.scss'
import * as ToggleGroup  from "@radix-ui/react-toggle-group";
import { FormEvent, useState } from "react";
import { api } from "../../services/api";
import { Loading } from "../Loading";
import { Headset, User, Envelope, IdentificationBadge, Info, ChatText, Question } from "phosphor-react";

export function Ouvidoria({ className }: { className?: string }) {
        const [procurouFAZAG, setProcurouFAZAG] = useState('Sim')
        const [openModal, setOpenModal] = useState(false)
        const [loading, setLoading] = useState(false)

        async function handleSubmit(e: FormEvent){
          e.preventDefault()
          setLoading(true)
          
          const formData = new FormData(e.target as HTMLFormElement)
          const data = Object.fromEntries(formData)
          
          try {
            await api.post('/ouvidoria/create', {
              nome: data.nome,
              email: data.email,
              motivo: data.motivo,
              text: data.text,
              vinculo: data.vinculo,
              procurouSetor: procurouFAZAG
            })

            await api.post('/ouvidoria/nodemailer', {
              nome: data.nome,
              email: data.email,
              motivo: data.motivo,
              text: data.text,
              vinculo: data.vinculo,
              procurouSetor: procurouFAZAG
            }) 
            setLoading(false)
            
            alert('Mensagem enviada!')
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
      <button className={className || `${styles.btnOuvidoria} btn btn-light`}>
        <Headset size={24} className={styles.icon}/>
        <span>Ouvidoria</span>
      </button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.DialogOverlay} />
      <Dialog.Content className={styles.DialogContent}>

        {loading && <Loading/>}
        
        <Dialog.Title className={styles.DialogTitle}>Ouvidoria FAZAG</Dialog.Title>
        <p className={styles.description}>
          Sua opinião é fundamental para melhorarmos nossos serviços. Relate sua experiência.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          
          <div className={styles.inputGrid}>
            <div className={styles.field}>
              <label htmlFor="name" className={styles.labels}>
                <User size={18} weight="bold" />
                Nome <span>*</span>
              </label>
              <input type="text" name="nome" id="name" placeholder="Seu nome completo" className={styles.input} required/>
            </div>
            
            <div className={styles.field}>
              <label htmlFor="email" className={styles.labels}>
                <Envelope size={18} weight="bold" />
                E-mail <span>*</span>
              </label>
              <input type="email" name="email" id="email" placeholder="exemplo@email.com" className={styles.input} required/>
            </div>
          </div>

          <div className={styles.inputGrid}>
            <div className={styles.field}>
              <label htmlFor="vinculo" className={styles.labels}>
                <IdentificationBadge size={18} weight="bold" />
                Seu Vínculo <span>*</span>
              </label>
              <select name="vinculo" id="vinculo" className={styles.select} required>
                <option value="" disabled selected>Selecione seu vínculo</option>
                <option value="Servidor">Servidor</option>
                <option value="Aluno">Aluno</option>
                <option value="Professor">Professor</option>
                <option value="Terceirizado">Terceirizado</option>
                <option value="Usuário/Outros">Usuário/Outros</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="motivo" className={styles.labels}>
                <Info size={18} weight="bold" />
                Motivo <span>*</span>
              </label>
              <select name="motivo" id="motivo" className={styles.select} required>
                <option value="" disabled selected>Selecione o motivo</option>
                <option value="Crítica">Crítica</option>
                <option value="Denúncia">Denúncia</option>
                <option value="Elogio">Elogio</option>
                <option value="Informação">Informação</option>
                <option value="Reclamação">Reclamação</option>
                <option value="Solicitação">Solicitação</option>
                <option value="Sugestão">Sugestão</option>
              </select>
            </div>
          </div>

          <div className={styles.toggleSection}>
            <label className={styles.labels}>
              <Question size={18} weight="bold" />
              Você procurou o setor envolvido antes de recorrer à Ouvidoria? <span>*</span>
            </label>
            <ToggleGroup.Root 
              className={styles.toggleGroupRoot} 
              type="single" 
              value={procurouFAZAG} 
              onValueChange={(val) => val && setProcurouFAZAG(val)}
            >
              <ToggleGroup.Item value="Sim" className={procurouFAZAG === 'Sim' ? styles.toggleGroupItemSelected : styles.toggleGroupItem}>
                Sim, procurei
              </ToggleGroup.Item>
              <ToggleGroup.Item value="Não" className={procurouFAZAG === 'Não' ? styles.toggleGroupItemSelected : styles.toggleGroupItem}>
                Não, recorri direto
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>

          <div className={styles.field}>
            <label htmlFor="text" className={styles.labels}>
              <ChatText size={18} weight="bold" />
              Relato da Manifestação <span>*</span>
            </label>
            <textarea 
              name="text" 
              id="text" 
              rows={4} 
              className={styles.textArea} 
              placeholder="Descreva detalhadamente o ocorrido ou sua sugestão..."
              required
            ></textarea>
          </div>

          <button className={styles.enviarButton} type='submit' disabled={loading}>
            <span>{loading ? 'Enviando...' : 'Enviar Manifestação'}</span>
          </button>
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