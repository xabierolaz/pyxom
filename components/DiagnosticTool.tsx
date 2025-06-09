'use client';

import React, { useState, useEffect } from 'react';

// Resource status checker utility
const DiagnosticTool: React.FC = () => {
  const [resourceStatus, setResourceStatus] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'general'|'network'|'memory'|'modules'>('general');
  const [userAgent, setUserAgent] = useState('');

  // Resources to check
  const resources = [
    { name: 'Monaco Editor CDN', url: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs/loader.js' },
    { name: 'Pyodide Main JS', url: 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js' },
    { name: 'Pyodide WASM', url: 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.asm.wasm' },
    { name: 'Pyodide Data', url: 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.asm.data' },
    { name: 'Fallback CDN', url: 'https://pyodide-cdn2.iodide.io/v0.27.5/full/pyodide.js' }
  ];

  // Check resource availability
  const checkResources = async () => {
    const results: Record<string, any> = {};

    for (const resource of resources) {
      try {
        const startTime = performance.now();
        const response = await fetch(resource.url, { method: 'HEAD', mode: 'no-cors' });
        const endTime = performance.now();
        results[resource.name] = { 
          available: true,
          latency: Math.round(endTime - startTime),
          size: response.headers.get('content-length') || 'unknown'
        };
      } catch (error) {
        results[resource.name] = { available: false, error: String(error) };
      }
    }

    // Check browser capabilities
    results['Browser Info'] = {
      supportsWasm: typeof WebAssembly !== 'undefined',
      localStorage: typeof localStorage !== 'undefined',
      serviceWorker: 'serviceWorker' in navigator,
      navigator: navigator.userAgent
    };

    // Check memory
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      results['Memory'] = {
        jsHeapSizeLimit: formatBytes((performance as any).memory?.jsHeapSizeLimit),
        totalJSHeapSize: formatBytes((performance as any).memory?.totalJSHeapSize),
        usedJSHeapSize: formatBytes((performance as any).memory?.usedJSHeapSize)
      };
    } else {
      results['Memory'] = { note: 'Memory API not available in this browser' };
    }
    
    // Check loaded modules
    results['Loaded Modules'] = {
      monaco: typeof (window as any).monaco !== 'undefined',
      pyodide: typeof (window as any).loadPyodide !== 'undefined',
      reactLoaded: typeof React !== 'undefined',
      nextLoaded: typeof (window as any).__NEXT_DATA__ !== 'undefined'
    };

    setResourceStatus(results);
    setLoading(false);
  };

  const formatBytes = (bytes: number | undefined) => {
    if (bytes === undefined) return 'unknown';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserAgent(navigator.userAgent);
      checkResources();
    }
  }, []);

  const renderStatusBadge = (available: boolean) => (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {available ? 'Disponible' : 'Error'}
    </span>
  );

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
        <p className="mt-4 text-gray-600">Analizando recursos...</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Herramienta de Diagnóstico PyXom</h1>
      
      <div className="bg-blue-50 p-4 rounded-md mb-6 border-l-4 border-blue-500">
        <p className="text-blue-700">
          Esta herramienta verifica la disponibilidad de recursos críticos para el funcionamiento correcto de PyXom.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <div className="flex border-b">
          <button 
            onClick={() => setSelectedTab('general')}
            className={`px-4 py-3 ${selectedTab === 'general' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-600'}`}
          >
            General
          </button>
          <button 
            onClick={() => setSelectedTab('network')}
            className={`px-4 py-3 ${selectedTab === 'network' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-600'}`}
          >
            Recursos de Red
          </button>
          <button 
            onClick={() => setSelectedTab('memory')}
            className={`px-4 py-3 ${selectedTab === 'memory' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-600'}`}
          >
            Memoria
          </button>
          <button 
            onClick={() => setSelectedTab('modules')}
            className={`px-4 py-3 ${selectedTab === 'modules' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-600'}`}
          >
            Módulos
          </button>
        </div>
        
        <div className="p-4">
          {selectedTab === 'general' && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Información del Navegador</h2>
              <div className="bg-gray-50 p-4 rounded mb-4 font-mono text-sm overflow-x-auto">
                {userAgent}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-medium mb-2">Soporte WASM</h3>
                  {resourceStatus['Browser Info']?.supportsWasm ? 
                    <span className="text-green-600">Soportado ✓</span> : 
                    <span className="text-red-600">No soportado ✗</span>
                  }
                </div>
                
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-medium mb-2">LocalStorage</h3>
                  {resourceStatus['Browser Info']?.localStorage ? 
                    <span className="text-green-600">Disponible ✓</span> : 
                    <span className="text-red-600">No disponible ✗</span>
                  }
                </div>
                
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-medium mb-2">Service Worker</h3>
                  {resourceStatus['Browser Info']?.serviceWorker ? 
                    <span className="text-green-600">Soportado ✓</span> : 
                    <span className="text-red-600">No soportado ✗</span>
                  }
                </div>
              </div>
              
              <div className="mt-6">
                <button 
                  onClick={() => checkResources()} 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Actualizar diagnóstico
                </button>
              </div>
            </div>
          )}
          
          {selectedTab === 'network' && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Estado de los recursos de red</h2>
              
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recurso</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {resources.map(resource => (
                    <tr key={resource.name} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="font-medium">{resource.name}</span>
                        <div className="text-xs text-gray-500 truncate">{resource.url}</div>
                      </td>
                      <td className="px-4 py-3">
                        {renderStatusBadge(resourceStatus[resource.name]?.available || false)}
                      </td>
                      <td className="px-4 py-3">
                        {resourceStatus[resource.name]?.latency ? 
                          `${resourceStatus[resource.name].latency}ms` : 
                          'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {selectedTab === 'memory' && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Información de memoria</h2>
              
              {resourceStatus['Memory'] ? (
                <div className="space-y-4">
                  {Object.entries(resourceStatus['Memory']).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-4 rounded">
                      <h3 className="font-medium mb-1">{key}</h3>
                      <div>{String(value)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">Información de memoria no disponible</div>
              )}
            </div>
          )}
          
          {selectedTab === 'modules' && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Estado de los módulos</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resourceStatus['Loaded Modules'] && Object.entries(resourceStatus['Loaded Modules']).map(([module, loaded]) => (
                  <div key={module} className={`p-4 rounded ${loaded ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{module}</h3>
                      {loaded ? 
                        <span className="text-green-600">Cargado ✓</span> : 
                        <span className="text-red-600">No cargado ✗</span>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticTool;
