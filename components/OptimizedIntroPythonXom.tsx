// Optimized IntroPythonXom - Eliminates cascading loading delays
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import monacoManager, { MonacoLoadingState } from '@/utils/monacoManager';
import OptimizedPyCodeEditor from './OptimizedPyCodeEditor';
import { runPythonTests, getPyodideInstance, type TestResult, type StaticCheckResult } from '@/utils/pythonRunner';
import type { PyodideInterface } from 'pyodide';
import type { 
  ExerciseData, 
  AttemptResult, 
  SingleTestRunResult,   
  StaticCheckRunResult
} from '@/types/types';

interface OptimizedIntroPythonXomProps {
  data: ExerciseData;
}

const OptimizedIntroPythonXom: React.FC<OptimizedIntroPythonXomProps> = ({ data }) => {
  const [userCode, setUserCode] = useState(data.starterCode || '# Escribe tu código aquí\n');
  const [monacoState, setMonacoState] = useState<MonacoLoadingState>(monacoManager.getState());
  const [pyodideState, setPyodideState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [lastResult, setLastResult] = useState<AttemptResult | null>(null);

  // Initialize Monaco and Pyodide immediately
  useEffect(() => {
    // Subscribe to Monaco loading state
    const unsubscribe = monacoManager.onStateChange(setMonacoState);
    
    // Start loading Monaco immediately
    monacoManager.ensureMonacoLoaded();
    
    // Initialize Pyodide
    initializePyodide();
    
    return unsubscribe;
  }, []);

  const initializePyodide = async () => {
    try {
      await getPyodideInstance();
      setPyodideState('ready');
    } catch (error) {
      console.error('Failed to initialize Pyodide:', error);
      setPyodideState('error');
    }
  };

  const handleCodeChange = (newCode: string) => {
    setUserCode(newCode);
  };
  const runTests = async () => {
    if (isRunningTests || pyodideState !== 'ready') return;
    
    setIsRunningTests(true);
    
    try {
      // Convert test objects to string format for the runner
      const testsForRunner = data.tests.map(test => 
        `assert ${test.input} == ${test.expected}, "Test failed for ${test.name || 'unnamed test'}"`
      );

      const result = await runPythonTests(userCode, testsForRunner);
      
      // Convert result to AttemptResult format  
      const attemptResult: AttemptResult = {
        timestamp: Date.now(),
        overallPassed: result.testRunResults.every(tr => tr.passed),
        testRunResults: result.testRunResults.map((tr, index): SingleTestRunResult => ({
          testCase: data.tests[index] || { input: '', expected: '', name: `Test ${index + 1}` },
          isSuccessExecution: !tr.error,
          actualOutput: tr.output || '',
          normalizedActualOutput: tr.output?.trim() || '',
          passed: tr.passed,
          durationMs: tr.executionTime || 0,
          error: tr.error,
          pointsEarned: tr.pointsEarned || 0
        })),
        staticCheckRunResults: result.staticCheckRunResults?.map(scr => ({
          check: { id: '', description: '', checkFunction: async () => false },
          passed: scr.passed,
          message: scr.feedback,
          error: undefined,
          pointsEarned: scr.pointsEarned || 0
        })) || [],
        totalTests: result.testRunResults.length,
        testsPassedCount: result.testRunResults.filter(tr => tr.passed).length,
        totalStaticChecks: result.staticCheckRunResults?.length || 0,
        staticChecksPassedCount: result.staticCheckRunResults?.filter(scr => scr.passed).length || 0,
        durationMs: 0,
        totalPointsEarned: result.testRunResults.reduce((sum, tr) => sum + (tr.pointsEarned || 0), 0),
        maxPossiblePoints: data.maxPoints || 0
      };

      setLastResult(attemptResult);
      
    } catch (error) {
      console.error('Test execution failed:', error);
      setLastResult({
        timestamp: Date.now(),
        overallPassed: false,
        testRunResults: [],
        staticCheckRunResults: [],
        totalTests: 0,
        testsPassedCount: 0,
        totalStaticChecks: 0,
        staticChecksPassedCount: 0,
        durationMs: 0,
        totalPointsEarned: 0,
        maxPossiblePoints: 0
      });
    } finally {
      setIsRunningTests(false);
    }
  };

  // Check if systems are ready
  const isSystemReady = monacoState.status === 'ready' && pyodideState === 'ready';
  const hasErrors = monacoState.status === 'error' || pyodideState === 'error';

  // Loading state
  if (!isSystemReady && !hasErrors) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{data.title}</h1>
            <p className="text-gray-600 mt-2">{data.description}</p>
          </div>

          {/* System Loading Status */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Inicializando entorno Python</h2>
                <p className="text-gray-600 mt-2">Preparando el editor y el intérprete de Python...</p>
              </div>

              {/* Progress indicators */}
              <div className="space-y-4 max-w-md mx-auto">
                {/* Monaco Progress */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {monacoState.status === 'ready' ? (
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-blue-500 rounded-full animate-spin"></div>
                    )}
                    <span className="font-medium">Editor Monaco</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {monacoState.status === 'ready' ? 'Listo' : monacoState.stage}
                  </span>
                </div>

                {/* Pyodide Progress */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {pyodideState === 'ready' ? (
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-blue-500 rounded-full animate-spin"></div>
                    )}
                    <span className="font-medium">Intérprete Python</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {pyodideState === 'ready' ? 'Listo' : 'Cargando...'}
                  </span>
                </div>
              </div>

              {/* Monaco specific progress */}
              {monacoState.status !== 'ready' && (
                <div className="mt-6">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${monacoState.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {Math.round(monacoState.progress)}% - {monacoState.stage}
                  </p>
                </div>
              )}

              {/* Tips */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">💡 Mientras esperamos:</p>
                  <ul className="text-left space-y-1">
                    <li>• Lee cuidadosamente el enunciado del ejercicio</li>
                    <li>• Piensa en la estrategia de solución</li>
                    <li>• Revisa los casos de prueba para entender los requisitos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (hasErrors) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-red-600 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-800 mb-4">Error al cargar el entorno</h2>
            
            <div className="space-y-3 mb-6">
              {monacoState.status === 'error' && (
                <div className="p-3 bg-red-100 rounded border border-red-200">
                  <p className="text-red-800"><strong>Editor:</strong> {monacoState.error}</p>
                </div>
              )}
              {pyodideState === 'error' && (
                <div className="p-3 bg-red-100 rounded border border-red-200">
                  <p className="text-red-800"><strong>Python:</strong> No se pudo cargar el intérprete</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                🔄 Recargar página
              </button>
              <br />
              <a
                href="/monaco-debug"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔧 Diagnóstico avanzado
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main interface when ready
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{data.title}</h1>
              <p className="text-gray-600 mt-2">{data.description}</p>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Python listo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Exercise Description */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">📋 Instrucciones</h2>
              {data.description && (
              <div className="prose max-w-none mb-6">
                <div dangerouslySetInnerHTML={{ __html: data.description }} />
              </div>
            )}

            {/* Test Cases Preview */}
            {data.tests && data.tests.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3">🧪 Casos de prueba:</h3>
                <div className="space-y-2">
                  {data.tests.slice(0, 3).map((test, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded border">
                      <div className="text-sm">
                        <strong>{test.name}</strong>
                        {test.input && (
                          <div className="mt-1">
                            <span className="text-gray-600">Entrada:</span> <code>{test.input}</code>
                          </div>
                        )}
                        <div className="mt-1">
                          <span className="text-gray-600">Esperado:</span> <code>{test.expected}</code>
                        </div>
                      </div>
                    </div>
                  ))}
                  {data.tests.length > 3 && (
                    <p className="text-gray-500 text-sm">... y {data.tests.length - 3} casos más</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="h-[600px]">
              <OptimizedPyCodeEditor
                initialCode={userCode}                tests={data.tests.map(test => ({
                  name: test.name || 'Test',
                  input: test.input || '',
                  expected: test.expected,
                  points: test.points || 1
                }))}
                onCodeChange={handleCodeChange}
                onTestResults={(result) => {
                  // Handle test results if needed
                }}
              />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        {lastResult && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">📊 Resultados</h2>
              <div className={`p-4 rounded-lg border ${
              lastResult.overallPassed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">
                    {lastResult.overallPassed ? '✅' : '❌'}
                  </span>
                  <span className="font-semibold">
                    {lastResult.overallPassed ? 'Ejercicio completado' : 'Hay errores'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Puntuación: {lastResult.totalPointsEarned}/{lastResult.maxPossiblePoints}
                </div>
              </div>

              {lastResult.testRunResults.length > 0 && (
                <div className="mt-4 space-y-2">
                  {lastResult.testRunResults.map((test, index) => (
                    <div key={index} className={`p-2 rounded ${
                      test.passed ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{test.testCase.name || `Test ${index + 1}`}</span>
                        <span className={test.passed ? 'text-green-600' : 'text-red-600'}>
                          {test.passed ? '✓' : '✗'}
                        </span>
                      </div>
                      {test.error && (
                        <div className="mt-1 text-sm text-red-600">
                          {test.error}
                        </div>
                      )}
                    </div>
                  ))}                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptimizedIntroPythonXom;
