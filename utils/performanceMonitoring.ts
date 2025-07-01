// Simple performance monitoring utility
import type { UserInteractionData, PerformanceMetrics } from '../types/monaco';

export interface PerformanceTracker {
  trackUserInteraction(event: string, data?: UserInteractionData): void;
  trackPerformance(metric: string, value: number): void;
  getMetrics(): PerformanceMetrics;
}

class SimplePerformanceTracker implements PerformanceTracker {
  private metrics: PerformanceMetrics = {};

  trackUserInteraction(event: string, data?: UserInteractionData): void {
    console.log(`Performance: ${event}`, data);
    this.metrics[event] = { timestamp: Date.now(), data };
  }

  trackPerformance(metric: string, value: number): void {
    console.log(`Performance metric: ${metric} = ${value}`);
    this.metrics[metric] = value;
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }
}

const performanceTracker = new SimplePerformanceTracker();

export function getPerformanceTracker(): PerformanceTracker {
  return performanceTracker;
}
