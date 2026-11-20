import type { NextConfig } from 'next';

const basePath = process.env.GITHUB_ACTIONS === 'true' ? '/Prayer-Times' : '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
