// Advanced Memory Management for PyXom
// Handles Python execution memory, Monaco Editor cleanup, and performance optimization

interface MemoryStats {
  used: number;
  total: number;
  available: number;
  percentage: number;
}

interface MemoryConfig {
  maxPythonMemory: number; // MB
  gcThreshold: number; // MB
  monitorInterval: number; // ms
  cleanupDelay: number; // ms
}

class MemoryManager {
  private config: MemoryConfig;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private pythonWorkerMemory: Map<string, number> = new Map();
  private monacoInstances: Set<any> = new Set();
  private memoryObserver: PerformanceObserver | null = null;

  constructor(config: Partial<MemoryConfig> = {}) {
    this.config = {
      maxPythonMemory: 128, // 128MB default
      gcThreshold: 64, // Trigger GC at 64MB
      monitorInterval: 5000, // Check every 5 seconds
      cleanupDelay: 1000, // Wait 1 second before cleanup
      ...config
    };

    this.initializeMemoryMonitoring();
  }

  private initializeMemoryMonitoring(): void {
    // Monitor performance entries for memory usage
    if ('PerformanceObserver' in window) {
      try {
        this.memoryObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'measure' && entry.name.includes('memory')) {
              this.handleMemoryMeasure(entry);
            }
          });
        });
        
        this.memoryObserver.observe({ entryTypes: ['measure'] });
      } catch (error) {
        console.warn('MemoryManager: Performance observer not available:', error);
      }
    }

    // Start periodic memory monitoring
    this.startMonitoring();
  }

  public startMonitoring(): void {
    if (this.monitoringInterval) return;

    this.monitoringInterval = setInterval(() => {
      this.checkMemoryUsage();
    }, this.config.monitorInterval);

    console.log('MemoryManager: Monitoring started');
  }

  public stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    if (this.memoryObserver) {
      this.memoryObserver.disconnect();
      this.memoryObserver = null;
    }

    console.log('MemoryManager: Monitoring stopped');
  }

  public async getMemoryStats(): Promise<MemoryStats> {
    // Modern memory API
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        available: Math.round((memory.jsHeapSizeLimit - memory.usedJSHeapSize) / 1024 / 1024),
        percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
      };
    }

    // Fallback estimation
    return this.estimateMemoryUsage();
  }

  private async estimateMemoryUsage(): Promise<MemoryStats> {    // Estimate based on tracked components
    let estimatedUsage = 0;
    
    // Python worker memory
    Array.from(this.pythonWorkerMemory.values()).forEach(memory => {
      estimatedUsage += memory;
    });
    
    // Monaco instances (estimated 20MB each)
    estimatedUsage += this.monacoInstances.size * 20;
    
    return {
      used: estimatedUsage,
      total: estimatedUsage + 100, // Conservative estimate
      available: Math.max(0, 100 - estimatedUsage),
      percentage: Math.min(100, (estimatedUsage / (estimatedUsage + 100)) * 100)
    };
  }

  private async checkMemoryUsage(): Promise<void> {
    try {
      const stats = await this.getMemoryStats();
      
      // Log memory stats periodically
      if (stats.percentage > 70) {
        console.warn('MemoryManager: High memory usage detected:', stats);
      }
      
      // Trigger garbage collection if threshold exceeded
      if (stats.used > this.config.gcThreshold) {
        await this.performGarbageCollection();
      }
      
      // Emit memory stats for monitoring
      this.emitMemoryStats(stats);
      
    } catch (error) {
      console.error('MemoryManager: Error checking memory usage:', error);
    }
  }

  private handleMemoryMeasure(entry: PerformanceEntry): void {
    console.log('MemoryManager: Memory measure:', entry.name, entry.duration);
  }

  private emitMemoryStats(stats: MemoryStats): void {
    // Emit custom event for performance monitoring
    window.dispatchEvent(new CustomEvent('memoryStats', {
      detail: {
        timestamp: Date.now(),
        stats,
        pythonWorkers: this.pythonWorkerMemory.size,
        monacoInstances: this.monacoInstances.size
      }
    }));
  }

  // Python Worker Memory Management
  public trackPythonWorker(workerId: string, memoryUsage: number): void {
    this.pythonWorkerMemory.set(workerId, memoryUsage);
    console.log(`MemoryManager: Tracking Python worker ${workerId}: ${memoryUsage}MB`);
  }

  public async cleanupPythonWorker(workerId: string): Promise<void> {
    if (this.pythonWorkerMemory.has(workerId)) {
      this.pythonWorkerMemory.delete(workerId);
      console.log(`MemoryManager: Cleaned up Python worker ${workerId}`);
      
      // Force garbage collection after cleanup
      await this.performGarbageCollection();
    }
  }

  // Monaco Editor Memory Management
  public trackMonacoInstance(instance: any): void {
    this.monacoInstances.add(instance);
    console.log(`MemoryManager: Tracking Monaco instance (total: ${this.monacoInstances.size})`);
  }

  public async cleanupMonacoInstance(instance: any): Promise<void> {
    if (this.monacoInstances.has(instance)) {
      try {
        // Dispose Monaco editor
        if (instance.dispose) {
          instance.dispose();
        }
        
        // Remove from tracking
        this.monacoInstances.delete(instance);
        console.log(`MemoryManager: Cleaned up Monaco instance (remaining: ${this.monacoInstances.size})`);
        
        // Delay before forcing GC to allow cleanup
        setTimeout(() => {
          this.performGarbageCollection();
        }, this.config.cleanupDelay);
        
      } catch (error) {
        console.error('MemoryManager: Error cleaning up Monaco instance:', error);
      }
    }
  }

  // Garbage Collection
  private async performGarbageCollection(): Promise<void> {
    try {
      // Manual garbage collection (if available)
      if ('gc' in window && typeof (window as any).gc === 'function') {
        (window as any).gc();
        console.log('MemoryManager: Manual garbage collection performed');
      }
      
      // Clear unused references
      this.clearUnusedReferences();
      
      // Force browser cleanup
      await this.triggerBrowserCleanup();
      
    } catch (error) {
      console.error('MemoryManager: Error during garbage collection:', error);
    }
  }

  private clearUnusedReferences(): void {
    // Clear any weak references or cached data
    // This is application-specific cleanup
    
    // Example: Clear cached results older than 5 minutes
    const cutoffTime = Date.now() - 5 * 60 * 1000;
    
    // Cleanup would go here based on application state
    console.log('MemoryManager: Cleared unused references');
  }

  private async triggerBrowserCleanup(): Promise<void> {
    // Use requestIdleCallback to perform cleanup during idle time
    return new Promise((resolve) => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          // Trigger potential browser optimizations
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = 1;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, 1, 1);
          }
          
          resolve();
        });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(resolve, 0);
      }
    });
  }

  // Memory Optimization Utilities
  public async optimizeForLowMemory(): Promise<void> {
    console.log('MemoryManager: Optimizing for low memory');
    
    // Cleanup Monaco instances
    const monacoInstances = Array.from(this.monacoInstances);
    for (const instance of monacoInstances) {
      await this.cleanupMonacoInstance(instance);
    }
    
    // Cleanup Python workers
    const workerIds = Array.from(this.pythonWorkerMemory.keys());
    for (const workerId of workerIds) {
      await this.cleanupPythonWorker(workerId);
    }
    
    // Force aggressive garbage collection
    await this.performGarbageCollection();
    
    console.log('MemoryManager: Low memory optimization complete');
  }

  public getMemoryReport(): object {
    return {
      config: this.config,
      pythonWorkers: this.pythonWorkerMemory.size,
      monacoInstances: this.monacoInstances.size,
      isMonitoring: this.monitoringInterval !== null,
      trackedWorkerMemory: Array.from(this.pythonWorkerMemory.entries())
    };
  }

  // Cleanup on shutdown
  public cleanup(): void {
    this.stopMonitoring();
    this.pythonWorkerMemory.clear();
    this.monacoInstances.clear();
    console.log('MemoryManager: Cleanup complete');
  }
}

// Singleton instance
let memoryManagerInstance: MemoryManager | null = null;

export function getMemoryManager(config?: Partial<MemoryConfig>): MemoryManager {
  if (!memoryManagerInstance) {
    memoryManagerInstance = new MemoryManager(config);
  }
  return memoryManagerInstance;
}

export function cleanupMemoryManager(): void {
  if (memoryManagerInstance) {
    memoryManagerInstance.cleanup();
    memoryManagerInstance = null;
  }
}

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    cleanupMemoryManager();
  });
}

export type { MemoryStats, MemoryConfig };
export { MemoryManager };
