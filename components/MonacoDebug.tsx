'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Componente de depuración para Monaco Editor
function MonacoDebug() {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toISOString()}: ${info}`]);
  };

  useEffect(() => {
    addDebugInfo('MonacoDebug component mounted');
    
    // Verificar si Monaco está disponible globalmente
    if (typeof window !== 'undefined') {
      addDebugInfo(`Window object available: ${!!window}`);
      addDebugInfo(`Monaco global: ${!!(window as any).monaco}`);
    }
  }, []);

  // Editor dinámico con debugging detallado
  const Editor = dynamic(
    () => {
      addDebugInfo('Starting dynamic import of monaco-editor/react');
      return import('@monaco-editor/react')
        .then(mod => {
          addDebugInfo(`Monaco module loaded successfully: ${!!mod}`);
          addDebugInfo(`Default export: ${!!mod.default}`);
          addDebugInfo(`Module keys: ${Object.keys(mod).join(', ')}`);
          return mod.default || mod;
        })
        .catch(error => {
          addDebugInfo(`Error loading Monaco: ${error.message}`);
          throw error;
        });
    },
    {
      ssr: false,
      loading: () => {
        addDebugInfo('Monaco loading component rendered');
        return <div className="p-4 bg-yellow-100 text-yellow-800">Cargando Monaco Editor...</div>;
      }
    }
  );

  const handleEditorDidMount = (editor: any, monaco: any) => {
    addDebugInfo('Monaco Editor mounted successfully');
    addDebugInfo(`Editor instance: ${!!editor}`);
    addDebugInfo(`Monaco instance: ${!!monaco}`);
    
    // Verificar que el DOM element se creó
    const editorElement = document.querySelector('.monaco-editor');
    addDebugInfo(`Monaco DOM element found: ${!!editorElement}`);
    if (editorElement) {
      addDebugInfo(`Monaco DOM element classes: ${editorElement.className}`);
    }
  };

  const handleEditorError = (error: any) => {
    addDebugInfo(`Monaco Editor error: ${error.message || error}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Monaco Editor Debug</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Debug Information:</h2>
        <div className="bg-gray-100 p-4 rounded-lg max-h-64 overflow-y-auto">
          {debugInfo.map((info, index) => (
            <div key={index} className="text-sm font-mono mb-1">{info}</div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Monaco Editor Test:</h2>
        <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ height: '300px' }}>
          <Editor
            height="300px"
            defaultLanguage="python"
            defaultValue="# Test Monaco Editor\nprint('Hello, PyXom!')"
            theme="vs-dark"
            onMount={handleEditorDidMount}
            onValidate={handleEditorError}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true
            }}
          />
        </div>      </div>
    </div>
  );
}

export default MonacoDebug;
