import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/admin-dashboard.module.scss';
import { Calendar, SignOut, User, Layout, ArrowRight, ChatCircleText, Files, BookOpen, Users, TreeStructure } from 'phosphor-react';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading, logout, hasPermission } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  if (loading || !user) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner} />
        <p>Carregando painel...</p>
      </div>
    );
  }

  const modules = [
    {
      title: 'Cursos',
      description: 'Gerencie informações, publicação, grades, corpo docente e matrizes curriculares.',
      icon: <BookOpen size={32} />,
      link: '/admin/cursos',
      color: '#175cd3',
      permission: 'courses' as const,
    },
    {
      title: 'Calendario Academico',
      description: 'Gerencie eventos, feriados e prazos do semestre letivo.',
      icon: <Calendar size={32} />,
      link: '/admin/calendario-academico',
      color: '#3b82f6',
      permission: 'academic_calendar' as const,
    },
    {
      title: 'NUSP - Agendamentos',
      description: 'Configure dias de atendimento e visualize consultas agendadas.',
      icon: <User size={32} />,
      link: '/admin/nusp',
      color: '#10b981',
      permission: 'nusp' as const,
    },
    {
      title: 'Ouvidoria',
      description: 'Acesse registros, relatorios detalhados e graficos da ouvidoria.',
      icon: <ChatCircleText size={32} />,
      link: '/admin/ouvidoria',
      color: '#f59e0b',
      permission: 'ombudsman' as const,
    },
    {
      title: 'Publicacoes Institucionais',
      description: 'Envie PDFs e imagens para visualizacao no site e no aplicativo.',
      icon: <Files size={32} />,
      link: '/admin/publicacoes-institucionais',
      color: '#8b5cf6',
      permission: 'institutional_publications' as const,
    },
    {
      title: 'Organograma Institucional',
      description: 'Gerencie cargos, responsáveis, setores e vínculos da estrutura institucional.',
      icon: <TreeStructure size={32} />,
      link: '/admin/organograma',
      color: '#0f766e',
      permission: 'organization_chart' as const,
    },
  ].filter((module) => hasPermission(module.permission));

  const navItems = modules.map((module) => ({
    label: module.title,
    link: module.link,
    icon: module.icon,
  }));

  return (
    <div className={styles.dashboardContainer}>
      <Head>
        <title>Admin | Painel de Controle</title>
      </Head>

      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>FAZAG</div>
          <p className={styles.badge}>Admin</p>
        </div>

        <nav className={styles.nav}>
          <div className={`${styles.navItem} ${styles.active}`}>
            <Layout size={20} />
            Dashboard
          </div>
          {navItems.map((item) => (
            <div key={item.link} className={styles.navItem} onClick={() => router.push(item.link)}>
              {React.cloneElement(item.icon, { size: 20 })}
              <span>{item.label}</span>
            </div>
          ))}
          {user.isSuperAdmin && (
            <div className={styles.navItem} onClick={() => router.push('/admin/usuarios')}>
              <Users size={20} />
              <span>Usuários</span>
            </div>
          )}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <User size={20} />
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>{user.name || 'Administrador'}</p>
              <p className={styles.userEmail}>{user.email}</p>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <SignOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Bem-vindo, {user.name?.split(' ')[0]}</h1>
            <p className={styles.subtitle}>O que voce deseja gerenciar hoje?</p>
            {hasPermission('courses') && (
              <button className={styles.courseShortcut} onClick={() => router.push('/admin/cursos')}>
                <BookOpen size={20} />
                Gerenciar informações e arquivos dos cursos
                <ArrowRight size={18} />
              </button>
            )}
          </div>
          <div className={styles.date}>
            {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
        </header>

        <div className={styles.moduleGrid}>
          {modules.map((module, idx) => (
            <div
              key={idx}
              className={styles.moduleCard}
              onClick={() => router.push(module.link)}
            >
              <div className={styles.moduleIcon} style={{ color: module.color }}>
                {module.icon}
              </div>
              <div className={styles.moduleInfo}>
                <h2 className={styles.moduleTitle}>{module.title}</h2>
                <p className={styles.moduleDescription}>{module.description}</p>
              </div>
              <div className={styles.moduleArrow}>
                <ArrowRight size={24} />
              </div>
            </div>
          ))}

          {user.isSuperAdmin && (
            <div className={styles.moduleCard} onClick={() => router.push('/admin/usuarios')}>
              <div className={styles.moduleIcon} style={{ color: '#ec4899' }}>
                <Users size={32} />
              </div>
              <div className={styles.moduleInfo}>
                <h2 className={styles.moduleTitle}>Usuários administrativos</h2>
                <p className={styles.moduleDescription}>Crie usuários, defina acessos e altere senhas.</p>
              </div>
              <div className={styles.moduleArrow}><ArrowRight size={24} /></div>
            </div>
          )}

          <div className={`${styles.moduleCard} ${styles.disabled}`}>
            <div className={styles.moduleIcon}>
              <Layout size={32} />
            </div>
            <div className={styles.moduleInfo}>
              <h2 className={styles.moduleTitle}>Outros Modulos</h2>
              <p className={styles.moduleDescription}>Em breve novos recursos estarao disponiveis.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
