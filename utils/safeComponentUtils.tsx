'use client';

import React, { Suspense } from 'react';
import GlobalErrorBoundary from '@/components/GlobalErrorBoundary';

/**
 * Safe component wrapper that handles loading and error states
 * Prevents "missing required error components" issues
 */
interface SafeComponentWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  loadingMessage?: string;
}

const SafeComponentWrapper: React.FC<SafeComponentWrapperProps> = ({
  children,
  fallback,
  errorFallback,
  loadingMessage = "Cargando componente..."
}) => {
  const defaultFallback = fallback || (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
        <p className="text-gray-600">{loadingMessage}</p>
      </div>
    </div>
  );

  const defaultErrorFallback = errorFallback || (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center">
        <div className="text-red-600 text-xl mr-3">⚠️</div>
        <div>
          <h3 className="font-medium text-red-800">Error cargando componente</h3>
          <p className="text-red-600 text-sm mt-1">
            Por favor, recarga la página o inténtalo de nuevo.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <GlobalErrorBoundary fallback={() => defaultErrorFallback}>
      <Suspense fallback={defaultFallback}>
        {children}
      </Suspense>
    </GlobalErrorBoundary>
  );
};

export default SafeComponentWrapper;

/**
 * Safe dynamic import helper
 */
export function createSafeComponent<T extends React.JSX.IntrinsicAttributes = Record<string, unknown>>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  fallback?: React.ReactNode
) {
  const SafeComponent = React.lazy(async () => {
    try {      console.log('🔄 Loading component safely...');
      const loadedModule = await importFn();
      console.log('✅ Component loaded successfully');
      return loadedModule;
    } catch (error) {
      console.error('❌ Failed to load component:', error);

      // Return a fallback component instead of throwing
      return {
        default: () => (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-center">
              <div className="text-red-600 text-2xl mb-2">⚠️</div>
              <h3 className="font-medium text-red-800 mb-1">Error cargando componente</h3>
              <p className="text-red-600 text-sm">
                Error: {error instanceof Error ? error.message : 'Desconocido'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Recargar página
              </button>
            </div>
          </div>
        )
      };
    }
  });  // Return wrapped component with proper typing
  return function WrappedComponent(props: T) {
    return (
      <SafeComponentWrapper fallback={fallback}>
        <SafeComponent {...(props as T & React.JSX.IntrinsicAttributes)} />
      </SafeComponentWrapper>
    );
  } as React.ComponentType<T>;
}

/**
 * Emergency recovery utilities
 */
export const EmergencyRecovery = {
  clearCache: async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      localStorage.clear();
      sessionStorage.clear();

      console.log('✅ Cache cleared successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to clear cache:', error);
      return false;
    }
  },

  reloadApplication: () => {
    window.location.reload();
  },

  navigateToSafePage: () => {
    window.location.href = '/test-simple';
  },

  reportError: (error: Error, context?: string) => {
    const errorReport = {
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    try {
      const reports = JSON.parse(localStorage.getItem('pyxom-emergency-reports') || '[]');
      reports.push(errorReport);
      // Keep only last 5 reports
      localStorage.setItem('pyxom-emergency-reports', JSON.stringify(reports.slice(-5)));
    } catch (e) {
      console.warn('Failed to store error report:', e);
    }

    console.error('🚨 Emergency error reported:', errorReport);
  }
};

/**
 * Component health checker
 */
export const ComponentHealthChecker = {  checkReactHealth: () => {
    const checks = {
      react: typeof React !== 'undefined',
      reactDom: typeof window !== 'undefined' && typeof (window as { ReactDOM?: unknown })['ReactDOM'] !== 'undefined',
      nextJs: typeof window !== 'undefined' && typeof (window as { __NEXT_DATA__?: unknown })['__NEXT_DATA__'] !== 'undefined',
      errorBoundaries: true // Assume our error boundaries are working if this code runs
    };

    console.log('🏥 Component Health Check:', checks);
    return checks;
  },
  checkResourceHealth: async () => {
    const resources = [
      { name: 'Monaco CDN', url: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs/loader.js' },
      { name: 'Pyodide CDN', url: 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js' }
    ];

    const results: Record<string, string> = {};    for (const resource of resources) {
      try {
        await fetch(resource.url, { method: 'HEAD', mode: 'no-cors' });
        results[resource.name] = 'OK';
      } catch {
        results[resource.name] = 'ERROR';
      }
    }

    console.log('🌐 Resource Health Check:', results);
    return results;
  }
};
