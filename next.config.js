  /** @type {import('next').NextConfig} */
  const nextConfig = {
    output: 'export',
    basePath: '',
    images: {
      unoptimized: true,
    },
    trailingSlash: true, // bu önemli!
  }
  
  module.exports = nextConfig
  
