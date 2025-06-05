// pyxom/components/IntroPythonXom.tsx
'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { runPythonTests, getPyodideInstance, type TestResult, type StaticCheckResult } from '@/utils/pythonRunner';
import type { PyodideInterface } from 'pyodide';
import type { 
  ExerciseData, 
  AttemptResult, 
  SingleTestRunResult, 
  StaticCheckRunResult
} from '@/types/types'; // Ajusta la ruta si es necesario

// --- Carga dinámica para Componentes Pesados ---
// Añadimos un componente de carga simple para Suspense
const LoadingPlaceholder = ({ message }: { message: string }) => (
  <div className="p-4 text-center text-gray-500">{message}</div>
);

const Editor = dynamic(() => 
  import('@monaco-editor/react').then(mod => mod.default || mod), 
  { 
    ssr: false,
    loading: () => <LoadingPlaceholder message="Cargando editor..." />
  }
);




// --- Componentes de Iconos (puedes moverlos a un archivo separado utils/icons.tsx) ---
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1 text-green-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const IconX = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1 text-red-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const IconInfo = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1 text-blue-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;
const IconLightbulb = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1 text-yellow-600" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h-1V3a1 1 0 10-2 0v2H7a1 1 0 00-1 1v2h10V6a1 1 0 00-1-1h-1V3a1 1 0 10-2 0v2H9V3z" /><path fillRule="evenodd" d="M9 2a1 1 0 00-1 1v1H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2h-2V3a1 1 0 00-1-1H9zm2 12a1 1 0 10-2 0v1a1 1 0 102 0v-1z" clipRule="evenodd" /></svg>;
const IconWarning = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1 text-orange-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.216 3.031-1.742 3.031H4.42c-1.526 0-2.492-1.697-1.742-3.031l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm0-3.5a1 1 0 00-1 1v1.25a1 1 0 102 0V10.5a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;


