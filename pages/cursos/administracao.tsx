import { GetStaticProps } from "next";
import { Buttons } from "../../components/Cursos/buttons";
import { getClient } from "../../services/prismic";
import styles from '../../styles/cursos.module.scss'

export default function Administracao(){
    return (
        <div className={`${styles.container} container`}>
            <h1>Administração</h1>
            <Buttons/>
            <h2 className={styles.infoCourse}>Informações do Curso</h2>
            <h3>Objetivo</h3>
            <p className={styles.paragrafo}>
            O profissional em Administração deve planejar, organizar, analisar, dirigir e controlar as ações organizacionais de uma empresa ou organização. O administrador trabalha nos mais diversos setores de hospitais, fábricas e escolas a ONGs, empresas do setor público e aquelas vinculadas à Internet. Esse profissional também se envolve com a publicidade e o marketing, na promoção de vendas dos produtos ou serviços da empresa.
            </p>
            <p className={styles.paragrafo}>
            A Faculdade Zacarias de Góes assume o compromisso de formar profissionais autônomos, preparados para atuar no mercado de trabalho.
            </p>
            <h3>Informações do Curso</h3>
            <ul>
                <li>Habilitação: Bacharelado em Administração</li>
                <li>Duração do Curso: 4 anos</li>
                <li>Carga horária total do curso: 3.000 horas</li>
                <li>Regime letivo: SEMESTRAL</li>
                <li>Vagas anuais: 100</li>
            </ul>

            <h3>Turno de Aulas</h3>
            <p>Noturno: 18:50 às 22:00</p>

            <h3>Dados de autorização e criação</h3>
            <p>Autorizado pela Portaria No. 192, de 25 de Janeiro de 2002. Reconhecido pela Portaria Ministerial Nº 2659, de 28 de Julho de 2005.</p>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async () => {
   const response = await getClient().getByUID('posts', 'informacoes-do-curso-de-administracao', {})

   const post = {
    id: 'informacoes-do-curso-de-administracao',
    title: response.data.title,
    content: response.data.content
   }
   return {
    props: {
        response,
        post,
    }
   }
}