/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['raw.githubusercontent.com', 'file.cubiz.space'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'file.cubiz.space',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    USE_GITHUB_FILES: process.env.USE_GITHUB_FILES || 'true',
    FILE_DOMAIN: process.env.FILE_DOMAIN || 'file.cubiz.space',
  },
}

export default nextConfig
