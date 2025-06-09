const CACHE_NAME = 'pyxom-cache-v2';
const STATIC_CACHE = 'pyxom-static-v2';
const PYODIDE_CACHE = 'pyxom-pyodide-v2';
const MONACO_CACHE = 'pyxom-monaco-v2';

// Resources to cache on install
const STATIC_RESOURCES = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  // Add critical CSS and JS files
];

// Monaco Editor resources with multiple CDN options
const MONACO_RESOURCES = [
  // Primary CDN (jsdelivr)
  'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs/loader.js',
  'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs/editor/editor.main.js',
  'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs/basic-languages/python/python.js',
  'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs/editor/editor.main.css',
  
  // Fallback CDN (cdnjs)
  'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.46.0/min/vs/loader.js',
  'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.46.0/min/vs/editor/editor.main.js',
  'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.46.0/min/vs/basic-languages/python/python.js',
  
  // Web workers and essential components
  'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs/base/worker/workerMain.js',
  'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs/language/json/jsonMode.js',
  'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs/language/typescript/tsMode.js',
];

// Pyodide resources
const PYODIDE_RESOURCES = [
  'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js',
  'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.asm.js',
  'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.asm.wasm',
  'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/python_stdlib.zip',
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static resources
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching static resources');
        return cache.addAll(STATIC_RESOURCES.map(url => new Request(url, { cache: 'reload' })));
      }).catch(err => console.warn('Failed to cache static resources:', err)),
      
      // Pre-fetch Monaco Editor (high priority)
      caches.open(MONACO_CACHE).then((cache) => {
        console.log('Service Worker: Pre-fetching Monaco Editor');
        return Promise.allSettled(
          MONACO_RESOURCES.map(url => 
            fetch(url, { cache: 'force-cache' })
              .then(response => response.ok ? cache.put(url, response) : Promise.reject())
              .catch(err => console.warn(`Failed to cache Monaco resource ${url}:`, err))
          )
        );
      }),
      
      // Pre-fetch Pyodide (lower priority)
      caches.open(PYODIDE_CACHE).then((cache) => {
        console.log('Service Worker: Pre-fetching Pyodide');
        return Promise.allSettled(
          PYODIDE_RESOURCES.map(url => 
            fetch(url, { cache: 'force-cache' })
              .then(response => response.ok ? cache.put(url, response) : Promise.reject())
              .catch(err => console.warn(`Failed to cache Pyodide resource ${url}:`, err))
          )
        );
      })
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (![CACHE_NAME, STATIC_CACHE, PYODIDE_CACHE, MONACO_CACHE].includes(cacheName)) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) return;
  
  event.respondWith(
    (async () => {
      try {
        // Strategy 1: Monaco Editor resources - Cache First
        if (isMonacoResource(url)) {
          return await cacheFirstStrategy(request, MONACO_CACHE);
        }
        
        // Strategy 2: Pyodide resources - Cache First
        if (isPyodideResource(url)) {
          return await cacheFirstStrategy(request, PYODIDE_CACHE);
        }
        
        // Strategy 3: Static assets - Cache First with fallback
        if (isStaticAsset(url)) {
          return await cacheFirstStrategy(request, STATIC_CACHE);
        }
        
        // Strategy 4: API and dynamic content - Network First
        if (isApiRequest(url)) {
          return await networkFirstStrategy(request, CACHE_NAME);
        }
        
        // Strategy 5: HTML pages - Stale While Revalidate
        if (isHtmlRequest(request)) {
          return await staleWhileRevalidateStrategy(request, CACHE_NAME);
        }
        
        // Default: Network only
        return await fetch(request);
        
      } catch (error) {
        console.error('Service Worker fetch error:', error);
        
        // Fallback for HTML requests
        if (isHtmlRequest(request)) {
          const cachedResponse = await caches.match('/');
          if (cachedResponse) return cachedResponse;
        }
        
        // Return a basic error response
        return new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    })()
  );
});

// Helper functions for resource identification
function isMonacoResource(url) {
  return url.hostname === 'cdn.jsdelivr.net' && 
         (url.pathname.includes('monaco-editor') || url.pathname.includes('/vs/'));
}

function isPyodideResource(url) {
  return url.hostname === 'cdn.jsdelivr.net' && url.pathname.includes('pyodide');
}

function isStaticAsset(url) {
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/);
}

function isApiRequest(url) {
  return url.pathname.startsWith('/api/');
}

function isHtmlRequest(request) {
  return request.headers.get('accept')?.includes('text/html');
}

// Caching strategies
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function staleWhileRevalidateStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(cacheName);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(err => {
    console.warn('Network request failed:', err);
    return cachedResponse;
  });
  
  return cachedResponse || fetchPromise;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'code-execution') {
    event.waitUntil(syncCodeExecution());
  }
});

async function syncCodeExecution() {
  // Handle offline code execution sync
  console.log('Service Worker: Syncing offline code execution');
}

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_REPORT') {
    // Handle performance reports
    console.log('Service Worker: Performance report received', event.data);
  }
});

console.log('Service Worker: Script loaded');

