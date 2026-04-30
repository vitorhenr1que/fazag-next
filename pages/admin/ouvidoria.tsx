import React, { useEffect, useState, useCallback, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/admin-ouvidoria.module.scss';
import { 
  CaretLeft, 
  ChatCircleText, 
  Users, 
  Megaphone, 
  MagnifyingGlass,
  ChartBar,
  X,
  Keyboard
} from 'phosphor-react';
import { api } from '../../services/api';
import { format } from 'date-fns';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import * as Dialog from '@radix-ui/react-dialog';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const PAGE_SIZE = 15;

export default function AdminOuvidoria() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [records, setRecords] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [fetchingStats, setFetchingStats] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // Selected Record for Modal
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState(''); // Added for debounce
  const [motivoFilter, setMotivoFilter] = useState('');
  const [vinculoFilter, setVinculoFilter] = useState('');
  
  // Date Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [semester, setSemester] = useState(''); 
  const [year, setYear] = useState(new Date().getFullYear().toString());

  // Infinite Scroll Ref
  const observerTarget = useRef(null);

  // Fetch Stats with filters
  const fetchStats = useCallback(async () => {
    setFetchingStats(true);
    try {
      const statsRes = await api.get('/ouvidoria/stats', {
        params: { 
          startDate, 
          endDate, 
          semester, 
          year,
          search: searchTerm 
        }
      });
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setFetchingStats(false);
    }
  }, [startDate, endDate, semester, year, searchTerm]);

  // Fetch records with filters and pagination
  const fetchRecords = useCallback(async (pageNum: number, isNewSearch: boolean = false) => {
    if (isNewSearch) {
      setFetching(true);
    } else {
      setFetchingMore(true);
    }

    try {
      const response = await api.get('/ouvidoria/list', {
        params: {
          page: pageNum,
          limit: PAGE_SIZE,
          search: searchTerm,
          motivo: motivoFilter,
          vinculo: vinculoFilter,
          startDate,
          endDate,
          semester,
          year
        }
      });

      if (isNewSearch) {
        setRecords(response.data.records);
      } else {
        setRecords(prev => [...prev, ...response.data.records]);
      }
      
      setHasMore(response.data.hasMore);
      setTotalRecords(response.data.total);
    } catch (err) {
      console.error('Error fetching records:', err);
    } finally {
      setFetching(false);
      setFetchingMore(false);
    }
  }, [searchTerm, motivoFilter, vinculoFilter, startDate, endDate, semester, year]);

  // Debounce search input (4 seconds as requested)
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 4000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  // Initial fetch and trigger when filters change
  useEffect(() => {
    if (user) {
      fetchStats();
      setPage(1);
      fetchRecords(1, true);
    }
  }, [user, searchTerm, motivoFilter, vinculoFilter, startDate, endDate, semester, year, fetchStats, fetchRecords]);

  const loadMore = useCallback(() => {
    if (!fetchingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchRecords(nextPage, false);
    }
  }, [fetchingMore, hasMore, page, fetchRecords]);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !fetchingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMore, hasMore, fetchingMore]);

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchTerm('');
    setMotivoFilter('');
    setVinculoFilter('');
    setStartDate('');
    setEndDate('');
    setSemester('');
    setYear(new Date().getFullYear().toString());
  };

  const handleSemesterChange = (val: string) => {
    setSemester(val);
    if (val) {
      setStartDate('');
      setEndDate('');
    }
  };

  const handleDateChange = (type: 'start' | 'end', val: string) => {
    if (type === 'start') setStartDate(val);
    else setEndDate(val);
    
    if (val) {
      setSemester('');
    }
  };

  const openRecordDetails = (record: any) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const uniqueMotivos = stats?.byMotivo?.map((m: any) => m.name) || [];
  const uniqueVinculos = stats?.byVinculo?.map((v: any) => v.name) || [];

  if (loading || !user) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#0f172a', 
        color: '#94a3b8' 
      }}>
        Carregando...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Admin | Ouvidoria</title>
      </Head>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div>
            <button className={styles.backBtn} onClick={() => router.push('/admin')}>
              <CaretLeft size={20} />
              Voltar ao Painel
            </button>
            <h1>Ouvidoria - Relatórios e Registros</h1>
          </div>
        </header>

        {/* Global Filters Section */}
        <section className={styles.card} style={{ marginBottom: '2rem' }}>
          <div className={styles.cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ChartBar size={24} color="#3b82f6" />
              <h2 style={{ margin: 0 }}>Filtros de Relatório</h2>
            </div>
            <button className={styles.clearFilters} onClick={handleClearFilters}>
              Limpar Todos os Filtros
            </button>
          </div>
          
          <div className={styles.filters} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', display: 'grid' }}>
            <div className={styles.filterGroup}>
              <label>Palavra-chave (Mensagem, Nome ou E-mail)</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Ex: trancamento*matrícula (e), financeiro+taxa (ou)"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
                <MagnifyingGlass size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              </div>
              <small style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                Use <strong>*</strong> para "E" e <strong>+</strong> para "OU"
              </small>
            </div>

            <div className={styles.filterGroup}>
              <label>Semestre</label>
              <select value={semester} onChange={(e) => handleSemesterChange(e.target.value)}>
                <option value="">Selecione...</option>
                <option value="1">1º Semestre (Jan - Jun)</option>
                <option value="2">2º Semestre (Jul - Dez)</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Ano</label>
              <select value={year} onChange={(e) => setYear(e.target.value)}>
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Data Início</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => handleDateChange('start', e.target.value)} 
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Data Fim</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => handleDateChange('end', e.target.value)} 
              />
            </div>
          </div>
        </section>

        {/* Stats Summary */}
        <div className={styles.statsRow}>
          {fetchingStats ? (
            <>
              <div className={`${styles.skeleton} ${styles.skeletonStat}`}></div>
              <div className={`${styles.skeleton} ${styles.skeletonStat}`}></div>
              <div className={`${styles.skeleton} ${styles.skeletonStat}`}></div>
            </>
          ) : (
            <>
              <div className={`${styles.statCard} ${styles.highlight}`}>
                <div className={styles.statIcon}>
                  <ChatCircleText size={32} />
                </div>
                <div className={styles.statInfo}>
                  <span>Registros no Período</span>
                  <strong>{stats?.total || 0}</strong>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <Megaphone size={32} />
                </div>
                <div className={styles.statInfo}>
                  <span>Motivo Principal</span>
                  <strong>{stats?.byMotivo?.[0]?.name || 'N/A'}</strong>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <Users size={32} />
                </div>
                <div className={styles.statInfo}>
                  <span>Vínculos no Período</span>
                  <strong>{stats?.byVinculo?.length || 0}</strong>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Charts Section */}
        <div className={styles.chartsGrid}>
          {fetchingStats ? (
            <>
              <div className={`${styles.skeleton} ${styles.skeletonChart}`}></div>
              <div className={`${styles.skeleton} ${styles.skeletonChart}`}></div>
            </>
          ) : (
            <>
              <div className={styles.chartCard}>
                <h3>Distribuição por Motivo</h3>
                {stats?.byMotivo?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats?.byMotivo || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {(stats?.byMotivo || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className={styles.emptyState} style={{ padding: '2rem' }}>Sem dados para exibir</div>
                )}
              </div>

              <div className={styles.chartCard}>
                <h3>Evolução no Período</h3>
                {stats?.byMonth?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats?.byMonth || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#64748b" 
                        fontSize={12}
                        tickFormatter={(val) => {
                          const [y, m] = val.split('-');
                          return `${m}/${y}`;
                        }}
                      />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className={styles.emptyState} style={{ padding: '2rem' }}>Sem dados para exibir</div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Detailed Records Section */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Registros Detalhados</h2>
              {!fetching && (
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Exibindo {records.length} de {totalRecords} registros
                </p>
              )}
            </div>
            <div className={styles.filters}>
              <div className={styles.filterGroup}>
                <label>Motivo</label>
                <select value={motivoFilter} onChange={(e) => setMotivoFilter(e.target.value)}>
                  <option value="">Todos</option>
                  {uniqueMotivos.map((m: any) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Vínculo</label>
                <select value={vinculoFilter} onChange={(e) => setVinculoFilter(e.target.value)}>
                  <option value="">Todos</option>
                  {uniqueVinculos.map((v: any) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.tableContainer}>
            {fetching && records.length === 0 ? (
              <div style={{ padding: '1rem' }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`${styles.skeleton} ${styles.skeletonRow}`}></div>
                ))}
              </div>
            ) : records.length > 0 ? (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Nome</th>
                      <th>E-mail</th>
                      <th>Motivo</th>
                      <th>Vínculo</th>
                      <th>Mensagem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record: any) => (
                      <tr 
                        key={record.id} 
                        className={styles.clickable}
                        onClick={() => openRecordDetails(record)}
                      >
                        <td>{format(new Date(record.data), 'dd/MM/yyyy')}</td>
                        <td>{record.nome}</td>
                        <td>{record.email}</td>
                        <td>{record.motivo}</td>
                        <td>{record.vinculo}</td>
                        <td className={styles.messageCell}>
                          {record.text}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Infinite Scroll Target */}
                <div 
                  ref={observerTarget} 
                  style={{ 
                    height: '100px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#64748b',
                    fontSize: '0.875rem'
                  }}
                >
                  {fetchingMore && <p>Carregando mais registros...</p>}
                  {!hasMore && records.length > 0 && <p>Fim dos registros.</p>}
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                <p>Nenhum registro encontrado.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Details Modal */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.modalOverlay} />
          <Dialog.Content className={styles.modalContent}>
            <Dialog.Title className={styles.modalTitle}>
              Detalhes do Registro
            </Dialog.Title>
            
            {selectedRecord && (
              <div className={styles.modalBody}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className={styles.modalField}>
                    <label>Nome</label>
                    <p>{selectedRecord.nome}</p>
                  </div>
                  <div className={styles.modalField}>
                    <label>E-mail</label>
                    <p>{selectedRecord.email}</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className={styles.modalField}>
                    <label>Motivo</label>
                    <p>{selectedRecord.motivo}</p>
                  </div>
                  <div className={styles.modalField}>
                    <label>Vínculo</label>
                    <p>{selectedRecord.vinculo}</p>
                  </div>
                </div>

                <div className={styles.modalField}>
                  <label>Procurou outro setor?</label>
                  <p>{selectedRecord.procurouSetor}</p>
                </div>

                <div className={styles.modalField}>
                  <label>Data do Registro</label>
                  <p>{format(new Date(selectedRecord.data), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: require('date-fns/locale').ptBR })}</p>
                </div>

                <div className={styles.modalField}>
                  <label>Mensagem Completa</label>
                  <p className={styles.messageText}>{selectedRecord.text}</p>
                </div>
              </div>
            )}

            <Dialog.Close asChild>
              <button className={styles.closeButton} aria-label="Close">
                <X size={24} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
