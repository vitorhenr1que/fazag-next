import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/admin-nusp.module.scss';
import { CaretLeft, Check, Calendar, User, Clock, EnvelopeSimple, IdentificationCard, ChartBar, CalendarCheck, UsersThree } from 'phosphor-react';
import { api } from '../../services/api';
import { format, parse, isSameDay, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DAYS_OF_WEEK = [
  { id: 0, name: 'Domingo' },
  { id: 1, name: 'Segunda' },
  { id: 2, name: 'Terça' },
  { id: 3, name: 'Quarta' },
  { id: 4, name: 'Quinta' },
  { id: 5, name: 'Sexta' },
  { id: 6, name: 'Sábado' },
];

export default function AdminNusp() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [availableDays, setAvailableDays] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState(format(new Date(), 'yyyy-MM'));

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [settingsRes, appointmentsRes] = await Promise.all([
          api.get('/nusp/settings'),
          api.get('/nusp/list')
        ]);

        const days = settingsRes.data.availableDays.split(',').filter((d: string) => d !== '').map(Number);
        setAvailableDays(days);
        setAppointments(appointmentsRes.data);
      } catch (err) {
        console.error('Error fetching NUSP data:', err);
      } finally {
        setFetching(false);
      }
    }

    if (user) {
      fetchData();
    }
  }, [user]);

  const toggleDay = (dayId: number) => {
    if (availableDays.includes(dayId)) {
      setAvailableDays(availableDays.filter(id => id !== dayId));
    } else {
      setAvailableDays([...availableDays, dayId].sort());
    }
  };

  const deselectAll = () => {
    setAvailableDays([]);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await api.post('/nusp/settings', {
        availableDays: availableDays.join(',')
      });
      alert('Configurações salvas com sucesso!');
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Erro ao salvar configurações.');
    } finally {
      setSaving(false);
    }
  };

  const filteredAppointments = appointments.filter((appointment: any) => {
    let matchesDate = true;
    let matchesMonth = true;

    if (dateFilter) {
      // Input date is YYYY-MM-DD, appointment date is DD/MM/YYYY
      const [year, month, day] = dateFilter.split('-');
      const formattedFilterDate = `${day}/${month}/${year}`;
      matchesDate = appointment.dataAgendada === formattedFilterDate;
    }

    if (monthFilter) {
      // Month filter is YYYY-MM
      const [year, month] = monthFilter.split('-');
      const [, appMonth, appYear] = appointment.dataAgendada.split('/');
      matchesMonth = appMonth === month && appYear === year;
    }

    return matchesDate && matchesMonth;
  });

  const today = format(new Date(), 'dd/MM/yyyy');
  const appointmentsToday = appointments.filter((app: any) => app.dataAgendada === today).length;
  const totalAppointments = appointments.length;

  const uniqueDays = Array.from(new Set(appointments.map((app: any) => app.dataAgendada))).length;
  const averageDaily = uniqueDays > 0 ? (totalAppointments / uniqueDays).toFixed(1) : 0;

  if (loading || !user || fetching) {
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
        <title>Admin | NUSP - Agendamentos</title>
      </Head>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div>
            <button className={styles.backBtn} onClick={() => router.push('/admin')}>
              <CaretLeft size={20} />
              Voltar ao Painel
            </button>
            <h1>NUSP - Núcleo de Suporte Psicopedagógico</h1>
          </div>
        </header>

        <div className={styles.statsRow}>
          <div className={`${styles.statCard} ${styles.highlight}`}>
            <div className={styles.statIcon}>
              <CalendarCheck size={32} />
            </div>
            <div className={styles.statInfo}>
              <span>Agendamentos Hoje</span>
              <strong>{appointmentsToday}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <UsersThree size={32} />
            </div>
            <div className={styles.statInfo}>
              <span>Agendamentos Totais</span>
              <strong>{totalAppointments}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <ChartBar size={32} />
            </div>
            <div className={styles.statInfo}>
              <span>Média de Agendamentos Diários</span>
              <strong>{averageDaily}</strong>
            </div>
          </div>
        </div>

        <div className={styles.contentGrid}>
          <section className={styles.card}>
            <h2>Configurações de Atendimento</h2>
            <div className={styles.settingsForm}>
              <div className={styles.formGroup}>
                <div className={styles.labelRow}>
                  <label>Dias da Semana Disponíveis</label>
                  <button className={styles.deselectAllBtn} onClick={deselectAll}>
                    Desmarcar Todos
                  </button>
                </div>
                <div className={styles.daysGrid}>
                  {DAYS_OF_WEEK.map((day) => (
                    <div 
                      key={day.id} 
                      className={`${styles.dayItem} ${availableDays.includes(day.id) ? styles.selected : ''}`}
                      onClick={() => toggleDay(day.id)}
                    >
                      <input 
                        type="checkbox" 
                        checked={availableDays.includes(day.id)} 
                        onChange={() => {}} // Controlled via parent click
                      />
                      {day.name}
                    </div>
                  ))}
                </div>
              </div>
              <button 
                className={styles.saveBtn} 
                onClick={handleSaveSettings}
                disabled={saving}
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Consultas Agendadas</h2>
              <div className={styles.filters}>
                <div className={styles.filterGroup}>
                  <label>Mês</label>
                  <input 
                    type="month" 
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                  />
                </div>
                <div className={styles.filterGroup}>
                  <label>Data</label>
                  <input 
                    type="date" 
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>
                {(monthFilter || dateFilter) && (
                  <button 
                    className={styles.clearFilters}
                    onClick={() => {
                      setMonthFilter('');
                      setDateFilter('');
                    }}
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
            <div className={styles.tableContainer}>
              {filteredAppointments.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Horário</th>
                      <th>Nome</th>
                      <th>Vínculo</th>
                      <th>E-mail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appointment: any) => (
                      <tr key={appointment.id}>
                        <td>{appointment.dataAgendada}</td>
                        <td>{appointment.horario}:00</td>
                        <td>{appointment.nome}</td>
                        <td>{appointment.vinculo}</td>
                        <td>{appointment.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className={styles.emptyState}>
                  <p>Nenhum agendamento encontrado.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
