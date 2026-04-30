import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  getDay, 
  setYear, 
  setMonth,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as Dialog from '@radix-ui/react-dialog';
import { 
  FloppyDisk, 
  FilePdf, 
  Plus, 
  X, 
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  SignOut,
  Layout
} from 'phosphor-react';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';
import styles from '../../../styles/admin-calendario.module.scss';

type EventStatus = 'normal' | 'recesso' | 'atencao' | 'letivo' | 'reuniao' | 'colacao';

interface CalendarEvent {
  day: number;
  status: EventStatus;
  text: string;
}

interface MonthData {
  monthIndex: number;
  monthName: string;
  events: CalendarEvent[];
}

export default function CalendarioAdmin() {
  const [year, setYearValue] = useState(new Date().getFullYear());
  const [semester, setSemester] = useState('full');
  const [months, setMonths] = useState<MonthData[]>([]);
  const [selectedDay, setSelectedDay] = useState<{ monthIndex: number; day: number } | null>(null);
  const [eventForm, setEventForm] = useState<{ status: EventStatus; text: string }>({
    status: 'normal',
    text: '',
  });
  const [isPublishing, setIsPublishing] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  // Initialize 12 months or fetch from DB
  useEffect(() => {
    if (!user) return; // Don't fetch if not logged in
    
    const fetchExisting = async () => {
      try {
        const res = await axios.get(`/api/calendario?full=true&ano=${year}`);
        if (res.data && res.data.data && res.data.data.length > 0) {
          setMonths(res.data.data);
          setYearValue(res.data.year);
        } else {
          generateInitialMonths();
        }
      } catch (e) {
        generateInitialMonths();
      }
    };
    fetchExisting();
  }, [year, user]);

  const generateInitialMonths = () => {
    const initialMonths: MonthData[] = Array.from({ length: 12 }, (_, i) => ({
      monthIndex: i,
      monthName: format(setMonth(new Date(), i), 'MMMM', { locale: ptBR }),
      events: [],
    }));
    setMonths(initialMonths);
  };

  const handleDayClick = (monthIndex: number, day: number) => {
    const existingEvent = months[monthIndex].events.find(e => e.day === day);
    setSelectedDay({ monthIndex, day });
    setEventForm({
      status: existingEvent?.status || 'normal',
      text: existingEvent?.text || '',
    });
  };

  const saveEvent = () => {
    if (!selectedDay) return;

    const newMonths = [...months];
    const month = newMonths[selectedDay.monthIndex];
    const eventIndex = month.events.findIndex(e => e.day === selectedDay.day);

    if (eventForm.text.trim() === '') {
      // Delete if text is empty
      if (eventIndex > -1) month.events.splice(eventIndex, 1);
    } else {
      if (eventIndex > -1) {
        month.events[eventIndex] = { day: selectedDay.day, ...eventForm };
      } else {
        month.events.push({ day: selectedDay.day, ...eventForm });
      }
    }

    // Sort events by day
    month.events.sort((a, b) => a.day - b.day);

    setMonths(newMonths);
    setSelectedDay(null);
  };

  const publishToSite = async () => {
    setIsPublishing(true);
    try {
      await axios.post('/api/calendario', {
        calendarData: {
          year,
          data: months
        }
      });
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    } catch (error) {
      alert('Erro ao publicar calendário');
    } finally {
      setIsPublishing(false);
    }
  };

  const exportPDF = () => {
    window.print();
  };

  const renderCalendarGrid = (monthIndex: number) => {
    const date = setMonth(setYear(new Date(), year), monthIndex);
    const firstDayOfMonth = startOfMonth(date);
    const lastDayOfMonth = endOfMonth(date);
    
    // Days in month
    const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
    
    // Padding for first week
    const startDay = getDay(firstDayOfMonth);
    const paddingDays = Array.from({ length: startDay }, (_, i) => i);

    return (
      <div className={styles.calendarGrid}>
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, idx) => (
          <div key={`${d}-${idx}`} className={styles.dayName}>{d}</div>
        ))}
        {paddingDays.map(i => <div key={`pad-${i}`} className={`${styles.dayCell} ${styles.empty}`} />)}
        {daysInMonth.map(dayDate => {
          const d = dayDate.getDate();
          const event = months[monthIndex].events.find(e => e.day === d);
          return (
            <div 
              key={d} 
              className={`${styles.dayCell} ${event ? styles[`status_${event.status}`] : ''}`}
              onClick={() => handleDayClick(monthIndex, d)}
            >
              {d}
            </div>
          );
        })}
      </div>
    );
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const filteredMonths = useMemo(() => {
    if (semester === '1') return months.slice(0, 6);
    if (semester === '2') return months.slice(6, 12);
    return months;
  }, [months, semester]);

  if (loading || !user) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner} />
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <Head>
        <title>Admin | Calendário Acadêmico</title>
      </Head>

      <div className={styles.printHeader}>
        <h1>Calendário Acadêmico - {year}</h1>
        <p>{semester === 'full' ? 'Ano Inteiro' : `Semestre ${semester}`}</p>
      </div>

      <header className={`${styles.header} ${styles.noPrint}`}>
        <div className={styles.titleSection}>
          <div className={styles.topRow}>
            <button className={styles.backBtn} onClick={() => router.push('/admin')} title="Voltar ao Painel">
              <Layout size={20} />
              Painel
            </button>
            <h1 className={styles.title}>Gerenciador de Calendário</h1>
          </div>
          <p className={styles.subtitle}>Configuração do Ano Letivo {year}</p>
        </div>

        <div className={styles.controls}>
          <div className={styles.inputGroup}>
            <label>Ano</label>
            <input 
              type="number" 
              className={styles.input} 
              value={year} 
              onChange={e => setYearValue(Number(e.target.value))} 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Visualização</label>
            <select 
              className={styles.select} 
              value={semester} 
              onChange={e => setSemester(e.target.value)} 
            >
              <option value="1">1º Semestre (Jan - Jun)</option>
              <option value="2">2º Semestre (Jul - Dez)</option>
              <option value="full">Ano Inteiro</option>
            </select>
          </div>
          
          <button className={`${styles.button} ${styles.secondary}`} onClick={exportPDF}>
            <FilePdf size={20} />
            Exportar PDF
          </button>
          
          <button 
            className={`${styles.button} ${styles.primary}`} 
            onClick={publishToSite}
            disabled={isPublishing}
          >
            <FloppyDisk size={20} />
            {isPublishing ? 'Publicando...' : 'Publicar no Site'}
          </button>

          <button className={styles.logoutBtn} onClick={handleLogout} title="Sair do painel">
            <SignOut size={20} />
            Sair
          </button>
        </div>
      </header>

      <div className={styles.grid}>
        {filteredMonths.map((month) => (
          <div key={month.monthName} className={styles.monthCard}>
            <h2 className={styles.monthTitle}>{month.monthName}</h2>
            
            {renderCalendarGrid(month.monthIndex)}

            <div className={styles.eventList}>
              {month.events.length > 0 ? (
                month.events.map((event, eIdx) => (
                  <div key={eIdx} className={`${styles.eventItem} ${styles[event.status]}`}>
                    <span className={styles.dayBadge}>{event.day}</span>
                    <span className={styles.eventText}>{event.text}</span>
                  </div>
                ))
              ) : (
                <p className={`${styles.emptyText} ${styles.noPrint}`}>Nenhum evento</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.status_recesso}`} />
          <span>Recesso/Feriado</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.status_atencao}`} />
          <span>Importante</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.status_letivo}`} />
          <span>Dia Letivo</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.status_reuniao}`} />
          <span>Reunião</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.status_colacao}`} />
          <span>Colação</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.status_normal}`} />
          <span>Evento</span>
        </div>
      </div>

      <Dialog.Root open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.modalOverlay} />
          <Dialog.Content className={styles.modalContent}>
            <Dialog.Title className={styles.modalTitle}>
              Evento para {selectedDay?.day} de {selectedDay && months[selectedDay.monthIndex].monthName}
            </Dialog.Title>

            <div className={styles.formField}>
              <label>Status do Dia</label>
              <select 
                className={styles.select}
                value={eventForm.status}
                onChange={e => setEventForm({ ...eventForm, status: e.target.value as EventStatus })}
              >
                <option value="normal">Evento</option>
                <option value="recesso">Recesso/Feriado</option>
                <option value="atencao">Importante</option>
                <option value="letivo">Dia Letivo</option>
                <option value="reuniao">Reunião</option>
                <option value="colacao">Colação</option>
              </select>
            </div>

            <div className={styles.formField}>
              <label>Descrição do Evento</label>
              <textarea 
                className={styles.textarea}
                placeholder="Ex: Início das aulas"
                value={eventForm.text}
                onChange={e => setEventForm({ ...eventForm, text: e.target.value })}
              />
            </div>

            <div className={styles.modalActions}>
              <button className={`${styles.button} ${styles.secondary}`} onClick={() => setSelectedDay(null)}>
                Cancelar
              </button>
              <button className={`${styles.button} ${styles.primary}`} onClick={saveEvent}>
                Salvar Evento
              </button>
            </div>

            <Dialog.Close asChild>
              <button className={styles.closeButton} aria-label="Close">
                <X size={20} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {showStatus && (
        <div className={styles.publishStatus}>
          <CheckCircle size={24} weight="fill" />
          Calendário publicado com sucesso!
        </div>
      )}
    </div>
  );
}
