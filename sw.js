const CACHE_NAME = 'neworbit-room-v3';
const ASSETS = [
  './index.html',
  './manifest.json',
  './pwa-icon.png',
  './neworbit-logo-white.png',
  './meet-logo.png',
  './teams-logo.png',
  'https://cdn.jsdelivr.net/npm/ical.js@1.4.0/build/ical.min.js',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap'
];

// Install: Cache core assets
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control immediately
  );
});

// Fetch: Network First for HTML, Cache First for assets
self.addEventListener('fetch', (event) => {
  // Navigation requests (HTML) -> Network First
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Other requests -> Cache First, fallback to Network
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
