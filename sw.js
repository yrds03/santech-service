const CACHE_NAME = 'sanstech-enterprise-v1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json'
];

// 1. Install Service Worker & Cache Tampilan Awal
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

// 2. Fetch Data (Bypass API Google Sheets agar tetap Real-Time)
self.addEventListener('fetch', event => {
    // Jika request ke Google Apps Script (Dynamic Data), jangan pakai cache
    if (event.request.url.includes('script.google.com') || event.request.method === 'POST') {
        return; 
    }

    // Untuk file HTML, CSS, JS, gunakan jaringan dulu, kalau offline baru pakai cache
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});

// 3. Update Service Worker otomatis jika ada versi baru
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
