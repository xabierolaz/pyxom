/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@monaco-editor/react'],
    // Exclude debug pages in production
    ...(!process.env.NODE_ENV === 'development' && {
      excludePages: ['/monaco-debug', '/debug-demo']
    })
  },
  
  // Only include essential file extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Build optimization
  swcMinify: true,
  
  // Optimize output
  compress: true,
  poweredByHeader: false,
  
  // Bundle optimization
  webpack(config, { isServer, dev }) {
    // Exclude problematic directories completely
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/.next/**',
        '**/test-results/**',
        '**/playwright-report/**',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/scripts/**',
        '**/.git/**'
      ]
    };

    if (!isServer) {
      config.resolve.fallback = { fs: false, path: false };
      
      // Optimize Monaco Editor bundle
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,            monaco: {
              test: /[\\/]node_modules[\\/](@monaco-editor|monaco-editor)[\\/]/,
              name: 'monaco',
              chunks: 'async',
              priority: 20, // Higher priority
              reuseExistingChunk: true,
              enforce: true, // Force create this chunk
              maxSize: 500000, // Break into smaller chunks if too large
            },
            // Separate Monaco core for faster loading
            monacoCore: {
              test: /[\\/]node_modules[\\/]monaco-editor[\\/]esm[\\/]vs[\\/]editor[\\/]/,
              name: 'monaco-core',
              chunks: 'async',
              priority: 25, // Higher than monaco
              reuseExistingChunk: true,
            },
            pyodide: {
              test: /[\\/]node_modules[\\/]pyodide[\\/]/,
              name: 'pyodide',
              chunks: 'async',
              priority: 10,
              reuseExistingChunk: true,
            }
          }
        }
      };
        // Exclude heavy Monaco languages we don't need
      const webpack = require('webpack');
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^\.\/locale$/,
          contextRegExp: /moment$/
        })
      );
    }
    
    // Production optimizations
    if (!dev) {
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }
    
    return config;
  },
  
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
  },
  
  // Headers for better caching
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/workers/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400' // 1 day for workers
          }        ]      }
    ];
  }
};

module.exports = nextConfig;
