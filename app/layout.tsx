// app/layout.tsx
import '../styles/globals.css';
import Script from 'next/script';

export const metadata = { /* ... */ };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <Script
          src="https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js" // <--- CAMBIA ESTA VERSIÓN
          strategy="beforeInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}