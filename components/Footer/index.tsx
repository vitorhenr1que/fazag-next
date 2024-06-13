import Image from 'next/image'
import { SocialIcon } from './SocialIcon'
import styles from './style.module.scss'
import moodle from '../../public/images/icons/moodle.svg'
import youtube from '../../public/images/icons/youtube.svg'
import facebook from '../../public/images/icons/facebook.svg'
import instagram from '../../public/images/icons/instagram.svg'
import whatsapp from '../../public/images/icons/whatsapp.svg'
import logofazag from '../../public/images/logo-fazag-branca.png'
import Link from 'next/link'


export default function Footer() {
    return (
        <div className={styles.footerContainer}>
            <div className={`container ${styles.footerHeader}`}>
                <div className={styles.divFooter}>
                    <span>A FAZAG</span>
                    <Link href="/fazaginforma/quem-somos">Quem somos</Link>
                    <Link href="/fazaginforma/a-faculdade-zacarias-de-goes-tem-como-missao-contribuir">Missão, Visão e Valores</Link>
                    <Link href="/static/regulamentos/regulamentogeral.pdf" download={"Regulamento Geral.pdf"}>Regimento Geral</Link>
                    <Link href="/publicacoes-institucionais">Publicações Insitucionais</Link>
                </div>
                <div className={styles.divFooter}>
                    <span>CURSOS</span>
                    <Link href="/cursos/administracao">Administração</Link>
                    <Link href="/cursos/ciencias-contabeis">Ciências Contábeis</Link>
                    <Link href="/cursos/educacao-fisica">Educação Física</Link>
                    <Link href="/cursos/enfermagem">Enfermagem</Link>
                    <Link href="/cursos/engenharia-civil">Engenharia Civil</Link>
                    <Link href="/cursos/estetica">Estética</Link>
                    <Link href="/cursos/farmacia">Farmácia</Link>
                    <Link href="/cursos/fisioterapia">Fisioterapia</Link>
                    <Link href="/cursos/nutricao">Nutrição</Link>
                    <Link href="/cursos/pedagogia">Pedagogia</Link>
                    <Link href="/cursos/psicologia">Psicologia</Link>
                    <Link href="/cursos/servico-social">Serviço Social</Link>
                </div>
                <div className={styles.divFooterBlock}>
                    <div className={styles.divFooter}>
                        <span>CONTEUDOS</span>
                        <Link href="/publicacoes-institucionais">Calendário Acadêmico</Link>
                        <Link href="/eventos-institucionais">Eventos Institucionais</Link>
                        <Link href="/fazaginforma/cpa">CPA</Link>
                        <Link href="/fazaginforma/monitoria">Monitoria</Link>
                    </div>
                    <div className={styles.divFooter}>
                        <span>SUPORTE</span>
                        {/*<Link href="#">Perguntas Frequentes</Link>*/}
                        <Link href="/fazaginforma/contato">Contato</Link>
                    </div>
                </div>
                <div className={styles.divFooterBlock}>
                    <div className={styles.divFooterSocial}>
                        <span>REDES SOCIAIS</span>
                        <div className={styles.iconContainer}>
                        <SocialIcon logo={<Image src={whatsapp} alt={'WhatsApp'}/>} buttonColor='linear-gradient(45deg, #25D366 20%, #128C7E )' link='https://wa.me/5575982296725' />
                        <SocialIcon logo={<Image src={instagram} alt={'Instagram'}/>} buttonColor='linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' link="https://instagram.com/faculdade_fazag" />
                        <SocialIcon logo={<Image src={facebook} alt={'Facebook'}/>} buttonColor='#3b5998' link='https://facebook.com/fazag' />
                        <SocialIcon logo={<Image src={moodle} alt={'Moodle'}/>} buttonColor='linear-gradient(45deg, #f38e17, #dd851d 45%)' link='https://moodle.fazag.edu.br' />
                        <SocialIcon logo={<Image src={youtube} alt={'Youtube'} quality={100}/>} buttonColor='#ff0000' link='https://www.youtube.com/channel/UCU97-2ut5JjiS3y9vZPQSGg' />
                        
                        </div>
                        
                    </div>
                    <div className={styles.divFooterButton}>
                        <span>Acesse o Portal da FAZAG</span>
                        <Link className='btn btn-primary' href="https://fazag.sistemajaguar.com.br">Entrar</Link>
                    </div>
                </div>
            </div>
            
            <div className={`${styles.lowFooter} container`}>
            <hr/>
            <div className={styles.divLowFooter}>
                <Link href="/"><Image width={150} src={logofazag} alt={'Logo FAZAG'} quality={100}/></Link>
                <span>Copyright © 2002-2023 Sociedade Educacional Zacarias de Góes LTDA. Todos os direitos reservados.</span>
            </div>
            
            </div>
            
        </div>
    )
}