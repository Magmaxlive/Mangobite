/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: false,
  allowedDevOrigins: ['192.168.1.40'],
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
