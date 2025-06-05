'use client';

import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { ExerciseData, AttemptResult, SingleTestRunResult, StaticCheckRunResult, TestCase } from '@/types/types';
import { runPythonTests, type ExecutionResult } from '@/utils/pythonRunner';
import { TestResultsPanel } from './TestResultsPanel';
import { HintsPanel } from './HintsPanel';
import { ModelSolutionPanel } from './ModelSolutionPanel';

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
  const [lastResult, setLastResult] = useState<AttemptResult | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [showModelSolution, setShowModelSolution] = useState(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    onCodeChange?.(code);
  }, [code, onCodeChange]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Configure Monaco for Python
    monaco.languages.setMonarchTokensProvider('python', {
      tokenizer: {
        root: [
          [/[a-zA-Z_]\w*/, {
            cases: {
              '@keywords': 'keyword',
              '@builtins': 'builtin',
              '@default': 'identifier'
            }
          }],
          [/"([^"\\]|\\.)*$/, 'string.invalid'],
          [/"/, 'string', '@string_double'],
          [/'([^'\\]|\\.)*$/, 'string.invalid'],
          [/'/, 'string', '@string_single'],
          [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
          [/\d+/, 'number'],
          [/#.*$/, 'comment'],
        ],
        string_double: [
          [/[^\\"]+/, 'string'],
          [/\\./, 'string.escape'],
          [/"/, 'string', '@pop']
        ],
        string_single: [
          [/[^\\']+/, 'string'],
          [/\\./, 'string.escape'],
          [/'/, 'string', '@pop']
        ]
      },
      keywords: [
        'and', 'as', 'assert', 'break', 'class', 'continue', 'def',
        'del', 'elif', 'else', 'except', 'exec', 'finally', 'for',
        'from', 'global', 'if', 'import', 'in', 'is', 'lambda',
        'not', 'or', 'pass', 'print', 'raise', 'return', 'try',
        'while', 'with', 'yield', 'None', 'True', 'False'
      ],
      builtins: [
        'abs', 'all', 'any', 'bin', 'bool', 'chr', 'dict', 'dir',
        'enumerate', 'eval', 'filter', 'float', 'format', 'frozenset',
        'getattr', 'globals', 'hasattr', 'hash', 'help', 'hex', 'id',
        'input', 'int', 'isinstance', 'issubclass', 'iter', 'len',
        'list', 'locals', 'map', 'max', 'min', 'next', 'object',
        'oct', 'open', 'ord', 'pow', 'print', 'range', 'repr',
        'reversed', 'round', 'set', 'setattr', 'slice', 'sorted',
        'str', 'sum', 'tuple', 'type', 'vars', 'zip'
      ]
    });
  };
  const runTests = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    try {
      const testStrings = exercise.tests.map(test => 
        `assert ${test.input} == ${test.expected}, "Test failed for ${test.name || 'unnamed test'}"`
      );
      
      const executionResult = await runPythonTests(code, testStrings);
      
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
        durationMs: 0,
        totalPointsEarned: executionResult.testRunResults.reduce((acc, tr) => acc + (tr.pointsEarned || 0), 0),
        maxPossiblePoints: exercise.maxPoints || 0
      };
      
      setLastResult(result);
      onSubmit?.(result);
    } catch (error) {
      console.error('Error running tests:', error);
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
            ) : (              <>
                <span>▶</span>
                <span>Ejecutar Pruebas</span>
              </>
            )}
          </button>
          
          <button
            onClick={openPythonTutor}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center space-x-2"
          >
            <span>📊</span>
            <span>Visualizar</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowHints(!showHints)}
            className="px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 flex items-center space-x-1"
          >
            <span>💡</span>
            <span>Pistas</span>
          </button>
          
          {exercise.modelSolution && (
            <button
              onClick={() => setShowModelSolution(!showModelSolution)}
              className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center space-x-1"
            >
              <span>📖</span>
              <span>Solución</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <Editor
              height="100%"
              defaultLanguage="python"
              value={code}
              onChange={(value) => setCode(value || '')}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                folding: true,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                insertSpaces: true,
                wordWrap: 'on',
                bracketPairColorization: { enabled: true },
                guides: {
                  indentation: true,
                  bracketPairs: true
                }
              }}
            />
          </div>

          {/* Test Results */}
          {lastResult && (
            <TestResultsPanel result={lastResult} />
          )}
        </div>

        {/* Side Panels */}
        <div className="w-80 flex flex-col border-l bg-gray-50">
          {showHints && exercise.hints && (
            <HintsPanel 
              hints={exercise.hints}
              result={lastResult}
              onClose={() => setShowHints(false)}
            />
          )}
          
          {showModelSolution && exercise.modelSolution && (
            <ModelSolutionPanel
              solution={exercise.modelSolution}
              onClose={() => setShowModelSolution(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
