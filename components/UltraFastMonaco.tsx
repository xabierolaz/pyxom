'use client';

import React, { useEffect, useRef, useState } from 'react';

interface UltraFastMonacoProps {
  value: string;
  onChange: (value: string | undefined) => void;
  onMount?: (editor: any, monaco: any) => void;
  height?: string;
  language?: string;
  theme?: string;
  readOnly?: boolean;
}

declare global {
  interface Window {
    monaco?: any;
    require?: any;
    ULTRA_MONACO_CACHE?: any;
  }
}

// Ultra-fast preloading function
function preloadMonacoResources() {
  const resources = [
    'https://unpkg.com/monaco-editor@0.46.0/min/vs/loader.js',
    'https://unpkg.com/monaco-editor@0.46.0/min/vs/editor/editor.main.js',
    'https://unpkg.com/monaco-editor@0.46.0/min/vs/editor/editor.main.css',
    'https://unpkg.com/monaco-editor@0.46.0/min/vs/basic-languages/python/python.js',
    'https://unpkg.com/monaco-editor@0.46.0/min/vs/language/typescript/tsWorker.js'
  ];

  resources.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = url.endsWith('.css') ? 'style' : 'script';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

export default function UltraFastMonaco({
  value,
  onChange,
  onMount,
  height = '400px',
  language = 'python',
  theme = 'vs-dark',
  readOnly = false
}: UltraFastMonacoProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const startTime = useRef<number>(Date.now());
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    // Listen for Monaco preload completion
    const handleMonacoPreloaded = (event: CustomEvent) => {
      if (mounted && window.monaco) {
        console.log(`🚀 ULTRA: Monaco preloaded in ${event.detail.loadTime}ms, creating editor immediately!`);
        createEditor();
      }
    };

    window.addEventListener('monaco-preloaded', handleMonacoPreloaded as EventListener);

    const loadMonacoUltraFast = async () => {
      try {
        console.log('🚀 ULTRA-FAST: Starting Monaco load at', new Date().toISOString());
        
        // Preload resources immediately
        preloadMonacoResources();        // Check if Monaco is already preloaded from the home page
        if (window.monaco) {
          console.log('🚀 ULTRA: Using preloaded Monaco from home page!');
          createEditor();
          return;
        }

        // Check if preloader is available
        const preloadedTime = sessionStorage.getItem('monaco-preloaded');
        if (preloadedTime) {
          console.log(`🚀 ULTRA: Monaco was preloaded ${Date.now() - parseInt(preloadedTime)}ms ago`);
        }

        // Check cache first
        if (window.ULTRA_MONACO_CACHE) {
          console.log('💾 ULTRA-FAST: Using cached Monaco');
          window.monaco = window.ULTRA_MONACO_CACHE;
          createEditor();
          return;
        }

        // Ultra-aggressive loading with multiple simultaneous attempts
        const loadPromises = [
          loadFromUnpkg(),
          loadFromJsDelivr(),
          loadFromCdnjs()
        ];

        // Race all loading methods - first one wins
        Promise.race(loadPromises).then(() => {
          if (mounted && window.monaco) {
            console.log('🏆 ULTRA-FAST: Monaco loaded via race condition');
            window.ULTRA_MONACO_CACHE = window.monaco;
            createEditor();
          }
        }).catch(err => {
          console.error('❌ ULTRA-FAST: All loading methods failed:', err);
          if (mounted) {
            setError('Error: Todos los métodos de carga fallaron');
            setLoading(false);
          }
        });

        // Timeout after 5 seconds (much shorter than before)
        timeoutId = setTimeout(() => {
          if (loading && mounted) {
            console.error('⏰ ULTRA-FAST: Timeout after 5 seconds');
            setError('Timeout: Monaco no cargó en 5 segundos');
            setLoading(false);
          }
        }, 5000);

      } catch (err) {
        console.error('❌ ULTRA-FAST: Critical error:', err);
        if (mounted) {
          setError('Error crítico cargando Monaco');
          setLoading(false);
        }
      }
    };

    const loadFromUnpkg = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/monaco-editor@0.46.0/min/vs/loader.js';
        script.async = true;
        script.defer = true;

        script.onload = () => {
          console.log('📦 ULTRA-FAST: Unpkg loader ready');
          window.require.config({
            paths: { vs: 'https://unpkg.com/monaco-editor@0.46.0/min/vs' }
          });
          window.require(['vs/editor/editor.main'], resolve);
        };

        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const loadFromJsDelivr = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs/loader.js';
        script.async = true;
        script.defer = true;

        script.onload = () => {
          console.log('🚀 ULTRA-FAST: jsDelivr loader ready');
          window.require.config({
            paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs' }
          });
          window.require(['vs/editor/editor.main'], resolve);
        };

        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const loadFromCdnjs = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.46.0/min/vs/loader.min.js';
        script.async = true;
        script.defer = true;

        script.onload = () => {
          console.log('⚡ ULTRA-FAST: cdnjs loader ready');
          window.require.config({
            paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.46.0/min/vs' }
          });
          window.require(['vs/editor/editor.main'], resolve);
        };

        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const createEditor = () => {
      if (!editorRef.current || !window.monaco || editorInstanceRef.current) {
        return;
      }

      try {
        const elapsed = Date.now() - startTime.current;
        console.log(`⚡ ULTRA-FAST: Creating editor in ${elapsed}ms`);
        
        editorInstanceRef.current = window.monaco.editor.create(editorRef.current, {
          value: value || '',
          language: language || 'python',
          theme: theme || 'vs-dark',
          readOnly: readOnly || false,
          fontSize: 14,
          lineNumbers: 'on',
          wordWrap: 'on',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          // Ultra-fast performance settings
          renderLineHighlight: 'none',
          renderWhitespace: 'none',
          renderControlCharacters: false,
          disableLayerHinting: true,
          disableMonospaceOptimizations: false,
          fontLigatures: false,
          smoothScrolling: false
        });

        if (onChange) {
          editorInstanceRef.current.onDidChangeModelContent(() => {
            const newValue = editorInstanceRef.current.getValue();
            onChange(newValue);
          });
        }

        if (onMount) {
          onMount(editorInstanceRef.current, window.monaco);
        }

        setLoadTime(elapsed);
        setLoading(false);
        console.log(`✅ ULTRA-FAST: Editor ready in ${elapsed}ms`);

      } catch (err) {
        console.error('❌ ULTRA-FAST: Error creating editor:', err);
        setError('Error creando editor');
        setLoading(false);
      }
    };

    loadMonacoUltraFast();    return () => {
      mounted = false;
      window.removeEventListener('monaco-preloaded', handleMonacoPreloaded as EventListener);
      if (timeoutId) clearTimeout(timeoutId);
      if (editorInstanceRef.current) {
        try {
          editorInstanceRef.current.dispose();
          editorInstanceRef.current = null;
        } catch (err) {
          console.error('Error disposing editor:', err);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (editorInstanceRef.current && value !== undefined) {
      const currentValue = editorInstanceRef.current.getValue();
      if (currentValue !== value) {
        editorInstanceRef.current.setValue(value);
      }
    }
  }, [value]);

  if (loading) {
    const elapsed = Date.now() - startTime.current;
    return (
      <div 
        className="w-full bg-gray-900 border border-gray-600 rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center text-white">
          <div className="animate-pulse text-4xl mb-3">⚡</div>
          <div className="text-lg font-bold text-yellow-400">ULTRA-FAST MODE</div>
          <div className="text-sm text-gray-300">Cargando Monaco Editor...</div>
          <div className="text-xs text-gray-400 mt-2">
            Tiempo transcurrido: {Math.floor(elapsed / 1000)}s
          </div>
          <div className="text-xs text-blue-400 mt-1">
            Usando carga agresiva con múltiples CDNs
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="w-full bg-red-900 border border-red-600 rounded-lg flex items-center justify-center p-4"
        style={{ height }}
      >
        <div className="text-center text-white">
          <div className="text-red-200 font-medium mb-2">⚡ Error Ultra-Fast</div>
          <div className="text-sm mb-3">{error}</div>
          <div className="text-xs text-gray-300 mb-3">
            Tiempo transcurrido: {Math.floor((Date.now() - startTime.current) / 1000)}s
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
          >
            Recargar e Intentar de Nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {loadTime && (
        <div className="absolute top-2 right-2 z-10 bg-green-600 text-white text-xs px-2 py-1 rounded">
          ⚡ {loadTime}ms
        </div>
      )}
      <div 
        ref={editorRef} 
        className="w-full border border-gray-600 rounded-lg"
        style={{ height }}
      />
    </div>
  );
}
