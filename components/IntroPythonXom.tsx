// pyxom/components/IntroPythonXom.tsx
'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { getPyodideInstance } from '@/utils/pythonRunner';
import type { PyodideInterface } from 'pyodide';
import type {
  ExerciseData,
  AttemptResult
} from '@/types/types'; // Ajusta la ruta si es necesario

// Beautiful custom icon components for the interface
const CheckCircleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const XCircleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

const InformationCircleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

const ArrowPathIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm-3.068-9.852a.75.75 0 00-1.449.39 5.5 5.5 0 019.201 2.466l.312.311h-2.433a.75.75 0 000 1.5h4.243a.75.75 0 00.75-.75V1.247a.75.75 0 00-1.5 0v2.43l-.31-.31A7 7 0 0012.244 1.571z" clipRule="evenodd" />
  </svg>
);

const MagnifyingGlassIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
  </svg>
);

const PlayIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
  </svg>
);

// Enhanced Code Editor with fallback
import { preloadMonaco } from '@/utils/loadMonaco';

// Preload Monaco to address loading issues
if (typeof window !== 'undefined') {
  preloadMonaco();
}

const PyCodeEditor = dynamic(() =>
  import('./SimplePyCodeEditor')
    .catch(err => {
      console.error('Failed to load SimplePyCodeEditor:', err);
      return import('./LazyMonacoEditor').then(mod => {
        console.log('Fallback to LazyMonacoEditor');
        return {
          default: ({ initialCode, onCodeChange }: {
            initialCode: string;
            onCodeChange?: (code: string) => void;
            tests?: Array<{ name: string; input: string; expected: string; points: number }>;
          }) =>
            <mod.default
              value={initialCode}
              onChange={(value: string | undefined) => onCodeChange?.(value ?? '')}
              height="400px"
              language="python"
            />
        };
      }).catch(err2 => {
        console.error('All editor loading attempts failed:', err2);
        return {
          default: () => (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 font-medium">Error cargando el editor</p>
              <p className="text-sm text-red-600 mt-2">Por favor, recarga la página o prueba con otro navegador.</p>
            </div>
          )
        };
      });
    }),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Cargando editor Python...</p>
          <p className="text-xs text-gray-500 mt-2">Si tarda mucho, prueba a recargar la página</p>
        </div>
      </div>
    )
  }
);

// --- Carga dinámica para Componentes Pesados ---
// Añadimos un componente de carga simple para Suspense
const LoadingPlaceholder = ({ message }: { message: string }) => (
  <div className="p-4 text-center text-gray-500">{message}</div>
);


// --- Beautiful Icon Components with enhanced styling ---
const IconCheck = ({ className = "h-5 w-5 inline mr-1 text-green-600" }: { className?: string }) => (
  <CheckCircleIcon className={`${className} drop-shadow-sm`} />
);

const IconX = ({ className = "h-5 w-5 inline mr-1 text-red-600" }: { className?: string }) => (
  <XCircleIcon className={`${className} drop-shadow-sm`} />
);

const IconInfo = ({ className = "h-5 w-5 inline mr-1 text-blue-600" }: { className?: string }) => (
  <InformationCircleIcon className={`${className} drop-shadow-sm`} />
);


