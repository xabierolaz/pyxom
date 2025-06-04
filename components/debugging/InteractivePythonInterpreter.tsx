// Interactive Python Interpreter
// Provides a REPL environment for testing code snippets

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Play, RotateCcw, Copy, Download } from 'lucide-react';

interface InteractivePythonInterpreterProps {
  isVisible: boolean;
  onClose: () => void;
  initialCode?: string;
}

interface InterpreterSession {
  input: string;
  output: string;
  error?: string;
  timestamp: number;
}

export default function InteractivePythonInterpreter({ 
  isVisible, 
  onClose, 
  initialCode = '' 
}: InteractivePythonInterpreterProps) {
  const [sessions, setSessions] = useState<InterpreterSession[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [pyodideReady, setPyodideReady] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isVisible) {
      // Initialize with welcome message
      setSessions([
        {
          input: '',
          output: 'Python Interactive Interpreter\nType your Python code and press Ctrl+Enter to execute\nUse "help()" for help, "clear()" to clear screen',
          timestamp: Date.now()
        }
      ]);
      
      if (initialCode) {
        setCurrentInput(initialCode);
      }

      // Focus input
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isVisible, initialCode]);

  useEffect(() => {
    // Scroll to bottom when new sessions are added
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [sessions]);

  const executeCode = async () => {
    if (!currentInput.trim()) return;

    setIsExecuting(true);
    
    const input = currentInput.trim();
    let output = '';
    let error = '';

    try {
      // Special commands
      if (input === 'clear()') {
        setSessions([]);
        setCurrentInput('');
        setIsExecuting(false);
        return;
      }

      if (input === 'help()') {
        output = `Available commands:
- clear() - Clear the terminal
- help() - Show this help
- Any valid Python expression or statement

Examples:
>>> 2 + 2
>>> print("Hello, World!")
>>> x = 5; print(x * 2)
>>> import math; math.pi`;
      } else {
        // Simulate Python execution
        // In a real implementation, this would use Pyodide
        output = await simulatePythonExecution(input);
      }
    } catch (e: any) {
      error = e.message || 'Error executing code';
    }

    const newSession: InterpreterSession = {
      input,
      output,
      error,
      timestamp: Date.now()
    };

    setSessions(prev => [...prev, newSession]);
    setCurrentInput('');
    setIsExecuting(false);
  };

  const simulatePythonExecution = async (code: string): Promise<string> => {
    // Simple simulation - in real implementation, use Pyodide
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate execution time

    // Handle some basic cases
    if (code.includes('print(')) {
      const match = code.match(/print\((.*)\)/);
      if (match) {
        const content = match[1].replace(/['"]/g, '');
        return content;
      }
    }

    if (code.match(/^\d+\s*[\+\-\*\/]\s*\d+$/)) {
      try {
        return String(eval(code));
      } catch {
        return 'SyntaxError: invalid syntax';
      }
    }

    if (code.includes('=') && !code.includes('==')) {
      return ''; // Variable assignment
    }

    // For other cases, return a generic response
    return `>>> ${code}\n(Output would appear here in real implementation)`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      executeCode();
    }
  };

  const clearTerminal = () => {
    setSessions([]);
  };

  const copySession = (session: InterpreterSession) => {
    const text = `>>> ${session.input}\n${session.output}${session.error ? `\nError: ${session.error}` : ''}`;
    navigator.clipboard.writeText(text);
  };

  const exportSessions = () => {
    const content = sessions
      .filter(session => session.input)
      .map(session => `>>> ${session.input}\n${session.output}${session.error ? `\nError: ${session.error}` : ''}`)
      .join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'python_session.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-4xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Terminal className="mr-2" size={20} />
            Intérprete Interactivo de Python
          </h2>
          <div className="flex gap-2">
            <button
              onClick={clearTerminal}
              className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-sm"
            >
              <RotateCcw size={16} />
              Limpiar
            </button>
            <button
              onClick={exportSessions}
              className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
            >
              <Download size={16} />
              Exportar
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>

        {/* Terminal */}
        <div className="flex-1 flex flex-col">
          {/* Output Area */}
          <div 
            ref={terminalRef}
            className="flex-1 bg-gray-900 text-green-400 font-mono text-sm p-4 overflow-auto"
          >
            {sessions.map((session, index) => (
              <div key={index} className="mb-2">
                {session.input && (
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-400">{'>>>'}</span>
                    <span className="text-white">{session.input}</span>
                    <button
                      onClick={() => copySession(session)}
                      className="ml-auto opacity-50 hover:opacity-100 text-gray-400"
                      title="Copy session"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                )}
                {session.output && (
                  <div className="text-green-400 whitespace-pre-wrap ml-6">
                    {session.output}
                  </div>
                )}
                {session.error && (
                  <div className="text-red-400 ml-6">
                    Error: {session.error}
                  </div>
                )}
              </div>
            ))}
            
            {isExecuting && (
              <div className="flex items-center gap-2 text-yellow-400">
                <span>{'>>>'}</span>
                <span>Ejecutando...</span>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t bg-gray-100 p-4">
            <div className="flex items-start gap-2">
              <span className="text-gray-600 font-mono">{'>>>'}</span>
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu código Python aquí... (Ctrl+Enter para ejecutar)"
                  className="w-full font-mono text-sm border rounded p-2 resize-none"
                  rows={3}
                  disabled={isExecuting}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    Presiona Ctrl+Enter para ejecutar
                  </span>
                  <button
                    onClick={executeCode}
                    disabled={isExecuting || !currentInput.trim()}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
                  >
                    <Play size={16} />
                    {isExecuting ? 'Ejecutando...' : 'Ejecutar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help */}
        <div className="border-t bg-gray-50 p-2">
          <div className="text-xs text-gray-600 text-center">
            <strong>Comandos especiales:</strong> clear() - limpiar pantalla | help() - ayuda | 
            <strong> Atajos:</strong> Ctrl+Enter - ejecutar código
          </div>
        </div>
      </div>
    </div>
  );
}
