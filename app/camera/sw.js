/*
  Service Worker for full offline caching with versioning and manual refresh.
  - Precaches core assets on install
  - Serves from cache-first for faster loads
  - Updates seamlessly: new SW activates immediately
  - Supports CLEAR_AND_RELOAD message to clear caches and reload all clients
*/

// Increment CACHE_VERSION when you deploy new assets
const CACHE_VERSION = 'v1.0.0';
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;
const PRECACHE = `precache-${CACHE_VERSION}`;

// List all assets you want to precache. Include root and icons.
// Update the version above whenever this list or any file content changes.
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/sw.js',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
  '/site.webmanifest',
  // External CDN assets cannot be precached by URL reliably; they'll be runtime-cached when fetched
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      const allow = new Set([PRECACHE, RUNTIME_CACHE]);
      await Promise.all(keys.filter((k) => !allow.has(k)).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

// Cache-first for same-origin GET requests; network fallback then put into runtime cache
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Only handle same-origin requests; for cross-origin (e.g., CDN), use network-first and runtime cache
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((resp) => {
          const copy = resp.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
          return resp;
        }).catch(() => cached);
      })
    );
  } else {
    // Network-first for cross-origin, fallback to cache if available
    event.respondWith(
      fetch(req).then((resp) => {
        const copy = resp.clone();
        caches.open(RUNTIME_CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
        return resp;
      }).catch(() => caches.match(req))
    );
  }
});

self.addEventListener('message', async (event) => {
  const data = event.data || {};
  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }
  if (data.type === 'CLEAR_AND_RELOAD') {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (e) {
      // ignore
    }
    const allClients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
    for (const client of allClients) {
      client.navigate(client.url);
    }
  }
});