export default function IntroPythonXom({ data }: { data?: ExerciseData }) {
  if (!data) {
    return <div className="p-4 text-red-600">Error: Datos del ejercicio no cargados.</div>;
  }

  // Simplified state management - reduced from 9 useState hooks to 4
  const [code, setCode] = useState<string>(data.starterCode ?? '');
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

  const isExerciseCompleted = useMemo(() => currentAttempt?.overallPassed || false, [currentAttempt]);
  const handleSubmit = async () => {
    if (!isPyodideReady) {
        alert("El entorno de Python aún no está listo. Por favor, espera un momento e inténtalo de nuevo.");
        return;
    }
    setIsLoading(true);
    setCurrentAttempt(null);
    
    const executionResult = await runPythonTests(code, data.tests.map(test => `assert ${test.input} == ${test.expected}, "Test failed for ${test.name || 'unnamed test'}"`));
    
    // Transform ExecutionResult to AttemptResult
    const newAttempt: AttemptResult = {
      timestamp: Date.now(),
      overallPassed: executionResult.testRunResults.every(tr => tr.passed),
      testRunResults: executionResult.testRunResults.map((tr, index) => ({
        testCase: data.tests[index] || { input: '', expected: '' },
        isSuccessExecution: tr.passed,
        actualOutput: tr.output || '',
        normalizedActualOutput: tr.output?.trim() || '',
        passed: tr.passed,
        durationMs: 0,
        error: tr.error,
        pointsEarned: tr.pointsEarned
      })),
      staticCheckRunResults: executionResult.staticCheckRunResults?.map(scr => ({
        check: { id: '', description: '', checkFunction: async () => false },
        passed: scr.passed,
        message: scr.feedback,
        error: undefined,
        pointsEarned: scr.pointsEarned
      })),
      totalTests: executionResult.testRunResults.length,
      testsPassedCount: executionResult.testRunResults.filter(tr => tr.passed).length,
      totalStaticChecks: executionResult.staticCheckRunResults?.length || 0,
      staticChecksPassedCount: executionResult.staticCheckRunResults?.filter(scr => scr.passed).length || 0,
      durationMs: 0,
      totalPointsEarned: 0,
      maxPossiblePoints: data.maxPoints || 0
    };
    
    let points = 0;
    newAttempt.testRunResults.forEach((tr: SingleTestRunResult) => points += tr.pointsEarned || 0);
    newAttempt.staticCheckRunResults?.forEach((scr: StaticCheckRunResult) => points += scr.pointsEarned || 0);
    newAttempt.totalPointsEarned = points;
    
    setCurrentAttempt(newAttempt);
    setIsLoading(false);
  };

  const handleReset = () => { 
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
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 font-sans antialiased text-gray-800">
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 sm:mb-0">{data.title}</h1>
          {/* Indicador de Puntos (si se usan) */}
          {data.maxPoints && data.maxPoints > 0 && currentAttempt && (
            <span className="px-3 py-1.5 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-full">
              Puntos: {currentAttempt.totalPointsEarned || 0} / {data.maxPoints}
            </span>
          )}
        </div>
        {/* Usar dangerouslySetInnerHTML con precaución. Asegúrate de que data.description es seguro. */}
        <div className="text-slate-600 text-base md:text-lg leading-relaxed prose" dangerouslySetInnerHTML={{ __html: data.description }} />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-slate-700 mb-2">Tu Código:</h2>
            <div className="rounded-lg overflow-hidden shadow-lg border border-slate-300">
              <Suspense fallback={<LoadingPlaceholder message="Cargando editor..." />}>
                <Editor
                  height="450px" defaultLanguage="python" value={code}
                  onChange={(val) => setCode(val ?? '')} theme="vs-dark"
                  options={{ fontSize: 15, minimap: { enabled: false }, scrollBeyondLastLine: false, automaticLayout: true, wordWrap: 'on', padding: { top: 12, bottom: 12 } }}
                />
              </Suspense>
            </div>
          </section>

          <section className="flex flex-wrap gap-3 items-center">
            <button onClick={handleSubmit} disabled={isLoading || !isPyodideReady}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition ease-in-out duration-150 disabled:opacity-60 disabled:cursor-not-allowed">
              {isLoading ? 'Evaluando...' : (isPyodideReady ? 'Ejecutar y Comprobar' : 'Entorno Preparándose...')}
            </button>
            <button onClick={handleReset} className="px-5 py-2.5 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors">Resetear</button>
            <button onClick={openPythonTutor} className="px-5 py-2.5 bg-teal-500 text-white font-semibold rounded-lg shadow-sm hover:bg-teal-600 transition-colors">Visualizar</button>
          </section>
        </div>        <aside className="md:col-span-1 space-y-6">
          {/* Estado General */}
          {currentAttempt && !isLoading && (
            <div className={`p-4 rounded-lg shadow ${isExerciseCompleted ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'} border-l-4`}>
              <h3 className="text-lg font-semibold flex items-center">
                {isExerciseCompleted ? <><IconCheck />¡Completado!</> : <><IconX />Intento Fallido</>}
              </h3>
              <p className="text-sm mt-1">
                Tests: {currentAttempt.testsPassedCount}/{currentAttempt.totalTests} OK.
                {currentAttempt.staticCheckRunResults && currentAttempt.staticCheckRunResults.length > 0 && 
                 ` Comprobaciones: ${currentAttempt.staticChecksPassedCount}/${currentAttempt.totalStaticChecks} OK.`}
              </p>
            </div>
          )}
          {(isLoading && !currentAttempt) && <div className="p-4 rounded-lg bg-blue-100 border-blue-500 border-l-4 text-blue-700"><IconInfo />{isPyodideReady ? 'Evaluando tu código...' : 'Preparando entorno Python...'}</div>}
        </aside>
      </div>

      {/* Resultados Detallados del Intento (Colapsable) */}
      {currentAttempt && !isLoading && (
        <section className="mt-8 pt-6 border-t border-slate-200">
          <details open={!currentAttempt.overallPassed && currentAttempt.testRunResults.length > 0} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <summary className="text-xl font-semibold text-slate-700 cursor-pointer hover:text-slate-900 list-none flex justify-between items-center">
              Análisis Detallado del Último Intento
              <span className="text-sm transition-transform duration-200 transform group-open:rotate-180">▼</span>
            </summary>
            <div className="mt-4 space-y-4">
              {currentAttempt.testRunResults.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-slate-600 mb-2 border-b pb-1">Resultados de Tests Unitarios:</h4>
                  {currentAttempt.testRunResults.map((res, index) => (
                    <div key={index} className={`p-3 mb-2 border-l-4 rounded-md text-sm ${ res.passed ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50' }`}>
                      <div className="flex justify-between items-center font-medium">
                        <span>Test {res.testCase.name || index + 1}{res.testCase.hidden ? " (Oculto)" : ` (Input: "${res.testCase.input || 'Vacío'}")`}:</span>
                        <span className={res.passed ? 'text-green-700' : 'text-red-700'}>{res.passed ? <IconCheck /> : <IconX />}{res.passed ? 'APROBADO' : 'FALLIDO'}</span>
                      </div>
                      <p className="text-xs text-slate-500">Duración: {res.durationMs.toFixed(0)} ms. {res.testCase.points ? `Puntos: ${res.pointsEarned}/${res.testCase.points}` : ''}</p>
                      {!res.isSuccessExecution && res.error && (
                        <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded">
                          <p className="font-semibold text-red-700">Error de Ejecución:</p>
                          <pre className="whitespace-pre-wrap text-xs text-red-600">{res.error}</pre>
                        </div>                      )}
                      {res.isSuccessExecution && !res.passed && !res.testCase.hidden && (
                        <div className="mt-2">
                          <p className="font-medium text-slate-700 mb-1">Comparación de Salida:</p>
                          <div className="text-xs border rounded-md overflow-hidden bg-gray-50 p-2">
                            <div className="mb-2">
                              <span className="font-semibold text-green-700">Esperado:</span>
                              <pre className="whitespace-pre-wrap bg-green-50 p-1 rounded mt-1">{res.testCase.expected}</pre>
                            </div>
                            <div>
                              <span className="font-semibold text-red-700">Recibido:</span>
                              <pre className="whitespace-pre-wrap bg-red-50 p-1 rounded mt-1">{res.normalizedActualOutput}</pre>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {currentAttempt.staticCheckRunResults && currentAttempt.staticCheckRunResults.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-slate-600 mb-2 border-b pb-1">Comprobaciones de Código:</h4>
                  {currentAttempt.staticCheckRunResults.map((res, index) => (
                    <div key={index} className={`p-3 mb-2 border-l-4 rounded-md text-sm ${ res.passed ? 'border-green-500 bg-green-50' : (res.error ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50') }`}>
                      <div className="flex justify-between items-center font-medium">
                        <span>{res.check.description}:</span>
                        <span className={res.passed ? 'text-green-700' : (res.error ? 'text-red-700' : 'text-yellow-700')}>
                          {res.passed ? <IconCheck /> : (res.error ? <IconX /> : <IconInfo />)}
                          {res.passed ? 'OK' : (res.error ? 'ERROR' : 'ATENCIÓN')}
                        </span>
                      </div>
                      {res.message && <p className="text-xs text-slate-700 mt-1">{res.message}</p>}
                      {res.error && <pre className="whitespace-pre-wrap text-xs text-red-600 mt-1 bg-red-100 p-1 rounded">{res.error}</pre>}
                      {res.check.points && <p className="text-xs text-slate-500 mt-1">Puntos: {res.pointsEarned}/{res.check.points}</p>}
                    </div>
                  ))}
                </div>
              )}            </div>
          </details>
        </section>
      )}
    </div>
  );
}