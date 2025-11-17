import Image from 'next/image'
import styles from '../../styles/biblioteca.module.scss'
import biblioteca from '../../public/images/biblioteca.png'
import { Card } from '../../components/Biblioteca/Card'
import minhabiblioteca from '../../public/images/minhabiblioteca.jpg'
import curatoria from '../../public/images/curatoria.jpg'
import dspace from '../../public/images/dspace.jpg'
import OJS from '../../public/images/OJS.jpg'
import revista from '../../public/images/revista.png'

export default function Biblioteca(){
    return(
        <div className={styles.container}>

        <Image src={biblioteca} className={styles.imageBiblioteca} alt='Imagem de Biblioteca'/>
        <div className={`container ${styles.containerBib}`}>
            <h2>Biblioteca FAZAG</h2>
            <p>A Biblioteca da FAZAG está dedicada a fornecer informações técnicas, científicas e culturais para sua comunidade acadêmica. Nossa missão é atender às necessidades de ensino, pesquisa e extensão, adotando tecnologias modernas para o tratamento, recuperação e transferência de informações. Selecionamos, analisamos, organizamos, armazenamos, disseminamos e recuperamos informações para apoiar os programas de ensino e pesquisa em diversas áreas.</p>
            {/*<p>Para garantir a acessibilidade, nossos espaços estão equipados com recursos como teclados em braille e fones de ouvido, além de oferecer aplicativos como Vlibras e Dosvox, que permitem uma leitura acessível para todos os usuários.</p>*/}
            <h2>Biblioteca Virtual</h2>
            <p>A Biblioteca Virtual destaca-se pela vasta gama de recursos disponíveis, facilitando o processo de leitura dinâmica e oferecendo uma ampla variedade de publicações eletrônicas adaptadas aos ambientes digitais.</p>

            <p>Todos os materiais básicos e complementares necessários para as disciplinas oferecidas estão disponíveis no ambiente virtual, garantindo acesso contínuo e ininterrupto, 24 horas por dia, 7 dias por semana. Isso proporciona uma leitura otimizada em qualquer dispositivo móvel e em qualquer ambiente.</p>

            <p>A Biblioteca da Faculdade FAZAG possui assinatura de diversas bases de dados, bibliotecas virtuais e periódicos especializados, oferecendo milhares de títulos disponíveis em formatos digitais. Conheça algumas delas:</p>  

            <section className={styles.cardsContainer}>
            <div className={styles.divTitle}>
                <h3>Acervo Digital</h3>
            </div>
            <div className={styles.containerCard}>
                <Card 
                    title='Minha Biblioteca' 
                    // link='https://portal.dli.minhabiblioteca.com.br/Login.aspx?key=FAZAGValenca'
                    link='https://sso.minhabiblioteca.com.br/Login.aspx?key=UNITESTE'
                    image={minhabiblioteca}
                    paragraph='Milhares de títulos técnicos, acadêmicos e científicos de diversas áreas do conhecimento. plataforma intuitiva e fácil de usar. Totalmente online.'
                    />
                <Card 
                    title='Curatoria Editora'
                    link='https://moodle.fazag.edu.br/mod/lti/launch.php?id=2'
                    image={curatoria}
                    paragraph='Navegação intuitiva e de qualquer dispositivo. Rica fonte de conhecimento acadêmico, abrangendo um vasto leque de disciplinas e especializações.'
                />

            </div>

            <div className={styles.divTitle}>
                <h3>Apoio a Pesquisa</h3>
            </div>
            <div className={styles.containerCard}>
                <Card title='Repositório Digital' link='http://zacarias-vlc.conecttelecom.com.br:8080/xmlui/' image={dspace} paragraph='Uma plataforma de repositório digital que serve para ajudar instituições a gerenciar, preservar e fornecer acesso a uma ampla variedade de conteúdos digitais, como artigos acadêmicos, documentos de pesquisa, conjuntos de dados, imagens e muito mais.'/>
                <Card title='Revista Científica' link='http://zacarias-vlc.conecttelecom.com.br:8081/ojs/index.php/fazag/login' image={OJS} paragraph='O Open Journal Systems é uma plataforma de gerenciamento e publicação de revistas eletrônicas. O OJS oferece uma gama de ferramentas para facilitar o fluxo de trabalho editorial, desde a submissão inicial até a publicação final.'/>
                <Card title='1ª Edição da Revista FAZAG' link='static/revista_fazag_vol_1.pdf' download='Revista FAZAG - Volume 1' image={revista} paragraph='Explore as fronteiras do conhecimento acadêmico com o Volume 1 da Revista da Faculdade FAZAG. Prepare-se para uma jornada intelectual enriquecedora enquanto celebramos o pensamento crítico e a excelência acadêmica na FAZAG.' />
            </div>
                
            </section>

        </div>
            
        </div>
    )
    
}