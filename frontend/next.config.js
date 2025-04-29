/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/internal/:path*',
        destination: 'http://localhost:3000/api/internal/:path*',
      },
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_REST_URL}/api/:path*/`,
      },
    ];
  },
};

module.exports = nextConfig;
