'use client';

import React, { useState, useEffect } from 'react';

interface PythonTutorVisualizationProps {
  code: string;
  onClose: () => void;
}

interface ExecutionStep {
  line: number;
  event: 'call' | 'line' | 'return' | 'exception';
  globals: Record<string, any>;
  locals: Record<string, any>;
  stack: any[];
  stdout: string;
  stderr: string;
}

export function PythonTutorVisualization({ code, onClose }: PythonTutorVisualizationProps) {
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1000); // ms between steps

  useEffect(() => {
    generateExecutionTrace();
  }, [code]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < executionSteps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          if (next >= executionSteps.length - 1) {
            setIsPlaying(false);
          }
          return next;
        });
      }, playSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, executionSteps.length, playSpeed]);

  const generateExecutionTrace = async () => {
    // Simulate execution trace generation
    // In a real implementation, this would use a Python tracer
    const lines = code.split('\n').filter(line => line.trim());
    const steps: ExecutionStep[] = [];
    
    let globals = {};
    let locals = {};
    let stdout = '';
    
    // Add initial step
    steps.push({
      line: 0,
      event: 'call',
      globals: { ...globals },
      locals: { ...locals },
      stack: [],
      stdout,
      stderr: ''
    });

    // Simulate line-by-line execution
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Simulate variable assignments and operations
      if (line.includes('=') && !line.includes('==')) {
        const [varName] = line.split('=').map(s => s.trim());
        if (varName && !varName.includes(' ')) {
          locals[varName] = `<simulated_value_${i}>`;
        }
      }
      
      if (line.includes('print(')) {
        stdout += `Output from line ${i + 1}\n`;
      }

      steps.push({
        line: i + 1,
        event: 'line',
        globals: { ...globals },
        locals: { ...locals },
        stack: ['<module>'],
        stdout,
        stderr: ''
      });
    }

    // Add final step
    steps.push({
      line: lines.length,
      event: 'return',
      globals: { ...globals },
      locals: { ...locals },
      stack: [],
      stdout,
      stderr: ''
    });

    setExecutionSteps(steps);
    setCurrentStep(0);
  };

  const currentStepData = executionSteps[currentStep];
  const codeLines = code.split('\n');

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    if (currentStep < executionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentStep(parseInt(e.target.value));
    setIsPlaying(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-5/6 h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-blue-50">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-800">Python Tutor - Code Visualization</h2>
            <div className="text-sm text-gray-600">
              Step {currentStep + 1} of {executionSteps.length}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4 p-4 border-b bg-gray-50">
          <button
            onClick={handleStepBackward}
            disabled={currentStep === 0}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            ⬅ Back
          </button>
          
          <button
            onClick={handlePlay}
            disabled={currentStep >= executionSteps.length - 1}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          
          <button
            onClick={handleStepForward}
            disabled={currentStep >= executionSteps.length - 1}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Forward ➡
          </button>

          <div className="flex-1 mx-4">
            <input
              type="range"
              min="0"
              max={executionSteps.length - 1}
              value={currentStep}
              onChange={handleSliderChange}
              className="w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Speed:</label>
            <select
              value={playSpeed}
              onChange={(e) => setPlaySpeed(parseInt(e.target.value))}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value={2000}>Slow</option>
              <option value={1000}>Normal</option>
              <option value={500}>Fast</option>
              <option value={100}>Very Fast</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Code Display */}
          <div className="w-1/2 p-4 border-r overflow-auto">
            <h3 className="font-semibold text-gray-800 mb-3">Code</h3>
            <div className="bg-gray-900 text-gray-300 p-4 rounded font-mono text-sm">
              {codeLines.map((line, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 py-1 ${
                    currentStepData && index + 1 === currentStepData.line 
                      ? 'bg-yellow-400 text-black px-2 rounded' 
                      : ''
                  }`}
                >
                  <span className="w-8 text-gray-500 text-right select-none">
                    {index + 1}
                  </span>
                  <span className="flex-1">{line || ' '}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visualization */}
          <div className="w-1/2 p-4 overflow-auto">
            <div className="space-y-6">
              {/* Global Variables */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Global Variables</h3>
                <div className="bg-blue-50 p-3 rounded border">
                  {currentStepData && Object.keys(currentStepData.globals).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(currentStepData.globals).map(([name, value]) => (
                        <div key={name} className="flex items-center space-x-2">
                          <div className="bg-blue-200 px-2 py-1 rounded text-sm font-mono">
                            {name}
                          </div>
                          <div className="text-gray-600">→</div>
                          <div className="bg-white px-2 py-1 rounded border text-sm font-mono">
                            {typeof value === 'string' ? value : JSON.stringify(value)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm italic">No global variables</div>
                  )}
                </div>
              </div>

              {/* Local Variables */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Local Variables</h3>
                <div className="bg-green-50 p-3 rounded border">
                  {currentStepData && Object.keys(currentStepData.locals).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(currentStepData.locals).map(([name, value]) => (
                        <div key={name} className="flex items-center space-x-2">
                          <div className="bg-green-200 px-2 py-1 rounded text-sm font-mono">
                            {name}
                          </div>
                          <div className="text-gray-600">→</div>
                          <div className="bg-white px-2 py-1 rounded border text-sm font-mono">
                            {typeof value === 'string' ? value : JSON.stringify(value)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm italic">No local variables</div>
                  )}
                </div>
              </div>

              {/* Output */}
              {currentStepData && currentStepData.stdout && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Output</h3>
                  <div className="bg-gray-100 p-3 rounded border font-mono text-sm whitespace-pre-wrap">
                    {currentStepData.stdout}
                  </div>
                </div>
              )}

              {/* Call Stack */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Call Stack</h3>
                <div className="bg-purple-50 p-3 rounded border">
                  {currentStepData && currentStepData.stack.length > 0 ? (
                    <div className="space-y-1">
                      {currentStepData.stack.map((frame, index) => (
                        <div key={index} className="bg-purple-200 px-2 py-1 rounded text-sm font-mono">
                          {frame}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm italic">Empty call stack</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600">
              {currentStepData && (
                <>
                  Event: <span className="font-mono bg-gray-200 px-1 rounded">{currentStepData.event}</span>
                  {currentStepData.line > 0 && (
                    <span className="ml-4">
                      Line: <span className="font-mono bg-gray-200 px-1 rounded">{currentStepData.line}</span>
                    </span>
                  )}
                </>
              )}
            </div>
            <div className="text-gray-500">
              Python Tutor-style visualization for understanding code execution
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
