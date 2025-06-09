// Memory Monitoring System for PyXom
// Implements critical order 9: Real-time memory usage tracking and alerts

import React from 'react';

interface MemoryMetrics {
  used: number;
  total: number;
  percentage: number;
  timestamp: number;
  pyodideMemory?: number;
  workerMemory?: number;
  cacheMemory?: number;
}

interface MemoryAlert {
  level: 'warning' | 'critical' | 'severe';
  message: string;
  timestamp: number;
  metrics: MemoryMetrics;
  suggestions: string[];
}

interface MemoryConfig {
  warningThreshold: number; // percentage
  criticalThreshold: number; // percentage
  severeThreshold: number; // percentage
  monitoringInterval: number; // milliseconds
  alertCooldown: number; // milliseconds
  maxHistoryEntries: number;
}

class MemoryMonitor {
  private config: MemoryConfig;
  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private history: MemoryMetrics[] = [];
  private lastAlert: number = 0;
  private callbacks: Set<(metrics: MemoryMetrics) => void> = new Set();
  private alertCallbacks: Set<(alert: MemoryAlert) => void> = new Set();

  constructor(config: Partial<MemoryConfig> = {}) {
    this.config = {
      warningThreshold: 70,
      criticalThreshold: 85,
      severeThreshold: 95,
      monitoringInterval: 5000, // 5 seconds
      alertCooldown: 30000, // 30 seconds
      maxHistoryEntries: 100,
      ...config
    };
  }

  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(async () => {
      try {
        const metrics = await this.collectMetrics();
        this.addToHistory(metrics);
        this.checkAlerts(metrics);
        this.notifyCallbacks(metrics);
      } catch (error) {
        console.error('Memory monitoring error:', error);
      }
    }, this.config.monitoringInterval);
  }

  stopMonitoring(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  private async collectMetrics(): Promise<MemoryMetrics> {
    const memoryInfo = this.getMemoryInfo();
    const pyodideMemory = await this.getPyodideMemoryUsage();
    const cacheMemory = await this.getCacheMemoryUsage();

    return {
      used: memoryInfo.used,
      total: memoryInfo.total,
      percentage: (memoryInfo.used / memoryInfo.total) * 100,
      timestamp: Date.now(),
      pyodideMemory,
      cacheMemory
    };
  }

  private getMemoryInfo(): { used: number; total: number } {
    if ('memory' in performance) {
      const perfMemory = (performance as any).memory;
      return {
        used: perfMemory.usedJSHeapSize || 0,
        total: perfMemory.totalJSHeapSize || perfMemory.jsHeapSizeLimit || 0
      };
    }

    // Fallback estimation
    return {
      used: this.estimateMemoryUsage(),
      total: this.estimateMaxMemory()
    };
  }

  private estimateMemoryUsage(): number {
    // Rough estimation based on DOM elements and objects
    const domElements = document.querySelectorAll('*').length;
    const estimatedPerElement = 1000; // bytes per element (rough estimate)
    return domElements * estimatedPerElement;
  }

  private estimateMaxMemory(): number {
    // Conservative estimate for browser memory limit
    return 2 * 1024 * 1024 * 1024; // 2GB
  }

  private async getPyodideMemoryUsage(): Promise<number> {
    try {
      // This would need to be implemented based on Pyodide's memory reporting
      // For now, return 0 as a placeholder
      return 0;
    } catch {
      return 0;
    }
  }

  private async getCacheMemoryUsage(): Promise<number> {
    try {
      // Estimate based on localStorage and IndexedDB usage
      let totalSize = 0;

      // localStorage size
      const localStorageSize = JSON.stringify(localStorage).length;
      totalSize += localStorageSize;

      // IndexedDB size (estimated)
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        totalSize += estimate.usage || 0;
      }

      return totalSize;
    } catch {
      return 0;
    }
  }

  private addToHistory(metrics: MemoryMetrics): void {
    this.history.push(metrics);
    if (this.history.length > this.config.maxHistoryEntries) {
      this.history.shift();
    }
  }

  private checkAlerts(metrics: MemoryMetrics): void {
    const now = Date.now();
    if (now - this.lastAlert < this.config.alertCooldown) {
      return; // Still in cooldown
    }

    let alertLevel: MemoryAlert['level'] | null = null;
    let message = '';
    let suggestions: string[] = [];

    if (metrics.percentage >= this.config.severeThreshold) {
      alertLevel = 'severe';
      message = `Critical memory usage: ${metrics.percentage.toFixed(1)}%`;
      suggestions = [
        'Close other browser tabs',
        'Restart the application',
        'Clear browser cache',
        'Reduce code complexity'
      ];
    } else if (metrics.percentage >= this.config.criticalThreshold) {
      alertLevel = 'critical';
      message = `High memory usage detected: ${metrics.percentage.toFixed(1)}%`;
      suggestions = [
        'Save your work and refresh the page',
        'Close unnecessary browser tabs',
        'Clear cached data'
      ];
    } else if (metrics.percentage >= this.config.warningThreshold) {
      alertLevel = 'warning';
      message = `Memory usage is elevated: ${metrics.percentage.toFixed(1)}%`;
      suggestions = [
        'Consider simplifying your code',
        'Clear output history',
        'Close unused features'
      ];
    }

    if (alertLevel) {
      const alert: MemoryAlert = {
        level: alertLevel,
        message,
        timestamp: now,
        metrics,
        suggestions
      };

      this.lastAlert = now;
      this.notifyAlertCallbacks(alert);
    }
  }

  private notifyCallbacks(metrics: MemoryMetrics): void {
    this.callbacks.forEach(callback => {
      try {
        callback(metrics);
      } catch (error) {
        console.error('Memory monitoring callback error:', error);
      }
    });
  }

  private notifyAlertCallbacks(alert: MemoryAlert): void {
    this.alertCallbacks.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Memory alert callback error:', error);
      }
    });
  }

  onMetricsUpdate(callback: (metrics: MemoryMetrics) => void): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  onAlert(callback: (alert: MemoryAlert) => void): () => void {
    this.alertCallbacks.add(callback);
    return () => this.alertCallbacks.delete(callback);
  }

  getCurrentMetrics(): MemoryMetrics | null {
    return this.history[this.history.length - 1] || null;
  }

  getHistory(): MemoryMetrics[] {
    return [...this.history];
  }

  getAverageUsage(minutes: number = 5): number {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    const recentMetrics = this.history.filter(m => m.timestamp > cutoff);
    
    if (recentMetrics.length === 0) return 0;
    
    const sum = recentMetrics.reduce((acc, m) => acc + m.percentage, 0);
    return sum / recentMetrics.length;
  }

  getPeakUsage(minutes: number = 5): number {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    const recentMetrics = this.history.filter(m => m.timestamp > cutoff);
    
    if (recentMetrics.length === 0) return 0;
    
    return Math.max(...recentMetrics.map(m => m.percentage));
  }

  getMemoryTrend(): 'increasing' | 'decreasing' | 'stable' {
    if (this.history.length < 5) return 'stable';

    const recent = this.history.slice(-5);
    const first = recent[0].percentage;
    const last = recent[recent.length - 1].percentage;
    const diff = last - first;

    if (Math.abs(diff) < 2) return 'stable';
    return diff > 0 ? 'increasing' : 'decreasing';
  }

  async forceGarbageCollection(): Promise<void> {
    // Force garbage collection if available
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }

    // Trigger cleanup in various components
    if ('pyodide' in window && (window as any).pyodide) {
      try {
        // Trigger Python garbage collection
        (window as any).pyodide.runPython('import gc; gc.collect()');
      } catch (error) {
        console.warn('Could not trigger Python garbage collection:', error);
      }
    }

    // Clear some internal caches
    this.clearOldHistory();
  }

  private clearOldHistory(): void {
    const cutoff = Date.now() - (30 * 60 * 1000); // Keep last 30 minutes
    this.history = this.history.filter(m => m.timestamp > cutoff);
  }

  getStats(): {
    isMonitoring: boolean;
    historyLength: number;
    averageUsage: number;
    peakUsage: number;
    trend: string;
    lastAlert: number;
  } {
    return {
      isMonitoring: this.isMonitoring,
      historyLength: this.history.length,
      averageUsage: this.getAverageUsage(),
      peakUsage: this.getPeakUsage(),
      trend: this.getMemoryTrend(),
      lastAlert: this.lastAlert
    };
  }
}

