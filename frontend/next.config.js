/** @type {import('next').NextConfig} */

const restUrl = process.env.NEXT_PUBLIC_REST_URL || "http://backend:8000";
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/internal/:path*',
        destination: 'http://localhost:3000/api/internal/:path*',
      },
      {
        source: '/api/:path*',
        destination: `${restUrl}/api/:path*/`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: '',
      },
    ],
  },
  transpilePackages: ['geist'],
};

module.exports = nextConfig;
