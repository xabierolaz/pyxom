'use client';

import React, { useState, useEffect } from 'react';

// Declare global Monaco type
declare global {
  interface Window {
    monaco?: any;
  }
}

interface TestResult {
  method: 'original' | 'optimized';
  time: number;
  success: boolean;
  error?: string;
  timestamp: string;
}

export default function MonacoBenchmark() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setResults([]);
  };

  // Test original method (direct import)
  const testOriginalMethod = async (): Promise<TestResult> => {
    setCurrentTest('Testing original method...');
    const startTime = performance.now();
    
    try {
      // Clear Monaco if it exists
      if (window.monaco) {
        delete window.monaco;
      }
      
      // Simulate original method - direct import
      const monacoReact = await import('@monaco-editor/react');
      
      // Wait for Monaco to be available
      await new Promise((resolve, reject) => {
        const checkMonaco = () => {
          if (window.monaco) {
            resolve(window.monaco);
          } else {
            setTimeout(checkMonaco, 100);
          }
        };
        checkMonaco();
        
        // Timeout after 15 seconds (original timeout)
        setTimeout(() => reject(new Error('Timeout after 15 seconds')), 15000);
      });
      
      const endTime = performance.now();
      const loadTime = Math.round(endTime - startTime);
      
      return {
        method: 'original',
        time: loadTime,
        success: true,
        timestamp: new Date().toLocaleTimeString()
      };
    } catch (error) {
      const endTime = performance.now();
      const loadTime = Math.round(endTime - startTime);
      
      return {
        method: 'original',
        time: loadTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toLocaleTimeString()
      };
    }
  };

  // Test optimized method (with CDN fallbacks)
  const testOptimizedMethod = async (): Promise<TestResult> => {
    setCurrentTest('Testing optimized method...');
    const startTime = performance.now();
    
    try {
      // Clear Monaco if it exists
      if (window.monaco) {
        delete window.monaco;
      }
      
      // Use our optimized loading method
      const { loadMonacoWithFallback } = await import('@/utils/loadMonaco');
      await loadMonacoWithFallback();
      
      const endTime = performance.now();
      const loadTime = Math.round(endTime - startTime);
      
      return {
        method: 'optimized',
        time: loadTime,
        success: true,
        timestamp: new Date().toLocaleTimeString()
      };
    } catch (error) {
      const endTime = performance.now();
      const loadTime = Math.round(endTime - startTime);
      
      return {
        method: 'optimized',
        time: loadTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toLocaleTimeString()
      };
    }
  };

  const runBenchmark = async () => {
    setIsRunning(true);
    setCurrentTest('Starting benchmark...');
    
    try {
      // Test original method
      const originalResult = await testOriginalMethod();
      addResult(originalResult);
      
      // Wait a bit between tests
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Test optimized method
      const optimizedResult = await testOptimizedMethod();
      addResult(optimizedResult);
      
    } catch (error) {
      console.error('Benchmark error:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const getAverages = () => {
    const originalResults = results.filter(r => r.method === 'original' && r.success);
    const optimizedResults = results.filter(r => r.method === 'optimized' && r.success);
    
    const originalAvg = originalResults.length > 0 
      ? originalResults.reduce((sum, r) => sum + r.time, 0) / originalResults.length 
      : 0;
    
    const optimizedAvg = optimizedResults.length > 0 
      ? optimizedResults.reduce((sum, r) => sum + r.time, 0) / optimizedResults.length 
      : 0;
    
    return { originalAvg, optimizedAvg };
  };

  const { originalAvg, optimizedAvg } = getAverages();
  const improvement = originalAvg > 0 && optimizedAvg > 0 ? originalAvg - optimizedAvg : 0;
  const improvementPercent = originalAvg > 0 ? Math.round((improvement / originalAvg) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Monaco Editor - Benchmark Real</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Comparación de Rendimiento</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="font-semibold mb-2">Método Original</h3>
              <p className="text-sm text-gray-300">Importación directa de @monaco-editor/react</p>
              <p className="text-sm text-gray-300">Timeout: 15 segundos</p>
              <p className="text-sm text-gray-300">Sin fallbacks de CDN</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="font-semibold mb-2">Método Optimizado</h3>
              <p className="text-sm text-gray-300">CDN fallbacks múltiples</p>
              <p className="text-sm text-gray-300">Timeout: 3 segundos por CDN</p>
              <p className="text-sm text-gray-300">Preload hints + Service Worker</p>
            </div>
          </div>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={runBenchmark}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-2 rounded"
            >
              {isRunning ? 'Ejecutando...' : 'Ejecutar Benchmark'}
            </button>
            
            <button
              onClick={clearResults}
              disabled={isRunning}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 px-6 py-2 rounded"
            >
              Limpiar Resultados
            </button>
          </div>
          
          {currentTest && (
            <div className="bg-yellow-600 p-3 rounded mb-4">
              <p className="font-semibold">{currentTest}</p>
            </div>
          )}
        </div>

        {/* Results Summary */}
        {results.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Resumen de Resultados</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-700 p-4 rounded">
                <h3 className="font-semibold mb-2">Método Original</h3>
                <p className="text-2xl font-bold text-blue-400">
                  {originalAvg > 0 ? `${Math.round(originalAvg)}ms` : 'N/A'}
                </p>
                <p className="text-sm text-gray-300">Promedio</p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded">
                <h3 className="font-semibold mb-2">Método Optimizado</h3>
                <p className="text-2xl font-bold text-green-400">
                  {optimizedAvg > 0 ? `${Math.round(optimizedAvg)}ms` : 'N/A'}
                </p>
                <p className="text-sm text-gray-300">Promedio</p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded">
                <h3 className="font-semibold mb-2">Mejora</h3>
                <p className={`text-2xl font-bold ${improvement > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {improvement > 0 ? `${Math.round(improvement)}ms` : 'N/A'}
                </p>
                <p className="text-sm text-gray-300">
                  {improvementPercent > 0 ? `${improvementPercent}% más rápido` : 'Sin mejora'}
                </p>
              </div>
            </div>
            
            {improvement > 0 && (
              <div className="bg-green-800 p-4 rounded">
                <h3 className="font-semibold mb-2">🎉 Mejora Confirmada</h3>
                <p>El método optimizado es <strong>{Math.round(improvement)}ms</strong> más rápido ({improvementPercent}% de mejora)</p>
              </div>
            )}
            
            {improvement <= 0 && originalAvg > 0 && optimizedAvg > 0 && (
              <div className="bg-red-800 p-4 rounded">
                <h3 className="font-semibold mb-2">⚠️ Sin Mejora Significativa</h3>
                <p>Los resultados no muestran una mejora clara en el rendimiento</p>
              </div>
            )}
          </div>
        )}

        {/* Detailed Results */}
        {results.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Resultados Detallados</h2>
            
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={index} className={`p-3 rounded ${result.success ? 'bg-gray-700' : 'bg-red-800'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold">
                        {result.method === 'original' ? 'Original' : 'Optimizado'}
                      </span>
                      <span className="ml-2 text-sm text-gray-300">
                        {result.timestamp}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      {result.success ? (
                        <span className="text-green-400 font-bold">
                          {result.time}ms
                        </span>
                      ) : (
                        <span className="text-red-400 font-bold">
                          Error: {result.error}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
