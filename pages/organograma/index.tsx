import type { GetServerSideProps } from 'next';
import { useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowRight, Buildings, GraduationCap, TreeStructure } from 'phosphor-react';
import { getOrganizationChart } from '../../services/organizationChart';
import {
  OrganizationChartData,
  OrganizationNodeData,
} from '../../types/organizationChart';
import styles from '../../styles/organograma.module.scss';

interface OrganogramaProps {
  chart: OrganizationChartData;
}

const buildChildrenMap = (nodes: OrganizationNodeData[]) => {
  const childrenMap = new Map<string, OrganizationNodeData[]>();
  nodes.forEach((node) => {
    if (!node.parentId) return;
    const children = childrenMap.get(node.parentId) || [];
    children.push(node);
    childrenMap.set(node.parentId, children);
  });
  childrenMap.forEach((children) =>
    children.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'pt-BR'))
  );
  return childrenMap;
};

function OrganizationBranch({
  node,
  childrenMap,
}: {
  node: OrganizationNodeData;
  childrenMap: Map<string, OrganizationNodeData[]>;
}) {
  const children = childrenMap.get(node.id) || [];

  return (
    <article className={`${styles.branch} ${styles[`type${node.type}`]}`}>
      <div className={styles.branchCard}>
        <span className={styles.nodeType}>
          {node.type === 'ADVISORY' ? 'Apoio à direção' : 'Área institucional'}
        </span>
        <h3>{node.title}</h3>
        {node.personName && <strong>{node.personName}</strong>}
        {node.description && (
          <p>{node.description.split('\n').map((line, index) => <span key={`${line}-${index}`}>{line}</span>)}</p>
        )}
      </div>
      {children.length > 0 && (
        <div className={styles.children}>
          {children.map((child) => (
            <OrganizationBranch key={child.id} node={child} childrenMap={childrenMap} />
          ))}
        </div>
      )}
    </article>
  );
}

export default function Organograma({ chart }: OrganogramaProps) {
  const childrenMap = useMemo(() => buildChildrenMap(chart.nodes), [chart.nodes]);
  const entity = chart.nodes.find((node) => node.type === 'ENTITY');
  const leadership =
    chart.nodes.find((node) => node.type === 'LEADERSHIP' && node.parentId === entity?.id) ||
    chart.nodes.find((node) => node.type === 'LEADERSHIP');
  const structureRoots = leadership
    ? childrenMap.get(leadership.id) || []
    : chart.nodes.filter((node) => !node.parentId && node.id !== entity?.id);
  const advisoryRoots = structureRoots.filter((node) => node.type === 'ADVISORY');
  const managementRoots = structureRoots.filter((node) => node.type !== 'ADVISORY');

  return (
    <>
      <Head>
        <title>Organograma Institucional | FAZAG</title>
        <meta
          name="description"
          content="Conheça a estrutura organizacional, os setores e as coordenações de curso da FAZAG."
        />
      </Head>

      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}><TreeStructure size={17} /> Estrutura institucional</span>
            <h1>Organograma Institucional</h1>
            <p>
              Conheça como a FAZAG se organiza para integrar gestão acadêmica,
              atendimento, suporte e formação superior.
            </p>
          </div>
          <div className={styles.heroMark} aria-hidden="true"><Buildings size={92} /></div>
        </section>

        <section className={styles.chart} aria-label="Estrutura organizacional da FAZAG">
          <div className={styles.executive}>
            {entity && (
              <div className={styles.entityCard}>
                <span>Mantenedora</span>
                <h2>{entity.title}</h2>
                {entity.personName && <strong>{entity.personName}</strong>}
                {entity.description && (
                  <p>{entity.description.split('\n').map((line, index) => <span key={`${line}-${index}`}>{line}</span>)}</p>
                )}
              </div>
            )}

            {entity && leadership && <div className={styles.verticalConnector} aria-hidden="true" />}

            {leadership && (
              <div className={styles.leadershipCard}>
                <span>Faculdade Zacarias de Góes</span>
                <h2>{leadership.title}</h2>
                {leadership.personName && <strong>{leadership.personName}</strong>}
                {leadership.description && <p>{leadership.description}</p>}
              </div>
            )}
          </div>

          {structureRoots.length > 0 && (
            <div className={styles.structureFlow}>
              {advisoryRoots.length > 0 ? (
                <div className={styles.advisoryLayer}>
                  <div className={styles.advisoryGrid}>
                    {advisoryRoots.map((node) => (
                      <div className={styles.advisoryItem} key={node.id}>
                        <OrganizationBranch node={node} childrenMap={childrenMap} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={styles.structureConnector} aria-hidden="true" />
              )}

              {managementRoots.length > 0 && (
                <div className={styles.structureGrid}>
                  {managementRoots.map((node) => (
                    <OrganizationBranch key={node.id} node={node} childrenMap={childrenMap} />
                  ))}
                </div>
              )}
            </div>
          )}

          <section className={styles.coursesSection}>
            <div className={styles.courseConnector} aria-hidden="true" />
            <div className={styles.sectionHeading}>
              <span><GraduationCap size={20} /> Formação acadêmica</span>
              <h2>Coordenação de cursos</h2>
              <p>Coordenações interligadas à estrutura acadêmica da instituição.</p>
            </div>

            {chart.courses.length > 0 ? (
              <div className={styles.courseGrid}>
                {chart.courses.map((course) => (
                  <Link href={`/cursos/${course.slug}`} className={styles.courseCard} key={course.id}>
                    <span className={styles.courseDot} aria-hidden="true" />
                    <small>{course.degree || 'Graduação'}</small>
                    <h3>{course.name}</h3>
                    <p><span>Coordenação</span><strong>{course.coordinator}</strong></p>
                    <span className={styles.courseLink}>Conhecer o curso <ArrowRight size={16} /></span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.emptyCourses}>
                Os coordenadores aparecerão aqui assim que forem informados nos cursos publicados.
              </div>
            )}
          </section>
        </section>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<OrganogramaProps> = async () => {
  try {
    return { props: { chart: await getOrganizationChart() } };
  } catch (error) {
    console.error('Erro ao renderizar organograma:', error);
    return { props: { chart: { nodes: [], courses: [] } } };
  }
};
