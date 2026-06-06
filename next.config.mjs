/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: false,
  allowedDevOrigins: ['192.168.1.40'],
  async redirects() {
    return [
      {
        source: '/admin',
        destination: 'https://mangobitemagmax.myshopify.com/admin',
        permanent: false,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
};

export default nextConfig;
