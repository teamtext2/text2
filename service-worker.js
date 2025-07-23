const CACHE_NAME = 'text2-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/style.css',
  '/manifest.json',
  // Thêm các tài nguyên tĩnh khác nếu có
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(networkResponse => {
          // Nếu là file tĩnh, lưu vào cache
          if (event.request.url.startsWith(self.location.origin)) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        });
      })
      .catch(() => {
        // Nếu cả cache và network đều lỗi, có thể trả về trang offline hoặc gì đó
        return caches.match('/index.html');
      })
  );
}); 