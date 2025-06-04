'use client';

import React, { useState, useEffect } from 'react';
import { AttemptResult } from '@/types/types';

interface DebuggerPanelProps {
  code: string;
  breakpoints: Set<number>;
  result: AttemptResult | null;
  onClose: () => void;
}

interface DebugState {
  currentLine: number;
  variables: Record<string, any>;
  callStack: string[];
  output: string[];
  isRunning: boolean;
  isPaused: boolean;
}

export function DebuggerPanel({ code, breakpoints, result, onClose }: DebuggerPanelProps) {
  const [debugState, setDebugState] = useState<DebugState>({
    currentLine: 1,
    variables: {},
    callStack: [],
    output: [],
    isRunning: false,
    isPaused: false
  });

  const [stepMode, setStepMode] = useState<'into' | 'over' | 'out'>('over');

  useEffect(() => {
    // Initialize debugger with code
    initializeDebugger();
  }, [code, breakpoints]);

  const initializeDebugger = async () => {
    try {
      // Simulate debugging initialization
      // In a real implementation, this would set up a Python debugger
      setDebugState(prev => ({
        ...prev,
        variables: { '(globals)': 'Ready to debug' },
        callStack: ['<module>'],
        output: ['Debugger initialized']
      }));
    } catch (error) {
      console.error('Failed to initialize debugger:', error);
    }
  };

  const startDebugging = async () => {
    setDebugState(prev => ({ ...prev, isRunning: true, isPaused: false }));
    
    // Simulate step-by-step execution
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const lineNumber = i + 1;
      
      // Check if we hit a breakpoint
      if (breakpoints.has(lineNumber)) {
        setDebugState(prev => ({
          ...prev,
          currentLine: lineNumber,
          isPaused: true,
          output: [...prev.output, `Breakpoint hit at line ${lineNumber}`]
        }));
        return; // Stop execution at breakpoint
      }
      
      // Simulate variable updates
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate execution time
      setDebugState(prev => ({
        ...prev,
        currentLine: lineNumber,
        variables: { ...prev.variables, [`line_${lineNumber}`]: lines[i].trim() }
      }));
    }
    
    setDebugState(prev => ({ ...prev, isRunning: false, isPaused: false }));
  };

  const stepExecution = async () => {
    if (!debugState.isPaused) return;
    
    const nextLine = debugState.currentLine + 1;
    const lines = code.split('\n');
    
    if (nextLine <= lines.length) {
      setDebugState(prev => ({
        ...prev,
        currentLine: nextLine,
        variables: { ...prev.variables, [`line_${nextLine}`]: lines[nextLine - 1]?.trim() || '' },
        output: [...prev.output, `Stepped to line ${nextLine}`]
      }));
    } else {
      setDebugState(prev => ({ ...prev, isRunning: false, isPaused: false }));
    }
  };

  const continueExecution = () => {
    setDebugState(prev => ({ ...prev, isPaused: false }));
    startDebugging();
  };

  const stopDebugging = () => {
    setDebugState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      currentLine: 1,
      output: [...prev.output, 'Debugging stopped']
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-4/5 h-4/5 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Python Debugger</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center space-x-2 p-4 border-b bg-gray-50">
          <button
            onClick={startDebugging}
            disabled={debugState.isRunning}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            ▶ Start
          </button>
          
          <button
            onClick={stepExecution}
            disabled={!debugState.isPaused}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            ↓ Step
          </button>
          
          <button
            onClick={continueExecution}
            disabled={!debugState.isPaused}
            className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
          >
            ⏩ Continue
          </button>
          
          <button
            onClick={stopDebugging}
            disabled={!debugState.isRunning && !debugState.isPaused}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            ⏹ Stop
          </button>

          <div className="ml-4 flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Step Mode:</label>
            <select
              value={stepMode}
              onChange={(e) => setStepMode(e.target.value as any)}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="into">Step Into</option>
              <option value="over">Step Over</option>
              <option value="out">Step Out</option>
            </select>
          </div>

          <div className="ml-auto flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Line: {debugState.currentLine}
            </span>
            <div className={`w-3 h-3 rounded-full ${
              debugState.isRunning ? 'bg-green-500' : 
              debugState.isPaused ? 'bg-yellow-500' : 'bg-gray-400'
            }`} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Code Display */}
          <div className="flex-1 p-4 overflow-auto">
            <h3 className="font-semibold text-gray-800 mb-2">Code</h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-auto">
              {code.split('\n').map((line, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 ${
                    index + 1 === debugState.currentLine ? 'bg-yellow-600 text-black' : ''
                  }`}
                >
                  <span className="w-8 text-gray-500 text-right">
                    {index + 1}
                  </span>
                  {breakpoints.has(index + 1) && (
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                  )}
                  <span className="flex-1">{line || ' '}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Side Panel */}
          <div className="w-80 border-l flex flex-col">
            {/* Variables */}
            <div className="flex-1 p-4 border-b">
              <h3 className="font-semibold text-gray-800 mb-2">Variables</h3>
              <div className="space-y-1 text-sm">
                {Object.entries(debugState.variables).map(([name, value]) => (
                  <div key={name} className="flex items-start space-x-2">
                    <span className="font-mono text-blue-600 min-w-0 flex-shrink-0">
                      {name}:
                    </span>
                    <span className="font-mono text-gray-800 break-all">
                      {typeof value === 'string' ? value : JSON.stringify(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Call Stack */}
            <div className="flex-1 p-4 border-b">
              <h3 className="font-semibold text-gray-800 mb-2">Call Stack</h3>
              <div className="space-y-1 text-sm">
                {debugState.callStack.map((frame, index) => (
                  <div key={index} className="font-mono text-gray-700">
                    {frame}
                  </div>
                ))}
              </div>
            </div>

            {/* Output */}
            <div className="flex-1 p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Debug Output</h3>
              <div className="bg-gray-100 p-2 rounded text-sm h-32 overflow-auto">
                {debugState.output.map((line, index) => (
                  <div key={index} className="text-gray-700 font-mono">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        {result && (
          <div className="border-t p-4 bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-2">Test Results</h3>
            <div className="text-sm">
              <span className={`font-medium ${result.overallPassed ? 'text-green-600' : 'text-red-600'}`}>
                {result.overallPassed ? '✓ All tests passed' : '✗ Some tests failed'}
              </span>
              <span className="text-gray-600 ml-4">
                ({result.testsPassedCount}/{result.totalTests} tests passed)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
