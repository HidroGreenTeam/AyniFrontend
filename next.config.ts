import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/treatments/:path*',
        destination: 'https://treatment-service.thankfulwater-e8adfc7e.eastus.azurecontainerapps.io/api/v1/treatments/:path*',
      },
    ];
  },
};

export default nextConfig;
