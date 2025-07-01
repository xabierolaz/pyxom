'use client';

import React, { useState, useEffect, useRef } from 'react';
import { configurePythonMonaco, getOptimizedEditorOptions } from '@/utils/monacoConfig';
import { loadMonacoWithFallback } from '@/utils/loadMonaco';
import type { Monaco } from '@monaco-editor/react';
import type * as monaco from 'monaco-editor';

interface LazyMonacoEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  onMount?: (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => void;
  height?: string;
  language?: string;
  theme?: string;
  readOnly?: boolean;
  className?: string;
}

// Loading skeleton with recovery options
const EditorSkeleton = ({ onManualLoad }: { onManualLoad?: () => void }) => {
  const [loadTime, setLoadTime] = React.useState(0);
  const [showRecovery, setShowRecovery] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLoadTime(prev => prev + 1);
    }, 100);

    const recoveryTimer = setTimeout(() => {
      setShowRecovery(true);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(recoveryTimer);
    };
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-600 rounded w-1/4"></div>
        <div className="text-xs text-gray-400">
          Cargando... {(loadTime / 10).toFixed(1)}s
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-3 bg-gray-600 rounded w-3/4"></div>
        <div className="h-3 bg-gray-600 rounded w-1/2"></div>
        <div className="h-3 bg-gray-600 rounded w-5/6"></div>
      </div>

      <div className="mt-6 h-32 bg-gray-700 rounded"></div>

      {showRecovery && (
        <div className="mt-4 p-3 bg-yellow-800 rounded">
          <p className="text-sm mb-2">⚡ Carga lenta detectada</p>
          <button
            onClick={onManualLoad}
            className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm"
          >
            Cargar Manualmente
          </button>
        </div>
      )}
    </div>
  );
};

