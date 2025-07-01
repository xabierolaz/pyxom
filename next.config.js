/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [],
    esmExternals: false,
  },
  pageExtensions: ['tsx', 'jsx'],
  swcMinify: false,
  poweredByHeader: false,
  webpack(config, { isServer }) {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/.next/**',
        '**/app/06-repaso/ej*/**',
        '**/app/06-repaso/page.tsx',
        '**/app/06-repaso/repasoExercises.ts',
        '**/app/06-repaso/[exerciseId].tsx'
      ]
    };
    if (!isServer) {
      config.resolve.fallback = { fs: false, path: false };
    }
    return config;
  }
};
module.exports = nextConfig;
