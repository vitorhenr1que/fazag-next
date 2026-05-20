import { Calendar, Image as Photo } from "phosphor-react";
import Image from 'next/image'
import { Slide } from "./HomeAssets/Slide";
import { ButtonsMain } from "./HomeAssets/ButtonsMain";
import { FormaIngressar } from './HomeAssets/FormaIngressar'
import AgendeProva from '../../public/images/agende-prova.jpg'
import AmbienteVirtual from '../../public/images/ambiente-virtual.jpg'
import PortalAluno from '../../public/images/portal-do-aluno.jpg'
import { PostDestaqueHome } from "./HomeAssets/PostDestaqueHome";
import styles from './style.module.scss'
import Link from "next/dist/client/link";
import { PostsProps } from "../../pages";
import { Ouvidoria } from "../Ouvidoria";

// https://dummyimage.com/1320x350/z32/fff.png 1903x1070

export default function HomeMain({posts}: PostsProps) {

  
  return (
    <>
      

       <Slide/>
       <div className="container">
        <section className={styles.botoesMain}>
        
        {/*<ButtonsMain 
          url="http"
          title="Agende sua prova" 
          description="Aqui você também pode realizar a sua prova sem precisar sair de casa."
          src={AgendeProva}/>*/}
          
          <ButtonsMain 
          url="https://moodle.fazag.edu.br"
          title="Ambiente Virtual" 
          description="Acesse cursos, aulas e conteúdos online no AVA da FAZAG."
          src={AmbienteVirtual}/>
          
          <ButtonsMain 
          // url="https://fazag.sistemajaguar.com.br"
          url="https://portais.qualinfonet.com.br/fazag"
          title="Portal do Aluno" 
          description="Acesse suas notas, comprovante de matrícula, certificados e muito mais."
          src={PortalAluno}/>

        </section>
        </div>
        <div className={`container ${styles.blocos}`}>
          <div className={`row ${styles.mainInfo}`}>
            <div className={`col-md-8 ${styles.fazagInfoContainer}`}>
              
                <Link href="/fazaginforma" className={styles.fazagInfo}>FAZAG INFORMA</Link>
                {/* COLOCAR COMPONENTE AQUI! */}
                <PostDestaqueHome posts={posts}/>
              </div>

            <div className={`col ${styles.agenda}`}>AGENDA
            
              <Link href="/calendario-academico" className={styles.agendaBtn}>
                <Calendar className={styles.phosforIcon} size={24}/>
                <span className={styles.buttonText}>Calendário Acadêmico</span>
              </Link>
              <Link href="/eventos-institucionais" className={styles.eventosBtn}>
                <Photo className={styles.phosforIcon} size={24} />
                <span className={styles.buttonText}>Eventos Institucionais</span>
              </Link>

              <Ouvidoria className={styles.btnOuvidoria_custom}/>
              
              <div className={styles.eMEContainer}>
                <a className={styles.spanMEC} href="https://emec.mec.gov.br/emec/consulta-cadastro/detalhamento/d96957f455f6405d14c6542552b0f6eb/MjU2OA==">
                  <span>Consulte aqui o cadastro da</span>
                  <span>instituição no sistema e-MEC</span>
                </a>
                <a className={styles.mecQrCode} href="https://emec.mec.gov.br/emec/consulta-cadastro/detalhamento/d96957f455f6405d14c6542552b0f6eb/MjU2OA==">
                  <Image width={190} height={290} src={"/images/mecqrcode.png"} alt={"qrcode"} />
                </a>
              </div>

            </div>
          </div>
        </div>
        <FormaIngressar/>
     
    </>
    
  )
}
