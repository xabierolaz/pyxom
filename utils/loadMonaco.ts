/**
 * DEPRECATED - Use monacoCore.ts instead
 * Keeping for backward compatibility only
 */

// Re-export from consolidated module
export { loadMonacoUniversal as loadMonacoManually, prefetchMonacoResources, isMonacoLoaded } from './monacoCore';
export { MONACO_CDN_URLS } from './monacoConstants';

// Legacy function for backward compatibility
export function loadMonacoWithFallback(): Promise<void> {
  console.warn('loadMonacoWithFallback is deprecated. Use loadMonacoUniversal from monacoCore instead.');
  return import('./monacoCore').then(({ loadMonacoUniversal }) =>
    loadMonacoUniversal().then(() => undefined)
  );
}

// Legacy preload function
export function preloadMonaco(): void {
  console.warn('preloadMonaco is deprecated. Use prefetchMonacoResources from monacoCore instead.');
  import('./monacoCore').then(({ prefetchMonacoResources }) => prefetchMonacoResources());
}
