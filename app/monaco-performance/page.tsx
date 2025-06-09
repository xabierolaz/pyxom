'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Declare global Monaco type
declare global {
  interface Window {
    monaco?: any;
  }
}

// Test Monaco loading with original method vs optimized method
const OriginalMonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div>Cargando editor original...</div>
});

export default function MonacoPerformanceTest() {
  const [originalLoadTime, setOriginalLoadTime] = useState<number | null>(null);
  const [optimizedLoadTime, setOptimizedLoadTime] = useState<number | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [currentTest, setCurrentTest] = useState<'none' | 'original' | 'optimized'>('none');

  const addResult = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [...prev, `${timestamp}: ${message}`]);
  };

  const testOriginalLoading = () => {
    setCurrentTest('original');
    setOriginalLoadTime(null);
    addResult('🧪 Iniciando test de carga ORIGINAL (sin optimizaciones)');
    
    const startTime = performance.now();
    
    // Simulate original loading method
    const originalTest = document.createElement('div');
    originalTest.id = 'original-test';
    document.body.appendChild(originalTest);
    
    import('@monaco-editor/react').then(() => {
      const endTime = performance.now();
      const loadTime = Math.round(endTime - startTime);
      setOriginalLoadTime(loadTime);
      addResult(`✅ Editor ORIGINAL cargado en ${loadTime}ms`);
      setCurrentTest('none');
      document.body.removeChild(originalTest);
    }).catch(err => {
      addResult(`❌ Error en carga original: ${err.message}`);
      setCurrentTest('none');
    });
  };
  const testOptimizedLoading = async () => {
    setCurrentTest('optimized');
    setOptimizedLoadTime(null);
    addResult('🚀 Iniciando test de carga OPTIMIZADA (con mejoras)');
    
    const startTime = performance.now();
    
    try {
      // Clear any previous Monaco instances
      if (window.monaco) {
        delete window.monaco;
      }
      
      // Test our optimized loading utility with multiple CDNs
      const { loadMonacoWithFallback } = await import('@/utils/loadMonaco');
      await loadMonacoWithFallback();
      
      // Verify Monaco is actually loaded
      if (window.monaco) {
        const endTime = performance.now();
        const loadTime = Math.round(endTime - startTime);
        setOptimizedLoadTime(loadTime);
        addResult(`✅ Editor OPTIMIZADO cargado en ${loadTime}ms (con CDN fallbacks)`);
        addResult(`📊 Monaco version: ${window.monaco.editor.VERSION || 'unknown'}`);
      } else {
        throw new Error('Monaco no se cargó correctamente');
      }
      
      setCurrentTest('none');
    } catch (err) {
      addResult(`❌ Error en carga optimizada: ${err}`);
      setCurrentTest('none');
    }
  };

  const clearResults = () => {
    setTestResults([]);
    setOriginalLoadTime(null);
    setOptimizedLoadTime(null);
  };

  const getPerformanceComparison = () => {
    if (originalLoadTime && optimizedLoadTime) {
      const improvement = originalLoadTime - optimizedLoadTime;
      const percentage = Math.round((improvement / originalLoadTime) * 100);
      return {
        improvement,
        percentage,
        faster: improvement > 0
      };
    }
    return null;
  };

  const comparison = getPerformanceComparison();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Monaco Editor - Test de Rendimiento Real</h1>
        
        {/* Performance Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">📊 Método Original</h2>
            <div className="text-3xl font-bold mb-2">
              {originalLoadTime ? `${originalLoadTime}ms` : '---'}
            </div>
            <div className="text-gray-400">Tiempo de carga sin optimizaciones</div>
            <button
              onClick={testOriginalLoading}
              disabled={currentTest === 'original'}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-white w-full"
            >
              {currentTest === 'original' ? 'Probando...' : 'Probar Carga Original'}
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">🚀 Método Optimizado</h2>
            <div className="text-3xl font-bold mb-2">
              {optimizedLoadTime ? `${optimizedLoadTime}ms` : '---'}
            </div>
            <div className="text-gray-400">Tiempo de carga con optimizaciones</div>
            <button
              onClick={testOptimizedLoading}
              disabled={currentTest === 'optimized'}
              className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded text-white w-full"
            >
              {currentTest === 'optimized' ? 'Probando...' : 'Probar Carga Optimizada'}
            </button>
          </div>
        </div>

        {/* Comparison Results */}
        {comparison && (
          <div className={`bg-gray-800 rounded-lg p-6 mb-8 border-2 ${
            comparison.faster ? 'border-green-500' : 'border-red-500'
          }`}>
            <h2 className="text-xl font-semibold mb-4">📈 Comparación de Rendimiento</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {comparison.faster ? '✅' : '❌'}
                </div>
                <div className="text-sm text-gray-400">
                  {comparison.faster ? 'Mejora confirmada' : 'Sin mejora'}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  comparison.faster ? 'text-green-400' : 'text-red-400'
                }`}>
                  {comparison.faster ? '-' : '+'}{Math.abs(comparison.improvement)}ms
                </div>
                <div className="text-sm text-gray-400">Diferencia de tiempo</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  comparison.faster ? 'text-green-400' : 'text-red-400'
                }`}>
                  {comparison.percentage}%
                </div>
                <div className="text-sm text-gray-400">
                  {comparison.faster ? 'Más rápido' : 'Más lento'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Network and System Info */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">🌐 Información del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Conexión:</strong><br />
              <span className="text-gray-300">
                {(navigator as any).connection?.effectiveType || 'Desconocida'} 
                {(navigator as any).connection?.downlink && 
                  ` (${(navigator as any).connection.downlink} Mbps)`}
              </span>
            </div>
            <div>
              <strong>Cache:</strong><br />
              <span className="text-gray-300">
                {typeof window !== 'undefined' && 'caches' in window ? 'Disponible' : 'No disponible'}
              </span>
            </div>
            <div>
              <strong>Service Worker:</strong><br />
              <span className="text-gray-300">
                {'serviceWorker' in navigator ? 'Activo' : 'No disponible'}
              </span>
            </div>
            <div>
              <strong>Monaco Precargado:</strong><br />
              <span className="text-gray-300">
                {typeof window !== 'undefined' && (window as any).monaco ? 'Sí' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Test Log */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">📝 Log de Pruebas</h2>
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
            >
              Limpiar
            </button>
          </div>
          <div className="bg-black rounded p-4 h-64 overflow-y-auto font-mono text-sm">
            {testResults.length === 0 ? (
              <div className="text-gray-500">No hay resultados de pruebas disponibles</div>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Test Instructions */}
        <div className="mt-8 bg-blue-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">📋 Instrucciones de Prueba</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Primero ejecuta "Probar Carga Original" para establecer una línea base</li>
            <li>Luego ejecuta "Probar Carga Optimizada" para ver las mejoras</li>
            <li>Compara los tiempos para ver si las optimizaciones realmente funcionan</li>
            <li>Repite las pruebas varias veces para obtener resultados consistentes</li>
            <li>Ten en cuenta que la primera carga puede ser más lenta debido al cache</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
