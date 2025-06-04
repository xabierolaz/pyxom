// Breakpoint Debugging System
// Allows users to set breakpoints and debug their code step by step

import React, { useState, useEffect } from 'react';
import { Bug, Play, Pause, ArrowRight, Circle, AlertCircle } from 'lucide-react';

interface BreakpointDebuggerProps {
  code: string;
  onCodeChange: (code: string) => void;
}

interface Breakpoint {
  line: number;
  enabled: boolean;
  condition?: string;
}

interface DebugState {
  currentLine: number;
  variables: Record<string, any>;
  callStack: string[];
  isRunning: boolean;
  isPaused: boolean;
  output: string;
  error?: string;
}

export default function BreakpointDebugger({ code, onCodeChange }: BreakpointDebuggerProps) {
  const [breakpoints, setBreakpoints] = useState<Breakpoint[]>([]);
  const [debugState, setDebugState] = useState<DebugState>({
    currentLine: -1,
    variables: {},
    callStack: [],
    isRunning: false,
    isPaused: false,
    output: '',
  });
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  const toggleBreakpoint = (lineNumber: number) => {
    setBreakpoints(prev => {
      const existingIndex = prev.findIndex(bp => bp.line === lineNumber);
      if (existingIndex >= 0) {
        // Remove breakpoint
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        // Add breakpoint
        return [...prev, { line: lineNumber, enabled: true }];
      }
    });
  };

  const toggleBreakpointEnabled = (lineNumber: number) => {
    setBreakpoints(prev =>
      prev.map(bp =>
        bp.line === lineNumber ? { ...bp, enabled: !bp.enabled } : bp
      )
    );
  };

  const startDebugging = async () => {
    setDebugState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      currentLine: 1,
      output: '',
      error: undefined
    }));
    setShowDebugPanel(true);

    // Simulate debugging execution
    await simulateDebugExecution();
  };

  const simulateDebugExecution = async () => {
    const lines = code.split('\n').filter(line => line.trim());
    
    for (let i = 0; i < lines.length; i++) {
      const lineNumber = i + 1;
      
      // Check if there's a breakpoint at this line
      const breakpoint = breakpoints.find(bp => bp.line === lineNumber && bp.enabled);
      
      setDebugState(prev => ({
        ...prev,
        currentLine: lineNumber,
        variables: {
          ...prev.variables,
          // Simulate variable updates
          [`var_${lineNumber}`]: `value_${lineNumber}`
        }
      }));

      if (breakpoint) {
        setDebugState(prev => ({ ...prev, isPaused: true }));
        
        // Wait for user to continue
        await new Promise<void>(resolve => {
          const continueExecution = () => {
            setDebugState(prev => ({ ...prev, isPaused: false }));
            resolve();
          };
          
          // Store the continue function for the continue button
          (window as any).debugContinue = continueExecution;
        });
      }

      // Small delay to visualize execution
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setDebugState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      currentLine: -1
    }));
  };

  const continueExecution = () => {
    if ((window as any).debugContinue) {
      (window as any).debugContinue();
    }
  };

  const stepOver = () => {
    // Implement step over functionality
    console.log('Step over');
  };

  const stepInto = () => {
    // Implement step into functionality
    console.log('Step into');
  };

  const stopDebugging = () => {
    setDebugState({
      currentLine: -1,
      variables: {},
      callStack: [],
      isRunning: false,
      isPaused: false,
      output: '',
    });
    setShowDebugPanel(false);
  };

  const codeLines = code.split('\n');

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-gray-100 border-b">
        <button
          onClick={startDebugging}
          disabled={debugState.isRunning}
          className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          <Bug size={16} />
          {debugState.isRunning ? 'Debugging...' : 'Iniciar Debug'}
        </button>
        
        {debugState.isRunning && (
          <>
            <button
              onClick={continueExecution}
              disabled={!debugState.isPaused}
              className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              <Play size={16} />
              Continuar
            </button>
            
            <button
              onClick={stepOver}
              disabled={!debugState.isPaused}
              className="flex items-center gap-1 px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
            >
              <ArrowRight size={16} />
              Paso a Paso
            </button>
            
            <button
              onClick={stopDebugging}
              className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <Pause size={16} />
              Detener
            </button>
          </>
        )}
      </div>

      {/* Code Editor with Breakpoints */}
      <div className="flex flex-1">
        <div className="flex-1 relative">
          {/* Breakpoint Gutter */}
          <div className="absolute left-0 top-0 w-12 bg-gray-50 border-r h-full z-10">
            {codeLines.map((_, index) => {
              const lineNumber = index + 1;
              const hasBreakpoint = breakpoints.some(bp => bp.line === lineNumber);
              const isCurrentLine = debugState.currentLine === lineNumber;
              
              return (
                <div
                  key={lineNumber}
                  className={`h-6 flex items-center justify-center cursor-pointer hover:bg-gray-200 ${
                    isCurrentLine ? 'bg-yellow-200' : ''
                  }`}
                  onClick={() => toggleBreakpoint(lineNumber)}
                  title={`Click to toggle breakpoint on line ${lineNumber}`}
                >
                  {hasBreakpoint && (
                    <Circle
                      size={12}
                      className="text-red-500 fill-current"
                    />
                  )}
                  {isCurrentLine && (
                    <ArrowRight
                      size={12}
                      className="text-yellow-600 absolute right-1"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Code Display */}
          <div className="ml-12 p-4 font-mono text-sm">
            {codeLines.map((line, index) => {
              const lineNumber = index + 1;
              const isCurrentLine = debugState.currentLine === lineNumber;
              
              return (
                <div
                  key={lineNumber}
                  className={`flex ${
                    isCurrentLine ? 'bg-yellow-100' : ''
                  }`}
                >
                  <span className="w-8 text-gray-400 text-right mr-4">
                    {lineNumber}
                  </span>
                  <span>{line}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Debug Panel */}
        {showDebugPanel && (
          <div className="w-80 border-l bg-white">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-700 flex items-center">
                <Bug className="mr-2" size={16} />
                Panel de Debug
              </h3>
            </div>

            {/* Variables */}
            <div className="p-4 border-b">
              <h4 className="font-medium text-gray-600 mb-2">Variables</h4>
              {Object.keys(debugState.variables).length > 0 ? (
                <div className="space-y-1">
                  {Object.entries(debugState.variables).map(([name, value]) => (
                    <div key={name} className="flex justify-between text-sm">
                      <span className="text-blue-600">{name}</span>
                      <span className="text-gray-800">{String(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">No variables</p>
              )}
            </div>

            {/* Call Stack */}
            <div className="p-4 border-b">
              <h4 className="font-medium text-gray-600 mb-2">Call Stack</h4>
              {debugState.callStack.length > 0 ? (
                <div className="space-y-1">
                  {debugState.callStack.map((frame, index) => (
                    <div key={index} className="text-sm text-gray-700 font-mono">
                      {frame}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">Empty stack</p>
              )}
            </div>

            {/* Status */}
            <div className="p-4">
              <h4 className="font-medium text-gray-600 mb-2">Estado</h4>
              <div className="text-sm">
                {debugState.isRunning ? (
                  <div className="flex items-center text-green-600">
                    <Circle size={8} className="mr-2 fill-current" />
                    {debugState.isPaused ? 'Pausado' : 'Ejecutando'}
                  </div>
                ) : (
                  <div className="flex items-center text-gray-600">
                    <Circle size={8} className="mr-2" />
                    Detenido
                  </div>
                )}
              </div>
              
              {debugState.currentLine > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  Línea actual: {debugState.currentLine}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Breakpoints List */}
      {breakpoints.length > 0 && (
        <div className="border-t p-4 bg-gray-50">
          <h4 className="font-medium text-gray-700 mb-2">Breakpoints</h4>
          <div className="space-y-1">
            {breakpoints.map((bp, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Línea {bp.line}</span>
                <div className="flex items-center gap-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={bp.enabled}
                      onChange={() => toggleBreakpointEnabled(bp.line)}
                      className="mr-1"
                    />
                    Habilitado
                  </label>
                  <button
                    onClick={() => toggleBreakpoint(bp.line)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
