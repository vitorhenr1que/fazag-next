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
          url="http://sistemajaguar.com.br"
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
            
              <button className="btn btn-danger" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                <Calendar className={styles.phosforIcon} size={24}/>
                <span className={styles.buttonText}>Calendario Acadêmico</span>
              </button>


              <div className="collapse" id="collapseExample">
                <a className={styles.calendarItem} download={'calendario20231.pdf'} href={"/static/calendario/calendario20231.pdf"}>
                  <svg xmlns={"http://www.w3.org/2000/svg"} height={"40"} width={"40"}><path d={"M14.208 21.917h1.584V18.5h1.875q.666 0 1.125-.458.458-.459.458-1.125v-1.875q0-.667-.458-1.125-.459-.459-1.125-.459h-3.459Zm1.584-5v-1.875h1.875v1.875Zm5.25 5h3.416q.667 0 1.125-.459.459-.458.459-1.125v-5.291q0-.667-.459-1.125-.458-.459-1.125-.459h-3.416Zm1.583-1.584v-5.291h1.833v5.291Zm5.333 1.584h1.584V18.5H31.5v-1.583h-1.958v-1.875H31.5v-1.584h-3.542Zm-16.291 9.208q-1.125 0-1.959-.833-.833-.834-.833-1.959V6.125q0-1.125.833-1.958.834-.834 1.959-.834h22.208q1.125 0 1.958.834.834.833.834 1.958v22.208q0 1.125-.834 1.959-.833.833-1.958.833Zm0-2.792h22.208V6.125H11.667v22.208Zm-5.542 8.334q-1.125 0-1.958-.834-.834-.833-.834-1.958v-25h2.792v25h25v2.792Zm5.542-30.542v22.208V6.125Z"} /></svg>
                  <p>2023.1</p>
                </a>
                
                <hr />

                <a className={styles.calendarItem} download={'calendario20232.pdf'} href={"/static/calendario/calendario20232.pdf"}>
                  <svg xmlns={"http://www.w3.org/2000/svg"} height={"40"} width={"40"}><path d={"M14.208 21.917h1.584V18.5h1.875q.666 0 1.125-.458.458-.459.458-1.125v-1.875q0-.667-.458-1.125-.459-.459-1.125-.459h-3.459Zm1.584-5v-1.875h1.875v1.875Zm5.25 5h3.416q.667 0 1.125-.459.459-.458.459-1.125v-5.291q0-.667-.459-1.125-.458-.459-1.125-.459h-3.416Zm1.583-1.584v-5.291h1.833v5.291Zm5.333 1.584h1.584V18.5H31.5v-1.583h-1.958v-1.875H31.5v-1.584h-3.542Zm-16.291 9.208q-1.125 0-1.959-.833-.833-.834-.833-1.959V6.125q0-1.125.833-1.958.834-.834 1.959-.834h22.208q1.125 0 1.958.834.834.833.834 1.958v22.208q0 1.125-.834 1.959-.833.833-1.958.833Zm0-2.792h22.208V6.125H11.667v22.208Zm-5.542 8.334q-1.125 0-1.958-.834-.834-.833-.834-1.958v-25h2.792v25h25v2.792Zm5.542-30.542v22.208V6.125Z"} /></svg>
                  <p>2023.2</p>
                </a>
              </div>
              <button className={`btn btn-light ${styles.eventosInstitucionais}`}>
              <Photo className={styles.phosforIcon} size={24} />
                <Link href="/eventos-institucionais" className={styles.buttonText}>Eventos Institucionais</Link>
              </button>

              <Ouvidoria/>
              
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

