import { Cross2Icon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import styles from './style.module.scss'
import { FormEvent, useEffect, useState } from "react";
import { api } from "../../services/api";
import { Loading } from "../Loading";
import { DayPicker, DateFormatter, WeekNumberFormatter } from "react-day-picker";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale'
import 'react-day-picker/dist/style.css'
import * as  ToggleGroup from "@radix-ui/react-toggle-group";
import { LoadingDiv } from "../Loading/LoadingDiv";

interface testArrProps {

      createdAt: String,
      email: String,
      horario: String,
      id: String,
      nome: String,
      vinculo: String

}




export function ModalNusp() {
        const [openModal, setOpenModal] = useState(false)
        const [loading, setLoading] = useState(false)
        const [loadingHour, setLoadingHour] = useState(false)
        const [daysSelected, setDaysSelected] = useState<Date>(getDate) // se DayPicker fosse mode="multiple" receberia <Date[]> 
        const [horario, SetHorario] = useState("")
        const [testArr, SetTestArr] = useState<testArrProps[]>([])
        const [isReserved, setIsReserved] = useState([])


        function VerifyHour(hour: string){
          const test = !!testArr.filter((index) => index.horario.includes(hour))[0]
          console.log('esse é o test: ', test)
          
          return test
        }

        function ToggleGroupA(){


          
          return (
              <>
              <label htmlFor="procurei" className={styles.labels}>Escolha o horário da sua sessão: <span>*</span></label>
                  <ToggleGroup.Root className={styles.toggleGroupRoot} type="single" defaultValue="Sim" onValueChange={SetHorario} >
                    <ToggleGroup.Item value="19" className={`${horario.includes('19') ? styles.toggleGroupItemSelected : styles.toggleGroupItem}`} disabled={VerifyHour('19')} title="19">19:00</ToggleGroup.Item>
                    <ToggleGroup.Item value="20" className={`${horario.includes('20') ? styles.toggleGroupItemSelected : styles.toggleGroupItem} `} disabled={VerifyHour('20')} title="20">20:00</ToggleGroup.Item>
                    <ToggleGroup.Item value="21" className={`${horario.includes('21') ? styles.toggleGroupItemSelected : styles.toggleGroupItem} `} disabled={VerifyHour('21')} title="21">21:00</ToggleGroup.Item>
                  </ToggleGroup.Root>
              </>
      
          )
      }

        function getDate(){
            const data = new Date()
            const diaDaSemana = data.getDay()
            if(diaDaSemana === 1){ // mais dias: if(diaDaSemana === 2 || diaDaSemana === 3)
                return new Date()
            }
            let diasAteDataInicial = 1 - diaDaSemana // o 1 é o valor da semana que quer que apareça marcado por padrão
            if(diasAteDataInicial <= 0){
                diasAteDataInicial += 7
            }
            return new Date(data.setDate(data.getDate() + diasAteDataInicial))
        }


        const daysAccepted = [1] // 1-seg 2-ter 3-qua... ex: [1, 2, 3]

        function disableDay(date: Date){ // O DayPicker vai fazer um map com Data do calendário
            const DayOfWeek = date.getDay() // vai pegar em número o dia da semana de 0 a 6 (domingo a sábado)
            return !daysAccepted.includes(DayOfWeek) //retorna pro DayPicker "true" se não incluir algum dos itens de daysAccepted se incluir retorna "false" (Retorna Data por Data)
        }


        function handleDaySelected(day: Date){
            //Para o caso de Múltipla seleção
         /*   console.log('day: ', day)
            
            console.log('selected: ', selected) //selected entra como parâmetro objeto {selected}
            if(selected){
                const newFilterArray = daysSelected.filter((selectedDay: any) => day.toLocaleDateString() === selectedDay.toLocaleDateString())
                setDaysSelected(newFilterArray)
                console.log('DIAS SELECIONADOS: ',daysSelected)
            }
            else{
                setDaysSelected([...daysSelected, day])
            } */ 
            setDaysSelected(day)
        }

        //Configurações de Localização PT-BR do DayPicker + date-fns (tem na documentação do DayPicker)

        const NU_LOCALE = 'pt-BR';

        const formatDay: DateFormatter = (day) =>
          day.getDate().toLocaleString(NU_LOCALE);

        const formatWeekNumber: WeekNumberFormatter = (weekNumber) => {
          return weekNumber.toLocaleString(NU_LOCALE);
        };

        const formatCaption: DateFormatter = (date, options) => {
          const y = date.getFullYear().toLocaleString(NU_LOCALE, {useGrouping: false});
          const m = format(date, 'MMMM', { locale: options?.locale });
          return `${m} ${y}`;
        };


        async function handleSubmit(e: FormEvent){
            e.preventDefault()
            setLoading(true)
            
            const formData = new FormData(e.target as HTMLFormElement)
            const data = Object.fromEntries(formData)
            console.log('Data aqui: ', data)
            try {
              await api.post('/nusp/create', {
                nome: data.nome,
                email: data.email,
                horario: horario,
                vinculo: data.vinculo,
                dataAgendada: daysSelected.toLocaleString().split(',')[0]
              })
  
              await api.post('/nusp/nodemailer', {
                nome: data.nome,
                email: data.email,
                horario: horario,
                text: data.text,
                vinculo: data.vinculo,
                dataAgendada: daysSelected.toLocaleString().split(',')[0]
              }) 
              setLoading(false)
              
              alert('Mensagem enviada!')
              setOpenModal(false)
            } catch(err){
              console.log(err, 'Erro com a validação do formulário')
            }
          }



//useEffect
          useEffect(()=> {
            async function VerifyDateHour(){
              setLoadingHour(true)
              try{
                const response = await api.post('/nusp/find', {
                  dataAgendada: daysSelected.toLocaleString().split(',')[0]
                })

                SetTestArr(response.data)

              }catch(e){
                console.log(e, 'Erro na verificação de agendamento')
              }
              

              setLoadingHour(false)
            }
            VerifyDateHour()
            SetHorario("")
            console.log('testArr', testArr)
          },[daysSelected])




        
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
        <div className={styles.icon}>
            <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 1C4.77614 1 5 1.22386 5 1.5V2H10V1.5C10 1.22386 10.2239 1 10.5 1C10.7761 1 11 1.22386 11 1.5V2H12.5C13.3284 2 14 2.67157 14 3.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V3.5C1 2.67157 1.67157 2 2.5 2H4V1.5C4 1.22386 4.22386 1 4.5 1ZM10 3V3.5C10 3.77614 10.2239 4 10.5 4C10.7761 4 11 3.77614 11 3.5V3H12.5C12.7761 3 13 3.22386 13 3.5V5H2V3.5C2 3.22386 2.22386 3 2.5 3H4V3.5C4 3.77614 4.22386 4 4.5 4C4.77614 4 5 3.77614 5 3.5V3H10ZM2 6V12.5C2 12.7761 2.22386 13 2.5 13H12.5C12.7761 13 13 12.7761 13 12.5V6H2ZM7 7.5C7 7.22386 7.22386 7 7.5 7C7.77614 7 8 7.22386 8 7.5C8 7.77614 7.77614 8 7.5 8C7.22386 8 7 7.77614 7 7.5ZM9.5 7C9.22386 7 9 7.22386 9 7.5C9 7.77614 9.22386 8 9.5 8C9.77614 8 10 7.77614 10 7.5C10 7.22386 9.77614 7 9.5 7ZM11 7.5C11 7.22386 11.2239 7 11.5 7C11.7761 7 12 7.22386 12 7.5C12 7.77614 11.7761 8 11.5 8C11.2239 8 11 7.77614 11 7.5ZM11.5 9C11.2239 9 11 9.22386 11 9.5C11 9.77614 11.2239 10 11.5 10C11.7761 10 12 9.77614 12 9.5C12 9.22386 11.7761 9 11.5 9ZM9 9.5C9 9.22386 9.22386 9 9.5 9C9.77614 9 10 9.22386 10 9.5C10 9.77614 9.77614 10 9.5 10C9.22386 10 9 9.77614 9 9.5ZM7.5 9C7.22386 9 7 9.22386 7 9.5C7 9.77614 7.22386 10 7.5 10C7.77614 10 8 9.77614 8 9.5C8 9.22386 7.77614 9 7.5 9ZM5 9.5C5 9.22386 5.22386 9 5.5 9C5.77614 9 6 9.22386 6 9.5C6 9.77614 5.77614 10 5.5 10C5.22386 10 5 9.77614 5 9.5ZM3.5 9C3.22386 9 3 9.22386 3 9.5C3 9.77614 3.22386 10 3.5 10C3.77614 10 4 9.77614 4 9.5C4 9.22386 3.77614 9 3.5 9ZM3 11.5C3 11.2239 3.22386 11 3.5 11C3.77614 11 4 11.2239 4 11.5C4 11.7761 3.77614 12 3.5 12C3.22386 12 3 11.7761 3 11.5ZM5.5 11C5.22386 11 5 11.2239 5 11.5C5 11.7761 5.22386 12 5.5 12C5.77614 12 6 11.7761 6 11.5C6 11.2239 5.77614 11 5.5 11ZM7 11.5C7 11.2239 7.22386 11 7.5 11C7.77614 11 8 11.2239 8 11.5C8 11.7761 7.77614 12 7.5 12C7.22386 12 7 11.7761 7 11.5ZM9.5 11C9.22386 11 9 11.2239 9 11.5C9 11.7761 9.22386 12 9.5 12C9.77614 12 10 11.7761 10 11.5C10 11.2239 9.77614 11 9.5 11Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
        </div>
        <span>Agendar sua sessão</span>
      </button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.DialogOverlay} />
      <Dialog.Content className={styles.DialogContent}>

       {loading && <Loading/>}
        
        <Dialog.Title className={styles.DialogTitle}>Agende sua sessão</Dialog.Title>

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
              <option value="Servidor">Servidor</option>
              <option value="Aluno">Aluno</option>
              <option value="Professor">Professor</option>
              <option value="Terceirizado">Terceirizado</option>
              <option value="Usuário/Outros">Usuário/Outros</option>
            </select>
            </fieldset>
        </div>

          <div className={styles.dateContainer}>
            <DayPicker 
            mode="single"
            selected={daysSelected}
            onDayClick={handleDaySelected}
            disabled={disableDay}
            locale={ptBR}
            
            formatters={{formatDay, formatCaption, formatWeekNumber}}
            />
            
            
            <div className={styles.hourContainer}>
              {loadingHour ? <LoadingDiv/> : <ToggleGroupA/>}

        </div>
            </div>
            
            
          


          <label htmlFor="text" className={styles.labels}>Breve relato da demanda: <span>*</span></label>
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