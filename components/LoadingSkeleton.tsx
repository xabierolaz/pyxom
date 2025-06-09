'use client';

import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'editor' | 'exercise' | 'result' | 'progress' | 'card';
  animate?: boolean;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className = '', 
  variant = 'card',
  animate = true 
}) => {
  const baseClasses = `bg-gray-200 rounded ${animate ? 'animate-pulse' : ''}`;
  
  const renderSkeleton = () => {
    switch (variant) {
      case 'editor':
        return (
          <div className={`${className} min-h-[400px] p-4 bg-gray-900 rounded-lg`}>
            {/* Editor header */}
            <div className="flex items-center mb-4">
              <div className={`${baseClasses} h-3 w-16 mr-4 bg-gray-700`}></div>
              <div className={`${baseClasses} h-3 w-24 bg-gray-700`}></div>
            </div>
            
            {/* Code lines */}
            <div className="space-y-2">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className={`${baseClasses} h-4 w-6 mr-4 bg-gray-700`}></div>
                  <div className={`${baseClasses} h-4 bg-gray-700`} 
                       style={{ width: `${Math.random() * 40 + 30}%` }}></div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'exercise':
        return (
          <div className={`${className} p-6 bg-white rounded-lg border`}>
            {/* Title */}
            <div className={`${baseClasses} h-6 w-3/4 mb-4`}></div>
            
            {/* Description */}
            <div className="space-y-2 mb-6">
              <div className={`${baseClasses} h-4 w-full`}></div>
              <div className={`${baseClasses} h-4 w-5/6`}></div>
              <div className={`${baseClasses} h-4 w-4/5`}></div>
            </div>
            
            {/* Examples */}
            <div className="mb-4">
              <div className={`${baseClasses} h-5 w-24 mb-2`}></div>
              <div className={`${baseClasses} h-16 w-full`}></div>
            </div>
            
            {/* Buttons */}
            <div className="flex space-x-3">
              <div className={`${baseClasses} h-10 w-24`}></div>
              <div className={`${baseClasses} h-10 w-32`}></div>
            </div>
          </div>
        );
        
      case 'result':
        return (
          <div className={`${className} p-4 bg-white rounded-lg border`}>
            {/* Header */}
            <div className="flex items-center mb-4">
              <div className={`${baseClasses} h-6 w-6 mr-3 rounded-full`}></div>
              <div className={`${baseClasses} h-5 w-32`}></div>
            </div>
            
            {/* Content */}
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className={`${baseClasses} h-4 w-4 mr-3 rounded`}></div>
                  <div className={`${baseClasses} h-4 w-3/4`}></div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'progress':
        return (
          <div className={`${className} p-4 bg-white rounded-lg border`}>
            {/* Progress header */}
            <div className="flex items-center justify-between mb-3">
              <div className={`${baseClasses} h-4 w-28`}></div>
              <div className={`${baseClasses} h-4 w-12`}></div>
            </div>
            
            {/* Progress bar */}
            <div className={`${baseClasses} h-2 w-full mb-3`}></div>
            
            {/* Status */}
            <div className={`${baseClasses} h-3 w-40`}></div>
          </div>
        );
        
      case 'card':
      default:
        return (
          <div className={`${className} p-4 bg-white rounded-lg border`}>
            <div className={`${baseClasses} h-4 w-3/4 mb-3`}></div>
            <div className={`${baseClasses} h-3 w-1/2 mb-2`}></div>
            <div className={`${baseClasses} h-3 w-5/6`}></div>
          </div>
        );
    }
  };
  
  return renderSkeleton();
};

// Specialized loading components
export const EditorLoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingSkeleton variant="editor" className={className} />
);

export const ExerciseLoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingSkeleton variant="exercise" className={className} />
);

export const ResultLoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingSkeleton variant="result" className={className} />
);

export const ProgressLoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingSkeleton variant="progress" className={className} />
);

// Loading screen with multiple skeletons
export const ExercisePageLoadingSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto p-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Exercise description */}
      <div className="order-2 lg:order-1">
        <ExerciseLoadingSkeleton />
      </div>
      
      {/* Code editor */}
      <div className="order-1 lg:order-2">
        <EditorLoadingSkeleton />
        
        {/* Test results */}
        <div className="mt-4">
          <ResultLoadingSkeleton />
        </div>
      </div>
    </div>
  </div>
);

// Progress indicator loading
export const ProgressIndicatorSkeleton: React.FC = () => (
  <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
    <div className="max-w-7xl mx-auto px-6 py-3">
      <ProgressLoadingSkeleton />
    </div>
  </div>
);

// Button loading skeleton
export const ButtonLoadingSkeleton: React.FC<{ 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32'
  };
  
  return (
    <div className={`bg-gray-200 rounded animate-pulse ${sizeClasses[size]} ${className}`}></div>
  );
};

// Text loading skeleton
export const TextLoadingSkeleton: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {[...Array(lines)].map((_, i) => (
      <div 
        key={i}
        className="bg-gray-200 rounded animate-pulse h-4"
        style={{ 
          width: i === lines - 1 ? '70%' : '100%' 
        }}
      ></div>
    ))}
  </div>
);

// Monaco Editor specific loading
export const MonacoLoadingSkeleton: React.FC<{ height?: string }> = ({ 
  height = '400px' 
}) => (
  <div 
    className="bg-gray-900 rounded-lg flex items-center justify-center border"
    style={{ height }}
  >
    <div className="text-center">
      {/* Spinner */}
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
      
      {/* Text */}
      <div className="text-gray-400 text-sm space-y-2">
        <div>Cargando Editor de Código...</div>
        <div className="text-xs text-gray-500">Optimizando Monaco Editor</div>
      </div>
      
      {/* Fake progress bar */}
      <div className="mt-4 w-48 mx-auto">
        <div className="bg-gray-700 rounded-full h-1">
          <div className="bg-blue-500 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  </div>
);

// Python execution loading
export const PythonExecutionSkeleton: React.FC = () => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
    <div className="flex items-center">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600 mr-3"></div>
      <div className="text-yellow-800">
        <div className="font-medium mb-1">Ejecutando código Python...</div>
        <div className="text-sm text-yellow-600">
          Procesando en entorno seguro
        </div>
      </div>
    </div>
    
    {/* Progress dots */}
    <div className="flex justify-center space-x-1 mt-3">
      {[...Array(3)].map((_, i) => (
        <div 
          key={i}
          className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        ></div>
      ))}
    </div>
  </div>
);

export default LoadingSkeleton;
