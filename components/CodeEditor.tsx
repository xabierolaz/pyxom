'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ExerciseData, AttemptResult, SingleTestRunResult, StaticCheckRunResult } from '@/types/types';
import { runPythonTests } from '@/utils/pythonRunner';
import LazyMonacoEditor from './LazyMonacoEditor';
import { PythonExecutionSkeleton } from './LoadingSkeleton';
import { getMemoryManager } from '@/utils/memoryManager';
import { getPerformanceTracker } from '@/utils/performanceMonitoring';

interface CodeEditorProps {
  exercise: ExerciseData;
  onSubmit?: (result: AttemptResult) => void;
  onCodeChange?: (code: string) => void;
  initialCode?: string;
}

export default function CodeEditor({
  exercise,
  onSubmit,
  onCodeChange,
  initialCode
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode || exercise.starterCode);
  const [isRunning, setIsRunning] = useState(false);
  const [memoryStats, setMemoryStats] = useState<{ used?: number; percentage?: number }>({});
  const editorRef = useRef<HTMLDivElement | null>(null);
  const memoryManager = getMemoryManager();
  const performanceTracker = getPerformanceTracker();

  useEffect(() => {
    onCodeChange?.(code);
  }, [code, onCodeChange]);

  useEffect(() => {
    // Track CodeEditor component mount
    performanceTracker.trackUserInteraction('code_editor_mount');

    // Update memory stats periodically
    const updateMemoryStats = async () => {
      const stats = await memoryManager.getMemoryStats();
      setMemoryStats(stats);
    };
    updateMemoryStats();
    const interval = setInterval(updateMemoryStats, 5000);
    return () => {
      clearInterval(interval);
      memoryManager.cleanup();
    };
  }, [memoryManager, performanceTracker]);

  const handleEditorReady = (editor: unknown) => {
    editorRef.current = editor as HTMLDivElement;

    // Track editor ready event
    performanceTracker.trackUserInteraction('monaco_editor_ready');
  };

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);

    // Track code changes for performance monitoring
    performanceTracker.trackUserInteraction('code_change');
  };
  const runTests = async () => {
    if (isRunning) return;

    setIsRunning(true);

    // Track test execution start
    const startTime = performance.now();
    performanceTracker.trackUserInteraction('test_execution_start');

    try {
      const testStrings = exercise.tests.map(test =>
        `assert ${test.input} == ${test.expected}, "Test failed for ${test.name || 'unnamed test'}"`
      );
      const executionResult = await runPythonTests(code, testStrings);

      // Guardar el resultado completo para el sistema de feedback inteligente
      // setLastExecutionResult(executionResult);

      // Transform ExecutionResult to AttemptResult
      const result: AttemptResult = {
        timestamp: Date.now(),
        overallPassed: executionResult.testRunResults.every(tr => tr.passed),
        testRunResults: executionResult.testRunResults.map((tr, index): SingleTestRunResult => ({
          testCase: exercise.tests[index] || { input: '', expected: '' },
          isSuccessExecution: tr.passed,
          actualOutput: tr.output || '',
          normalizedActualOutput: tr.output?.trim() || '',
          passed: tr.passed,
          durationMs: 0,
          error: tr.error,
          pointsEarned: tr.pointsEarned
        })),
        staticCheckRunResults: executionResult.staticCheckRunResults?.map((scr): StaticCheckRunResult => ({
          check: { id: '', description: '', checkFunction: async () => false },
          passed: scr.passed,
          message: scr.feedback,
          error: undefined,
          pointsEarned: scr.pointsEarned
        })),
        totalTests: executionResult.testRunResults.length,
        testsPassedCount: executionResult.testRunResults.filter(tr => tr.passed).length,
        totalStaticChecks: executionResult.staticCheckRunResults?.length || 0,
        staticChecksPassedCount: executionResult.staticCheckRunResults?.filter(scr => scr.passed).length || 0,
        durationMs: performance.now() - startTime,
        totalPointsEarned: executionResult.testRunResults.reduce((acc, tr) => acc + (tr.pointsEarned || 0), 0),
        maxPossiblePoints: exercise.maxPoints || 0
      };      // Track test execution completion
      performanceTracker.trackUserInteraction('test_execution_complete', {
        timestamp: Date.now(),
        metadata: { durationMs: result.durationMs }
      });

      onSubmit?.(result);
    } catch (error) {
      console.error('Error running tests:', error);

      // Track test execution error
      performanceTracker.trackUserInteraction('test_execution_error');
    } finally {
      setIsRunning(false);
    }
  };

  const openPythonTutor = () => {
    const encoded = encodeURIComponent(code);
    window.open(
      `https://pythontutor.com/iframe-embed.html#code=${encoded}&origin=opt-frontend.js&py=3&curInstr=0`,
      '_blank', 'noopener,noreferrer'
    );

    // Track Python Tutor usage
    performanceTracker.trackUserInteraction('python_tutor_open');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
        <div className="flex items-center space-x-2">
          <button
            onClick={runTests}
            disabled={isRunning}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {isRunning ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Ejecutando...</span>
              </>
            ) : (
              <>
                <span>▶</span>
                <span>Ejecutar Pruebas</span>
              </>
            )}
          </button>
          <button
            onClick={openPythonTutor}
            disabled={isRunning}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <span>📊</span>
            <span>Visualizar</span>
          </button>
        </div>
        {/* Memory usage indicator */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          {memoryStats.used && (
            <span>
              Memoria: {Math.round(memoryStats.used)}MB ({memoryStats.percentage?.toFixed(1)}%)
            </span>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            {isRunning && (
              <div className="absolute inset-0 bg-black bg-opacity-20 z-10 flex items-center justify-center">
                <PythonExecutionSkeleton />
              </div>
            )}
            <LazyMonacoEditor
              height="100%"
              language="python"
              value={code}
              onChange={handleCodeChange}
              onMount={handleEditorReady}
              theme="vs-dark"
              readOnly={isRunning}
            />
          </div>
          {/* Enhanced Test Results */}
          {/* {lastResult && lastExecutionResult && (
            <EnhancedTestResultsPanel
              result={lastResult}
              exercise={exercise}
              userCode={code}
              executionResult={lastExecutionResult}
            />
          )} */}
        </div>
      </div>
    </div>
  );
}
