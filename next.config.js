/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production'
const prefixPath = isProd ? '/ChatGPT_Playground' : ''

const nextConfig = {
  assetPrefix: prefixPath,
  output: 'export',
  distDir: 'docs'
}

module.exports = nextConfig
