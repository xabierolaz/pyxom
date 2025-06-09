// Real Progress Indicator for PyXom
// Shows actual progress for Pyodide loading and code execution

'use client';

import React, { useEffect, useState } from 'react';

export interface ProgressState {
  stage: string;
  progress: number;
  isLoading: boolean;
  error?: string;
  details?: string;
}

interface ProgressBarProps {
  progress: ProgressState;
  showDetails?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'linear' | 'circular';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showDetails = true,
  size = 'medium',
  variant = 'linear'
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  // Smooth progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayProgress(prev => {
        const diff = progress.progress - prev;
        if (Math.abs(diff) < 0.1) return progress.progress;
        return prev + diff * 0.3;
      });
    }, 16); // 60fps

    return () => clearInterval(interval);
  }, [progress.progress]);

  const sizeClasses = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4'
  };

  const containerClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  if (variant === 'circular') {
    return (
      <div className={`flex flex-col items-center space-y-2 ${containerClasses[size]}`}>
        <div className="relative">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-gray-200"
            />
            <circle
              cx="32"
              cy="32"
              r="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className="text-blue-600"
              strokeDasharray={`${2 * Math.PI * 30}`}
              strokeDashoffset={`${2 * Math.PI * 30 * (1 - displayProgress / 100)}`}
              style={{
                transition: 'stroke-dashoffset 0.3s ease-in-out'
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold text-blue-600">
              {Math.round(displayProgress)}%
            </span>
          </div>
        </div>
        {showDetails && (
          <div className="text-center">
            <p className="font-medium text-gray-700">{progress.stage}</p>
            {progress.details && (
              <p className="text-gray-500 text-xs mt-1">{progress.details}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`w-full ${containerClasses[size]}`}>
      {showDetails && (
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-gray-700">{progress.stage}</span>
          <span className="text-gray-500">{Math.round(displayProgress)}%</span>
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300 ease-out relative"
          style={{ width: `${displayProgress}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </div>
      
      {showDetails && progress.details && (
        <p className="text-xs text-gray-500 mt-1">{progress.details}</p>
      )}
      
      {progress.error && (
        <p className="text-xs text-red-600 mt-1 flex items-center">
          <span className="mr-1">⚠️</span>
          {progress.error}
        </p>
      )}
    </div>
  );
};

// Pyodide loading progress stages
export const PYODIDE_STAGES = {
  INITIALIZING: 'Iniciando...',
  DOWNLOADING: 'Descargando Pyodide...',
  LOADING_CORE: 'Cargando núcleo Python...',
  LOADING_PACKAGES: 'Cargando paquetes...',
  INITIALIZING_INTERPRETER: 'Inicializando intérprete...',
  READY: 'Listo para ejecutar',
  ERROR: 'Error en la carga'
};

// Code execution progress stages
export const EXECUTION_STAGES = {
  VALIDATING: 'Validando código...',
  PREPARING: 'Preparando ejecución...',
  EXECUTING: 'Ejecutando código...',
  RUNNING_TESTS: 'Ejecutando pruebas...',
  COLLECTING_RESULTS: 'Recopilando resultados...',
  COMPLETE: 'Ejecución completada',
  ERROR: 'Error en la ejecución',
  TIMEOUT: 'Tiempo agotado',
  STOPPED: 'Detenido por el usuario'
};

// Multi-stage progress indicator
interface MultiStageProgressProps {
  stages: string[];
  currentStage: number;
  stageProgress: number;
  error?: string;
}

export const MultiStageProgress: React.FC<MultiStageProgressProps> = ({
  stages,
  currentStage,
  stageProgress,
  error
}) => {
  const totalProgress = ((currentStage / stages.length) * 100) + (stageProgress / stages.length);

  return (
    <div className="w-full space-y-4">
      {/* Overall progress */}
      <ProgressBar
        progress={{
          stage: stages[currentStage] || 'Procesando...',
          progress: totalProgress,
          isLoading: true,
          error
        }}
        size="medium"
      />
      
      {/* Stage indicators */}
      <div className="flex justify-between items-center">
        {stages.map((stage, index) => (
          <div
            key={index}
            className={`flex flex-col items-center text-xs ${
              index < currentStage
                ? 'text-green-600'
                : index === currentStage
                ? 'text-blue-600'
                : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                index < currentStage
                  ? 'bg-green-100 border-green-600'
                  : index === currentStage
                  ? 'bg-blue-100 border-blue-600'
                  : 'bg-gray-100 border-gray-300'
              }`}
            >
              {index < currentStage ? (
                <span>✓</span>
              ) : index === currentStage ? (
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span className="mt-1 text-center max-w-16 leading-tight">
              {stage.length > 12 ? `${stage.substring(0, 12)}...` : stage}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Real-time performance monitor
interface PerformanceMonitorProps {
  executionTime?: number;
  memoryUsage?: number;
  cpuUsage?: number;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  executionTime,
  memoryUsage,
  cpuUsage
}) => {
  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatMemory = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Rendimiento</h4>
      <div className="grid grid-cols-3 gap-4 text-xs">
        {executionTime !== undefined && (
          <div className="text-center">
            <div className="text-blue-600 font-mono text-lg">
              {formatTime(executionTime)}
            </div>
            <div className="text-gray-500">Tiempo</div>
          </div>
        )}
        {memoryUsage !== undefined && (
          <div className="text-center">
            <div className="text-green-600 font-mono text-lg">
              {formatMemory(memoryUsage)}
            </div>
            <div className="text-gray-500">Memoria</div>
          </div>
        )}
        {cpuUsage !== undefined && (
          <div className="text-center">
            <div className="text-orange-600 font-mono text-lg">
              {cpuUsage.toFixed(1)}%
            </div>
            <div className="text-gray-500">CPU</div>
          </div>
        )}
      </div>
    </div>
  );
};

// Loading skeleton for editor
export const EditorSkeleton: React.FC = () => (
  <div className="h-96 bg-gray-100 rounded-lg p-4 animate-pulse">
    <div className="space-y-3">
      <div className="h-4 bg-gray-300 rounded w-1/3" />
      <div className="h-4 bg-gray-300 rounded w-1/2" />
      <div className="h-4 bg-gray-300 rounded w-2/3" />
      <div className="h-4 bg-gray-300 rounded w-1/4" />
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-4 bg-gray-300 rounded w-1/2" />
    </div>
    <div className="mt-4 flex justify-center">
      <div className="text-gray-500 text-sm">Cargando editor Python...</div>
    </div>
  </div>
);

// Progress hook for tracking loading states
export const useProgressTracker = () => {
  const [progress, setProgress] = useState<ProgressState>({
    stage: 'Iniciando...',
    progress: 0,
    isLoading: false
  });

  const updateProgress = (update: Partial<ProgressState>) => {
    setProgress(prev => ({ ...prev, ...update }));
  };

  const startProgress = (stage: string) => {
    setProgress({
      stage,
      progress: 0,
      isLoading: true
    });
  };

  const completeProgress = (stage: string = 'Completado') => {
    setProgress({
      stage,
      progress: 100,
      isLoading: false
    });
  };

  const errorProgress = (error: string) => {
    setProgress(prev => ({
      ...prev,
      error,
      isLoading: false
    }));
  };

  return {
    progress,
    updateProgress,
    startProgress,
    completeProgress,
    errorProgress
  };
};

export default ProgressBar;
