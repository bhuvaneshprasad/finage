import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@finage/core', '@finage/database'],
  typedRoutes: true,
  output: 'standalone',
};

export default nextConfig;
