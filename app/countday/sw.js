// Service Worker: network-only (no caching)
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// For every fetch, try network and do not use Cache Storage.
self.addEventListener('fetch', event => {
  // Ignore non-GET requests and browser-extension requests
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    fetch(event.request, { cache: 'no-store' })
      .then(response => {
        return response;
      })
      .catch(() => {
        // If network fails, for navigation requests try to return the cached document from scope
        if (event.request.mode === 'navigate') {
          return fetch('index.html', { cache: 'no-store' }).catch(() => new Response('Offline', { status: 503, statusText: 'Service Unavailable' }));
        }
        return new Response('Network error', { status: 408, statusText: 'Network error' });
      })
  );
});
