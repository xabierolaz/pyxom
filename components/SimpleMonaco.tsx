'use client';

import React, { useEffect, useRef, useState } from 'react';

interface SimpleMonacoProps {
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
  }
}

export default function SimpleMonaco({
  value,
  onChange,
  onMount,
  height = '400px',
  language = 'python',
  theme = 'vs-dark',
  readOnly = false
}: SimpleMonacoProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadMonaco = async () => {
      try {
        // Check if Monaco is already loaded
        if (window.monaco) {
          console.log('✅ Monaco already available');
          createEditor();
          return;
        }

        console.log('🚨 SIMPLE: Loading Monaco from CDN...');

        // Load Monaco from CDN
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/monaco-editor@0.46.0/min/vs/loader.js';
        script.async = true;

        script.onload = () => {
          if (!mounted) return;

          console.log('🚨 SIMPLE: Monaco loader loaded');
          
          window.require.config({
            paths: {
              vs: 'https://unpkg.com/monaco-editor@0.46.0/min/vs'
            }
          });

          window.require(['vs/editor/editor.main'], () => {
            if (!mounted) return;
            
            console.log('✅ SIMPLE: Monaco editor ready');
            createEditor();
          });
        };

        script.onerror = () => {
          if (!mounted) return;
          console.error('❌ SIMPLE: Failed to load Monaco script');
          setError('Error cargando Monaco desde CDN');
          setLoading(false);
        };

        document.head.appendChild(script);

        // Timeout
        setTimeout(() => {
          if (loading && mounted) {
            setError('Timeout cargando Monaco (30s)');
            setLoading(false);
          }
        }, 30000);

      } catch (err) {
        console.error('❌ SIMPLE: Monaco loading error:', err);
        if (mounted) {
          setError('Error inesperado cargando Monaco');
          setLoading(false);
        }
      }
    };

    const createEditor = () => {
      if (!editorRef.current || !window.monaco || editorInstanceRef.current) {
        return;
      }

      try {
        console.log('🚨 SIMPLE: Creating Monaco editor instance');
        
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
          automaticLayout: true
        });

        // Set up change listener
        if (onChange) {
          editorInstanceRef.current.onDidChangeModelContent(() => {
            const newValue = editorInstanceRef.current.getValue();
            onChange(newValue);
          });
        }

        // Call onMount if provided
        if (onMount) {
          onMount(editorInstanceRef.current, window.monaco);
        }

        setLoading(false);
        console.log('✅ SIMPLE: Monaco editor created successfully');

      } catch (err) {
        console.error('❌ SIMPLE: Error creating editor:', err);
        setError('Error creando editor Monaco');
        setLoading(false);
      }
    };

    loadMonaco();

    return () => {
      mounted = false;
      if (editorInstanceRef.current) {
        try {
          editorInstanceRef.current.dispose();
          editorInstanceRef.current = null;
        } catch (err) {
          console.error('Error disposing Monaco editor:', err);
        }
      }
    };
  }, []);

  // Update editor value when prop changes
  useEffect(() => {
    if (editorInstanceRef.current && value !== undefined) {
      const currentValue = editorInstanceRef.current.getValue();
      if (currentValue !== value) {
        editorInstanceRef.current.setValue(value);
      }
    }
  }, [value]);

  if (loading) {
    return (
      <div 
        className="w-full bg-gray-900 border border-gray-600 rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-3"></div>
          <div className="text-lg font-medium">🚨 SIMPLE MODE</div>
          <div className="text-sm text-gray-300">Cargando Monaco Editor...</div>
          <div className="text-xs text-gray-400 mt-2">
            Usando modo simple para máxima compatibilidad
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
          <div className="text-red-200 font-medium mb-2">🚨 Error Simple Mode</div>
          <div className="text-sm mb-3">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
          >
            Recargar Página
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={editorRef} 
      className="w-full border border-gray-600 rounded-lg"
      style={{ height }}
    />
  );
}
