'use client';

import React, { useState, useEffect } from 'react';
import LazyMonacoEditor from '@/components/LazyMonacoEditor';

export default function MonacoEditorTestPage() {
  const [code, setCode] = useState("# Escribe algo de código Python aquí\nprint('Hola Mundo!')\n\n# Este es un editor de prueba para verificar la carga de Monaco");
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startTime = performance.now();
    
    // Monitorear si Monaco se carga o no
    const checkInterval = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).monaco) {
        const endTime = performance.now();
        setLoadTime(endTime - startTime);
        setIsLoaded(true);
        clearInterval(checkInterval);
      }
    }, 100);
    
    // Timeout para considerar una carga fallida
    const timeout = setTimeout(() => {
      if (!isLoaded) {
        setError('Monaco no se cargó después de 15 segundos');
        clearInterval(checkInterval);
      }
    }, 15000);
    
    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, [isLoaded]);

  const handleEditorMount = (editor: any, monaco: any) => {
    setIsLoaded(true);
    if (loadTime === null) {
      setLoadTime(performance.now());
    }
    console.log('Monaco Editor montado correctamente');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Prueba de Editor Monaco</h1>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <h2 className="text-lg font-semibold mb-3">Estado de carga</h2>
        
        <div className="mb-2">
          <span className="font-medium mr-2">Estado:</span>
          {isLoaded ? (
            <span className="text-green-600 font-medium">Cargado</span>
          ) : error ? (
            <span className="text-red-600 font-medium">Error</span>
          ) : (
            <span className="text-yellow-600 font-medium">Cargando...</span>
          )}
        </div>
        
        {loadTime && (
          <div className="mb-2">
            <span className="font-medium mr-2">Tiempo de carga:</span>
            <span>{Math.round(loadTime)}ms</span>
          </div>
        )}
        
        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>
      
      <div className="h-[400px] border rounded-lg overflow-hidden mb-6">
        <LazyMonacoEditor
          value={code}
          onChange={setCode}
          onMount={handleEditorMount}
          height="100%"
          language="python"
          theme="vs-dark"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-2">Información del sistema</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <div>
              <span className="font-medium">Navegador:</span> {typeof navigator !== 'undefined' ? navigator.userAgent.split(' ').slice(-2).join(' ') : 'No disponible'}
            </div>
            <div>
              <span className="font-medium">Dispositivo:</span> {typeof window !== 'undefined' ? (window.innerWidth < 768 ? 'Móvil' : 'Escritorio') : 'No disponible'}
            </div>
            <div>
              <span className="font-medium">Pantalla:</span> {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'No disponible'}
            </div>
            <div>
              <span className="font-medium">Monaco cargado:</span> {typeof window !== 'undefined' && (window as any).monaco ? 'Sí' : 'No'}
            </div>
          </div>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-2">Depuración</h3>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Recargar página
            </button>
            
            <button 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  import('@/utils/loadMonaco').then(({ loadMonacoManually }) => {
                    loadMonacoManually().then(success => {
                      alert(success ? 'Monaco cargado manualmente con éxito' : 'Falló la carga manual de Monaco');
                    });
                  });
                }
              }}
              className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              Cargar Monaco manualmente
            </button>
            
            <button 
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                alert('Cache del navegador limpiado');
              }}
              className="w-full px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
            >
              Limpiar cache local
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
