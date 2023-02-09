import certification from '../../../../public/images/icons/certification.png'
import enem from '../../../../public/images/icons/enem.png'
import vestonline from '../../../../public/images/icons/vest-online.png'
import vestoffline from '../../../../public/images/icons/vest-offline.png'
import transferency from '../../../../public/images/icons/transferency.png'
import Image from 'next/image'
import styles from './style.module.scss'


export function FormaIngressar() {
    return (
        <>
        <section>
        <div className={styles.formasDeIngressoContainer}>
            <h2>FORMAS DE INGRESSO</h2>
            <div className={styles.formasDeIngressoContent}>
                <div className={`${styles.formasDeIngressoContentItem} ${styles.itemA}`}>
               <Image src={vestonline} alt="" />
               <h4>VESTIBULAR ONLINE</h4>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed eligendi voluptas dolorem, sequi voluptatum, blanditiis enim qui minima totam quidem harum non necessitatibus! Voluptatum porro dolor, possimus ullam quo aliquid!</p>
                </div>
                <div className={`${styles.formasDeIngressoContentItem} ${styles.itemB}`}>
                <Image src={vestoffline} alt="" />
                <h4>VESTIBULAR TRADICIONAL</h4>
                <p>O vestibular tradicional é aquele em que são divulgadas as datas relacionadas com o período de inscrição, datas das provas, matrículas, etc. Geralmente a FAZAG divulga um edital e/ou manual do candidato onde podem ser encontradas todas as informações referentes ao exame. As provas podem ser objetivas ou dissertativas, mas normalmente possuem uma redação.</p>
                </div>
                <div className={`${styles.formasDeIngressoContentItem} ${styles.itemC}`}>
                <Image src={transferency} alt="" />
                <h4>TRANSFERÊNCIA</h4>
                <p className={styles.paragrafo}>
                    <strong>Transfira seu curso para a nossa Faculdade</strong>
                    <span>Junte os documentos necessários para se transferir para a FAZAG</span>
                    <a href='#'>(Confira a documentação aqui)</a>
                </p>
                </div>
                <div className={`${styles.formasDeIngressoContentItem} ${styles.itemD}`}>
                <Image src={certification} alt="" />
                <h4>SEGUNDA GRADUAÇÃO</h4>
                <p className={styles.paragrafo}> 
                    <strong>Em apenas 3 passos você dará início ao seu futuro!</strong>
                    <span>1 - Escolha o curso, preencha o formulário de inscrição em nosso site.</span>
                    <span>2 - Junte os documentos necessários.</span>
                    <span>3 - Entregue a documentação na secretaria e boa sorte.</span>
                    <a href='#'>(Confira a documentação aqui)</a>
                </p>
                </div>
                <div className={`${styles.formasDeIngressoContentItem} ${styles.itemE}`}>
                <Image src={enem} alt="" />
                <h4>NOTA DO ENEM</h4>
                <p className={styles.paragrafo}> 
                    <strong>Em apenas 3 passos você dará início ao seu futuro!</strong>
                    <span>1 - Escolha o curso, preencha o formulário de inscrição em nosso site.</span>
                    <span>2 - Junte os documentos necessários para ingressar com sua nota do ENEM.</span>
                    <span>3 - Entregue a documentação na secretaria e boa sorte.</span>
                    <a href='#'>(Confira a documentação aqui)</a>
                </p>
                </div>
            </div>
        </div>
        </section>
        </>
    )
}