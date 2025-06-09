'use client';

import React, { useState, useEffect } from 'react';
import { getPyodideInstance } from '@/utils/pythonRunner';

const PyodideLoader: React.FC = () => {
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    progress: 0,
    stage: '',
    error: null as string | null
  });

  useEffect(() => {
    // Start preloading Pyodide when component mounts
    const preloadPyodide = async () => {
      setLoadingState({
        isLoading: true,
        progress: 0,
        stage: 'Inicializando entorno Python...',
        error: null
      });

      try {
        // Set a timeout to detect if loading is taking too long
        const timeout = setTimeout(() => {
          setLoadingState(prev => ({
            ...prev,
            stage: prev.stage + ' (Carga lenta detectada - Verificando conexión...)'
          }));
        }, 15000); // 15 seconds timeout
        
        await getPyodideInstance((progress) => {
          let stage = 'Cargando Pyodide...';
          if (progress < 30) stage = 'Descargando recursos...';
          else if (progress < 70) stage = 'Inicializando entorno...';
          else if (progress < 90) stage = 'Instalando paquetes...';
          else stage = 'Finalizando configuración...';

          setLoadingState(prev => ({
            ...prev,
            progress,
            stage
          }));
        });
        
        // Clear timeout since loading completed
        clearTimeout(timeout);

        setLoadingState(prev => ({
          ...prev,
          isLoading: false,
          progress: 100,
          stage: 'Entorno Python listo'
        }));

        // Hide loader after 2 seconds
        setTimeout(() => {
          setLoadingState(prev => ({ ...prev, isLoading: false }));
        }, 2000);      } catch (error) {
        console.error('PyodideLoader error:', error);
        setLoadingState(prev => ({
          ...prev,
          isLoading: false,
          error: `Error cargando Python: ${error}`
        }));
      }
    };

    // Start preloading after a short delay to avoid blocking initial render
    const timer = setTimeout(preloadPyodide, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!loadingState.isLoading && !loadingState.error) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="text-6xl mb-4">🐍</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Preparando PyXom
          </h3>
          
          {loadingState.error ? (
            <div className="text-red-600 text-sm">
              {loadingState.error}
              <button
                onClick={() => window.location.reload()}
                className="block mx-auto mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 text-sm mb-4">
                {loadingState.stage}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${loadingState.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">
                {Math.round(loadingState.progress)}% completado
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PyodideLoader;
