/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Vercel assets
      {
        protocol: 'https',
        hostname: 'assets.vercel.com',
        pathname: '/image/upload/**',
      },
      // Prismic (repo "fazag")
      {
        protocol: 'https',
        hostname: 'images.prismic.io',
        pathname: '/fazag/**',
      },
      // Google user content (abrange lh3, lh4, lh5, lh6...)
      {
        protocol: 'https',
        hostname: 'lh*.googleusercontent.com',
      },
      // Firebase Storage (via API REST v0)
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/**',
      },
      // Se você também usa URLs de "download" com tokens variados,
      // troque o pathname acima para '/**'
    ],
  },

  async headers() {
    // CORS com whitelist simples
    const allowed = [
      'https://fazag.edu.br',
      'https://matriculas.fazag.edu.br',
      'https://fazag-next.vercel.app',
      'https://motivabolsas.com.br'
    ];

    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          // Use um valor estático; a validação do Origin deve ser feita no handler/middleware:
          { key: 'Access-Control-Allow-Origin', value: "*" },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Origin, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      { source: '/api/posts/allposts', destination: 'https://fazag-next.vercel.app/api/posts/allposts' },
      { source: '/api/ouvidoria/create', destination: 'https://fazag-next.vercel.app/api/ouvidoria/create' },
      { source: '/api/vagas/vagas', destination: 'https://fazag-next.vercel.app/api/vagas/vagas' },
      { source: '/api/vagas/alterar', destination: 'https://fazag-next.vercel.app/api/vagas/alterar' },
      { source: '/api/ouvidoria/nodemailer', destination: 'https://fazag-next.vercel.app/api/ouvidoria/nodemailer' },
      { source: '/api/ouvidoria/coordenador', destination: 'https://fazag-next.vercel.app/api/ouvidoria/coordenador' },
      { source: '/api/ouvidoria/emailcoordenador', destination: 'https://fazag-next.vercel.app/api/ouvidoria/emailcoordenador' },
      { source: '/api/leads/create', destination: 'https://fazag-next.vercel.app/api/leads/create' },
      { source: '/api/leads/leadsmail', destination: 'https://fazag-next.vercel.app/api/leads/leadsmail' },

      { source: '/api/matriculas/create', destination: 'https://fazag-next.vercel.app/api/leads/create' },
      { source: '/api/inscricao/create', destination: 'https://fazag-next.vercel.app/api/inscricao/create' },
      { source: '/api/inscricao/sendmail', destination: 'https://fazag-next.vercel.app/api/inscricao/sendmail' },
      { source: '/api/egressos/create', destination: 'https://fazag-next.vercel.app/api/egressos/create' },
      { source: '/api/egressos/nodemailer', destination: 'https://fazag-next.vercel.app/api/egressos/nodemailer' },
      { source: '/api/nusp/create', destination: 'https://fazag-next.vercel.app/api/nusp/create' },
      { source: '/api/nusp/nodemailer', destination: 'https://fazag-next.vercel.app/api/nusp/nodemailer' },
      { source: '/api/nusp/find', destination: 'https://fazag-next.vercel.app/api/nusp/find' },
      { source: '/api/revalidate', destination: 'https://fazag-next.vercel.app/api/revalidate' },
      { source: '/fazag-informa', destination: 'https://fazag.edu.br/fazaginforma' },
      { source: '/egressos', destination: 'https://fazag.edu.br/egressos' },
      
    ];
  },
};

module.exports = nextConfig;