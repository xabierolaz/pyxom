'use client';

import React from 'react';
import Editor from '@monaco-editor/react';

interface DiffViewerProps {
  original: string;
  modified: string;
  language?: string;
  height?: string;
}

export default function DiffViewer({ 
  original, 
  modified, 
  language = 'python',
  height = '400px' 
}: DiffViewerProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b">
        <h3 className="text-sm font-semibold text-gray-700">Comparación de Código</h3>
      </div>
      <div className="grid grid-cols-2 gap-0">
        <div className="border-r">
          <div className="bg-red-50 px-3 py-1 text-xs font-medium text-red-700 border-b">
            Tu Código
          </div>
          <Editor
            height={height}
            language={language}
            value={original}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 12,
              lineNumbers: 'on',
              folding: false,
              wordWrap: 'on'
            }}
          />
        </div>
        <div>
          <div className="bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border-b">
            Solución Modelo
          </div>
          <Editor
            height={height}
            language={language}
            value={modified}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 12,
              lineNumbers: 'on',
              folding: false,
              wordWrap: 'on'
            }}
          />
        </div>
      </div>
    </div>
  );
}