import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface PerformanceMetrics {
  userId?: string;
  sessionId: string;
  exerciseId?: string;
  metrics: {
    pyodideLoadTime?: number;
    codeExecutionTime: number;
    testExecutionTime?: number;
    memoryUsage?: number;
    cpuUsage?: number;
    errorCount: number;
    hintsUsed: number;
    debugSteps: number;
  };
  userAgent: string;
  timestamp: string;
}

export interface SystemPerformance {
  pyodideStatus: 'loading' | 'ready' | 'error';
  memoryUsage: number;
  executionQueue: number;
  activeUsers: number;
  averageResponseTime: number;
}

class PerformanceMonitor {
  private sessionId: string;
  private metrics: Map<string, any> = new Map();
  private startTimes: Map<string, number> = new Map();

  constructor() {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    // Monitor page load performance
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        this.recordMetric('pageLoadTime', navigation.loadEventEnd - navigation.fetchStart);
      });

      // Monitor memory usage
      this.monitorMemoryUsage();
      
      // Monitor errors
      window.addEventListener('error', (event) => {
        this.recordError('javascript_error', event.error);
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.recordError('promise_rejection', event.reason);
      });
    }
  }

  // Start timing an operation
  startTiming(operation: string): void {
    this.startTimes.set(operation, performance.now());
  }

  // End timing an operation and record the duration
  endTiming(operation: string): number {
    const startTime = this.startTimes.get(operation);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.recordMetric(`${operation}_duration`, duration);
      this.startTimes.delete(operation);
      return duration;
    }
    return 0;
  }

  // Record a custom metric
  recordMetric(name: string, value: any): void {
    this.metrics.set(name, {
      value,
      timestamp: Date.now()
    });
  }

  // Record an error
  recordError(type: string, error: any): void {
    const errorCount = this.metrics.get('errorCount') || 0;
    this.recordMetric('errorCount', errorCount + 1);
    this.recordMetric(`error_${type}`, {
      message: error?.message || String(error),
      stack: error?.stack,
      timestamp: Date.now()
    });
  }

  // Monitor memory usage
  private monitorMemoryUsage(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.recordMetric('memoryUsage', {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        });
      }, 30000); // Every 30 seconds
    }
  }

  // Get current performance snapshot
  getPerformanceSnapshot(): SystemPerformance {
    const memoryMetric = this.metrics.get('memoryUsage');
    const memoryUsage = memoryMetric ? memoryMetric.value.used / memoryMetric.value.limit : 0;

    return {
      pyodideStatus: this.metrics.get('pyodideStatus')?.value || 'loading',
      memoryUsage,
      executionQueue: this.metrics.get('executionQueue')?.value || 0,
      activeUsers: this.metrics.get('activeUsers')?.value || 1,
      averageResponseTime: this.metrics.get('averageResponseTime')?.value || 0
    };
  }

  // Send performance data to Firebase
  async sendPerformanceData(userId?: string, exerciseId?: string): Promise<void> {
    try {
      const performanceData: PerformanceMetrics = {
        userId,
        sessionId: this.sessionId,
        exerciseId,
        metrics: {
          codeExecutionTime: this.metrics.get('code_execution_duration')?.value || 0,
          testExecutionTime: this.metrics.get('test_execution_duration')?.value || 0,
          pyodideLoadTime: this.metrics.get('pyodide_load_duration')?.value || 0,
          memoryUsage: this.metrics.get('memoryUsage')?.value?.used || 0,
          errorCount: this.metrics.get('errorCount') || 0,
          hintsUsed: this.metrics.get('hintsUsed') || 0,
          debugSteps: this.metrics.get('debugSteps') || 0
        },
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };

      await addDoc(collection(db, 'performance_metrics'), {
        ...performanceData,
        createdAt: serverTimestamp()
      });

      // Clear metrics after sending
      this.metrics.clear();
    } catch (error) {
      console.error('Failed to send performance data:', error);
    }
  }

  // Generate performance report
  generateReport(): string {
    const metrics = Array.from(this.metrics.entries()).map(([key, value]) => {
      return `${key}: ${JSON.stringify(value.value)} (${new Date(value.timestamp).toLocaleTimeString()})`;
    }).join('\n');

    return `Performance Report - Session: ${this.sessionId}\n${'='.repeat(50)}\n${metrics}`;
  }

  // Monitor Pyodide performance specifically
  monitorPyodidePerformance(pyodide: any): void {
    if (!pyodide) return;

    // Monitor package loading
    const originalLoadPackage = pyodide.loadPackage;
    pyodide.loadPackage = (...args: any[]) => {
      this.startTiming('package_load');
      return originalLoadPackage.apply(pyodide, args).finally(() => {
        this.endTiming('package_load');
      });
    };

    // Monitor code execution
    const originalRunPython = pyodide.runPython;
    pyodide.runPython = (code: string, ...args: any[]) => {
      this.startTiming('code_execution');
      try {
        const result = originalRunPython.call(pyodide, code, ...args);
        this.endTiming('code_execution');
        return result;
      } catch (error) {
        this.endTiming('code_execution');
        this.recordError('python_execution', error);
        throw error;
      }
    };

    this.recordMetric('pyodideStatus', 'ready');
  }

  // Track user interactions
  trackInteraction(type: string, data?: any): void {
    const interactionCount = this.metrics.get(`interaction_${type}`) || 0;
    this.recordMetric(`interaction_${type}`, interactionCount + 1);
    
    if (data) {
      this.recordMetric(`interaction_${type}_data`, data);
    }
  }

  // Calculate performance score
  getPerformanceScore(): number {
    const codeExecTime = this.metrics.get('code_execution_duration')?.value || 0;
    const errorCount = this.metrics.get('errorCount') || 0;
    const memoryUsage = this.metrics.get('memoryUsage')?.value?.used || 0;
    const memoryLimit = this.metrics.get('memoryUsage')?.value?.limit || 1;

    // Calculate score based on speed, reliability, and efficiency
    const speedScore = Math.max(0, 100 - (codeExecTime / 10)); // Penalty for slow execution
    const reliabilityScore = Math.max(0, 100 - (errorCount * 10)); // Penalty for errors
    const efficiencyScore = Math.max(0, 100 - (memoryUsage / memoryLimit * 100)); // Penalty for high memory usage

    return (speedScore + reliabilityScore + efficiencyScore) / 3;
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Helper functions
export const trackCodeExecution = (duration: number) => {
  performanceMonitor.recordMetric('code_execution_duration', duration);
};

export const trackTestExecution = (duration: number) => {
  performanceMonitor.recordMetric('test_execution_duration', duration);
};

export const trackHintUsage = () => {
  const current = performanceMonitor['metrics'].get('hintsUsed') || 0;
  performanceMonitor.recordMetric('hintsUsed', current + 1);
};

export const trackDebugStep = () => {
  const current = performanceMonitor['metrics'].get('debugSteps') || 0;
  performanceMonitor.recordMetric('debugSteps', current + 1);
};

export const trackError = (type: string, error: any) => {
  performanceMonitor.recordError(type, error);
};

export default PerformanceMonitor;
