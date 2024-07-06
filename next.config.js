/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.architect.io',
      },
    ],
  },
}
const withTM = require('next-transpile-modules')(['three'])

module.exports = withTM()

module.exports = nextConfig