export default function IntroPythonXom({ data }: { data: ExerciseData }) {
  // Move all hooks to the top level, before any return
  const [code, setCode] = useState<string>(data?.starterCode ?? '');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPyodideReady, setIsPyodideReady] = useState<boolean>(false);
  const [currentAttempt, setCurrentAttempt] = useState<AttemptResult | null>(null);

  // Efecto para inicializar Pyodide
  useEffect(() => {
    setCode(data.starterCode);
    setCurrentAttempt(null);
    setIsLoading(true);

    getPyodideInstance().then((pyInstance: PyodideInterface) => {
        if (pyInstance) {
            setIsPyodideReady(true);
            console.log("IntroPythonXom: Pyodide está listo.");
        } else {
            setIsPyodideReady(false);
            console.error("IntroPythonXom: Pyodide no pudo ser inicializado.");
        }
        setIsLoading(false);
    });

  }, [data.id, data.starterCode]);

  const isExerciseCompleted = useMemo(() => currentAttempt?.overallPassed || false, [currentAttempt]);  const handleReset = () => {
    setCode(data.starterCode);
    setCurrentAttempt(null);
    setIsLoading(false);
  };
  const openPythonTutor = () => {
    const encoded = encodeURIComponent(code);
    window.open(
      `https://pythontutor.com/iframe-embed.html#code=${encoded}&origin=opt-frontend.js&py=3&curInstr=0`,
      '_blank', 'noopener,noreferrer'
    );
  };

  if (isLoading && !isPyodideReady && !currentAttempt) {
    return <LoadingPlaceholder message="Preparando entorno Python, por favor espera..." />;
  }
    return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 font-sans antialiased text-gray-800 bg-gradient-to-br from-slate-50 to-white min-h-screen">
      <header className="mb-8 p-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-xl border border-emerald-200 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2 sm:mb-0">
            {data.title}
          </h1>
          {/* Beautiful Points Indicator */}
          {data.maxPoints && data.maxPoints > 0 && currentAttempt && (
            <div className="px-4 py-2 text-sm font-semibold text-emerald-700 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full border border-emerald-200 shadow-sm backdrop-blur-sm">
              <span className="flex items-center gap-1">
                Puntos: {currentAttempt.totalPointsEarned || 0} / {data.maxPoints}
              </span>
            </div>
          )}
        </div>
        {/* Enhanced description styling */}
        <div className="text-slate-700 text-base md:text-lg leading-relaxed prose prose-slate max-w-none">
          <div dangerouslySetInnerHTML={{ __html: data.description.replace(/\n/g, '<br>') }} />
        </div>
      </header>        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <PlayIcon className="h-5 w-5 text-emerald-600" />
                Tu Código:
              </h2>
              <div className="rounded-xl overflow-hidden shadow-lg border border-slate-300 bg-white backdrop-blur-sm">
                <Suspense fallback={<LoadingPlaceholder message="Cargando editor..." />}>                <PyCodeEditor
                  initialCode={code}
                  onCodeChange={(newCode) => setCode(newCode)}
                  tests={data.tests.map(t => ({
                    name: t.name ?? '',
                    input: t.input,
                    expected: t.expected,
                    points: t.points ?? 0
                  }))}
                /></Suspense>
            </div>
          </section>

          {/* Enhanced controls with beautiful HeroIcons */}
          <section className="flex flex-wrap gap-3 items-center">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 font-semibold rounded-lg hover:from-slate-200 hover:to-slate-300 transition-all duration-200 shadow-sm hover:shadow-md border border-slate-300"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Resetear a código inicial
            </button>
            <button
              onClick={openPythonTutor}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-lg shadow-sm hover:from-teal-600 hover:to-cyan-700 transition-all duration-200 hover:shadow-md"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
              Visualizar con Python Tutor
            </button>
          </section>
        </div>

        <aside className="md:col-span-1 space-y-6">
          {/* Beautiful Status General */}
          {currentAttempt && !isLoading && (
            <div className={`p-6 rounded-xl shadow-lg backdrop-blur-sm border-2 transition-all duration-300 ${
              isExerciseCompleted
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-green-100'
                : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300 shadow-red-100'
            }`}>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                {isExerciseCompleted ? (
                  <>
                    <IconCheck className="h-6 w-6 text-green-600" />
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ¡Completado!
                    </span>
                  </>
                ) : (
                  <>
                    <IconX className="h-6 w-6 text-red-600" />
                    <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                      Intento Fallido
                    </span>
                  </>
                )}
              </h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center justify-between">
                  <span className="text-slate-600">Tests:</span>
                  <span className={`font-semibold px-2 py-1 rounded-full text-xs ${
                    currentAttempt.testsPassedCount === currentAttempt.totalTests
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {currentAttempt.testsPassedCount}/{currentAttempt.totalTests} OK
                  </span>
                </p>
                {currentAttempt.staticCheckRunResults && currentAttempt.staticCheckRunResults.length > 0 && (
                  <p className="flex items-center justify-between">
                    <span className="text-slate-600">Comprobaciones:</span>
                    <span className={`font-semibold px-2 py-1 rounded-full text-xs ${
                      currentAttempt.staticChecksPassedCount === currentAttempt.totalStaticChecks
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {currentAttempt.staticChecksPassedCount}/{currentAttempt.totalStaticChecks} OK
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Beautiful Loading Indicator */}
          {(isLoading && !currentAttempt) && (
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <IconInfo className="h-6 w-6 text-blue-600 animate-pulse" />
                <div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {isPyodideReady ? 'Evaluando tu código...' : 'Preparando entorno Python...'}
                  </h3>
                  <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>      {/* Enhanced Intelligent Feedback Results Section */}
      {/* Removed EnhancedTestResultsPanel: was here, but file is missing */}
      {/*
      {currentAttempt && lastExecutionResult && !isLoading && (
        <section className="mt-8 pt-6 border-t border-slate-200">
          <EnhancedTestResultsPanel
            result={currentAttempt}
            exercise={data}
            userCode={code}
            executionResult={lastExecutionResult}
          />
        </section>
      )}
      */}
    </div>
  );
}
