'use client';

import React, { useEffect, useRef, useState } from 'react';

interface UltraFastMonacoOptimizedProps {
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

export default function UltraFastMonacoOptimized({
  value,
  onChange,
  onMount,
  height = '400px',
  language = 'python',
  theme = 'vs-dark',
  readOnly = false
}: UltraFastMonacoOptimizedProps) {
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
        console.log(`🚀 ULTRA-OPTIMIZED: Monaco preloaded in ${event.detail.loadTime}ms from CDN ${event.detail.cdn}, creating editor immediately!`);
        createEditor();
      }
    };

    window.addEventListener('monaco-preloaded', handleMonacoPreloaded as EventListener);

    const loadMonacoUltraFast = async () => {
      try {
        console.log('🚀 ULTRA-OPTIMIZED: Starting Monaco load at', new Date().toISOString());
        
        // Check if Monaco is already preloaded from the home page
        if (window.monaco) {
          console.log('🚀 ULTRA-OPTIMIZED: Using preloaded Monaco from home page!');
          createEditor();
          return;
        }

        // Check if preloader is available with performance metrics
        const preloadedTime = sessionStorage.getItem('monaco-preloaded');
        const preloadedLoadTime = sessionStorage.getItem('monaco-load-time');
        if (preloadedTime && preloadedLoadTime) {
          console.log(`🚀 ULTRA-OPTIMIZED: Monaco was preloaded ${Date.now() - parseInt(preloadedTime)}ms ago (original load: ${preloadedLoadTime}ms)`);
        }

        // Ultra-fast loading with aggressive timeout
        timeoutId = setTimeout(() => {
          if (loading && mounted) {
            console.error('❌ ULTRA-OPTIMIZED: Monaco load timeout (4s)');
            setError('Monaco Editor tardó demasiado en cargar. Recarga la página.');
            setLoading(false);
          }
        }, 4000);

        // If no preloaded Monaco, fall back to emergency loading
        if (!window.monaco) {
          console.log('🚀 ULTRA-OPTIMIZED: No preloaded Monaco, using emergency loading...');
          await loadMonacoEmergency();
        }

      } catch (error) {
        console.error('❌ ULTRA-OPTIMIZED: Error loading Monaco:', error);
        if (mounted) {
          setError('Error cargando Monaco Editor');
          setLoading(false);
        }
      }
    };

    const loadMonacoEmergency = async () => {
      return new Promise<void>((resolve, reject) => {
        // Emergency loading with fastest possible CDN
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/monaco-editor@0.46.0/min/vs/loader.js';
        script.async = true;
        
        script.onload = () => {
          console.log('🚀 EMERGENCY: Monaco loader ready');
          window.require.config({
            paths: { vs: 'https://unpkg.com/monaco-editor@0.46.0/min/vs' }
          });
          
          window.require(['vs/editor/editor.main'], () => {
            if (!mounted) return;
            console.log('🚀 EMERGENCY: Monaco core loaded');
            createEditor();
            resolve();
          });
        };

        script.onerror = () => {
          console.error('❌ EMERGENCY: Failed to load Monaco');
          reject(new Error('Emergency Monaco load failed'));
        };

        document.head.appendChild(script);
      });
    };

    const createEditor = () => {
      if (!editorRef.current || !window.monaco || editorInstanceRef.current) {
        return;
      }

      try {
        const elapsed = Date.now() - startTime.current;
        console.log(`⚡ ULTRA-OPTIMIZED: Creating editor in ${elapsed}ms`);
        
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
          // Ultra-optimized performance settings
          renderLineHighlight: 'none',
          renderWhitespace: 'none',
          renderControlCharacters: false,
          disableLayerHinting: true,
          disableMonospaceOptimizations: false,
          fontLigatures: false,
          smoothScrolling: false,
          // Additional performance optimizations
          quickSuggestions: false,
          parameterHints: { enabled: false },
          folding: false,
          glyphMargin: false,
          contextmenu: false
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
        console.log(`✅ ULTRA-OPTIMIZED: Editor ready in ${elapsed}ms`);

      } catch (err) {
        console.error('❌ ULTRA-OPTIMIZED: Error creating editor:', err);
        setError('Error creando editor');
        setLoading(false);
      }
    };

    loadMonacoUltraFast();

    return () => {
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

  if (error) {
    return (
      <div className="flex items-center justify-center bg-red-50 border border-red-200 rounded-lg" style={{ height }}>
        <div className="text-center p-6">
          <div className="text-red-600 text-lg font-semibold mb-2">⚠️ Error</div>
          <div className="text-red-700 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            🔄 Recargar página
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg" style={{ height }}>
        <div className="text-center p-6">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-gray-600 font-medium">🚀 Cargando Editor...</div>
          <div className="text-gray-500 text-sm mt-2">
            {loadTime && `Cargado en ${loadTime}ms`}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ height }}>
      <div ref={editorRef} style={{ height: '100%', width: '100%' }} />
      {loadTime && (
        <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
          ⚡ {loadTime}ms
        </div>
      )}
    </div>
  );
}
