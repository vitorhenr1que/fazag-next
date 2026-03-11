import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../../styles/consulta-diploma.module.scss';

export default function ConsultaDiploma() {
    const router = useRouter();
    const [iframeSrc, setIframeSrc] = useState("https://fazag.assinamos.com.br/iframe/diploma/");

    useEffect(() => {
        if (!router.isReady) return;

        const { cod } = router.query;
        if (cod) {
            const codValue = Array.isArray(cod) ? cod[0] : cod;
            // Append the validation code to the iframe source
            setIframeSrc(`https://fazag.assinamos.com.br/iframe/diploma/${codValue}`);
        }
    }, [router.isReady, router.query]);

    return (
        <div className={styles.pageWrapper}>
            <Head>
                <title>Consulta Diploma Digital | FAZAG</title>
                <meta name="description" content="Portal de consulta de diplomas digitais da Faculdade Fazag." />
            </Head>

            {/* Blurred Background */}
            <div className={styles.backgroundOverlay} />

            <main className="container">
                <div className={styles.iframeContainer}>
                    <iframe
                        id="assinamos_iframe"
                        src={iframeSrc}
                        width="100%"
                        height="600px"
                        title="Consulta Diploma"
                        className={styles.iframe}
                    >
                    </iframe>
                </div>
            </main>

            {/* Fixed Footer specialized for this page */}
            <div className={styles.fixedFooter}>
                <img
                    src="https://static.qualinfo.net.br/_acadweb.imagens/logo/bg_footer_qualinfo_diploma_digital.png"
                    className={styles.footerImg}
                    alt="Logo Qualinfo - Diploma Digital"
                />
            </div>
        </div>
    );
}