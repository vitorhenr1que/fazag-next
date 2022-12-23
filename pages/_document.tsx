import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
      <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Faculdade Zacarias de Góes</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossOrigin='anonymous'/>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;800;900&family=Poppins:wght@700;800&display=swap" rel="stylesheet"/>
      </Head>
      <body>
        <Main />
        <NextScript/>
      </body>
    </Html>
  )
}
