/**
 * Monaco Editor type definitions
 */

// Window interface extensions for Monaco
declare global {
  interface Window {
    monaco?: typeof import('monaco-editor');
    require?: {
      config: (config: { paths: Record<string, string> }) => void;
      (modules: string[], callback: () => void, errorCallback?: (error: Error) => void): void;
    };
    [key: string]: unknown;
  }
}

// Monaco Editor types
export type MonacoEditor = typeof import('monaco-editor');

// Performance monitoring types
export interface UserInteractionData {
  timestamp?: number;
  userId?: string;
  sessionId?: string;
  element?: string;
  value?: string | number | boolean;
  metadata?: Record<string, unknown>;
}

export interface PerformanceMetrics {
  loadTime?: number;
  renderTime?: number;
  errorCount?: number;
  userInteractions?: UserInteractionData[];
  memoryUsage?: number;
  [key: string]: unknown;
}

// HTTP Request/Response types for security config
export interface HttpRequest {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  query?: Record<string, unknown>;
}

export interface HttpResponse {
  status?: number;
  headers?: Record<string, string>;
  body?: unknown;
  json?: (data: unknown) => void;
  send?: (data: unknown) => void;
  setHeader?: (name: string, value: string) => void;
  end?: () => void;
}

export interface NextFunction {
  (error?: unknown): void;
}

export {};
