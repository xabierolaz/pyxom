'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Py</span>
              </div>
              <span className="text-xl font-bold text-slate-800">
                PyXom <span className="text-blue-600 text-sm">λ</span>
              </span>
            </Link>
          </div>          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-slate-600 hover:text-slate-900">
              Inicio
            </Link>
            <Link href="/sugerencias" className="text-slate-600 hover:text-slate-900">
              Sugerencias
            </Link>
          </nav><div className="flex items-center space-x-4">
            <div className="text-slate-600 text-sm">
              Plataforma de Aprendizaje Python
            </div>            <div className="text-slate-500 text-xs font-medium">
              Desarrollado por Xabier Olaz
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
