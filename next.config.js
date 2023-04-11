/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.vercel.com',
        port: '',
        pathname: '/image/upload/**',
      },
      {
        protocol: 'https',
        hostname: 'images.prismic.io',
        port: '',
        pathname: '/fazag/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/posts/allposts',
        destination: 'https://fazag-next.vercel.app/api/posts/allposts',
      },
      {
        source: '/api/ouvidoria/create',
        destination: 'https://fazag-next.vercel.app/api/ouvidoria/create'
      },
      {
        source: '/api/ouvidoria/nodemailer',
        destination: 'https://fazag-next.vercel.app/api/ouvidoria/nodemailer'
      },
      {
        source: '/api/ouvidoria/coordenador',
        destination: 'https://fazag-next.vercel.app/api/ouvidoria/coordenador'
      },
      {
        source: '/api/ouvidoria/emailcoordenador',
        destination: 'https://fazag-next.vercel.app/api/ouvidoria/emailcoordenador'
      },
      {
        source: '/fazag-informa',
        destination: 'https://www.fazag.edu.br/fazaginforma'
      },
      {
        source: '/fazag-informa',
        destination: 'https://fazag.edu.br/fazaginforma'
      },
      {
        source: '/iniciacao-cientifica/',
        destination: 'https://fazag.edu.br'
      }
    ]
  },
}

module.exports = nextConfig
