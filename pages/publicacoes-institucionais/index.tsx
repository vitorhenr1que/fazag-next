import styles from '../../styles/publicInstitucionais.module.scss'

export default function PublicacoesInstitucionais(){
return (
    <div className={styles.container}>
        <h1 className={styles.title}>Publicações Institucionais</h1>

        <div className={styles.linksContainer}>
        <hr />
        <h4>Regulamentos</h4>
            <a className={styles.calendarItem} download={'Regulamento Geral.pdf'} href={"static/regulamentos/regulamentogeral.pdf"}>
                  <svg xmlns={"http://www.w3.org/2000/svg"} fill={'red'} height={"40"} width={"40"}><path d={"M14.208 21.917h1.584V18.5h1.875q.666 0 1.125-.458.458-.459.458-1.125v-1.875q0-.667-.458-1.125-.459-.459-1.125-.459h-3.459Zm1.584-5v-1.875h1.875v1.875Zm5.25 5h3.416q.667 0 1.125-.459.459-.458.459-1.125v-5.291q0-.667-.459-1.125-.458-.459-1.125-.459h-3.416Zm1.583-1.584v-5.291h1.833v5.291Zm5.333 1.584h1.584V18.5H31.5v-1.583h-1.958v-1.875H31.5v-1.584h-3.542Zm-16.291 9.208q-1.125 0-1.959-.833-.833-.834-.833-1.959V6.125q0-1.125.833-1.958.834-.834 1.959-.834h22.208q1.125 0 1.958.834.834.833.834 1.958v22.208q0 1.125-.834 1.959-.833.833-1.958.833Zm0-2.792h22.208V6.125H11.667v22.208Zm-5.542 8.334q-1.125 0-1.958-.834-.834-.833-.834-1.958v-25h2.792v25h25v2.792Zm5.542-30.542v22.208V6.125Z"} /></svg>
                  <p>Regulamento Geral</p>
            </a>

            <a className={styles.calendarItem} download={'PDI 2022-2026.pdf'} href={"static/regulamentos/pdi.pdf"}>
                <svg xmlns={"http://www.w3.org/2000/svg"} fill={'red'} height={"40"} width={"40"}><path d={"M14.208 21.917h1.584V18.5h1.875q.666 0 1.125-.458.458-.459.458-1.125v-1.875q0-.667-.458-1.125-.459-.459-1.125-.459h-3.459Zm1.584-5v-1.875h1.875v1.875Zm5.25 5h3.416q.667 0 1.125-.459.459-.458.459-1.125v-5.291q0-.667-.459-1.125-.458-.459-1.125-.459h-3.416Zm1.583-1.584v-5.291h1.833v5.291Zm5.333 1.584h1.584V18.5H31.5v-1.583h-1.958v-1.875H31.5v-1.584h-3.542Zm-16.291 9.208q-1.125 0-1.959-.833-.833-.834-.833-1.959V6.125q0-1.125.833-1.958.834-.834 1.959-.834h22.208q1.125 0 1.958.834.834.833.834 1.958v22.208q0 1.125-.834 1.959-.833.833-1.958.833Zm0-2.792h22.208V6.125H11.667v22.208Zm-5.542 8.334q-1.125 0-1.958-.834-.834-.833-.834-1.958v-25h2.792v25h25v2.792Zm5.542-30.542v22.208V6.125Z"} /></svg>
                <p>Projeto de Desenvolvimento Institucional (PDI)</p>
            </a>

            <hr />

            <h4>Calendário Acadêmico</h4>
            <a className={styles.calendarItem} download={'calendario20231.pdf'} href={"static/calendario/calendario20231.pdf"}>
                <svg xmlns={"http://www.w3.org/2000/svg"} fill={'red'} height={"40"} width={"40"}><path d={"M14.208 21.917h1.584V18.5h1.875q.666 0 1.125-.458.458-.459.458-1.125v-1.875q0-.667-.458-1.125-.459-.459-1.125-.459h-3.459Zm1.584-5v-1.875h1.875v1.875Zm5.25 5h3.416q.667 0 1.125-.459.459-.458.459-1.125v-5.291q0-.667-.459-1.125-.458-.459-1.125-.459h-3.416Zm1.583-1.584v-5.291h1.833v5.291Zm5.333 1.584h1.584V18.5H31.5v-1.583h-1.958v-1.875H31.5v-1.584h-3.542Zm-16.291 9.208q-1.125 0-1.959-.833-.833-.834-.833-1.959V6.125q0-1.125.833-1.958.834-.834 1.959-.834h22.208q1.125 0 1.958.834.834.833.834 1.958v22.208q0 1.125-.834 1.959-.833.833-1.958.833Zm0-2.792h22.208V6.125H11.667v22.208Zm-5.542 8.334q-1.125 0-1.958-.834-.834-.833-.834-1.958v-25h2.792v25h25v2.792Zm5.542-30.542v22.208V6.125Z"} /></svg>
                <p>Calendário Acadêmico 2023.1</p>
            </a>
            <a className={styles.calendarItem} download={'calendario20232.pdf'} href={"static/calendario/calendario20232.pdf"}>
                <svg xmlns={"http://www.w3.org/2000/svg"} fill={'red'} height={"40"} width={"40"}><path d={"M14.208 21.917h1.584V18.5h1.875q.666 0 1.125-.458.458-.459.458-1.125v-1.875q0-.667-.458-1.125-.459-.459-1.125-.459h-3.459Zm1.584-5v-1.875h1.875v1.875Zm5.25 5h3.416q.667 0 1.125-.459.459-.458.459-1.125v-5.291q0-.667-.459-1.125-.458-.459-1.125-.459h-3.416Zm1.583-1.584v-5.291h1.833v5.291Zm5.333 1.584h1.584V18.5H31.5v-1.583h-1.958v-1.875H31.5v-1.584h-3.542Zm-16.291 9.208q-1.125 0-1.959-.833-.833-.834-.833-1.959V6.125q0-1.125.833-1.958.834-.834 1.959-.834h22.208q1.125 0 1.958.834.834.833.834 1.958v22.208q0 1.125-.834 1.959-.833.833-1.958.833Zm0-2.792h22.208V6.125H11.667v22.208Zm-5.542 8.334q-1.125 0-1.958-.834-.834-.833-.834-1.958v-25h2.792v25h25v2.792Zm5.542-30.542v22.208V6.125Z"} /></svg>
                <p>Calendário Acadêmico 2023.2</p>
            </a>

            <hr />

            <h4>Curso de Férias</h4>
            <a className={styles.calendarItem} download={'Edital Curso de Férias - 2023.1.pdf'} href={"static/editalcursodeferias.pdf"}>
                <svg xmlns={"http://www.w3.org/2000/svg"} fill={'red'} height={"40"} width={"40"}><path d={"M14.208 21.917h1.584V18.5h1.875q.666 0 1.125-.458.458-.459.458-1.125v-1.875q0-.667-.458-1.125-.459-.459-1.125-.459h-3.459Zm1.584-5v-1.875h1.875v1.875Zm5.25 5h3.416q.667 0 1.125-.459.459-.458.459-1.125v-5.291q0-.667-.459-1.125-.458-.459-1.125-.459h-3.416Zm1.583-1.584v-5.291h1.833v5.291Zm5.333 1.584h1.584V18.5H31.5v-1.583h-1.958v-1.875H31.5v-1.584h-3.542Zm-16.291 9.208q-1.125 0-1.959-.833-.833-.834-.833-1.959V6.125q0-1.125.833-1.958.834-.834 1.959-.834h22.208q1.125 0 1.958.834.834.833.834 1.958v22.208q0 1.125-.834 1.959-.833.833-1.958.833Zm0-2.792h22.208V6.125H11.667v22.208Zm-5.542 8.334q-1.125 0-1.958-.834-.834-.833-.834-1.958v-25h2.792v25h25v2.792Zm5.542-30.542v22.208V6.125Z"} /></svg>
                <p>Edital 2023.1</p>
            </a>
       
        </div>
    </div>
    
)
}