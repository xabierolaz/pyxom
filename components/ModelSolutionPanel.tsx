'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import DiffViewer from './DiffViewer';

interface ModelSolutionPanelProps {
  solution: {
    code: string;
    explanation?: string;
  };
  userCode?: string;
  onClose: () => void;
}

export function ModelSolutionPanel({ solution, userCode, onClose }: ModelSolutionPanelProps) {
  const [activeTab, setActiveTab] = useState<'solution' | 'explanation' | 'diff'>('solution');

  return (
    <div className="flex flex-col h-full bg-white border-l">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-indigo-50">
        <div className="flex items-center space-x-2">
          <span className="text-xl">📖</span>
          <h3 className="font-semibold text-gray-800">Solución Modelo</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b bg-gray-50">
        <button
          onClick={() => setActiveTab('solution')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'solution'
              ? 'border-indigo-500 text-indigo-600 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Código de la Solución
        </button>
        
        {solution.explanation && (
          <button
            onClick={() => setActiveTab('explanation')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'explanation'
                ? 'border-indigo-500 text-indigo-600 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Explicación
          </button>
        )}
        
        {userCode && (
          <button
            onClick={() => setActiveTab('diff')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'diff'
                ? 'border-indigo-500 text-indigo-600 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Comparar
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'solution' && (
          <div className="h-full">
            <Editor
              height="100%"
              defaultLanguage="python"
              value={solution.code}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                folding: true,
                selectOnLineNumbers: false,
                automaticLayout: true,
                tabSize: 4,
                wordWrap: 'on',
                bracketPairColorization: { enabled: true },
                guides: {
                  indentation: true,
                  bracketPairs: true
                }
              }}
              theme="vs-light"
            />
          </div>
        )}        {activeTab === 'explanation' && solution.explanation && (
          <div className="h-full overflow-y-auto p-4">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-blue-600">📝</span>
                <h4 className="font-semibold text-blue-900">Explicación de la Solución</h4>
              </div>
              <div className="text-blue-800 text-sm leading-relaxed whitespace-pre-wrap">
                {solution.explanation}
              </div>
            </div>
          </div>        )}{activeTab === 'diff' && userCode && (
          <div className="h-full">
            <DiffViewer
              original={userCode}
              modified={solution.code}
            />
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="border-t p-3 bg-gray-50">
        <div className="flex items-center justify-between text-xs">
          <div className="text-gray-600">
            Study this solution to improve your understanding
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                // Copy solution code to clipboard
                navigator.clipboard.writeText(solution.code);
              }}
              className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              📋 Copy Code
            </button>
            <button
              onClick={() => {
                // Reset and try again
                onClose();
              }}
              className="px-2 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
