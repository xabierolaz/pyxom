// app/layout.tsx
import '../styles/globals.css';
import Script from 'next/script';
import Header from '@/components/Header';
import PyodideLoader from '@/components/PyodideLoader';
import GlobalErrorBoundary from '@/components/GlobalErrorBoundary';

export const metadata = {
  title: 'PyXom - Plataforma de Aprendizaje Python',
  description: 'Aprende Python de forma interactiva con ejercicios prácticos y seguimiento de progreso'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Mobile and PWA optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PyXom" />
        <link rel="manifest" href="/manifest.json" />

        {/* Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />

        {/* Preload critical resources with multiple CDN options */}
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js"
          as="script"
        />
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.asm.wasm"
          as="fetch"
          crossOrigin="anonymous"
        />

        {/* Monaco Editor resources - Loaded only when required by components */}

        {/* Fallback CDNs for key resources */}
        <link
          rel="dns-prefetch"
          href="https://cdnjs.cloudflare.com"
        />
        <link
          rel="dns-prefetch"
          href="https://unpkg.com"
        />

        {/* Service Worker Registration */}
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `
          }}
        />

        {/* Enhanced Pyodide Loading */}
        <Script
          src="https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js"
          strategy="beforeInteractive"
        />

        {/* Content Security Policy */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com;
            style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
            font-src 'self' https://fonts.gstatic.com;
            img-src 'self' data: https:;
            connect-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com https://api.github.com;
            worker-src 'self' blob:;
            object-src 'none';
            base-uri 'self';
            form-action 'self';
          "
        />
      </head>
      <body>
        <GlobalErrorBoundary>
          <Header />
          <PyodideLoader />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
