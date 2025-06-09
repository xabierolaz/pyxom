'use client';

import React, { useState, useEffect } from 'react';
import { loadMonacoManually, prefetchMonacoResources } from '../../utils/loadMonaco';

export default function MonacoDebugPage() {
  const [monacoStatus, setMonacoStatus] = useState<'loading' | 'loaded' | 'error' | 'not-loaded'>('not-loaded');
  const [loadTime, setLoadTime] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  useEffect(() => {
    // Check if Monaco is already loaded
    if (typeof window !== 'undefined' && (window as any).monaco) {
      setMonacoStatus('loaded');
      addDebugInfo('Monaco ya está cargado');
    } else {
      addDebugInfo('Monaco no está cargado');
    }

    // Listen for Monaco events
    const handleMonacoLoaded = () => {
      setMonacoStatus('loaded');
      addDebugInfo('Monaco cargado exitosamente');
    };

    const handleMonacoError = () => {
      setMonacoStatus('error');
      addDebugInfo('Error al cargar Monaco');
    };

    window.addEventListener('monaco-loaded', handleMonacoLoaded);
    window.addEventListener('monaco-load-error', handleMonacoError);

    return () => {
      window.removeEventListener('monaco-loaded', handleMonacoLoaded);
      window.removeEventListener('monaco-load-error', handleMonacoError);
    };
  }, []);

  const handleManualLoad = async () => {
    setMonacoStatus('loading');
    setLoadTime(0);
    addDebugInfo('Iniciando carga manual de Monaco...');
    
    const startTime = Date.now();
    const timer = setInterval(() => {
      setLoadTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    try {
      const success = await loadMonacoManually();
      clearInterval(timer);
      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      
      if (success) {
        setMonacoStatus('loaded');
        addDebugInfo(`Monaco cargado exitosamente en ${totalTime} segundos`);
      } else {
        setMonacoStatus('error');
        addDebugInfo(`Error al cargar Monaco después de ${totalTime} segundos`);
      }
    } catch (error) {
      clearInterval(timer);
      setMonacoStatus('error');
      addDebugInfo(`Error en carga manual: ${error}`);
    }
  };

  const getStatusColor = () => {
    switch (monacoStatus) {
      case 'loaded': return 'text-green-400';
      case 'loading': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (monacoStatus) {
      case 'loaded': return 'Cargado ✅';
      case 'loading': return `Cargando... (${loadTime}s)`;
      case 'error': return 'Error ❌';
      default: return 'No cargado';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Monaco Editor - Diagnóstico Rápido</h1>
        
        {/* Status Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Estado de Monaco</h2>
          <div className={`text-lg ${getStatusColor()}`}>
            Estado: {getStatusText()}
          </div>
          {monacoStatus === 'loaded' && (
            <div className="text-green-400 mt-2">
              Monaco está disponible y listo para usar
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Solución Rápida</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleManualLoad}
              disabled={monacoStatus === 'loading'}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-white font-semibold"
            >
              🔧 Cargar Monaco Manualmente
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded text-white font-semibold"
            >
              🔄 Recargar Página
            </button>
          </div>
          
          {monacoStatus === 'loading' && (
            <div className="mt-4 p-4 bg-yellow-900 rounded border border-yellow-600">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400 mr-3"></div>
                <span>Cargando Monaco... Por favor espera ({loadTime}s)</span>
              </div>
            </div>
          )}
          
          {monacoStatus === 'error' && (
            <div className="mt-4 p-4 bg-red-900 rounded border border-red-600">
              <strong>❌ Error de carga</strong>
              <p className="mt-2">Monaco no se pudo cargar. Posibles soluciones:</p>
              <ul className="mt-2 ml-4 list-disc">
                <li>Verificar conexión a internet</li>
                <li>Recargar la página</li>
                <li>Probar en modo incógnito</li>
                <li>Deshabilitar extensiones del navegador</li>
              </ul>
            </div>
          )}
          
          {monacoStatus === 'loaded' && (
            <div className="mt-4 p-4 bg-green-900 rounded border border-green-600">
              <strong>✅ ¡Listo!</strong>
              <p className="mt-2">Monaco se cargó exitosamente. Ahora puedes usar el editor.</p>
              <a 
                href="/monaco-test/editor" 
                className="inline-block mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
              >
                Probar Editor →
              </a>
            </div>
          )}
        </div>

        {/* Debug Log */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Log de Actividad</h2>
          <div className="bg-black rounded p-4 h-48 overflow-y-auto font-mono text-sm">
            {debugInfo.length === 0 ? (
              <div className="text-gray-500">No hay actividad registrada</div>
            ) : (
              debugInfo.map((info, index) => (
                <div key={index} className="mb-1">
                  {info}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}