// Performance Monitoring System for PyXom
// Tracks Core Web Vitals and Python execution performance

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
  
  // Page metrics
  pageLoadTime?: number;
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
    this.initializeCoreWebVitals();
    this.initializePageMetrics();
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
    });

    // Cumulative Layout Shift
    this.observeMetric('layout-shift', (entry) => {
      if (!entry.hadRecentInput) {
        this.metrics.cls = (this.metrics.cls || 0) + entry.value;
        const clsValue = this.metrics.cls || 0;
        this.recordEvent('core_vital', 'cls', clsValue);
      }
    });

    // Navigation timing for TTFB
    if (typeof window !== 'undefined' && performance.timing) {
      const ttfb = performance.timing.responseStart - performance.timing.navigationStart;
      this.updateMetric('ttfb', ttfb);
    }
  }

  private initializePageMetrics() {
    if (typeof window !== 'undefined') {
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
  }

  private observeMetric(type: string, callback: (entry: any) => void) {
    if (typeof window === 'undefined') return;
    
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
