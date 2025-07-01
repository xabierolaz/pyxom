// Simple Python Code Editor - Clean implementation
'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Load Monaco Editor with fallback
const Editor = dynamic(
  () => import('@monaco-editor/react').catch(() => {
    console.error('Failed to load Monaco Editor');
    return {
      default: () => (
        <div className="p-4 bg-gray-100 border rounded">
          <p>Editor de código no disponible. Por favor, recarga la página.</p>
        </div>
      )
    };
  }),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Cargando editor...</p>
        </div>
      </div>
    )
  }
);

interface PyCodeEditorProps {
  initialCode: string;
  onCodeChange?: (code: string) => void;
}

export default function SimplePyCodeEditor({
  initialCode = '# Escribe tu código aquí\nprint("Hola Mundo")',
  onCodeChange
}: PyCodeEditorProps) {
  const [code, setCode] = useState(initialCode);

  // Handle code changes
  const handleCodeChange = useCallback((newCode: string | undefined) => {
    const codeValue = newCode || '';
    setCode(codeValue);
    onCodeChange?.(codeValue);
  }, [onCodeChange]);

  // Editor mount handler
  const handleEditorDidMount = useCallback(() => {
    // Editor is ready, could add logic here if needed
  }, []);

  // Reset code
  const resetCode = useCallback(() => {
    setCode(initialCode);
  }, [initialCode]);

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <h3 className="font-medium text-gray-700">Editor Python</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={resetCode}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          >
            Resetear
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          defaultLanguage="python"
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10
            },
            automaticLayout: true
          }}
          theme="vs-light"
        />
      </div>
    </div>
  );
}
