'use client';

import React, { useEffect, useState } from 'react';

// Global interface declarations for Monaco
declare global {
  interface Window {
    monaco?: any;
    require?: any;
  }
}

interface MonacoPreloaderProps {
  children: React.ReactNode;
}

export default function MonacoPreloader({ children }: MonacoPreloaderProps) {
  const [preloadStatus, setPreloadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [preloadStartTime, setPreloadStartTime] = useState<number>(0);

  useEffect(() => {
    let mounted = true;

    const preloadMonaco = async () => {
      // Don't preload if Monaco is already available
      if (window.monaco) {
        console.log('✅ Monaco already available, skipping preload');
        setPreloadStatus('success');
        return;
      }

      console.log('🚀 PRELOADER: Starting ultra-fast Monaco preload...');
      setPreloadStatus('loading');
      setPreloadStartTime(Date.now());

      try {        // Step 1: Aggressive multi-CDN preloading
        const cdnUrls = [
          'https://unpkg.com/monaco-editor@0.46.0/min/vs/loader.js',
          'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs/loader.js',
          'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.46.0/min/vs/loader.min.js'
        ];

        let loadSuccess = false;
        
        // Try multiple CDNs simultaneously for maximum speed
        const loadPromises = cdnUrls.map((url, index) => {
          return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.async = true;
            script.defer = true;
            
            script.onload = () => {
              if (!mounted || loadSuccess) return;
              loadSuccess = true;
              
              console.log(`🚀 PRELOADER: Monaco loaded from CDN ${index + 1} (${url})`);
              
              // Configure paths based on successful CDN
              const basePath = url.replace('/loader.js', '').replace('/loader.min.js', '');
              window.require.config({
                paths: {
                  vs: basePath
                },
            'vs/nls': {
              availableLanguages: {
                '*': 'en'
              }
            }
          });

          // Preload core Monaco modules
          window.require(['vs/editor/editor.main'], () => {
            if (!mounted) return;
            
            const loadTime = Date.now() - preloadStartTime;
            console.log(`✅ PRELOADER: Monaco ready in ${loadTime}ms! 🎉`);
            setPreloadStatus('success');
            
            // Store Monaco availability globally for other components
            sessionStorage.setItem('monaco-preloaded', Date.now().toString());
            
            // Dispatch custom event to notify other components
            window.dispatchEvent(new CustomEvent('monaco-preloaded', {
              detail: { loadTime }
            }));
          });
        };

        loaderScript.onerror = () => {
          if (!mounted) return;
          console.error('❌ PRELOADER: Failed to load Monaco loader');
          setPreloadStatus('error');
        };

        document.head.appendChild(loaderScript);

        // Ultra-aggressive timeout - 8 seconds max
        setTimeout(() => {
          if (preloadStatus === 'loading' && mounted) {
            console.warn('⚠️ PRELOADER: Monaco preload timeout (8s)');
            setPreloadStatus('error');
          }
        }, 8000);

      } catch (error) {
        console.error('❌ PRELOADER: Monaco preload error:', error);
        if (mounted) {
          setPreloadStatus('error');
        }
      }
    };

    // Start preloading immediately when component mounts
    preloadMonaco();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      {/* Preload Status Indicator */}
      {preloadStatus === 'loading' && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
          <span className="text-sm font-medium">🚀 Preparando Monaco...</span>
        </div>
      )}
      
      {preloadStatus === 'success' && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse">
          <span className="text-sm font-medium">✅ Monaco listo!</span>
        </div>
      )}

      {preloadStatus === 'error' && (
        <div className="fixed top-4 right-4 z-50 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <span className="text-sm font-medium">⚠️ Monaco se cargará cuando sea necesario</span>
        </div>
      )}

      {children}
    </>
  );
}
