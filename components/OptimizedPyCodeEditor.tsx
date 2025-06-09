// Optimized PyCodeEditor - Uses unified Monaco loading manager
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import monacoManager, { MonacoLoadingState } from '@/utils/monacoManager';
import { 
  runPythonTestsEnhanced, 
  type ExecutionResult 
} from '@/utils/pythonRunner';

interface OptimizedPyCodeEditorProps {
  initialCode: string;
  tests: Array<{
    name: string;
    input: string;
    expected: string;
    points: number;
  }>;
  onCodeChange?: (code: string) => void;
  onTestResults?: (results: ExecutionResult) => void;
}

const OptimizedPyCodeEditor: React.FC<OptimizedPyCodeEditorProps> = ({
  initialCode,
  tests,
  onCodeChange,
  onTestResults
}) => {
  const [code, setCode] = useState(initialCode);
  const [monacoState, setMonacoState] = useState<MonacoLoadingState>(monacoManager.getState());
  const [editor, setEditor] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<ExecutionResult | null>(null);
  
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);

  // Subscribe to Monaco loading state changes
  useEffect(() => {
    const unsubscribe = monacoManager.onStateChange(setMonacoState);
    
    // Start loading Monaco immediately
    monacoManager.ensureMonacoLoaded();
    
    return unsubscribe;
  }, []);

  // Create Monaco editor when ready
  useEffect(() => {
    if (monacoState.status === 'ready' && editorContainerRef.current && !editorInstanceRef.current) {
      createMonacoEditor();
    }
  }, [monacoState.status]);

  const createMonacoEditor = useCallback(() => {
    const monaco = monacoManager.getMonaco();
    if (!monaco || !editorContainerRef.current) return;

    try {
      const editorInstance = monaco.editor.create(editorContainerRef.current, {
        value: code,
        language: 'python',
        theme: 'vs-dark',
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        insertSpaces: true,
        wordWrap: 'on',
        // Performance optimizations
        renderWhitespace: 'selection',
        renderControlCharacters: false,
        renderIndentGuides: true,
        // Accessibility
        accessibilitySupport: 'auto',
        // Mobile optimizations
        scrollbar: {
          vertical: 'auto',
          horizontal: 'auto',
          verticalScrollbarSize: 12,
          horizontalScrollbarSize: 12
        }
      });

      // Configure Python language features
      configurePythonLanguage(monaco);

      // Set up event listeners
      editorInstance.onDidChangeModelContent(() => {
        const newCode = editorInstance.getValue();
        setCode(newCode);
        onCodeChange?.(newCode);
      });

      editorInstanceRef.current = editorInstance;
      setEditor(editorInstance);

      console.log('✅ Monaco Editor created successfully');
    } catch (error) {
      console.error('❌ Failed to create Monaco editor:', error);
      setMonacoState(prev => ({
        ...prev,
        status: 'error',
        error: 'Failed to create editor instance'
      }));
    }
  }, [code, onCodeChange]);

  const configurePythonLanguage = (monaco: any) => {
    // Enhanced Python language configuration
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
          [/\d*\.\d+([eE][+-]?\d+)?/, 'number.float'],
          [/\d+/, 'number'],
          [/#.*$/, 'comment'],
          [/[()\[\]{}]/, 'bracket'],
          [/[+\-*/%=<>!&|~^]/, 'operator'],
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
        'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif',
        'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import',
        'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return',
        'try', 'while', 'with', 'yield', 'True', 'False', 'None'
      ],
      builtins: [
        'abs', 'all', 'any', 'ascii', 'bin', 'bool', 'bytearray', 'bytes',
        'callable', 'chr', 'classmethod', 'compile', 'complex', 'delattr',
        'dict', 'dir', 'divmod', 'enumerate', 'eval', 'exec', 'filter',
        'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr',
        'hash', 'help', 'hex', 'id', 'input', 'int', 'isinstance', 'issubclass',
        'iter', 'len', 'list', 'locals', 'map', 'max', 'memoryview', 'min',
        'next', 'object', 'oct', 'open', 'ord', 'pow', 'print', 'property',
        'range', 'repr', 'reversed', 'round', 'set', 'setattr', 'slice',
        'sorted', 'staticmethod', 'str', 'sum', 'super', 'tuple', 'type',
        'vars', 'zip'
      ]
    });

    // Python autocomplete
    monaco.languages.registerCompletionItemProvider('python', {
      provideCompletionItems: () => ({
        suggestions: [
          {
            label: 'print',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'print(${1:value})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Print values to the console'
          },
          {
            label: 'input',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'input(${1:"prompt"})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Get user input'
          },
          {
            label: 'len',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'len(${1:object})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Return the length of an object'
          },
          {
            label: 'range',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'range(${1:stop})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Create a range of numbers'
          },
          {
            label: 'def',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'def ${1:function_name}(${2:parameters}):\n    ${3:pass}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Define a function'
          },
          {
            label: 'class',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'class ${1:ClassName}:\n    def __init__(self${2:, parameters}):\n        ${3:pass}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Define a class'
          }
        ]
      })
    });
  };
  const runTests = async () => {
    if (isRunning || !editor) return;
    
    setIsRunning(true);
    
    try {
      // Convert test objects to string format for the runner
      const testsForRunner = tests.map(test => 
        `assert ${test.input} == ${test.expected}, "Test failed for ${test.name}"`
      );
      
      const result = await runPythonTestsEnhanced(code, testsForRunner);
      setTestResults(result);
      onTestResults?.(result);
    } catch (error) {
      console.error('Test execution failed:', error);      setTestResults({
        success: false,
        error: 'Failed to execute tests: ' + (error instanceof Error ? error.message : 'Unknown error'),
        output: '',
        testRunResults: [],
        executionTime: 0
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleForceReload = async () => {
    setEditor(null);
    editorInstanceRef.current = null;
    await monacoManager.forceReload();
  };

  // Loading states
  if (monacoState.status === 'loading' || monacoState.status === 'preloading') {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center p-8">
          <div className="relative mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-blue-600">
                {Math.round(monacoState.progress)}%
              </span>
            </div>
          </div>
          <p className="text-gray-700 font-medium">{monacoState.stage}</p>
          <div className="w-64 bg-gray-200 rounded-full h-2 mt-3">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${monacoState.progress}%` }}
            ></div>
          </div>
          {monacoState.loadTime && (
            <p className="text-xs text-gray-500 mt-2">
              Tiempo transcurrido: {Math.round(monacoState.loadTime / 1000)}s
            </p>
          )}
        </div>
      </div>
    );
  }

  if (monacoState.status === 'error') {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg border-2 border-red-200">
        <div className="text-center p-8">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error cargando el editor</h3>
          <p className="text-red-600 mb-4">{monacoState.error}</p>
          <div className="space-y-2">
            <button
              onClick={handleForceReload}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              🔄 Reintentar carga
            </button>
            <br />
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              🔄 Recargar página
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Editor Controls */}
      <div className="flex items-center justify-between p-3 bg-gray-100 border-b">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Editor Python</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-500">Listo</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={runTests}
            disabled={isRunning || !editor}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Ejecutando...</span>
              </>
            ) : (
              <>
                <span>▶️</span>
                <span>Ejecutar Pruebas</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 relative">
        <div 
          ref={editorContainerRef}
          className="w-full h-full"
          style={{ minHeight: '400px' }}
        />
        
        {isRunning && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-10">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="font-medium">Ejecutando código Python...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Test Results */}
      {testResults && (
        <div className="border-t bg-gray-50 p-4 max-h-48 overflow-y-auto">
          <div className="space-y-2">
            <div className={`flex items-center space-x-2 ${testResults.success ? 'text-green-600' : 'text-red-600'}`}>
              <span>{testResults.success ? '✅' : '❌'}</span>
              <span className="font-medium">
                Resultado: {testResults.success ? 'Exitoso' : 'Falló'}
              </span>
              {testResults.executionTime && (
                <span className="text-gray-500">
                  ({testResults.executionTime}ms)
                </span>
              )}
            </div>
            
            {testResults.output && (
              <div className="bg-black text-green-400 p-3 rounded font-mono text-sm">
                <pre>{testResults.output}</pre>
              </div>
            )}
            
            {testResults.error && (
              <div className="bg-red-100 text-red-800 p-3 rounded">
                <pre className="text-sm">{testResults.error}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedPyCodeEditor;
