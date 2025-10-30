// Service worker intentionally neutralized by maintainer.
// The original service worker was removed; this stub ensures any previously
// registered worker will activate a minimal, harmless worker that does not
// interfere with site behavior.

self.addEventListener('install', event => {
  // Immediately activate
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// No fetch handlers — keep network behavior default.
