'use client';

import React, { useState } from 'react';

declare global {
  interface Window {
    monaco?: any;
  }
}

export default function QuickMonacoTest() {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testOriginal = async () => {
    setIsLoading(true);
    setResult('🧪 Testing ORIGINAL method (15s timeout)...');
    
    const startTime = performance.now();
    
    try {
      // Clear Monaco
      if (window.monaco) delete window.monaco;
      
      // Simulate original method with long timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout after 15 seconds')), 15000);
      });
      
      const loadPromise = import('@monaco-editor/react').then(() => {
        return new Promise((resolve) => {
          const checkMonaco = () => {
            if (window.monaco) resolve(window.monaco);
            else setTimeout(checkMonaco, 100);
          };
          checkMonaco();
        });
      });
      
      await Promise.race([loadPromise, timeoutPromise]);
      
      const endTime = performance.now();
      const time = Math.round(endTime - startTime);
      setResult(`✅ Original method: ${time}ms`);
      
    } catch (error) {
      const endTime = performance.now();
      const time = Math.round(endTime - startTime);
      setResult(`❌ Original method failed after ${time}ms: ${error}`);
    }
    
    setIsLoading(false);
  };

  const testOptimized = async () => {
    setIsLoading(true);
    setResult('🚀 Testing OPTIMIZED method (CDN fallbacks)...');
    
    const startTime = performance.now();
    
    try {
      // Clear Monaco
      if (window.monaco) delete window.monaco;
      
      // Use optimized method
      const { loadMonacoWithFallback } = await import('@/utils/loadMonaco');
      await loadMonacoWithFallback();
      
      const endTime = performance.now();
      const time = Math.round(endTime - startTime);
      setResult(`✅ Optimized method: ${time}ms`);
      
    } catch (error) {
      const endTime = performance.now();
      const time = Math.round(endTime - startTime);
      setResult(`❌ Optimized method failed after ${time}ms: ${error}`);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Monaco Loading Test - Quick Demo</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">¿Mejora real o solo diagnóstico?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-red-900 p-4 rounded">
              <h3 className="font-bold mb-2">❌ ANTES (Original)</h3>
              <ul className="text-sm space-y-1">
                <li>• Un solo CDN</li>
                <li>• 15 segundos timeout</li>
                <li>• Sin fallbacks</li>
                <li>• Sin caché</li>
              </ul>
            </div>
            
            <div className="bg-green-900 p-4 rounded">
              <h3 className="font-bold mb-2">✅ AHORA (Optimizado)</h3>
              <ul className="text-sm space-y-1">
                <li>• 3 CDNs fallback</li>
                <li>• 3s por CDN (9s max)</li>
                <li>• Recuperación automática</li>
                <li>• Service Worker caché</li>
              </ul>
            </div>
          </div>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={testOriginal}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-6 py-3 rounded font-semibold"
            >
              Test Método Original
            </button>
            
            <button
              onClick={testOptimized}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-3 rounded font-semibold"
            >
              Test Método Optimizado
            </button>
          </div>
          
          {result && (
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="font-semibold mb-2">Resultado:</h3>
              <p className="font-mono text-sm">{result}</p>
            </div>
          )}
          
          {isLoading && (
            <div className="bg-yellow-600 p-4 rounded">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-3"></div>
                <span>Cargando Monaco Editor...</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-blue-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">💡 Instrucciones</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li><strong>Limpia la caché</strong> del navegador (Ctrl+Shift+R)</li>
            <li><strong>Prueba el método original</strong> - verás el timeout de 15s</li>
            <li><strong>Prueba el método optimizado</strong> - debería ser mucho más rápido</li>
            <li><strong>Refresca y prueba de nuevo</strong> - el caché hace la diferencia</li>
          </ol>
          
          <div className="mt-4 p-3 bg-blue-800 rounded">
            <p className="text-sm">
              <strong>Tip:</strong> Para simular conexión lenta, abre DevTools (F12) → Network → selecciona "Fast 3G"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
