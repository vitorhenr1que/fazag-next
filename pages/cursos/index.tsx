import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, GraduationCap } from 'phosphor-react';
import { prisma } from '../../services/prisma';
import styles from '../../styles/cursos-lista.module.scss';

type Course = {
  id: string;
  name: string;
  slug: string;
  summary: string | null;
  degree: string | null;
  duration: string | null;
  modality: string | null;
  featured: boolean;
};

export default function Courses({ courses }: { courses: Course[] }) {
  return (
    <>
      <Head>
        <title>Cursos de Graduação | FAZAG</title>
        <meta name="description" content="Conheça os cursos de graduação da FAZAG." />
      </Head>
      <section className={styles.hero}>
        <div><span>Escolha o seu caminho</span><h1>Cursos de graduação</h1><p>Formação de qualidade, conexão com o mercado e uma comunidade preparada para acompanhar sua jornada.</p></div>
      </section>
      <main className={styles.container}>
        <div className={styles.heading}><div><span>Graduação FAZAG</span><h2>Encontre o curso ideal para você</h2></div><strong>{courses.length} curso(s)</strong></div>
        {courses.length === 0 ? <div className={styles.empty}>Novos cursos serão publicados em breve.</div> : (
          <div className={styles.grid}>
            {courses.map((course) => (
              <Link href={`/cursos/${course.slug}`} className={`${styles.card} ${course.featured ? styles.featured : ''}`} key={course.id}>
                {course.featured && <span className={styles.badge}>Destaque</span>}
                <div className={styles.icon}><BookOpen /></div>
                <h3>{course.name}</h3>
                <p>{course.summary || 'Conheça a formação, a estrutura do curso e a documentação acadêmica.'}</p>
                <div className={styles.meta}>
                  {course.degree && <span><GraduationCap /> {course.degree}</span>}
                  {course.duration && <span><Clock /> {course.duration}</span>}
                </div>
                <strong className={styles.link}>Conhecer o curso <ArrowRight /></strong>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const courses = await prisma.course.findMany({
    where: { active: true },
    orderBy: [{ featured: 'desc' }, { order: 'asc' }, { name: 'asc' }],
  });
  return { props: { courses: JSON.parse(JSON.stringify(courses)) } };
};
