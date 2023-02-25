import { FacebookLogo, InstagramLogo, WhatsappLogo, YoutubeLogo } from 'phosphor-react'
import Image from 'next/image'
import { SocialIcon } from './SocialIcon'
import styles from './style.module.scss'
import moodle from '../../public/images/icons/moodle.svg'
import youtube from '../../public/images/icons/youtube.svg'
import facebook from '../../public/images/icons/facebook.svg'
import instagram from '../../public/images/icons/instagram.svg'
import whatsapp from '../../public/images/icons/whatsapp.svg'
import logofazag from '../../public/images/logo-fazag-branca.png'

export default function Footer() {
    return (
        <div className={styles.footerContainer}>
            <div className={`container ${styles.footerHeader}`}>
                <div className={styles.divFooter}>
                    <span>A FAZAG</span>
                    <a href="fazaginforma/quem-somos">Quem somos</a>
                    <a href="fazaginforma/a-faculdade-zacarias-de-goes-tem-como-missao-contribuir">Missão, Visão e Valores</a>
                    <a href="#">Regimento Geral</a>
                    <a href="publicacoes-institucionais">Publicações Insitucionais</a>
                </div>
                <div className={styles.divFooter}>
                    <span>CURSOS</span>
                    <a href="cursos/administracao">Administração</a>
                    <a href="cursos/ciencias-contabeis">Ciências Contábeis</a>
                    <a href="cursos/educacao-fisica">Educação Física</a>
                    <a href="cursos/enfermagem">Enfermagem</a>
                    <a href="cursos/engenharia-civil">Engenharia Civil</a>
                    <a href="cursos/estetica">Estética</a>
                    <a href="cursos/farmacia">Farmácia</a>
                    <a href="cursos/fisioterapia">Fisioterapia</a>
                    <a href="cursos/nutricao">Nutrição</a>
                    <a href="cursos/pedagogia">Pedagogia</a>
                    <a href="cursos/psicologia">Psicologia</a>
                    <a href="cursos/servico-social">Serviço Social</a>
                </div>
                <div className={styles.divFooterBlock}>
                    <div className={styles.divFooter}>
                        <span>CONTEUDOS</span>
                        <a href="publicacoes-institucionais">Calendário Acadêmico</a>
                        <a href="eventos-institucionais">Eventos Institucionais</a>
                        <a href="fazaginforma/cpa">CPA</a>
                        <a href="fazaginforma/monitoria">Monitoria</a>
                    </div>
                    <div className={styles.divFooter}>
                        <span>SUPORTE</span>
                        <a href="#">Perguntas Frequentes</a>
                        <a href="#">Contato</a>
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
                        <a className='btn btn-primary' href="http://sistemajaguar.com.br">Entrar</a>
                    </div>
                </div>
            </div>
            
            <div className={`${styles.lowFooter} container`}>
            <hr/>
            <div className={styles.divLowFooter}>
                <a href="/"><Image width={100} src={logofazag} alt={'Logo FAZAG'} quality={100}/></a>
                <span>Copyright © 2002-2023 Sociedade Educacional Zacarias de Góes LTDA. Todos os direitos reservados.</span>
            </div>
            
            </div>
            
        </div>
    )
}