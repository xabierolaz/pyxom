'use client';

import React from 'react';
import Link from 'next/link';

// Beautiful Cobra Icon Component
const CobraIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Cobra body with gradient */}
    <defs>
      <linearGradient id="cobraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="50%" stopColor="#059669" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="eyeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    
    {/* Cobra hood */}
    <path 
      d="M20 40 C25 25, 35 20, 50 20 C65 20, 75 25, 80 40 C75 35, 65 32, 50 32 C35 32, 25 35, 20 40 Z" 
      fill="url(#cobraGradient)" 
      stroke="#047857" 
      strokeWidth="1"
    />
    
    {/* Cobra head */}
    <ellipse cx="50" cy="45" rx="15" ry="12" fill="url(#cobraGradient)" stroke="#047857" strokeWidth="1"/>
    
    {/* Cobra body curve */}
    <path 
      d="M50 57 C48 65, 45 72, 40 78 C35 84, 28 88, 20 90 C15 91, 12 89, 15 85 C20 80, 30 75, 40 70 C45 67, 48 62, 50 57" 
      fill="url(#cobraGradient)" 
      stroke="#047857" 
      strokeWidth="1"
    />
    
    {/* Eyes */}
    <circle cx="45" cy="42" r="3" fill="url(#eyeGradient)" />
    <circle cx="55" cy="42" r="3" fill="url(#eyeGradient)" />
    <circle cx="45" cy="42" r="1.5" fill="#1F2937" />
    <circle cx="55" cy="42" r="1.5" fill="#1F2937" />
    
    {/* Tongue */}
    <path d="M50 50 L52 55 L48 55 Z" fill="#EF4444" />
    <path d="M52 55 L54 57 M48 55 L46 57" stroke="#DC2626" strokeWidth="1" fill="none" />
    
    {/* Pattern on hood */}
    <path d="M35 30 C40 28, 45 28, 50 28 C55 28, 60 28, 65 30" stroke="#065F46" strokeWidth="2" fill="none" opacity="0.7"/>
    <path d="M38 35 C43 33, 47 33, 50 33 C53 33, 57 33, 62 35" stroke="#065F46" strokeWidth="2" fill="none" opacity="0.5"/>
  </svg>
);

// Navigation Icon Component using HeroIcons style
const HomeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const LightBulbIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
  </svg>
);

const AcademicCapIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443a55.381 55.381 0 0 1 5.25 2.882V15" />
  </svg>
);

const SparklesIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-lg border-b border-emerald-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with Beautiful Cobra */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-xl blur-sm group-hover:blur-none transition-all duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                  <CobraIcon className="w-12 h-12" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white drop-shadow-sm">
                  PyXom
                </span>
                <span className="text-xs font-semibold text-emerald-100 flex items-center">
                  <SparklesIcon className="w-3 h-3 mr-1" />
                  Python & Data Structures
                </span>
              </div>
            </Link>
          </div>

          {/* Beautiful Navigation */}
          <nav className="hidden md:flex space-x-2">
            <Link 
              href="/" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 group"
            >
              <HomeIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Inicio</span>
            </Link>
            <Link 
              href="/sugerencias" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 group"
            >
              <LightBulbIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Sugerencias</span>
            </Link>
          </nav>

          {/* Beautiful Badge */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <AcademicCapIcon className="w-5 h-5 text-emerald-100" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">
                  Plataforma de Aprendizaje
                </span>
                <span className="text-xs text-emerald-100">
                  UPNA • Xabier Olaz
                </span>
              </div>
            </div>
            
            {/* Mobile badge */}
            <div className="lg:hidden bg-white/10 backdrop-blur-sm rounded-full p-2 border border-white/20">
              <AcademicCapIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
