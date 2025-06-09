'use client';

import React, { useState, useEffect } from 'react';
import { loadMonacoManually, prefetchMonacoResources } from '@/utils/loadMonaco';

export default function MonacoLoadTest() {
  const [status, setStatus] = useState<{
    step: string;
    success: boolean | null;
    time: number;
    error?: string;
  }>({
    step: 'Iniciando diagnóstico...',
    success: null,
    time: 0
  });

  const [logs, setLogs] = useState<string[]>([]);

  // Función para añadir logs
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toISOString()}] ${message}`]);
  };

  useEffect(() => {
    const checkMonaco = async () => {
      const startTime = performance.now();
      
      try {
        // Verificar si Monaco ya está cargado
        if (typeof window !== 'undefined' && (window as any).monaco) {
          setStatus({
            step: 'Monaco ya está cargado en la ventana global',
            success: true,
            time: performance.now() - startTime
          });
          addLog('Monaco ya está disponible en window.monaco');
          return;
        }
        
        // Intentar precargar recursos
        addLog('Intentando precargar recursos de Monaco...');
        setStatus({
          step: 'Precargando recursos de Monaco...',
          success: null,
          time: performance.now() - startTime
        });
        
        prefetchMonacoResources();
        
        // Intentar carga manual
        addLog('Intentando carga manual de Monaco...');
        setStatus({
          step: 'Cargando Monaco manualmente...',
          success: null,
          time: performance.now() - startTime
        });
        
        const success = await loadMonacoManually();
        
        if (success) {
          addLog('Carga manual exitosa');
          setStatus({
            step: 'Carga manual completada con éxito',
            success: true,
            time: performance.now() - startTime
          });
        } else {
          addLog('Carga manual falló');
          setStatus({
            step: 'Carga manual falló',
            success: false,
            time: performance.now() - startTime,
            error: 'No se pudo cargar Monaco desde ningún CDN'
          });
        }
      } catch (error) {
        addLog(`Error: ${error}`);
        setStatus({
          step: 'Error durante la carga',
          success: false,
          time: performance.now() - startTime,
          error: String(error)
        });
      }
    };
    
    checkMonaco();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Prueba de Carga de Monaco Editor</h1>
      
      <div className="mb-8 p-4 rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">Estado de Carga</h2>
        <div className="flex items-center mb-2">
          <div className="mr-2 font-medium">Paso actual:</div>
          <div>{status.step}</div>
        </div>
        
        <div className="flex items-center mb-2">
          <div className="mr-2 font-medium">Estado:</div>
          <div>
            {status.success === null && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-sm">
                En progreso...
              </span>
            )}
            {status.success === true && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">
                Éxito
              </span>
            )}
            {status.success === false && (
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm">
                Error
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center mb-2">
          <div className="mr-2 font-medium">Tiempo:</div>
          <div>{Math.round(status.time)}ms</div>
        </div>
        
        {status.error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {status.error}
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Diagnóstico de Navegador</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Información del Navegador</h3>
            <div className="text-sm text-gray-700">
              <div>User Agent: {typeof navigator !== 'undefined' ? navigator.userAgent : 'No disponible'}</div>
              <div>Dispositivo Móvil: {typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'Sí' : 'No'}</div>
              <div>Soporte WebAssembly: {typeof WebAssembly !== 'undefined' ? 'Sí' : 'No'}</div>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Rendimiento</h3>
            <div className="text-sm text-gray-700">
              <div>Memoria: {typeof performance !== 'undefined' && (performance as any).memory ? `${Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)}MB / ${Math.round((performance as any).memory.jsHeapSizeLimit / 1024 / 1024)}MB` : 'No disponible'}</div>
              <div>Conexión: {typeof navigator !== 'undefined' && (navigator as any).connection ? (navigator as any).connection.effectiveType : 'No disponible'}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Logs</h2>
        <div className="p-4 bg-gray-900 text-gray-100 rounded-lg font-mono text-sm h-64 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="mb-1">{log}</div>
          ))}
          {logs.length === 0 && <div className="text-gray-500">Sin actividad registrada</div>}
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Reiniciar Prueba
        </button>
      </div>
    </div>
  );
}
