import Head from 'next/head'
import Image from 'next/image'
import { FormEvent, useState } from 'react'
import { PROCESSO_SELETIVO_2027_1_COURSES } from '../../data/processoSeletivo20271'
import panfletoFrente from '../../public/images/processo-seletivo-2027-1/campanha-frente.png'
import panfletoVerso from '../../public/images/processo-seletivo-2027-1/campanha-cursos.png'
import styles from '../../styles/processo-seletivo-2027-1.module.scss'

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
          content="Seu futuro começa com uma escolha. Conheça os cursos de graduação da FAZAG e as formas de ingresso para o Processo Seletivo 2027.1."
        />
      </Head>

      <main className={styles.page}>
        <header className={styles.intro}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Processo Seletivo / 2027.1</span>
            <h1>Seu <em>futuro</em><br />começa com<br />uma escolha<span>.</span></h1>
            <p>Escolha a sua graduação. Na FAZAG, o próximo capítulo da sua história começa agora.</p>
            <a className={styles.primaryLink} href="#receba-informacoes">
              Quero começar <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className={styles.heroEdition} aria-hidden="true">
            <span>FAZAG</span>
            <strong>2027<span>.1</span></strong>
            <p>Uma escolha.<br />Novas possibilidades.</p>
          </div>
        </header>

        <ul className={styles.metrics} aria-label="A FAZAG em números">
          <li><strong>16</strong><span>cursos de graduação</span></li>
          <li><strong>24</strong><span>anos de história</span></li>
          <li><strong>+5.000</strong><span>profissionais formados</span></li>
        </ul>

        <section className={styles.campaign} aria-labelledby="campaign-title">
          <div className={styles.sectionHeading}>
            <div><span>O seu próximo capítulo</span><h2 id="campaign-title">Encontre o seu caminho.</h2></div>
            <p>Conheça a campanha e descubra a graduação que combina com o seu futuro.</p>
          </div>
          <div className={styles.flyers}>
          <figure className={styles.flyer}>
            <Image
              src={panfletoFrente}
              alt="Campanha FAZAG 2027.1: seu futuro começa com uma escolha. 16 cursos de graduação, 24 anos de história e mais de 5.000 formados."
              priority
              placeholder="blur"
              sizes="(max-width: 820px) calc(100vw - 40px), (max-width: 1440px) 46vw, 624px"
            />
            <figcaption><span>01 / Sua escolha</span><strong>O futuro começa aqui.</strong></figcaption>
          </figure>

          <figure className={styles.flyer}>
            <Image
              src={panfletoVerso}
              alt="Verso do panfleto do Processo Seletivo 2027.1 da FAZAG, com a lista de cursos disponíveis"
              placeholder="blur"
              sizes="(max-width: 820px) calc(100vw - 40px), (max-width: 1440px) 46vw, 624px"
            />
            <figcaption><span>02 / Sua graduação</span><strong>Conheça nossos cursos.</strong></figcaption>
          </figure>
          </div>
        </section>

        <section id="receba-informacoes" className={styles.leadSection} aria-labelledby="lead-title">
          <div className={styles.leadIntro}>
            <span>Dê o primeiro passo</span>
            <h2 id="lead-title">A sua escolha merece um novo começo.</h2>
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
              {formStatus === 'submitting' ? 'Enviando...' : 'Quero conhecer as condições'}
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
