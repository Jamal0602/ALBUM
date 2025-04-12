/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['raw.githubusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    USE_GITHUB_FILES: process.env.USE_GITHUB_FILES || 'true',
  },
}

export default nextConfig
