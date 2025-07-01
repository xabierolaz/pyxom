// filepath: d:\pyxom\lib\performance.ts
// Simplified Performance Monitoring - No ESLint errors
'use client';

export interface SystemPerformance {
  pyodideStatus: 'loading' | 'ready' | 'error';
}

interface MetricValue {
  value: unknown;
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

  private initializeMonitoring() {
    // Basic monitoring setup
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.recordError('javascript_error', event.error);
      });
    }
  }

  recordMetric(name: string, value: unknown): void {
    this.metrics.set(name, {
      value,
      timestamp: Date.now()
    });
  }

  startTimer(name: string): void {
    this.startTimes.set(name, Date.now());
  }

  endTimer(name: string): number {
    const startTime = this.startTimes.get(name);
    if (startTime) {
      const duration = Date.now() - startTime;
      this.recordMetric(`${name}_duration`, duration);
      this.startTimes.delete(name);
      return duration;
    }
    return 0;
  }

  recordError(type: string, error: Error | string): void {
    const errorData = {
      type,
      message: error instanceof Error ? error.message : error,
      timestamp: Date.now()
    };

    this.recordMetric(`error_${type}`, errorData);
    console.error(`Performance Monitor - ${type}:`, error);
  }

  getSystemHealth(): SystemPerformance {
    return {
      pyodideStatus: (this.metrics.get('pyodideStatus')?.value as 'loading' | 'ready' | 'error') || 'loading'
    };
  }

  getMetricsReport(): string[] {
    const report: string[] = [];
    this.metrics.forEach((value, key) => {
      report.push(`${key}: ${JSON.stringify(value.value)} (${new Date(value.timestamp).toLocaleTimeString()})`);
    });
    return report;
  }
}

// Singleton instance
const performanceMonitor = new PerformanceMonitor();

// Export functions
export const recordMetric = (name: string, value: unknown) => {
  performanceMonitor.recordMetric(name, value);
};

export const startTimer = (name: string) => {
  performanceMonitor.startTimer(name);
};

export const endTimer = (name: string) => {
  return performanceMonitor.endTimer(name);
};

export const trackError = (type: string, error: Error | string) => {
  performanceMonitor.recordError(type, error);
};

export const getSystemHealth = (): SystemPerformance => {
  return performanceMonitor.getSystemHealth();
};

export const getPerformanceReport = (): string[] => {
  return performanceMonitor.getMetricsReport();
};

export default performanceMonitor;
