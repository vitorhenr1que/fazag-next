/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: '/api/posts/allposts',
        destination: 'https://fazag-next.vercel.app/api/posts/allposts',
      },
    ]
  },
}

module.exports = nextConfig
