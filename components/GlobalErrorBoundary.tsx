'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<unknown>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Enhanced Error Boundary to catch and handle React component errors
 * Addresses the "missing required error components" issue
 */
class GlobalErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details
    console.error('🚨 GlobalErrorBoundary caught an error:', error);
    console.error('Error Info:', errorInfo);

    // Update state with error info
    this.setState({ errorInfo });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report to error tracking service (if available)
    this.reportError(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps, prevState: ErrorBoundaryState) {
    // Reset error state if children changed (helps with hot reloading)
    if (prevState.hasError && !this.state.hasError) {
      console.log('✅ ErrorBoundary: Error cleared, normal operation resumed');
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private reportError = (error: Error, errorInfo: React.ErrorInfo) => {
    // This could be enhanced to send to error tracking services
    const errorReport = {
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      },
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Store in localStorage for debugging
    try {
      const existingReports = JSON.parse(localStorage.getItem('pyxom-error-reports') || '[]');
      existingReports.push(errorReport);
      // Keep only last 10 reports
      const recentReports = existingReports.slice(-10);
      localStorage.setItem('pyxom-error-reports', JSON.stringify(recentReports));
    } catch (e) {
      console.warn('Failed to store error report:', e);
    }
  };

  private handleRetry = () => {
    const { retryCount } = this.state;

    if (retryCount < 3) {
      console.log(`🔄 ErrorBoundary: Retry attempt ${retryCount + 1}`);

      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: retryCount + 1
      });
    } else {
      console.error('❌ ErrorBoundary: Max retry attempts reached');
      alert('Se han agotado los intentos de recuperación. Por favor, recarga la página.');
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private renderErrorUI() {
    const { error, errorInfo, retryCount } = this.state;

    // Check if this is a "missing required error components" error
    const isMissingComponentsError = error?.message?.includes('missing required error components') ||
                                   error?.message?.includes('refreshing') ||
                                   error?.stack?.includes('components');

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl border border-red-200 overflow-hidden">
          {/* Header */}
          <div className="bg-red-600 text-white p-6">
            <div className="flex items-center">
              <div className="text-4xl mr-4">🚨</div>
              <div>
                <h1 className="text-2xl font-bold">
                  {isMissingComponentsError ? 'Componentes Faltantes Detectados' : 'Error del Sistema'}
                </h1>
                <p className="text-red-100 mt-1">
                  {isMissingComponentsError
                    ? 'Se detectó el problema de componentes faltantes'
                    : 'Ha ocurrido un error inesperado en la aplicación'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Error Details */}
          <div className="p-6">
            {isMissingComponentsError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <div className="text-yellow-600 text-xl mr-3">⚠️</div>
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-2">
                      Problema Identificado: Missing Required Error Components
                    </h3>
                    <p className="text-yellow-700 text-sm">
                      Este error típicamente indica un problema con:
                    </p>
                    <ul className="text-yellow-700 text-sm mt-2 list-disc list-inside">
                      <li>Componentes React no cargados correctamente</li>
                      <li>Error Boundaries faltantes o mal configurados</li>
                      <li>Problemas de hidratación en Next.js</li>
                      <li>Imports dinámicos que fallan</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Mensaje del Error:</h3>
                <div className="bg-gray-50 border rounded p-3 font-mono text-sm text-red-600">
                  {error?.message || 'Error desconocido'}
                </div>
              </div>

              {errorInfo?.componentStack && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Componente Afectado:</h3>
                  <div className="bg-gray-50 border rounded p-3 font-mono text-xs text-gray-600 max-h-32 overflow-y-auto">
                    {errorInfo.componentStack}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Información del Sistema:</h3>
                <div className="text-blue-700 text-sm space-y-1">
                  <p><strong>Intentos de recuperación:</strong> {retryCount}/3</p>
                  <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
                  <p><strong>URL:</strong> {window.location.href}</p>
                  <p><strong>User Agent:</strong> {navigator.userAgent.substring(0, 50)}...</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex flex-wrap gap-3">
              {retryCount < 3 && (
                <button
                  onClick={this.handleRetry}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
                >
                  🔄 Intentar de Nuevo ({3 - retryCount} intentos restantes)
                </button>
              )}

              <button
                onClick={this.handleReload}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-medium"
              >
                🔃 Recargar Página
              </button>

              <button
                onClick={this.handleGoHome}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors font-medium"
              >
                🏠 Ir al Inicio
              </button>

              <a
                href="/test-simple"
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors font-medium no-underline"
              >
                🧪 Página de Prueba
              </a>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              <p>
                Si el problema persiste, abre las herramientas de desarrollador (F12)
                y revisa la consola para más detalles, o contacta al soporte técnico.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback as React.ComponentType<{ error?: Error }>;
        return <FallbackComponent error={this.state.error} />;
      }

      // Render default error UI
      return this.renderErrorUI();
    }

    // Render children normally
    return this.props.children;
  }
}

export default GlobalErrorBoundary;

// Higher-order component for easy wrapping
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<unknown>
) {
  const WrappedComponent = React.forwardRef<unknown, P>((props, ref) => (
    <GlobalErrorBoundary fallback={fallback}>
      {/* @ts-expect-error: ref type may not match for all components */}
      <Component {...props} ref={ref} />
    </GlobalErrorBoundary>
  ));

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Error boundary for specific error types
export class MonacoErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Check if this is a Monaco-related error
    const isMonacoError = error.message?.includes('monaco') ||
                         error.stack?.includes('monaco') ||
                         error.message?.includes('editor');

    return { hasError: isMonacoError, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Monaco Editor Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-96 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-red-600 text-4xl mb-3">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error en Monaco Editor</h3>
            <p className="text-red-600 mb-4">{this.state.error?.message}</p>
            <div className="space-x-2">
              <button
                onClick={() => this.setState({ hasError: false })}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reintentar
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Recargar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
