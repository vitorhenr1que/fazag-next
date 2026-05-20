import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  setMonth,
  setYear,
  startOfMonth,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarBlank, CaretLeft, CaretRight, Clock, GraduationCap, MagnifyingGlass } from 'phosphor-react';
import styles from '../../styles/calendario-academico.module.scss';

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

const statusLabels: Record<EventStatus, string> = {
  normal: 'Evento',
  recesso: 'Recesso/Feriado',
  atencao: 'Importante',
  letivo: 'Dia Letivo',
  reuniao: 'Reunião',
  colacao: 'Colação',
};

const statusOrder: EventStatus[] = ['recesso', 'atencao', 'letivo', 'reuniao', 'colacao', 'normal'];

function buildEmptyMonths(year: number): MonthData[] {
  return Array.from({ length: 12 }, (_, monthIndex) => ({
    monthIndex,
    monthName: format(setMonth(setYear(new Date(), year), monthIndex), 'MMMM', { locale: ptBR }),
    events: [],
  }));
}

export default function CalendarioAcademico() {
  const [year, setYearValue] = useState(2026);
  const [semester, setSemester] = useState<'1' | '2'>('1');
  const [months, setMonths] = useState<MonthData[]>(() => buildEmptyMonths(2026));
  const [query, setQuery] = useState('');
  const [isSemesterExpanded, setIsSemesterExpanded] = useState(false);
  const [selectedEventDay, setSelectedEventDay] = useState<string | null>(null);
  const [expandedEventMonths, setExpandedEventMonths] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchCalendar() {
      setIsLoading(true);
      setError('');

      try {
        const response = await axios.get(`/api/calendario?full=true&ano=${year}`);
        const data = Array.isArray(response.data?.data) ? response.data.data : [];
        if (!isMounted) return;

        setMonths(data.length > 0 ? data : buildEmptyMonths(year));
      } catch (err) {
        if (!isMounted) return;
        setMonths(buildEmptyMonths(year));
        setError('Não foi possível carregar o calendário no momento.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchCalendar();

    return () => {
      isMounted = false;
    };
  }, [year]);

  useEffect(() => {
    setIsSemesterExpanded(false);
    setSelectedEventDay(null);
    setExpandedEventMonths([]);
  }, [semester, year]);

  const semesterMonths = useMemo(() => {
    return semester === '1' ? months.slice(0, 6) : months.slice(6, 12);
  }, [months, semester]);

  const featuredMonthIndex = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const semesterStart = semester === '1' ? 0 : 6;
    const semesterEnd = semester === '1' ? 5 : 11;

    if (year === today.getFullYear() && currentMonth >= semesterStart && currentMonth <= semesterEnd) {
      return currentMonth;
    }

    return semesterStart;
  }, [semester, year]);

  const featuredMonth = useMemo(() => {
    return semesterMonths.find((month) => month.monthIndex === featuredMonthIndex) || semesterMonths[0];
  }, [featuredMonthIndex, semesterMonths]);

  const visibleMonths = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return isSemesterExpanded || !featuredMonth ? semesterMonths : [featuredMonth];
    }

    return semesterMonths
      .map((month) => ({
        ...month,
        events: month.events.filter((event) => event.text.toLowerCase().includes(normalizedQuery)),
      }))
      .filter((month) => month.events.length > 0);
  }, [featuredMonth, isSemesterExpanded, query, semesterMonths]);

  const hasPublishedEvents = months.some((month) => month.events.length > 0);
  const isShowingSearchResults = query.trim().length > 0;
  const featuredMonthLabel = featuredMonth?.monthIndex === new Date().getMonth() && year === new Date().getFullYear()
    ? 'Mês atual'
    : 'Início do semestre';

  const toggleEventMonth = (monthIndex: number) => {
    setExpandedEventMonths((currentMonths) =>
      currentMonths.includes(monthIndex)
        ? currentMonths.filter((index) => index !== monthIndex)
        : [...currentMonths, monthIndex]
    );
  };

  const scrollToMonth = (monthIndex?: number) => {
    window.setTimeout(() => {
      document
        .getElementById(`mes-${monthIndex}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleSemesterViewToggle = () => {
    const nextIsExpanded = !isSemesterExpanded;
    const targetMonthIndex = nextIsExpanded
      ? semesterMonths[0]?.monthIndex
      : featuredMonth?.monthIndex;

    setIsSemesterExpanded(nextIsExpanded);
    scrollToMonth(targetMonthIndex);
  };

  const renderCalendarGrid = (month: MonthData) => {
    const date = setMonth(setYear(new Date(), year), month.monthIndex);
    const daysInMonth = eachDayOfInterval({ start: startOfMonth(date), end: endOfMonth(date) });
    const paddingDays = Array.from({ length: getDay(startOfMonth(date)) }, (_, index) => index);

    return (
      <div className={styles.calendarGrid} aria-label={`Calendário de ${month.monthName}`}>
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((dayName, index) => (
          <span key={`${dayName}-${index}`} className={styles.dayName}>{dayName}</span>
        ))}

        {paddingDays.map((paddingDay) => (
          <span key={`pad-${paddingDay}`} className={`${styles.dayCell} ${styles.emptyDay}`} />
        ))}

        {daysInMonth.map((dayDate) => {
          const day = dayDate.getDate();
          const event = month.events.find((item) => item.day === day);
          const eventDayKey = `${month.monthIndex}-${day}`;
          const isSelected = selectedEventDay === eventDayKey;

          return (
            <button
              type="button"
              key={day}
              className={`${styles.dayCell} ${event ? styles[`status_${event.status}`] : ''} ${isSelected ? styles.tooltipOpen : ''}`}
              aria-label={event ? `${day} de ${month.monthName}: ${event.text}` : `${day} de ${month.monthName}`}
              aria-pressed={event ? isSelected : undefined}
              disabled={!event}
              onClick={() => {
                if (!event) return;
                setSelectedEventDay((currentDay) => currentDay === eventDayKey ? null : eventDayKey);
              }}
              onBlur={() => {
                if (isSelected) {
                  setSelectedEventDay(null);
                }
              }}
            >
              {day}
              {event && (
                <span className={styles.eventTooltip} role="tooltip">
                  {event.text}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Calendário Acadêmico | FAZAG</title>
        <meta
          name="description"
          content="Consulte as datas importantes do calendário acadêmico da FAZAG."
        />
      </Head>

      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroIcon}>
              <GraduationCap size={34} weight="fill" />
            </div>
            <div>
              <h1>Calendário Acadêmico</h1>
              <p>Consulte períodos letivos, recessos, reuniões, eventos e outras datas importantes da faculdade.</p>
            </div>
          </div>

          <div className={styles.heroCard}>
            <CalendarBlank size={28} />
            <strong>{year}.{semester}</strong>
            <span>{semester === '1' ? 'Janeiro a Junho' : 'Julho a Dezembro'}</span>
          </div>
        </section>

        <section className={styles.toolbar} aria-label="Filtros do calendário">
          <div className={styles.yearControl}>
            <button type="button" onClick={() => setYearValue((currentYear) => currentYear - 1)} aria-label="Ano anterior">
              <CaretLeft size={18} />
            </button>
            <strong>{year}</strong>
            <button type="button" onClick={() => setYearValue((currentYear) => currentYear + 1)} aria-label="Próximo ano">
              <CaretRight size={18} />
            </button>
          </div>

          <div className={styles.semesterControl}>
            <button
              type="button"
              className={semester === '1' ? styles.active : ''}
              onClick={() => setSemester('1')}
            >
              {year}.1
            </button>
            <button
              type="button"
              className={semester === '2' ? styles.active : ''}
              onClick={() => setSemester('2')}
            >
              {year}.2
            </button>
          </div>

          <label className={styles.search}>
            <MagnifyingGlass size={18} />
            <input
              type="search"
              placeholder="Buscar data importante"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </section>

        <section className={styles.legend} aria-label="Legenda de categorias">
          {statusOrder.map((status) => (
            <span key={status} className={styles.legendItem}>
              <span className={`${styles.legendColor} ${styles[`status_${status}`]}`} />
              {statusLabels[status]}
            </span>
          ))}
        </section>

        {!isLoading && hasPublishedEvents && !isShowingSearchResults && (
          <div className={styles.expandBar}>
            <div>
              <strong>{isSemesterExpanded ? `Semestre completo ${year}.${semester}` : `${featuredMonthLabel}: ${featuredMonth?.monthName}`}</strong>
              <span>
                {isSemesterExpanded
                  ? 'Exibindo os meses em ordem cronológica.'
                  : `Exibindo primeiro o mês em destaque de ${year}.${semester}.`}
              </span>
            </div>
            <button type="button" onClick={handleSemesterViewToggle}>
              {isSemesterExpanded ? 'Mostrar apenas mês em destaque' : 'Expandir semestre completo'}
            </button>
          </div>
        )}

        {error && <p className={styles.alert}>{error}</p>}

        {isLoading ? (
          <div className={styles.loadingState}>
            <Clock size={28} />
            <p>Carregando calendário acadêmico...</p>
          </div>
        ) : !hasPublishedEvents ? (
          <div className={styles.emptyState}>
            <CalendarBlank size={34} />
            <h2>Calendário em atualização</h2>
            <p>As datas acadêmicas de {year} ainda não foram publicadas.</p>
          </div>
        ) : (
          <div className={styles.contentGrid}>
            <section className={styles.monthsGrid} aria-label="Meses do calendário acadêmico">
              {visibleMonths.length > 0 ? (
                visibleMonths.map((month) => {
                  const isEventListExpanded = expandedEventMonths.includes(month.monthIndex);
                  const eventListId = `eventos-${month.monthIndex}`;

                  return (
                    <article
                      id={`mes-${month.monthIndex}`}
                      key={month.monthIndex}
                      className={`${styles.monthCard} ${!isSemesterExpanded && !isShowingSearchResults && month.monthIndex === featuredMonth?.monthIndex ? styles.featuredMonth : ''}`}
                    >
                      <header>
                        <div>
                          {!isSemesterExpanded && !isShowingSearchResults && month.monthIndex === featuredMonth?.monthIndex && (
                            <span className={styles.monthBadge}>{featuredMonthLabel}</span>
                          )}
                          <h2>{month.monthName}</h2>
                        </div>
                        <span className={styles.eventCount}>{month.events.length} {month.events.length === 1 ? 'data' : 'datas'}</span>
                      </header>

                      {renderCalendarGrid(month)}

                      <button
                        type="button"
                        className={styles.eventListToggle}
                        onClick={() => toggleEventMonth(month.monthIndex)}
                        aria-expanded={isEventListExpanded}
                        aria-controls={eventListId}
                        disabled={month.events.length === 0}
                      >
                        {month.events.length === 0
                          ? 'Sem eventos cadastrados'
                          : isEventListExpanded
                            ? 'Ocultar eventos do mês'
                            : 'Mostrar eventos do mês'}
                      </button>

                      <div
                        className={`${styles.eventListWrapper} ${isEventListExpanded ? styles.eventListOpen : ''}`}
                        id={eventListId}
                        aria-hidden={!isEventListExpanded}
                      >
                        <div className={styles.eventList}>
                          {month.events.length > 0 ? (
                            month.events.map((event) => (
                              <div key={`${month.monthIndex}-${event.day}-${event.text}`} className={styles.eventItem}>
                                <span className={`${styles.eventDay} ${styles[`status_${event.status}`]}`}>{event.day}</span>
                                <div>
                                  <strong>{statusLabels[event.status]}</strong>
                                  <p>{event.text}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className={styles.monthEmpty}>Nenhuma data cadastrada.</p>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className={styles.emptyState}>
                  <MagnifyingGlass size={34} />
                  <h2>Nenhum resultado encontrado</h2>
                  <p>Tente buscar por outro termo ou altere o semestre.</p>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </>
  );
}
