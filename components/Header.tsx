'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-slate-800">PyXom</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-slate-600 hover:text-slate-900">
              Inicio
            </Link>
            <Link href="/parts" className="text-slate-600 hover:text-slate-900">
              Partes del Curso
            </Link>
            <Link href="/progress" className="text-slate-600 hover:text-slate-900">
              Mi Progreso
            </Link>
            <Link href="/support" className="text-slate-600 hover:text-slate-900">
              Soporte
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="text-slate-600 text-sm">
              Plataforma de Aprendizaje Python
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
