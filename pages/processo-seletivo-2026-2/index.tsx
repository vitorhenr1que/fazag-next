import Head from 'next/head'
import Image from 'next/image'
import panfletoFrente from '../../public/images/processo-seletivo-2026-2/panfleto-frente.png'
import panfletoVerso from '../../public/images/processo-seletivo-2026-2/panfleto-verso.png'
import styles from '../../styles/processo-seletivo-2026-2.module.scss'

const whatsappLink =
  'https://wa.me/5575981048077?text=Ol%C3%A1%21%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20Processo%20Seletivo%202026.2%20da%20FAZAG.'

export default function ProcessoSeletivo20262() {
  return (
    <>
      <Head>
        <title>Processo Seletivo 2026.2 | FAZAG</title>
        <meta
          name="description"
          content="Conheça os cursos do Processo Seletivo 2026.2 da FAZAG e fale com nossa equipe pelo WhatsApp."
        />
      </Head>

      <main className={styles.page}>
        <div className={styles.glow} aria-hidden="true" />

        <header className={styles.intro}>
          <span className={styles.eyebrow}>Inscrições abertas</span>
          <h1>Processo Seletivo 2026.2</h1>
          <p>Novos cursos. Novas oportunidades. Seu futuro começa na FAZAG.</p>
        </header>

        <section className={styles.flyers} aria-label="Panfletos do Processo Seletivo 2026.2">
          <figure className={`${styles.flyer} ${styles.front}`}>
            <Image
              src={panfletoFrente}
              alt="Frente do panfleto do Processo Seletivo 2026.2 da FAZAG, com destaque para os novos cursos"
              priority
              placeholder="blur"
              sizes="(max-width: 820px) calc(100vw - 40px), 46vw"
            />
          </figure>

          <figure className={`${styles.flyer} ${styles.back}`}>
            <Image
              src={panfletoVerso}
              alt="Verso do panfleto do Processo Seletivo 2026.2 da FAZAG, com a lista de cursos disponíveis"
              placeholder="blur"
              sizes="(max-width: 820px) calc(100vw - 40px), 46vw"
            />
          </figure>
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
