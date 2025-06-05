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
  const [showSolutionWarning, setShowSolutionWarning] = useState(true);

  const confirmViewSolution = () => {
    setShowSolutionWarning(false);
  };

  if (showSolutionWarning) {
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

        {/* Warning Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              ¡Piensa antes de mirar!
            </h3>
            <div className="text-sm text-gray-600 space-y-3 mb-6">
              <p>
                Viewing the model solution can be very helpful for learning, but it's most 
                effective when you've already tried to solve the problem yourself.
              </p>
              <p>
                <strong>Best practices:</strong>
              </p>
              <ul className="text-left space-y-1 mt-2">
                <li>• Try to solve the exercise first</li>
                <li>• Use hints if you're stuck</li>
                <li>• Only check the solution when you need guidance</li>
                <li>• Study the solution to understand different approaches</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={confirmViewSolution}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                Entiendo, muéstrame la solución
              </button>
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Déjame intentarlo primero
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        )}

        {activeTab === 'explanation' && solution.explanation && (
          <div className="h-full overflow-y-auto p-4">
            <div className="prose prose-sm max-w-none">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-blue-600">📝</span>
                  <h4 className="font-semibold text-blue-900">Explicación de la Solución</h4>
                </div>
                <div className="text-blue-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {solution.explanation}
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-700">
                <div className="bg-green-50 border-l-4 border-green-400 p-3">
                  <h5 className="font-medium text-green-900 mb-1">💡 Puntos Clave</h5>
                  <p className="text-green-800 text-xs">
                    Study how this solution approaches the problem. Consider the logic flow, 
                    variable naming, and code structure. Try to understand why this approach works.
                  </p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                  <h5 className="font-medium text-yellow-900 mb-1">🔄 Próximos Pasos</h5>
                  <p className="text-yellow-800 text-xs">
                    Try implementing this solution yourself without copying. See if you can 
                    explain each line and consider alternative approaches to the same problem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}        {activeTab === 'diff' && userCode && (
          <div className="h-full">
            <DiffViewer
              expected={solution.code}
              received={userCode}
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
