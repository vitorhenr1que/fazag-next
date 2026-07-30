import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, DownloadSimple, GraduationCap, MapPin, User } from 'phosphor-react';
import { prisma } from '../../services/prisma';
import styles from '../../styles/cursos.module.scss';

type CourseDocument = {
  id: string;
  title: string;
  category: string;
  fileName: string;
  fileUrl: string;
  size: number;
};

type CourseProps = {
  course: {
    name: string;
    slug: string;
    summary: string | null;
    description: string | null;
    degree: string | null;
    modality: string | null;
    duration: string | null;
    shift: string | null;
    coordinator: string | null;
    documents: CourseDocument[];
  };
};

const categoryNames: Record<string, string> = {
  GRADE_DOCENTE: 'Grade e corpo docente',
  MATRIZ_CURRICULAR: 'Matriz curricular',
  OUTRO: 'Outros documentos',
};

const formatSize = (size: number) =>
  size < 1024 * 1024 ? `${(size / 1024).toFixed(1)} KB` : `${(size / 1024 / 1024).toFixed(1)} MB`;

export default function CoursePage({ course }: CourseProps) {
  const groups = course.documents.reduce<Record<string, CourseDocument[]>>((result, document) => {
    (result[document.category] ||= []).push(document);
    return result;
  }, {});
  const facts = [
    course.degree && { icon: <GraduationCap />, label: 'Titulação', value: course.degree },
    course.modality && { icon: <MapPin />, label: 'Modalidade', value: course.modality },
    course.duration && { icon: <Clock />, label: 'Duração', value: course.duration },
    course.shift && { icon: <BookOpen />, label: 'Turno', value: course.shift },
  ].filter(Boolean) as Array<{ icon: JSX.Element; label: string; value: string }>;

  return (
    <>
      <Head>
        <title>{course.name} | FAZAG</title>
        <meta name="description" content={course.summary || `Conheça o curso de ${course.name} da FAZAG.`} />
      </Head>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <Link href="/cursos" className={styles.back}><ArrowLeft /> Todos os cursos</Link>
          <div className={styles.eyebrow}>Graduação FAZAG</div>
          <h1>{course.name}</h1>
          {course.summary && <p>{course.summary}</p>}
          <a className={styles.cta} href="https://matriculas.fazag.edu.br" target="_blank" rel="noreferrer">Quero me inscrever</a>
        </div>
      </section>

      <main className={styles.container}>
        {facts.length > 0 && (
          <section className={styles.facts}>
            {facts.map((fact) => (
              <div className={styles.fact} key={fact.label}>
                {fact.icon}<div><span>{fact.label}</span><strong>{fact.value}</strong></div>
              </div>
            ))}
          </section>
        )}

        <div className={styles.contentGrid}>
          <article className={styles.about}>
            <span className={styles.sectionLabel}>Sobre o curso</span>
            <h2>Construa seu futuro na FAZAG</h2>
            {course.description ? course.description.split(/\n\s*\n/).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            )) : <p>As informações completas deste curso serão publicadas em breve.</p>}
            {course.coordinator && (
              <div className={styles.coordinator}><User /><div><span>Coordenação</span><strong>{course.coordinator}</strong></div></div>
            )}
          </article>

          <aside className={styles.documentsPanel}>
            <span className={styles.sectionLabel}>Documentação acadêmica</span>
            <h2>Arquivos do curso</h2>
            {Object.keys(groups).length === 0 ? (
              <p className={styles.noDocuments}>Nenhum documento publicado no momento.</p>
            ) : Object.entries(groups).map(([category, documents]) => (
              <div className={styles.documentGroup} key={category}>
                <h3>{categoryNames[category] || category}</h3>
                {documents.map((document) => (
                  <a className={styles.document} href={document.fileUrl} target="_blank" rel="noreferrer" key={document.id}>
                    <div className={styles.pdfIcon}>PDF</div>
                    <div><strong>{document.title}</strong><span>{formatSize(document.size)}</span></div>
                    <DownloadSimple />
                  </a>
                ))}
              </div>
            ))}
          </aside>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = String(params?.curso || '');
  const course = await prisma.course.findFirst({
    where: { slug, active: true },
    include: { documents: { orderBy: [{ category: 'asc' }, { order: 'asc' }] } },
  });

  if (!course) return { notFound: true };
  return { props: { course: JSON.parse(JSON.stringify(course)) } };
};
