// Enhanced Python Code Editor with Security and UX Features
'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { 
  runPythonTestsEnhanced, 
  stopExecution,
  startAutoSave,
  stopAutoSave,
  loadAutoSave,
  getCodeHistory,
  checkUnsavedChanges,
  confirmExit,
  type ExecutionResult 
} from '@/utils/pythonRunner';

// Load Monaco Editor with fallback
const Editor = dynamic(
  () => import('@monaco-editor/react').catch(err => {
    console.error('Failed to load Monaco Editor:', err);
    return Promise.resolve(() => (
      <div className="bg-red-100 p-4 text-red-700 rounded">
        Error loading editor. Please try refreshing the page.
      </div>
    ));
  }),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-slate-100 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-2 mx-auto"></div>
          <p className="text-slate-600">Cargando editor de código...</p>
        </div>
      </div>
    )
  }
);

interface PyCodeEditorProps {
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

interface ProgressState {
  loading: boolean;
  progress: number;
  stage: string;
}

const PyCodeEditor: React.FC<PyCodeEditorProps> = ({
  initialCode,
  tests,
  onCodeChange,
  onTestResults
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [testResults, setTestResults] = useState<ExecutionResult | null>(null);
  const [progressState, setProgressState] = useState<ProgressState>({
    loading: false,
    progress: 0,
    stage: ''
  });
  
  // Auto-save and history
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [codeHistory, setCodeHistory] = useState<Array<{ code: string; timestamp: number }>>([]);
  
  // UI State
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const editorRef = useRef<any>(null);
  const originalCodeRef = useRef(initialCode);
  const stopButtonRef = useRef<HTMLButtonElement>(null);

  // Progress tracking
  const updateProgress = useCallback((progress: number, stage?: string) => {
    setProgressState(prev => ({
      ...prev,
      progress,
      stage: stage || prev.stage
    }));
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const getCode = () => code;
    const saveCallback = (savedCode: string) => {
      console.log('Auto-saved code');
    };

    startAutoSave(getCode, saveCallback);

    return () => {
      stopAutoSave();
    };
  }, [code]);

  // Load auto-saved code on mount
  useEffect(() => {
    const autoSaved = loadAutoSave();
    if (autoSaved && autoSaved !== initialCode) {
      const shouldRestore = window.confirm(
        'Se encontró código guardado automáticamente. ¿Quieres restaurarlo?'
      );
      if (shouldRestore) {
        setCode(autoSaved);
      }
    }
    
    // Load history
    setCodeHistory(getCodeHistory());
  }, [initialCode]);

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = checkUnsavedChanges(code, originalCodeRef.current);
    setHasUnsavedChanges(hasChanges);
  }, [code]);

  // Beforeunload event to prevent accidental closing
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Monaco Editor configuration
  const editorOptions = {
    minimap: { enabled: false },
    fontSize,
    lineNumbers: 'on' as const,
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 4,
    insertSpaces: true,
    wordWrap: 'on' as const,
    lineDecorationsWidth: 10,
    lineNumbersMinChars: 3,
    glyphMargin: false,
    folding: true,
    // Performance optimizations
    renderWhitespace: 'selection' as const,
    renderControlCharacters: false,
    renderIndentGuides: true,
    // Mobile optimizations
    scrollbar: {
      vertical: 'auto' as const,
      horizontal: 'auto' as const,
      verticalScrollbarSize: 12,
      horizontalScrollbarSize: 12
    }
  };
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    setIsEditorReady(true);
    
    // Configure Python-only language support
    monaco.languages.register({ id: 'python' });
    
