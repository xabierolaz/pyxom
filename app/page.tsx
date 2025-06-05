import React from 'react';
import Link from 'next/link';
import CourseNavigation from '@/components/CourseNavigation';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-4 text-center">
          Esta herramienta no sustituye la documentación ni los ejercicios oficiales del grado; es una herramienta extra para practicar ejercicios.
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
          Es PyXom, herramienta para repaso de Python para Estructuras de Datos de la UPNA desarrollada por Xabier Olaz.
        </div>

        <div className="grid gap-6 mb-8">
          <Link href="/06-repaso">
            <div className="relative bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                Convocatoria Extraordinaria 2025
              </span>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Ejercicios de Repaso</h3>
              <p className="text-sm text-gray-600">Repaso de Python para Estructuras de Datos de la UPNA</p>
            </div>
          </Link>
        </div>

        <CourseNavigation />
      </div>
    </main>
  );
}
