import '../styles/global.scss'
import type { AppProps } from 'next/app'
import { Header } from '../components/Header'
import Footer from '../components/Footer'
import Script from 'next/script'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
  <Header/>
  <Component {...pageProps} />
  <Footer/>
  <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
        crossOrigin="anonymous"
      />
     
    </>
  )

}
