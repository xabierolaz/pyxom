// app/layout.tsx
import '../styles/globals.css';
import Script from 'next/script';
import Header from '@/components/Header';

export const metadata = { 
  title: 'PyXom - Plataforma de Aprendizaje Python',
  description: 'Aprende Python de forma interactiva con ejercicios prácticos y seguimiento de progreso'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <Script
          src="https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <Header />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}