// Monaco Editor with optimized loading
const MonacoEditor = ({
  value,
  onChange,
  onMount,
  height = '400px',
  language = 'python',
  theme = 'vs-dark',
  readOnly = false,
  options = {}
}: {
  value: string;
  onChange: (value: string | undefined) => void;
  onMount?: (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => void;
  height?: string;
  language?: string;
  theme?: string;
  readOnly?: boolean;
  options?: Record<string, unknown>;
}) => {
  const [Editor, setEditor] = useState<React.ComponentType<Record<string, unknown>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadEditor = async () => {
      try {
        console.log('🚀 Loading Monaco...');

        // Try normal import with 3 second timeout
        const result = await Promise.race([
          import('@monaco-editor/react'),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Import timeout')), 3000))
        ]);

        if (mounted) {
          setEditor(() => (result as { default: React.ComponentType<Record<string, unknown>> }).default);
          setLoading(false);
        }
      } catch {
        console.log('⚡ Using CDN fallback...');

        try {
          await loadMonacoWithFallback();          // Create fallback component using global Monaco
          const FallbackEditor = (props: Record<string, unknown>) => {
            const editorRef = useRef<HTMLDivElement>(null);
            const editorInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

            useEffect(() => {
              if (editorRef.current && window.monaco && !editorInstanceRef.current) {
                const config = {
                  value: props.value as string || '',
                  language: props.language as string || 'python',
                  ...getOptimizedEditorOptions()
                };
                editorInstanceRef.current = window.monaco.editor.create(editorRef.current, config);

                if (props.onChange && typeof props.onChange === 'function') {
                  editorInstanceRef.current.onDidChangeModelContent(() => {
                    if (editorInstanceRef.current) {
                      const currentValue = editorInstanceRef.current.getValue();
                      (props.onChange as (value: string) => void)(currentValue);
                    }
                  });
                }

                if (props.onMount && typeof props.onMount === 'function') {
                  (props.onMount as (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => void)(
                    editorInstanceRef.current,
                    window.monaco as Monaco
                  );
                }
              }              return () => {
                if (editorInstanceRef.current) {
                  editorInstanceRef.current.dispose();
                  editorInstanceRef.current = null;
                }
              };
            }, [props.onChange, props.onMount, props.language, props.value]);

            useEffect(() => {
              if (editorInstanceRef.current && props.value !== undefined) {
                const currentValue = editorInstanceRef.current.getValue();
                if (currentValue !== props.value) {
                  editorInstanceRef.current.setValue(props.value as string);
                }
              }
            }, [props.value]);

            return <div ref={editorRef} style={{ height: (props.height as string) || '400px', width: '100%' }} />;
          };

          if (mounted) {
            setEditor(() => FallbackEditor);
            setLoading(false);
          }        } catch {
          if (mounted) {
            setError('Error cargando Monaco Editor');
            setLoading(false);
          }
        }
      }
    };

    loadEditor();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <EditorSkeleton />;
  }

  if (error) {
    return (
      <div className="w-full h-full bg-red-50 border border-red-200 rounded-lg flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-600 font-medium">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Recargar
          </button>
        </div>
      </div>
    );
  }

  if (!Editor) {
    return <EditorSkeleton />;
  }

  return (
    <Editor
      height={height}
      language={language}
      theme={theme}
      value={value}
      onChange={onChange}
      onMount={onMount}
      options={{
        ...getOptimizedEditorOptions(),
        readOnly,
        ...options
      }}
    />
  );
};

export default function LazyMonacoEditor({
  value,
  onChange,
  onMount,
  height = '400px',
  language = 'python',
  theme = 'vs-dark',
  readOnly = false,
  className = ''
}: LazyMonacoEditorProps) {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [forceReload, setForceReload] = useState(0);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    setIsClient(true);

    // Mobile detection
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                          window.innerWidth < 768;
    setIsMobile(isMobileDevice);

    // Preload Monaco resources
    import('@/utils/loadMonaco').then(({ prefetchMonacoResources }) => {
      prefetchMonacoResources?.();
    });

    // Listen for Monaco load events
    const handleMonacoLoaded = () => {
      console.log('✅ Monaco loaded successfully');
      setForceReload(prev => prev + 1);
    };

    window.addEventListener('monaco-loaded', handleMonacoLoaded);

    return () => {
      window.removeEventListener('monaco-loaded', handleMonacoLoaded);
    };
  }, []);
  const handleManualLoad = async () => {
    console.log('⚡ Manual Monaco load requested...');
    try {
      await import('../utils/monacoCore').then(({ loadMonacoUniversal }) => loadMonacoUniversal());
      setForceReload(prev => prev + 1);
    } catch (error) {
      console.error('Manual load failed:', error);
      if (confirm('Error cargando editor. ¿Recargar página?')) {
        window.location.reload();
      }
    }
  };  const handleEditorDidMount = (editor: unknown, monaco: Monaco) => {
    editorRef.current = editor as monaco.editor.IStandaloneCodeEditor;

    // Apply Python configuration
    configurePythonMonaco(monaco);

    // Apply optimized settings
    const editorInstance = editor as monaco.editor.IStandaloneCodeEditor;
    editorInstance.updateOptions(getOptimizedEditorOptions());

    // Mobile optimizations
    if (isMobile) {
      editorInstance.updateOptions({
        wordWrap: 'on',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineHeight: 20
      });
    }

    onMount?.(editorInstance, monaco);
  };

  if (!isClient) {
    return <EditorSkeleton onManualLoad={handleManualLoad} />;
  }

  return (
    <div className={`monaco-editor-container ${className}`} key={forceReload}>
      <MonacoEditor
        height={height}
        language={language}
        theme={theme}
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        readOnly={readOnly}
      />
    </div>
  );
}

// Error boundary wrapper
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Monaco Editor Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full bg-red-50 border border-red-200 rounded-lg flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-red-600 font-medium mb-2">Error cargando el editor</div>
            <div className="text-red-500 text-sm">
              {this.state.error?.message || 'Error desconocido'}
            </div>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Export wrapped component with error boundary
export function MonacoEditorWithErrorBoundary(props: LazyMonacoEditorProps) {
  return (
    <ErrorBoundary>
      <LazyMonacoEditor {...props} />
    </ErrorBoundary>
  );
}
