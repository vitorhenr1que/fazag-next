import { PublicacaoInstitucional } from '../../components/PublicacaoInstitucional/PublicacaoInstitucional'
import styles from '../../styles/publicInstitucionais.module.scss'

export default function PublicacoesInstitucionais(){
    const pdfSvg = 'M14.208 21.917h1.584V18.5h1.875q.666 0 1.125-.458.458-.459.458-1.125v-1.875q0-.667-.458-1.125-.459-.459-1.125-.459h-3.459Zm1.584-5v-1.875h1.875v1.875Zm5.25 5h3.416q.667 0 1.125-.459.459-.458.459-1.125v-5.291q0-.667-.459-1.125-.458-.459-1.125-.459h-3.416Zm1.583-1.584v-5.291h1.833v5.291Zm5.333 1.584h1.584V18.5H31.5v-1.583h-1.958v-1.875H31.5v-1.584h-3.542Zm-16.291 9.208q-1.125 0-1.959-.833-.833-.834-.833-1.959V6.125q0-1.125.833-1.958.834-.834 1.959-.834h22.208q1.125 0 1.958.834.834.833.834 1.958v22.208q0 1.125-.834 1.959-.833.833-1.958.833Zm0-2.792h22.208V6.125H11.667v22.208Zm-5.542 8.334q-1.125 0-1.958-.834-.834-.833-.834-1.958v-25h2.792v25h25v2.792Zm5.542-30.542v22.208V6.125Z'
return (
    <div className={styles.container}>
        <h1 className={styles.title}>Publicações Institucionais</h1>

        <div className={styles.linksContainer}>
        <hr />
        <div className={styles.publicacao}> {/* Regulamentos Institucionais */}
            <p className="d-inline-flex gap-1">
                <a className={`btn btn-primary ${styles.btnPrimary}`} data-bs-toggle="collapse" href="#regulamentos" role="button" aria-expanded="false" aria-controls="regulamentos">
                    Regulamentos
                </a>
            </p>

                <div className="collapse" id={`regulamentos`}>
                <div className={`card card-body ${styles.cardBody}`}>
                <PublicacaoInstitucional 
                    downloadName='Regulamento Geral'
                    destination='static/regulamentos/regulamentogeral.pdf' 
                    label='Regulamento Geral' 
                    svgPath={pdfSvg}
                    />
                </div>
                </div>
        </div>
        <div className={styles.publicacao}> {/* Calendário Acadêmico */}
        <p className="d-inline-flex gap-1">
            <a className={`btn btn-primary ${styles.btnPrimary}`} data-bs-toggle="collapse" href="#calendario-academico" role="button" aria-expanded="false" aria-controls="calendario-academico">
                Calendário Acadêmico
            </a>
        </p>
            <div className="collapse" id={`calendario-academico`}>
            <div className={`card card-body ${styles.cardBody}`}>
                <PublicacaoInstitucional 
                    downloadName='Calendário Acadêmico 20241'
                    destination='static/calendario/calendario20241.pdf' 
                    label='Calendário Acadêmico 2024.1' 
                    svgPath={pdfSvg}
                    />
                    <hr/>
                    <PublicacaoInstitucional 
                    downloadName='Calendário Acadêmico 20242'
                    destination='static/calendario/calendario20242.pdf' 
                    label='Calendário Acadêmico 2024.2' 
                    svgPath={pdfSvg}
                    />
            </div>
            </div>
        </div>

        <div className={styles.publicacao}> {/* Curso de Férias */}
        <p className="d-inline-flex gap-1">
            <a className={`btn btn-primary ${styles.btnPrimary}`} data-bs-toggle="collapse" href="#cursoferias" role="button" aria-expanded="false" aria-controls="cursoferias">
                Curso de Férias
            </a>
        </p>

            <div className="collapse" id={`cursoferias`}>
            <div className={`card card-body ${styles.cardBody}`}>
                <PublicacaoInstitucional 
                    downloadName='Edital Curso de Férias - 2023.1'
                    destination='static/editalcursodeferias.pdf' 
                    label='Edital 2023.1' 
                    svgPath={pdfSvg}
                    />
            </div>
            </div>
        </div>
        <div className={styles.publicacao}> {/* Logo Institucional */}
        <p className="d-inline-flex gap-1">
            <a className={`btn btn-primary ${styles.btnPrimary}`} data-bs-toggle="collapse" href="#logo-institucional" role="button" aria-expanded="false" aria-controls="logo-institucional">
                Logo Institucional
            </a>
        </p>

            <div className="collapse" id={`logo-institucional`}>
            <div className={`card card-body ${styles.cardBody}`}>
        <PublicacaoInstitucional 
            viewBox='0 0 15 15'
            downloadName='FAZAG Logo Azul'
            destination='static/logo/logo-fazag-azul.png' 
            label='FAZAG Logo Azul' 
            svgPath='M2.5 1H12.5C13.3284 1 14 1.67157 14 2.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V2.5C1 1.67157 1.67157 1 2.5 1ZM2.5 2C2.22386 2 2 2.22386 2 2.5V8.3636L3.6818 6.6818C3.76809 6.59551 3.88572 6.54797 4.00774 6.55007C4.12975 6.55216 4.24568 6.60372 4.32895 6.69293L7.87355 10.4901L10.6818 7.6818C10.8575 7.50607 11.1425 7.50607 11.3182 7.6818L13 9.3636V2.5C13 2.22386 12.7761 2 12.5 2H2.5ZM2 12.5V9.6364L3.98887 7.64753L7.5311 11.4421L8.94113 13H2.5C2.22386 13 2 12.7761 2 12.5ZM12.5 13H10.155L8.48336 11.153L11 8.6364L13 10.6364V12.5C13 12.7761 12.7761 13 12.5 13ZM6.64922 5.5C6.64922 5.03013 7.03013 4.64922 7.5 4.64922C7.96987 4.64922 8.35078 5.03013 8.35078 5.5C8.35078 5.96987 7.96987 6.35078 7.5 6.35078C7.03013 6.35078 6.64922 5.96987 6.64922 5.5ZM7.5 3.74922C6.53307 3.74922 5.74922 4.53307 5.74922 5.5C5.74922 6.46693 6.53307 7.25078 7.5 7.25078C8.46693 7.25078 9.25078 6.46693 9.25078 5.5C9.25078 4.53307 8.46693 3.74922 7.5 3.74922Z'
            />
            <hr/>
        <PublicacaoInstitucional 
            viewBox='0 0 15 15'
            downloadName='FAZAG Logo Branca'
            destination='static/logo/logo-fazag-branca.png' 
            label='FAZAG Logo Branca' 
            svgPath='M2.5 1H12.5C13.3284 1 14 1.67157 14 2.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V2.5C1 1.67157 1.67157 1 2.5 1ZM2.5 2C2.22386 2 2 2.22386 2 2.5V8.3636L3.6818 6.6818C3.76809 6.59551 3.88572 6.54797 4.00774 6.55007C4.12975 6.55216 4.24568 6.60372 4.32895 6.69293L7.87355 10.4901L10.6818 7.6818C10.8575 7.50607 11.1425 7.50607 11.3182 7.6818L13 9.3636V2.5C13 2.22386 12.7761 2 12.5 2H2.5ZM2 12.5V9.6364L3.98887 7.64753L7.5311 11.4421L8.94113 13H2.5C2.22386 13 2 12.7761 2 12.5ZM12.5 13H10.155L8.48336 11.153L11 8.6364L13 10.6364V12.5C13 12.7761 12.7761 13 12.5 13ZM6.64922 5.5C6.64922 5.03013 7.03013 4.64922 7.5 4.64922C7.96987 4.64922 8.35078 5.03013 8.35078 5.5C8.35078 5.96987 7.96987 6.35078 7.5 6.35078C7.03013 6.35078 6.64922 5.96987 6.64922 5.5ZM7.5 3.74922C6.53307 3.74922 5.74922 4.53307 5.74922 5.5C5.74922 6.46693 6.53307 7.25078 7.5 7.25078C8.46693 7.25078 9.25078 6.46693 9.25078 5.5C9.25078 4.53307 8.46693 3.74922 7.5 3.74922Z'
            />
            </div>
            </div>
        </div>

        <div className={styles.publicacao}> {/* Programa de Iniciação Científica */}
        <p className="d-inline-flex gap-1">
            <a className={`btn btn-primary ${styles.btnPrimary}`} data-bs-toggle="collapse" href="#iniciacao-cientifica" role="button" aria-expanded="false" aria-controls="iniciacao-cientifica">
                Programa de Iniciação Científica
            </a>
        </p>

            <div className="collapse" id={`iniciacao-cientifica`}>
            <div className={`card card-body ${styles.cardBody}`}>
        <PublicacaoInstitucional 

            downloadName='Edital PIC'
            destination='static/pic/editalpic.pdf' 
            label='Edital Iniciação Científica'
            svgPath={pdfSvg}
            />
            {/*<hr/>
        <PublicacaoInstitucional 
            downloadName='Formulário do Aluno'
            destination='static/pic/formalunopic.pdf' 
            label='Formulário do Aluno' 
            svgPath={pdfSvg}
            />
            <hr/>
        <PublicacaoInstitucional 
            downloadName='Formulário do Professor'
            destination='static/pic/formprofessorpic.pdf' 
            label='Formulário do Professor' 
            svgPath={pdfSvg}
            />*/}
            </div>
            </div>
        </div>
        <div className={styles.publicacao}> {/* Seleção de Artigos Científicos para a Revista Científica */}
        <p className="d-inline-flex gap-1">
            <a className={`btn btn-primary ${styles.btnPrimary}`} data-bs-toggle="collapse" href="#selecao-cientifica" role="button" aria-expanded="false" aria-controls="selecao-cientifica">
                Seleção de Artigos Científicos para a Revista Científica
            </a>
        </p>

            <div className="collapse" id={`selecao-cientifica`}>
            <div className={`card card-body ${styles.cardBody}`}>
        <PublicacaoInstitucional 

            downloadName='Edital Seleção de Artigos Científicos para a Revista Científica'
            destination='static/pic/editalselecao.pdf' 
            label='Edital'
            svgPath={pdfSvg}
            />
            </div>
            </div>
        </div>

       
        </div>
    </div>
    
)
}