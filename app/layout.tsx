// app/layout.tsx
import '../styles/globals.css';
import Script from 'next/script';
import Header from '@/components/Header';
import PyodideLoader from '@/components/PyodideLoader';
import GlobalErrorBoundary from '@/components/GlobalErrorBoundary';
import { headers } from 'next/headers';

export const metadata = {
  title: 'PyXom - Plataforma de Aprendizaje Python',
  description: 'Aprende Python de forma interactiva con ejercicios prácticos y seguimiento de progreso'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = headers().get('x-nonce') || '';

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

        {/* Nota: La política CSP ahora se aplica dinámicamente mediante middleware para evitar duplicidades y conflictos. */}

        {/*
          El nonce se inyecta en este script, que a su vez lo establece
          para que Webpack pueda usarlo en los estilos y scripts que carga dinámicamente.
        */}
        <Script id="webpack-nonce" nonce={nonce} strategy="beforeInteractive">
          {`__webpack_nonce__ = "${nonce}";`}
        </Script>
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
