// Python Tutor Integration Component
// Provides step-by-step code visualization like mooc.fi

import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Eye, Code } from 'lucide-react';

interface PythonTutorProps {
  code: string;
  isVisible: boolean;
  onClose: () => void;
}

interface ExecutionStep {
  line: number;
  variables: Record<string, any>;
  stack: string[];
  output: string;
  error?: string;
}

export default function PythonTutorIntegration({ code, isVisible, onClose }: PythonTutorProps) {
  const [steps, setSteps] = useState<ExecutionStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isVisible && code) {
      generateExecutionSteps();
    }
  }, [isVisible, code]);

  const generateExecutionSteps = async () => {
    setIsLoading(true);
    try {
      // Simulate step-by-step execution analysis
      // In a real implementation, this would use a Python tracing mechanism
      const mockSteps: ExecutionStep[] = [
        {
          line: 1,
          variables: {},
          stack: ['<module>'],
          output: ''
        },
        {
          line: 2,
          variables: { 'x': 5 },
          stack: ['<module>'],
          output: ''
        },
        {
          line: 3,
          variables: { 'x': 5, 'y': 10 },
          stack: ['<module>'],
          output: ''
        },
        {
          line: 4,
          variables: { 'x': 5, 'y': 10, 'result': 15 },
          stack: ['<module>'],
          output: '15\n'
        }
      ];
      setSteps(mockSteps);
      setCurrentStep(0);
    } catch (error) {
      console.error('Error generating execution steps:', error);
    }
    setIsLoading(false);
  };

  const openExternalPythonTutor = () => {
    const encoded = encodeURIComponent(code);
    const url = `https://pythontutor.com/iframe-embed.html#code=${encoded}&origin=opt-frontend.js&py=3&curInstr=0`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const playExecution = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, playbackSpeed);
  };

  const resetExecution = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-6xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Eye className="mr-2" size={20} />
            Visualizador de Código Python
          </h2>
          <div className="flex gap-2">
            <button
              onClick={openExternalPythonTutor}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
            >
              Abrir en Python Tutor
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex">
          {/* Code Panel */}
          <div className="w-1/2 border-r">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-700 flex items-center">
                <Code className="mr-2" size={16} />
                Código
              </h3>
            </div>
            <div className="p-4 h-full overflow-auto">
              <pre className="text-sm font-mono">
                {code.split('\n').map((line, index) => (
                  <div
                    key={index}
                    className={`px-2 py-1 ${
                      currentStepData && currentStepData.line === index + 1
                        ? 'bg-yellow-200 border-l-4 border-yellow-500'
                        : ''
                    }`}
                  >
                    <span className="text-gray-400 mr-3">{index + 1}</span>
                    {line}
                  </div>
                ))}
              </pre>
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="w-1/2 flex flex-col">
            {/* Variables */}
            <div className="flex-1 p-4 border-b">
              <h3 className="font-semibold text-gray-700 mb-3">Variables</h3>
              {currentStepData && Object.keys(currentStepData.variables).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(currentStepData.variables).map(([name, value]) => (
                    <div key={name} className="flex justify-between p-2 bg-blue-50 rounded">
                      <span className="font-mono text-blue-700">{name}</span>
                      <span className="font-mono text-blue-900">
                        {typeof value === 'string' ? `"${value}"` : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No hay variables definidas</p>
              )}
            </div>

            {/* Call Stack */}
            <div className="flex-1 p-4 border-b">
              <h3 className="font-semibold text-gray-700 mb-3">Pila de Llamadas</h3>
              {currentStepData && currentStepData.stack.length > 0 ? (
                <div className="space-y-1">
                  {currentStepData.stack.map((frame, index) => (
                    <div key={index} className="p-2 bg-green-50 rounded font-mono text-green-700">
                      {frame}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Pila vacía</p>
              )}
            </div>

            {/* Output */}
            <div className="flex-1 p-4">
              <h3 className="font-semibold text-gray-700 mb-3">Salida</h3>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm h-24 overflow-auto">
                {currentStepData?.output || 'Sin salida'}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={resetExecution}
                className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                title="Reiniciar"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={prevStep}
                className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                disabled={currentStep === 0}
                title="Paso anterior"
              >
                <SkipBack size={16} />
              </button>
              <button
                onClick={playExecution}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                title={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                onClick={nextStep}
                className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                disabled={currentStep >= steps.length - 1}
                title="Siguiente paso"
              >
                <SkipForward size={16} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Velocidad:</label>
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value={2000}>Lenta</option>
                  <option value={1000}>Normal</option>
                  <option value={500}>Rápida</option>
                </select>
              </div>
              <span className="text-sm text-gray-600">
                Paso {currentStep + 1} de {steps.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
