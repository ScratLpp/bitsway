/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.bitsway.fr'],
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
          }
        ],
      },
    ]
  }
}

module.exports = nextConfig 