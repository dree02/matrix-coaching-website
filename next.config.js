/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ CRITICAL: Static export for Cloudflare Pages
  output: 'export',
  
  // ✅ No trailing slashes (cleaner URLs)
  trailingSlash: false,
  
  // ✅ Image optimization disabled for static export
  // Use unoptimized images or external CDN
  images: {
    unoptimized: true,
  },
  
  // ✅ Optional: Add base path if deploying to subdirectory
  // basePath: '/coaching',
  
  // ✅ Strict mode for better React practices
  reactStrictMode: true,
  
  // ✅ Performance optimizations
  swcMinify: true,
  
  // ✅ Cloudflare Pages compatibility
  experimental: {
    // Add any experimental features if needed
  },
}

module.exports = nextConfig
