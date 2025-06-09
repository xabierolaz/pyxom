// Performance Monitoring React Components for PyXom

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PerformanceMetrics, getPerformanceTracker } from './performanceMonitoring';

// React hook for performance monitoring
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isTracking, setIsTracking] = useState(false);
  const tracker = useRef<ReturnType<typeof getPerformanceTracker> | null>(null);

  useEffect(() => {
    tracker.current = getPerformanceTracker();
    setIsTracking(true);

    // Update metrics every 5 seconds
    const interval = setInterval(() => {
      if (tracker.current) {
        setMetrics(tracker.current.getMetrics());
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      setIsTracking(false);
    };
  }, []);

  const trackPyodideLoad = (start: boolean) => {
    if (tracker.current) {
      if (start) {
        tracker.current.startPyodideLoad();
      } else {
        tracker.current.endPyodideLoad();
      }
    }
  };

  const trackCodeExecution = (start: boolean, success?: boolean) => {
    if (tracker.current) {
      if (start) {
        tracker.current.startCodeExecution();
      } else {
        tracker.current.endCodeExecution(success);
      }
    }
  };

  const trackMemoryUsage = (usage: number) => {
    if (tracker.current) {
      tracker.current.trackMemoryUsage(usage);
    }
  };

  const trackUserInteraction = (type: string, responseTime?: number) => {
    if (tracker.current) {
      tracker.current.trackUserInteraction(type, responseTime);
    }
  };

  const trackError = (error: string, context?: string) => {
    if (tracker.current) {
      tracker.current.trackError(error, context);
    }
  };

  const generateReport = () => {
    return tracker.current?.generateReport() || null;
  };

  return {
    metrics,
    isTracking,
    trackPyodideLoad,
    trackCodeExecution,
    trackMemoryUsage,
    trackUserInteraction,
    trackError,
    generateReport
  };
};

// Performance monitoring component
export const PerformanceMonitor: React.FC<{ visible?: boolean }> = ({ visible = false }) => {
  const { metrics, generateReport } = usePerformanceMonitoring();
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleGenerateReport = () => {
    const newReport = generateReport();
    setReport(newReport);
    setShowReport(true);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-xs">
      <h3 className="text-sm font-semibold mb-2">Rendimiento</h3>
      
      <div className="space-y-1 text-xs">
        {metrics.fcp && (
          <div className="flex justify-between">
            <span>FCP:</span>
            <span className={metrics.fcp > 2000 ? 'text-red-500' : 'text-green-500'}>
              {Math.round(metrics.fcp)}ms
            </span>
          </div>
        )}
        
        {metrics.lcp && (
          <div className="flex justify-between">
            <span>LCP:</span>
            <span className={metrics.lcp > 2500 ? 'text-red-500' : 'text-green-500'}>
              {Math.round(metrics.lcp)}ms
            </span>
          </div>
        )}
        
        {metrics.pyodideLoadTime && (
          <div className="flex justify-between">
            <span>Pyodide:</span>
            <span className={metrics.pyodideLoadTime > 5000 ? 'text-red-500' : 'text-green-500'}>
              {Math.round(metrics.pyodideLoadTime)}ms
            </span>
          </div>
        )}
        
        {metrics.memoryUsage && (
          <div className="flex justify-between">
            <span>Memoria:</span>
            <span>
              {Math.round(metrics.memoryUsage / (1024 * 1024))}MB
            </span>
          </div>
        )}
      </div>
      
      <button
        onClick={handleGenerateReport}
        className="mt-2 w-full text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
      >
        Generar Reporte
      </button>
      
      {showReport && report && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Reporte de Rendimiento</h3>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">Puntuaciones</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Core Web Vitals:</span>
                    <span className={report.scores.coreWebVitals > 80 ? 'text-green-500' : 'text-red-500'}>
                      {report.scores.coreWebVitals}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Python:</span>
                    <span className={report.scores.pythonPerformance > 80 ? 'text-green-500' : 'text-red-500'}>
                      {report.scores.pythonPerformance}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Experiencia:</span>
                    <span className={report.scores.userExperience > 80 ? 'text-green-500' : 'text-red-500'}>
                      {report.scores.userExperience}/100
                    </span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>General:</span>
                    <span className={report.scores.overall > 80 ? 'text-green-500' : 'text-red-500'}>
                      {report.scores.overall}/100
                    </span>
                  </div>
                </div>
              </div>
              
              {report.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium">Recomendaciones</h4>
                  <ul className="text-sm space-y-1">
                    {report.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-gray-600">• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowReport(false)}
              className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default getPerformanceTracker;
