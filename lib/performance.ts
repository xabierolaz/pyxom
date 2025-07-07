'use client';

import type { PyodideInterface } from 'pyodide';

// Tipos para las métricas y errores
type MetricValueType = string | number | boolean | Record<string, unknown>;

export interface SystemPerformance {
  pyodideStatus: 'loading' | 'ready' | 'error';
}

interface MetricValue {
  value: MetricValueType;
  timestamp: number;
}

class PerformanceMonitor {
  private sessionId: string;
  private metrics: Map<string, MetricValue> = new Map();
  private startTimes: Map<string, number> = new Map();

  constructor() {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.initializeMonitoring();
  }

  private initializeMonitoring(): void {
    if (typeof window !== 'undefined' && typeof performance !== 'undefined') {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          this.recordMetric('pageLoadTime', navigation.loadEventEnd - navigation.fetchStart);
        }
      });

      window.addEventListener('error', (event: ErrorEvent) => {
        this.recordError('javascript_error', event.error);
      });

      window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
        this.recordError('promise_rejection', event.reason);
      });
    }
  }

  public startTiming(operation: string): void {
    this.startTimes.set(operation, performance.now());
  }

  public endTiming(operation: string): number {
    const startTime = this.startTimes.get(operation);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.recordMetric(`${operation}_duration`, duration);
      this.startTimes.delete(operation);
      return duration;
    }
    return 0;
  }

  public recordMetric(name: string, value: MetricValueType): void {
    this.metrics.set(name, {
      value,
      timestamp: Date.now()
    });
  }

  public recordError(type: string, error: unknown): void {
    const errorCount = (this.metrics.get('errorCount')?.value as number ?? 0);
    this.recordMetric('errorCount', errorCount + 1);

    let message = String(error);
    let stack: string | undefined;

    if (error instanceof Error) {
      message = error.message;
      stack = error.stack;
    }

    this.recordMetric(`error_${type}`, {
      message,
      stack,
      timestamp: Date.now()
    });
  }

  public getPerformanceSnapshot(): SystemPerformance {
    return {
      pyodideStatus: (this.metrics.get('pyodideStatus')?.value as SystemPerformance['pyodideStatus']) ?? 'loading',
    };
  }

  public generateReport(): string {
    const metrics = Array.from(this.metrics.entries()).map(([key, value]) => {
      const formattedValue = typeof value.value === 'object' ? JSON.stringify(value.value) : value.value;
      return `${key}: ${formattedValue} (${new Date(value.timestamp).toLocaleTimeString()})`;
    }).join('\n');

    return `Performance Report - Session: ${this.sessionId}\n${'='.repeat(50)}\n${metrics}`;
  }

  public monitorPyodidePerformance(pyodide: PyodideInterface): void {
    const originalLoadPackage = pyodide.loadPackage;
    pyodide.loadPackage = (...args: Parameters<typeof originalLoadPackage>) => {
      this.startTiming('package_load');
      return originalLoadPackage(...args).finally(() => {
        this.endTiming('package_load');
      });
    };

    const originalRunPython = pyodide.runPython;
    pyodide.runPython = (code: string, globals?: Record<string, unknown>) => {
      this.startTiming('code_execution');
      try {
        const result = originalRunPython(code, globals);
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

  public trackInteraction(type: string, data?: Record<string, unknown>): void {
    const interactionCount = (this.metrics.get(`interaction_${type}`)?.value as number ?? 0);
    this.recordMetric(`interaction_${type}`, interactionCount + 1);

    if (data) {
      this.recordMetric(`interaction_${type}_data`, data);
    }
  }

  // Calculate performance score
  getPerformanceScore(): number {
    const codeExecTime = (this.metrics.get('code_execution_duration')?.value as number | undefined) || 0;
    const errorCount = (this.metrics.get('errorCount')?.value as number | undefined) || 0;
    const memoryMetrics = this.metrics.get('memoryUsage')?.value as { used: number; limit: number } | undefined;
    const memoryUsage = memoryMetrics?.used || 0;
    const memoryLimit = memoryMetrics?.limit || 1;

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
  const current = (performanceMonitor['metrics'].get('hintsUsed')?.value as number | undefined) || 0;
  performanceMonitor.recordMetric('hintsUsed', current + 1);
};

export const trackDebugStep = () => {
  const current = (performanceMonitor['metrics'].get('debugSteps')?.value as number | undefined) || 0;
  performanceMonitor.recordMetric('debugSteps', current + 1);
};

export const trackError = (type: string, error: unknown) => {
  performanceMonitor.recordError(type, error);
};

export default PerformanceMonitor;
