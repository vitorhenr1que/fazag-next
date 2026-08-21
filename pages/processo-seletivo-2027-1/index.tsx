import Head from 'next/head'
import Image from 'next/image'
import { FormEvent, useState } from 'react'
import { PROCESSO_SELETIVO_2027_1_COURSES } from '../../data/processoSeletivo20271'
import panfletoFrente from '../../public/images/processo-seletivo-2026-2/panfleto-frente.png'
import panfletoVerso from '../../public/images/processo-seletivo-2026-2/panfleto-verso.png'
import styles from '../../styles/processo-seletivo-2026-2.module.scss'

const whatsappLink =
  'https://wa.me/5575981048077?text=Ol%C3%A1%21%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20Processo%20Seletivo%202027.1%20da%20FAZAG.'

function formatWhatsapp(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  const ddd = digits.slice(0, 2)
  const number = digits.slice(2)

  if (!digits) return ''
  if (digits.length <= 2) return `(${ddd}`
  if (number[0] !== '9') return `(${ddd}) `
  if (number.length <= 5) return `(${ddd}) ${number}`

  return `(${ddd}) ${number.slice(0, 5)}-${number.slice(5)}`
}

export default function ProcessoSeletivo20271() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formMessage, setFormMessage] = useState('')
  const [whatsapp, setWhatsapp] = useState('')

  async function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    setFormStatus('submitting')
    setFormMessage('')

    try {
      const response = await fetch('/api/leads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.get('nome'),
          email: formData.get('email'),
          tel: formData.get('tel'),
          course: formData.get('course'),
        }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result.message || 'Não foi possível enviar seus dados.')
      }

      form.reset()
      setWhatsapp('')
      setFormStatus('success')
      setFormMessage('Pronto! Recebemos seus dados e entraremos em contato com você.')
    } catch (error) {
      setFormStatus('error')
      setFormMessage(error instanceof Error ? error.message : 'Não foi possível enviar seus dados.')
    }
  }

  return (
    <>
      <Head>
        <title>Processo Seletivo 2027.1 | FAZAG</title>
        <meta
          name="description"
          content="Conheça os cursos do Processo Seletivo 2027.1 da FAZAG e fale com nossa equipe pelo WhatsApp."
        />
      </Head>

      <main className={styles.page}>
        <div className={styles.glow} aria-hidden="true" />

        <header className={styles.intro}>
          <span className={styles.eyebrow}>Inscrições abertas</span>
          <h1>Processo Seletivo 2027.1</h1>
          <p>Novos cursos. Novas oportunidades. Seu futuro começa na FAZAG.</p>
        </header>

        <section className={styles.flyers} aria-label="Panfletos do Processo Seletivo 2027.1">
          <figure className={`${styles.flyer} ${styles.front}`}>
            <Image
              src={panfletoFrente}
              alt="Frente do panfleto do Processo Seletivo 2027.1 da FAZAG, com destaque para os novos cursos"
              priority
              placeholder="blur"
              sizes="(max-width: 820px) calc(100vw - 40px), 46vw"
            />
          </figure>

          <figure className={`${styles.flyer} ${styles.back}`}>
            <Image
              src={panfletoVerso}
              alt="Verso do panfleto do Processo Seletivo 2027.1 da FAZAG, com a lista de cursos disponíveis"
              placeholder="blur"
              sizes="(max-width: 820px) calc(100vw - 40px), 46vw"
            />
          </figure>
        </section>

        <section className={styles.leadSection} aria-labelledby="lead-title">
          <div className={styles.leadIntro}>
            <span>Ofertas especiais</span>
            <h2 id="lead-title">Receba as melhores condições para começar</h2>
            <p>
              Conte qual curso combina com você e receba informações sobre bolsas,
              descontos e formas de ingresso.
            </p>
            <div className={styles.leadHighlight} aria-hidden="true">
              <strong>2027.1</strong>
              <span>Seu próximo passo começa aqui</span>
            </div>
          </div>

          <form className={styles.leadForm} onSubmit={handleLeadSubmit}>
            <div className={styles.field}>
              <label htmlFor="lead-nome">Nome completo</label>
              <input
                id="lead-nome"
                name="nome"
                type="text"
                autoComplete="name"
                minLength={3}
                maxLength={120}
                placeholder="Como podemos chamar você?"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="lead-email">E-mail</label>
              <input
                id="lead-email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={160}
                placeholder="voce@exemplo.com"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="lead-whatsapp">WhatsApp</label>
              <input
                id="lead-whatsapp"
                name="tel"
                type="tel"
                autoComplete="tel"
                inputMode="numeric"
                value={whatsapp}
                onChange={(event) => setWhatsapp(formatWhatsapp(event.target.value))}
                pattern={'\\(\\d{2}\\) 9\\d{4}-\\d{4}'}
                maxLength={15}
                title="Digite o WhatsApp no formato (XX) 9XXXX-XXXX"
                placeholder="(75) 98104-8077"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="lead-course">Curso de interesse</label>
              <select id="lead-course" name="course" defaultValue="" required>
                <option value="" disabled>Selecione um curso</option>
                {PROCESSO_SELETIVO_2027_1_COURSES.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>

            <button type="submit" disabled={formStatus === 'submitting'}>
              {formStatus === 'submitting' ? 'Enviando...' : 'Quero receber ofertas'}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>

            <p className={styles.privacyNote}>
              Ao enviar, você autoriza o contato da FAZAG sobre cursos e ofertas.
            </p>

            {formMessage && (
              <p
                className={formStatus === 'success' ? styles.successMessage : styles.errorMessage}
                role="status"
                aria-live="polite"
              >
                {formMessage}
              </p>
            )}
          </form>
        </section>

        <section className={styles.moreInfo} aria-labelledby="more-info-title">
          <div>
            <span>Conheça a FAZAG</span>
            <h2 id="more-info-title">Quer mais informações sobre os cursos?</h2>
          </div>
          <a
            href="https://matriculas.fazag.edu.br"
            target="_blank"
            rel="noopener noreferrer"
          >
            Saiba mais
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </section>

        <a
          className={styles.whatsappButton}
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Entrar em contato com a FAZAG pelo WhatsApp no número 75 98104-8077"
        >
          <Image
            src="/images/icons/whatsapp.svg"
            alt=""
            width={30}
            height={30}
            aria-hidden="true"
          />
          <span>
            Fale pelo WhatsApp
            <strong>(75) 98104-8077</strong>
          </span>
        </a>
      </main>
    </>
  )
}
