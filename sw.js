const CACHE_NAME = "santech-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./dashboard.html",
  "./service.html",
  "./teknisi-board.html",
  "./kasir.html",
  "./customer.html",
  "./sparepart.html",
  "./laporan.html",
  "./pengaturan.html",
  "./manifest.json"
];

// Menginstall Service Worker dan menyimpan file ke Cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Mengambil data dari Cache jika offline, atau dari Network jika online
self.addEventListener("fetch", event => {
  // Abaikan request ke Google Apps Script API agar data selalu real-time
  if (event.request.url.includes("script.google.com")) {
    return; 
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Menghapus Cache lama saat ada update
self.addEventListener("activate", event => {
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
