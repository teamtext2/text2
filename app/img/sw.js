// Minimal service worker for notification support and basic caching
const CACHE_NAME = 'text2-img-v1';
const ASSETS = [
	'/',
	'/index.html',
	'/favicon-32x32.png',
	'/android-chrome-192x192.png'
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))).then(() => self.clients.claim())
	);
});


self.addEventListener('fetch', (event) => {
	const { request } = event;
	if (request.method !== 'GET') return;
	event.respondWith(
		caches.match(request).then((cached) => cached || fetch(request).then((resp) => {
			const respClone = resp.clone();
			caches.open(CACHE_NAME).then((cache) => cache.put(request, respClone));
			return resp;
		}).catch(() => cached))
	);
});

// Handle notificationclick to focus/open the app
self.addEventListener('notificationclick', (event) => {
	event.notification.close();
	event.waitUntil(
		clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
			for (const client of clientList) {
				if ('focus' in client) return client.focus();
			}
			if (clients.openWindow) return clients.openWindow('/');
		})
	);
});


