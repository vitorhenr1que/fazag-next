import Image from 'next/image'
import styles from '../../styles/nusp.module.scss'
import nusp from '../../public/images/nusp.jpg'
import { ModalNusp } from '../../components/Nusp'

export default function Nusp(){
    return(
        <div className={`container ${styles.container}`}>
            <div className={styles.imageContainer}>
                <Image className={styles.imageNusp} src={nusp}  alt='Imagem de uma psicóloga fazendo atendimento' />
                <ModalNusp/>
            </div>
            <div className={styles.textContainer}>
                <div className={styles.h2Div}>
                    <h2>Núcleo de Apoio Sócio Psicopedagógico</h2>
                </div>
                <div className={styles.pDiv}>
                    <p>O Núcleo de Apoio Sócio Psicopedagógico da Faculdade FAZAG é um espaço dedicado ao bem-estar e ao desenvolvimento integral dos nossos estudantes. Reconhecendo a importância do suporte psicológico na jornada acadêmica, oferecemos serviços especializados para auxiliar nossos alunos em suas demandas emocionais e psicopedagógicas.</p>
                    <p>Nossa equipe é composta por profissionais altamente qualificados, comprometidos em proporcionar um ambiente acolhedor e confidencial para todos os que buscam apoio. Entre os serviços oferecidos, destacamos os atendimentos com nossa psicóloga, realizados nas terças e quartas-feiras.</p>
                    <p>Para garantir um atendimento personalizado e eficaz, as sessões são agendadas previamente. Cada dia conta com três sessões, com duração de uma hora cada. O agendamento pode ser facilmente realizado através do nosso site, proporcionando comodidade e praticidade aos nossos alunos.</p>
                    <p>Entendemos que o bem-estar emocional é fundamental para o sucesso acadêmico e pessoal. Por isso, incentivamos todos os nossos estudantes a aproveitarem os recursos disponíveis no Núcleo de Apoio Sócio Psicopedagógico, buscando o equilíbrio e o crescimento pessoal durante sua trajetória na FAZAG.</p>
                    <p>Estamos aqui para apoiá-lo em todas as etapas da sua jornada acadêmica. Não hesite em entrar em contato conosco e agendar sua sessão. Sua saúde emocional é nossa prioridade.</p>
                </div>
            </div>
            
        </div>
    )
}