    // Python syntax highlighting and tokens
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
    });    // Python autocomplete suggestions
    monaco.languages.registerCompletionItemProvider('python', {
      provideCompletionItems: (model: any, position: any) => {
        const suggestions = [
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
            label: 'for',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'for ${1:item} in ${2:iterable}:\n\t${3:pass}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'For loop statement'
          },
          {
            label: 'if',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'if ${1:condition}:\n\t${2:pass}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'If statement'
          },
          {
            label: 'def',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'def ${1:function_name}(${2:parameters}):\n\t${3:pass}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Function definition'
          }
        ];
        return { suggestions };
      }
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunCode();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Save action (already handled by auto-save)
      console.log('Code saved');
    });

    // Optimize for mobile
    if (window.innerWidth < 768) {
      editor.updateOptions({
        fontSize: 12,
        lineNumbers: 'off',
        glyphMargin: false,
        folding: false
      });
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onCodeChange?.(newCode);
    setError(null);
  };

  const handleRunCode = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setOutput('');
    setError(null);
    setExecutionTime(null);
    setTestResults(null);
    setProgressState({ loading: true, progress: 0, stage: 'Iniciando...' });
    setShowProgressBar(true);

    try {
      const testCode = tests.map(test => 
        `assert ${test.input} == ${test.expected}, f"Expected ${test.expected}, got {${test.input}}"`
      );

      updateProgress(10, 'Validando código...');
      
      const startTime = Date.now();
      const result = await runPythonTestsEnhanced(
        code,
        testCode,
        undefined,
        10000, // 10 second timeout
        (progress) => updateProgress(20 + (progress * 0.7), 'Ejecutando...')
      );

      const endTime = Date.now();
      const execTime = endTime - startTime;

      setExecutionTime(execTime);
      setTestResults(result);
      onTestResults?.(result);

      if (result.error) {
        setError(result.error);
      }
      
      if (result.output) {
        setOutput(result.output);
      }

      // Show results
      updateProgress(100, 'Completado');
      
      // Show timeout/stop status
      if (result.wasTimeout) {
        setError('⏱️ Ejecución interrumpida por timeout (10 segundos)');
      } else if (result.wasStopped) {
        setError('🛑 Ejecución detenida manualmente');
      }

    } catch (error) {
      setError(`Error during execution: ${error}`);
      updateProgress(0, 'Error');
    } finally {
      setIsRunning(false);
      setTimeout(() => {
        setShowProgressBar(false);
        setProgressState({ loading: false, progress: 0, stage: '' });
      }, 2000);
    }
  };

  const handleStopExecution = () => {
    stopExecution();
    setIsRunning(false);
    setProgressState(prev => ({ ...prev, stage: 'Deteniendo...' }));
  };

  const handleRestoreFromHistory = (historicalCode: string) => {
    setCode(historicalCode);
    setShowHistory(false);
  };

  const handleResetCode = () => {
    if (confirmExit(hasUnsavedChanges)) {
      setCode(initialCode);
      originalCodeRef.current = initialCode;
      setHasUnsavedChanges(false);
    }
  };

  // Format execution time
  const formatExecutionTime = (time: number) => {
    if (time < 1000) return `${time}ms`;
    return `${(time / 1000).toFixed(2)}s`;
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header with controls */}
      <div className="flex flex-wrap items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <button
            onClick={handleRunCode}
            disabled={!isEditorReady || isRunning}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <span>▶️</span>
            <span>{isRunning ? 'Ejecutando...' : 'Ejecutar'}</span>
          </button>
          
          {isRunning && (
            <button
              ref={stopButtonRef}
              onClick={handleStopExecution}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-2"
            >
              <span>⏹️</span>
              <span>Detener</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Settings */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Tamaño:</label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value={12}>12px</option>
              <option value={14}>14px</option>
              <option value={16}>16px</option>
              <option value={18}>18px</option>
            </select>
          </div>

          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
          >
            📚 Historial
          </button>

          <button
            onClick={handleResetCode}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            🔄 Reiniciar
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {showProgressBar && (
        <div className="px-4 py-2 bg-blue-50 border-b">
          <div className="flex items-center justify-between text-sm text-blue-700 mb-1">
            <span>{progressState.stage}</span>
            <span>{Math.round(progressState.progress)}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressState.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* History panel */}
      {showHistory && (
        <div className="px-4 py-2 bg-gray-50 border-b max-h-32 overflow-y-auto">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Historial de código:</h4>
          <div className="space-y-1">
            {codeHistory.map((item, index) => (
              <button
                key={index}
                onClick={() => handleRestoreFromHistory(item.code)}
                className="block w-full text-left px-2 py-1 text-xs bg-white rounded border hover:bg-gray-50 truncate"
              >
                {new Date(item.timestamp).toLocaleString()} - {item.code.substring(0, 50)}...
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Status bar */}
      <div className="px-4 py-1 bg-gray-100 border-b text-xs text-gray-600 flex justify-between">
        <span>
          {hasUnsavedChanges && <span className="text-orange-600">● </span>}
          Líneas: {code.split('\n').length} | Caracteres: {code.length}
        </span>
        {executionTime && (
          <span>Tiempo de ejecución: {formatExecutionTime(executionTime)}</span>
        )}
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Code editor */}
        <div className="flex-1 min-h-96">
          <Editor
            height="100%"
            defaultLanguage="python"
            value={code}
            onChange={handleCodeChange}
            onMount={handleEditorDidMount}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            options={editorOptions}
            loading={
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Cargando editor...</p>
                </div>
              </div>
            }
          />
        </div>

        {/* Output panel */}
        <div className="lg:w-1/3 border-l bg-gray-50 flex flex-col">
          {/* Results tabs */}
          <div className="flex border-b bg-white">
            <div className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold border-r">
              Resultados
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {/* Test results */}
            {testResults && (
              <div className="mb-4">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">
                  Resultados de Tests: {testResults.testRunResults.filter(t => t.passed).length}/{testResults.testRunResults.length}
                </h4>
                <div className="space-y-2">
                  {testResults.testRunResults.map((result, index) => (
                    <div 
                      key={index}
                      className={`p-2 rounded text-sm ${
                        result.passed 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>Test {index + 1}: {result.passed ? '✅' : '❌'}</span>
                        {result.executionTime && (
                          <span className="text-xs opacity-75">
                            {formatExecutionTime(result.executionTime)}
                          </span>
                        )}
                      </div>
                      {result.feedback && (
                        <div className="mt-1 text-xs opacity-90">{result.feedback}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Console output */}
            {output && (
              <div className="mb-4">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Salida:</h4>
                <pre className="bg-black text-green-400 p-3 rounded text-sm overflow-x-auto font-mono">
                  {output}
                </pre>
              </div>
            )}

            {/* Error output */}
            {error && (
              <div className="mb-4">
                <h4 className="font-semibold text-sm text-red-700 mb-2">Error:</h4>
                <pre className="bg-red-50 text-red-800 p-3 rounded text-sm overflow-x-auto border border-red-200">
                  {error}
                </pre>
              </div>
            )}

            {/* Empty state */}
            {!testResults && !output && !error && !isRunning && (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">🐍</div>
                <p>Ejecuta tu código para ver los resultados aquí</p>
                <p className="text-sm mt-1">Ctrl+Enter para ejecutar rápidamente</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PyCodeEditor;