// React hook for memory monitoring
export function useMemoryMonitor(config?: Partial<MemoryConfig>) {
  const [metrics, setMetrics] = React.useState<MemoryMetrics | null>(null);
  const [alert, setAlert] = React.useState<MemoryAlert | null>(null);
  const monitorRef = React.useRef<MemoryMonitor | null>(null);

  React.useEffect(() => {
    monitorRef.current = new MemoryMonitor(config);
    
    const unsubscribeMetrics = monitorRef.current.onMetricsUpdate(setMetrics);
    const unsubscribeAlerts = monitorRef.current.onAlert(setAlert);
    
    monitorRef.current.startMonitoring();

    return () => {
      unsubscribeMetrics();
      unsubscribeAlerts();
      monitorRef.current?.stopMonitoring();
    };
  }, []);

  const forceGC = React.useCallback(() => {
    return monitorRef.current?.forceGarbageCollection();
  }, []);

  const getStats = React.useCallback(() => {
    return monitorRef.current?.getStats();
  }, []);

  return {
    metrics,
    alert,
    forceGC,
    getStats
  };
}

// Global memory monitor instance
let globalMemoryMonitor: MemoryMonitor | null = null;

export const getMemoryMonitor = (config?: Partial<MemoryConfig>): MemoryMonitor => {
  if (!globalMemoryMonitor) {
    globalMemoryMonitor = new MemoryMonitor(config);
  }
  return globalMemoryMonitor;
};

export { MemoryMonitor };
export type { MemoryMetrics, MemoryAlert, MemoryConfig };
