import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
      {
        source: '/lms/:path*',
        destination: 'http://localhost:3001/lms/:path*',
      },
    ];
  },
};

export default nextConfig;