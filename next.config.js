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

  async headers() {
    return [
        {
            // matching all API routes
            source: "/api/:path*",
            headers: [
                { key: "Access-Control-Allow-Credentials", value: "true" },
                { key: "Access-Control-Allow-Origin", value: "https://matriculas.fazag.edu.br" }, // Colocar site específico que pode fazer requisições https://matriculas.fazag.edu.br
                { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
                { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                { key: "Access-Control-Max-Age", value: "86400" },
            ]
        }
    ]
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
        source: '/api/vagas/vagas',
        destination: 'https://fazag-next.vercel.app/api/vagas/vagas'
      },
      {
        source: '/api/vagas/alterar',
        destination: 'https://fazag-next.vercel.app/api/vagas/alterar'
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
        source: '/api/leads/create',
        destination: 'https://fazag-next.vercel.app/api/leads/create',
      },
      {
        source: '/api/leads/leadsmail',
        destination: 'https://fazag-next.vercel.app/api/leads/leadsmail',
      },
      {
        source: '/api/matriculas/create',
        destination: 'https://fazag-next.vercel.app/api/leads/create',
      },
      {
        source: '/api/matriculas/create',
        destination: 'https://fazag-next.vercel.app/api/leads/create',
      },
      {
        source: '/api/inscricao/create',
        destination: 'https://fazag-next.vercel.app/api/inscricao/create',
      },
      {
        source: '/api/inscricao/sendmail',
        destination: 'https://fazag-next.vercel.app/api/inscricao/sendmail',
      },
      {
        source: '/api/revalidate',
        destination: 'https://fazag-next.vercel.app/api/revalidate',
      },
      {
        source: '/fazag-informa',
        destination: 'https://fazag.edu.br/fazaginforma'
      }
    ]
  }
}

module.exports = nextConfig
