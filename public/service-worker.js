// Basic offline cache for Pyxom
const CACHE = 'pyxom-v1';
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll([
        '/',
        '/favicon.ico',
        '/manifest.json',
        'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js',
      ])
    )
  );
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});

