// Service Worker for PyXom - Advanced Caching Strategy
const CACHE_NAME = 'pyxom-v1.2';
const PYODIDE_CACHE = 'pyodide-cache-v1.0';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/styles/globals.css',
  '/favicon.ico'
];

// Pyodide resources to cache
const PYODIDE_ASSETS = [
  'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js',
  'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.asm.wasm',
  'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.asm.data',
  'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/distlib.tar',
  'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/site-packages.tar'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Cache Pyodide assets
      caches.open(PYODIDE_CACHE).then((cache) => {
        console.log('Caching Pyodide assets...');
        return Promise.allSettled(
          PYODIDE_ASSETS.map(url => 
            cache.add(url).catch(err => {
              console.warn(`Failed to cache ${url}:`, err);
              return null;
            })
          )
        );
      })
    ]).then(() => {
      console.log('Service Worker installation complete');
      // Force activation of new service worker
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== PYODIDE_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activation complete');
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle Pyodide requests with cache-first strategy
  if (url.hostname === 'cdn.jsdelivr.net' && url.pathname.includes('pyodide')) {
    event.respondWith(
      caches.open(PYODIDE_CACHE).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('Serving Pyodide asset from cache:', url.pathname);
            return cachedResponse;
          }
          
          // If not in cache, fetch and cache
          return fetch(event.request).then((response) => {
            // Only cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              cache.put(event.request, responseClone);
              console.log('Cached new Pyodide asset:', url.pathname);
            }
            return response;
          }).catch((error) => {
            console.error('Failed to fetch Pyodide asset:', url.pathname, error);
            throw error;
          });
        });
      })
    );
    return;
  }
  
  // Handle static assets with stale-while-revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            // Update cache with new version
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Network failed, return cached version if available
            return cachedResponse;
          });
          
          // Return cached version immediately if available, otherwise wait for network
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }
  
  // For all other requests, use network-first strategy
  event.respondWith(
    fetch(event.request).catch(() => {
      // If network fails, try to serve from cache
      return caches.match(event.request);
    })
  );
});

// Message handling for cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_PYODIDE') {
    // Force cache Pyodide assets
    event.waitUntil(
      caches.open(PYODIDE_CACHE).then((cache) => {
        return Promise.allSettled(
          PYODIDE_ASSETS.map(url => cache.add(url))
        );
      })
    );
  }
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    // Handle background synchronization
  }
});

// Push notification handling (for future features)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      tag: 'pyxom-notification',
      requireInteraction: true
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      // If a window is already open, focus it
      for (const client of clients) {
        if (client.url === self.location.origin && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Otherwise, open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

console.log('PyXom Service Worker loaded');
