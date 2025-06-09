// Performance Monitoring System for PyXom
// Tracks Core Web Vitals and Python execution performance

'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface PerformanceMetrics {
  // Core Web Vitals
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  
  // Python execution metrics
  pyodideLoadTime?: number;
  codeExecutionTime?: number;
  memoryUsage?: number;
  
  // User interaction metrics
  totalInteractions?: number;
  averageResponseTime?: number;
  errorRate?: number;
  
  // Page performance
  pageLoadTime?: number;
  resourceLoadTime?: number;
  domContentLoadedTime?: number;
}

export interface PerformanceEvent {
  type: 'core_vital' | 'python_execution' | 'user_interaction' | 'error';
  metric: string;
  value: number;
  timestamp: number;
  details?: any;
}

class PerformanceTracker {
  private metrics: PerformanceMetrics = {};
  private events: PerformanceEvent[] = [];
  private observers: PerformanceObserver[] = [];
  private startTimes: Map<string, number> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeCoreWebVitals();
      this.initializePageMetrics();
    }
  }

  private initializeCoreWebVitals() {
    // First Contentful Paint
    this.observeMetric('paint', (entry) => {
      if (entry.name === 'first-contentful-paint') {
        this.updateMetric('fcp', entry.startTime);
      }
    });

    // Largest Contentful Paint
    this.observeMetric('largest-contentful-paint', (entry) => {
      this.updateMetric('lcp', entry.startTime);
    });

    // First Input Delay
    this.observeMetric('first-input', (entry) => {
      this.updateMetric('fid', entry.processingStart - entry.startTime);
    });    // Cumulative Layout Shift
    this.observeMetric('layout-shift', (entry) => {
      if (!entry.hadRecentInput) {
        this.metrics.cls = (this.metrics.cls || 0) + entry.value;
        const clsValue = this.metrics.cls || 0;
        this.recordEvent('core_vital', 'cls', clsValue);
      }
    });

    // Navigation timing for TTFB
    if (performance.timing) {
      const ttfb = performance.timing.responseStart - performance.timing.navigationStart;
      this.updateMetric('ttfb', ttfb);
    }
  }

  private initializePageMetrics() {
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.updateMetric('pageLoadTime', loadTime);

      // DOM Content Loaded
      if (performance.timing) {
        const domContentLoaded = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
        this.updateMetric('domContentLoadedTime', domContentLoaded);
      }
    });
  }

  private observeMetric(type: string, callback: (entry: any) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          callback(entry);
        }
      });
      
      observer.observe({ entryTypes: [type] });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Failed to observe ${type}:`, error);
    }
  }

  private updateMetric(metric: keyof PerformanceMetrics, value: number) {
    this.metrics[metric] = value;
    this.recordEvent('core_vital', metric, value);
  }

  private recordEvent(type: PerformanceEvent['type'], metric: string, value: number, details?: any) {
    const event: PerformanceEvent = {
      type,
      metric,
      value,
      timestamp: Date.now(),
      details
    };
    
    this.events.push(event);
    
    // Keep only last 1000 events
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }

  // Python execution tracking
  startPyodideLoad() {
    this.startTimes.set('pyodideLoad', performance.now());
  }

  endPyodideLoad() {
    const startTime = this.startTimes.get('pyodideLoad');
    if (startTime) {
      const loadTime = performance.now() - startTime;
      this.updateMetric('pyodideLoadTime', loadTime);
      this.startTimes.delete('pyodideLoad');
    }
  }

  startCodeExecution() {
    this.startTimes.set('codeExecution', performance.now());
  }

  endCodeExecution(success: boolean = true) {
    const startTime = this.startTimes.get('codeExecution');
    if (startTime) {
      const executionTime = performance.now() - startTime;
      this.updateMetric('codeExecutionTime', executionTime);
      this.recordEvent('python_execution', 'execution_time', executionTime, { success });
      this.startTimes.delete('codeExecution');
    }
  }

  trackMemoryUsage(usage: number) {
    this.updateMetric('memoryUsage', usage);
    this.recordEvent('python_execution', 'memory_usage', usage);
  }

  trackUserInteraction(type: string, responseTime?: number) {
    this.metrics.totalInteractions = (this.metrics.totalInteractions || 0) + 1;
    
    if (responseTime) {
      const currentAvg = this.metrics.averageResponseTime || 0;
      const total = this.metrics.totalInteractions;
      this.metrics.averageResponseTime = ((currentAvg * (total - 1)) + responseTime) / total;
      
      this.recordEvent('user_interaction', type, responseTime);
    }
  }

  trackError(error: string, context?: string) {
    this.metrics.errorRate = (this.metrics.errorRate || 0) + 1;
    this.recordEvent('error', 'error_occurrence', 1, { error, context });
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getEvents(): PerformanceEvent[] {
    return [...this.events];
  }

  // Generate performance report
  generateReport(): {
    summary: PerformanceMetrics;
    scores: {
      coreWebVitals: number;
      pythonPerformance: number;
      userExperience: number;
      overall: number;
    };
    recommendations: string[];
  } {
    const metrics = this.getMetrics();
    const recommendations: string[] = [];
    
    // Score Core Web Vitals (0-100)
    let coreWebVitalsScore = 100;
    
    if (metrics.fcp && metrics.fcp > 2000) {
      coreWebVitalsScore -= 20;
      recommendations.push('Optimizar tiempo de primera pintura de contenido');
    }
    
    if (metrics.lcp && metrics.lcp > 2500) {
      coreWebVitalsScore -= 25;
      recommendations.push('Optimizar tiempo de pintura del elemento más grande');
    }
    
    if (metrics.fid && metrics.fid > 100) {
      coreWebVitalsScore -= 20;
      recommendations.push('Reducir delay de primera interacción');
    }
    
    if (metrics.cls && metrics.cls > 0.1) {
      coreWebVitalsScore -= 15;
      recommendations.push('Minimizar cambios de diseño acumulativos');
    }
    
    if (metrics.ttfb && metrics.ttfb > 800) {
      coreWebVitalsScore -= 20;
      recommendations.push('Optimizar tiempo hasta el primer byte');
    }

    // Score Python Performance (0-100)
    let pythonScore = 100;
    
    if (metrics.pyodideLoadTime && metrics.pyodideLoadTime > 5000) {
      pythonScore -= 30;
      recommendations.push('Optimizar carga de Pyodide');
    }
    
    if (metrics.codeExecutionTime && metrics.codeExecutionTime > 2000) {
      pythonScore -= 25;
      recommendations.push('Optimizar tiempo de ejecución de código');
    }
    
    if (metrics.memoryUsage && metrics.memoryUsage > 50 * 1024 * 1024) {
      pythonScore -= 20;
      recommendations.push('Optimizar uso de memoria');
    }

    // Score User Experience (0-100)
    let userExperienceScore = 100;
    
    if (metrics.averageResponseTime && metrics.averageResponseTime > 500) {
      userExperienceScore -= 25;
      recommendations.push('Mejorar tiempo de respuesta de la interfaz');
    }
    
    if (metrics.errorRate && metrics.errorRate > 0) {
      userExperienceScore -= Math.min(50, metrics.errorRate * 10);
      recommendations.push('Reducir tasa de errores');
    }

    const overallScore = Math.round((coreWebVitalsScore + pythonScore + userExperienceScore) / 3);

    return {
      summary: metrics,
      scores: {
        coreWebVitals: Math.max(0, coreWebVitalsScore),
        pythonPerformance: Math.max(0, pythonScore),
        userExperience: Math.max(0, userExperienceScore),
        overall: Math.max(0, overallScore)
      },
      recommendations
    };
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
let performanceTrackerInstance: PerformanceTracker | null = null;

export const getPerformanceTracker = (): PerformanceTracker => {
  if (!performanceTrackerInstance) {
    performanceTrackerInstance = new PerformanceTracker();
  }
  return performanceTrackerInstance;
};

// React hook for performance monitoring
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isTracking, setIsTracking] = useState(false);
  const tracker = useRef<PerformanceTracker | null>(null);

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
                  <ul className="text-sm space-y-1">                    {report.recommendations.map((rec: string, index: number) => (
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
