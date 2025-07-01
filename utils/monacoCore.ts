/**
 * Monaco Core Loader - Consolidated loading functions
 * Eliminates duplicated loading logic across components
 */

import { MONACO_CDN_URLS, MONACO_CONFIG, MONACO_RESOURCES } from './monacoConstants';

/**
 * Universal Monaco loader with fallback strategy
 */
export async function loadMonacoUniversal(): Promise<boolean> {
  // Check if Monaco is already loaded
  if (typeof window !== 'undefined' && window.monaco) {
    console.log('✅ Monaco already loaded');
    return true;
  }

  console.log('🚀 Loading Monaco with universal strategy...');

  return new Promise((resolve) => {
    let cdnIndex = 0;
    let hasResolved = false;

    const tryNextCDN = () => {
      if (hasResolved || cdnIndex >= MONACO_CDN_URLS.length) {
        if (!hasResolved) {
          console.error('❌ All CDNs failed to load Monaco');
          resolve(false);
        }
        return;
      }

      const url = MONACO_CDN_URLS[cdnIndex];
      const script = document.createElement('script');
      script.src = url;
      script.async = true;

      const timeout = setTimeout(() => {
        console.warn(`⏱️ Timeout loading from ${url}, trying next CDN...`);
        script.remove();
        cdnIndex++;
        tryNextCDN();
      }, MONACO_CONFIG.fastTimeout);

      script.onload = () => {
        clearTimeout(timeout);
        console.log(`✅ Monaco loader loaded from ${url}`);

        // Configure require
        if (!window.require) {
          console.warn('❌ No AMD loader available');
          cdnIndex++;
          tryNextCDN();
          return;
        }

        window.require.config({
          paths: { 'vs': url.replace('/loader.js', '') }
        });

        // Load monaco editor
        window.require(['vs/editor/editor.main'], () => {
          clearTimeout(timeout);
          if (!hasResolved && window.monaco) {
            hasResolved = true;
            console.log('✅ Monaco editor loaded successfully');
            window.dispatchEvent(new CustomEvent('monaco-loaded'));
            resolve(true);
          }
        }, (error: Error) => {
          clearTimeout(timeout);
          console.warn(`❌ Monaco require failed from ${url}:`, error);
          cdnIndex++;
          tryNextCDN();
        });
      };

      script.onerror = () => {
        clearTimeout(timeout);
        console.warn(`❌ Failed to load script from ${url}`);
        script.remove();
        cdnIndex++;
        tryNextCDN();
      };

      document.head.appendChild(script);
    };

    tryNextCDN();
  });
}

/**
 * Prefetch Monaco resources for faster loading
 */
export function prefetchMonacoResources(): void {
  if (typeof window === 'undefined') return;

  MONACO_RESOURCES.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = url.endsWith('.css') ? 'style' : 'script';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  console.log(`✅ Prefetched ${MONACO_RESOURCES.length} Monaco resources`);
}

/**
 * Check if Monaco is available
 */
export function isMonacoLoaded(): boolean {
  return typeof window !== 'undefined' && !!window.monaco;
}
