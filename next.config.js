/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  basePath: process.env.NODE_ENV === 'production' ? '/vibe-coding' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/vibe-coding' : '',
}

module.exports = nextConfig