const CACHE_NAME = 'milkshakito-cache-v12';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './assets/images/logoshake.png',
    './assets/images/logopwa.png',
    './assets/images/logopwa512.png',
    './assets/images/shakes.png',
    './assets/images/whatsapp.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Preparando shake no Cache! 🍦');
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (event) => {
    // Ignorar requisições POST, PUT, DELETE, etc.
    if (event.request.method !== 'GET') {
        return;
    }
    
    if (event.request.mode === 'navigate') {
        event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
        return;
    }

    event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
});
