import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push(
      'pino-pretty',
      'lokijs',
      'encoding',
      '@x402/core',
      '@x402/evm',
      '@x402/svm'
    );
    // Ignore optional dependencies that Next.js tries to resolve
    if (!config.resolve) config.resolve = {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@x402/core/client': false,
      '@x402/evm/exact/client': false,
      '@x402/evm/upto/client': false,
      '@x402/svm/exact/client': false,
    };
    return config;
  },
  turbopack: {},
};

export default nextConfig;
