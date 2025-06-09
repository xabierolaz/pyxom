/**
 * Utility for manually loading the Monaco editor script if dynamic import is failing
 */

// Define CDN URLs for Monaco Editor
const MONACO_CDN_URLS = [
  'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs/loader.js',
  'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.46.0/min/vs/loader.js',
  'https://unpkg.com/monaco-editor@0.46.0/min/vs/loader.js'
];

/**
 * Try loading Monaco from multiple CDNs with fallback
 */
function loadFromCdn(cdnUrls: string[], index: number, resolve: (success: boolean) => void) {
  if (index >= cdnUrls.length) {
    console.error('All CDNs failed to load Monaco');
    resolve(false);
    return;
  }
  
  const loaderScript = document.createElement('script');
  loaderScript.src = cdnUrls[index];
  loaderScript.async = true;
  
  loaderScript.onload = () => {
    console.log(`Monaco loader loaded from ${cdnUrls[index]}, configuring...`);
    
    // Configure require
    (window as any).require.config({
      paths: { 'vs': cdnUrls[index].replace('/loader.js', '') }
    });
    
    // Load monaco editor
    (window as any).require(['vs/editor/editor.main'], () => {
      console.log('Monaco editor loaded successfully');
      resolve(true);
    });
  };
  
  loaderScript.onerror = () => {
    console.warn(`Failed to load Monaco from ${cdnUrls[index]}, trying next CDN...`);
    // Try next CDN
    loadFromCdn(cdnUrls, index + 1, resolve);
  };
  
  document.head.appendChild(loaderScript);
}

/**
 * Manually load Monaco Editor with CDN fallbacks
 */
export function loadMonacoManually(): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      // Check if Monaco is already loaded
      if (typeof window !== 'undefined' && (window as any).monaco) {
        console.log('Monaco already loaded');
        resolve(true);
        return;
      }
      
      console.log('Loading Monaco manually...');
      loadFromCdn(MONACO_CDN_URLS, 0, resolve);
    } catch (err) {
      console.error('Error in manual Monaco loading:', err);
      resolve(false);
    }
  });
}

/**
 * Try to preload Monaco if dynamic import is failing
 */
export function preloadMonaco(): void {
  if (typeof window === 'undefined') return;
  
  // Check if Monaco is already being loaded or is loaded
  if ((window as any)._monacoPreloadStarted || (window as any).monaco) return;
  (window as any)._monacoPreloadStarted = true;
    // Add a timeout to detect if Monaco is taking too long to load
  const timeout = setTimeout(() => {
    console.log('Monaco load timeout - attempting manual load');
    loadMonacoManually().then(success => {
      if (success) {
        console.log('Manual Monaco load successful');
        // Dispatch custom event to notify components
        window.dispatchEvent(new CustomEvent('monaco-loaded'));
      } else {
        console.error('All Monaco loading attempts failed');
        // Dispatch error event
        window.dispatchEvent(new CustomEvent('monaco-load-error'));
      }
    });
  }, 3000); // 3 seconds timeout for faster recovery
  
  // Clean up on success
  const checkMonacoLoaded = setInterval(() => {
    if ((window as any).monaco) {
      clearTimeout(timeout);
      clearInterval(checkMonacoLoaded);
      console.log('Monaco loaded successfully via normal path');
    }
  }, 1000);
}

/**
 * Prefetch Monaco resources in the background
 */
export function prefetchMonacoResources(): void {
  if (typeof window === 'undefined') return;
  
  // Prefetch key Monaco resources
  const resources = [
    'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs/editor/editor.main.js',
    'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs/editor/editor.main.css',
    'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs/language/python/python.js'
  ];
  
  resources.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Load Monaco with CDN fallback and timeout handling
 */
export function loadMonacoWithFallback(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Check if Monaco is already loaded
      if (typeof window !== 'undefined' && (window as any).monaco) {
        console.log('Monaco already loaded');
        resolve();
        return;
      }
      
      console.log('Loading Monaco with fallback strategy...');
      
      const timeoutId = setTimeout(() => {
        reject(new Error('Monaco loading timeout after 10 seconds'));
      }, 10000); // 10 second total timeout
      
      loadFromCdn(MONACO_CDN_URLS, 0, (success) => {
        clearTimeout(timeoutId);
        if (success) {
          resolve();
        } else {
          reject(new Error('All CDNs failed to load Monaco'));
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

// Try preloading Monaco on module import and prefetch resources
if (typeof window !== 'undefined') {
  setTimeout(() => {
    prefetchMonacoResources();
    preloadMonaco();
  }, 1000);
}
