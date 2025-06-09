'use client';

import React, { useState, useEffect, useRef } from 'react';
import { loadMonacoDirectly } from '@/utils/emergencyMonaco';

interface EmergencyMonacoProps {
  value: string;
  onChange: (value: string | undefined) => void;
  onMount?: (editor: any, monaco: any) => void;
  height?: string;
  language?: string;
  theme?: string;
  readOnly?: boolean;
}

// Emergency Monaco Editor - Ultra Simple Loading
const EmergencyMonaco = ({ 
  value, 
  onChange, 
  onMount, 
  height = '400px', 
  language = 'python', 
  theme = 'vs-dark', 
  readOnly = false 
}: EmergencyMonacoProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [MonacoEditor, setMonacoEditor] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const loadEmergencyMonaco = async () => {
      try {
        console.log('🚨 EMERGENCY: Loading Monaco with simple strategy...');
        
        // Try direct import with longer timeout
        const monaco = await Promise.race([
          import('@monaco-editor/react'),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 10000)
          )
        ]);
          if (mounted) {
          console.log('✅ EMERGENCY: Monaco loaded successfully');
          setMonacoEditor((monaco as any).default);
          setLoading(false);
        }} catch (err) {
          console.log('🚨 EMERGENCY: Monaco import failed, trying direct CDN...');
          
          try {
            // Emergency CDN loading
            await loadMonacoDirectly();
            
            if (mounted && (window as any).monaco) {
              console.log('✅ EMERGENCY: Monaco loaded from direct CDN');
              setMonacoEditor(createSimpleEditor);
              setLoading(false);
            } else {
              throw new Error('Direct CDN failed');
            }
          } catch (cdnErr) {
          console.error('🚨 EMERGENCY: All loading methods failed:', cdnErr);
          if (mounted) {
            setError('Error cargando Monaco Editor');
            setLoading(false);
          }
        }
      }
    };

    loadEmergencyMonaco();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full bg-gray-800 border border-gray-600 rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-3"></div>
          <div>🚨 EMERGENCY: Cargando Monaco...</div>
          <div className="text-sm text-gray-300 mt-2">Modo de emergencia activado</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-red-800 border border-red-600 rounded-lg flex items-center justify-center p-4">
        <div className="text-center text-white">
          <div className="text-red-200 font-medium mb-2">🚨 Error de Emergencia</div>
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

  if (!MonacoEditor) {
    return (
      <div className="w-full h-full bg-yellow-800 border border-yellow-600 rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <div>⚠️ Monaco no disponible</div>
        </div>
      </div>
    );
  }

  // Use the loaded Monaco Editor
  return (
    <MonacoEditor
      height={height}
      language={language}
      theme={theme}
      value={value}
      onChange={onChange}
      onMount={onMount}
      options={{
        fontSize: 14,
        lineNumbers: 'on',
        wordWrap: 'on',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        readOnly
      }}
    />
  );
};

// Simple Monaco component for CDN fallback
const createSimpleEditor = (props: any) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current && (window as any).monaco && !editorInstanceRef.current) {
      editorInstanceRef.current = (window as any).monaco.editor.create(editorRef.current, {
        value: props.value || '',
        language: props.language || 'python',
        theme: props.theme || 'vs-dark',
        fontSize: 14,
        lineNumbers: 'on',
        wordWrap: 'on',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        readOnly: props.readOnly || false
      });

      if (props.onChange) {
        editorInstanceRef.current.onDidChangeModelContent(() => {
          props.onChange(editorInstanceRef.current.getValue());
        });
      }

      if (props.onMount) {
        props.onMount(editorInstanceRef.current, (window as any).monaco);
      }
    }

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.dispose();
        editorInstanceRef.current = null;
      }
    };
  }, [props.value, props.onChange, props.onMount]);

  useEffect(() => {
    if (editorInstanceRef.current && props.value !== undefined) {
      const currentValue = editorInstanceRef.current.getValue();
      if (currentValue !== props.value) {
        editorInstanceRef.current.setValue(props.value);
      }
    }
  }, [props.value]);

  return <div ref={editorRef} style={{ height: props.height || '400px', width: '100%' }} />;
};

export default EmergencyMonaco;
