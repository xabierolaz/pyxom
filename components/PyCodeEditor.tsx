// Simple Python Code Editor - Clean implementation
'use client';

import React, { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'monaco-editor/min/vs/editor/editor.main.css';
import {
  runPythonTestsEnhanced,
  stopExecution,
  type ExecutionResult
} from '@/utils/pythonRunner';
import type { TestCase } from '@/types/types';

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
  onTestResults?: (results: ExecutionResult) => void;
  tests?: TestCase[];
}

export default function PyCodeEditor({
  initialCode = '# Escribe tu código aquí\nprint("Hola Mundo")',
  onCodeChange,
  onTestResults,
  tests = []
}: PyCodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ExecutionResult | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const editorRef = useRef<unknown>(null);

  // Handle code changes
  const handleCodeChange = useCallback((newCode: string | undefined) => {
    const codeValue = newCode || '';
    setCode(codeValue);
    onCodeChange?.(codeValue);
  }, [onCodeChange]);

  // Run tests
  const runTests = useCallback(async () => {
    if (isRunning) return;

    setIsRunning(true);
    setResults(null);
    try {
      const result = await runPythonTestsEnhanced(code, tests);
      setResults(result);
      onTestResults?.(result);
    } catch (error) {
      console.error('Test execution failed:', error);
      const errorResult: ExecutionResult = {
        testRunResults: [],
        staticCheckRunResults: [],
        executionTime: 0,
        output: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        success: false
      };
      setResults(errorResult);
      onTestResults?.(errorResult);
    } finally {
      setIsRunning(false);
    }
  }, [code, tests, isRunning, onTestResults]);

  // Stop execution
  const handleStop = useCallback(async () => {
    await stopExecution();
    setIsRunning(false);
  }, []);

  // Editor mount handler
  const handleEditorDidMount = useCallback((editor: unknown) => {
    editorRef.current = editor;
    setIsEditorReady(true);
  }, []);

  // Reset code
  const resetCode = useCallback(() => {
    setCode(initialCode);
    setResults(null);
    onCodeChange?.(initialCode);
  }, [initialCode, onCodeChange]);

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-sm border relative">
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
          {isRunning ? (
            <button
              onClick={handleStop}
              className="px-4 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              Detener
            </button>
          ) : (
            <button
              onClick={runTests}
              disabled={!isEditorReady || tests.length === 0}
              className="px-4 py-1 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded transition-colors"
              title={tests.length === 0 ? "No hay tests para este ejercicio" : "Ejecutar tests"}
            >
              Ejecutar
            </button>
          )}
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

      {/* Results Panel */}
      {results && (
        <div className="border-t p-3 bg-gray-50 max-h-60 overflow-y-auto">
          <h4 className="font-medium text-gray-700 mb-2">Resultados:</h4>
          {results.output && (
            <div className="mb-2">
              <h5 className="font-semibold text-sm">Salida:</h5>
              <pre className="text-sm bg-white p-2 border rounded whitespace-pre-wrap mt-1">
                {results.output}
              </pre>
            </div>
          )}
          {results.testRunResults && results.testRunResults.length > 0 && (
            <div className="space-y-1">
               <h5 className="font-semibold text-sm">Tests:</h5>
              {results.testRunResults.map((test, index) => (
                <div
                  key={index}
                  className={`text-sm p-2 rounded ${
                    test.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  <span className="font-medium">
                    Test {index + 1}: {test.passed ? '✓ Pasó' : '✗ Falló'}
                  </span>
                  {test.error && (
                    <div className="mt-1 text-xs font-mono">{test.error}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Loading Overlay */}
      {isRunning && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Ejecutando código...</span>
          </div>
        </div>
      )}
    </div>
  );
}
