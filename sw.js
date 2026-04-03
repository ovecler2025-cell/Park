// ══════════════════════════════════════════════
//  SERVICE WORKER — sw.js
// ══════════════════════════════════════════════

const CACHE_NAME = 'brosur-pwa-v1';
const ASSETS = [
  './',
  './index.html',
  './editor.html',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// ── Install: tüm dosyaları cache'le ──────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(() => {
        // Bazı dosyalar yoksa sessizce geç
      });
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: eski cache'leri temizle ────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: Cache-first stratejisi ────────────
self.addEventListener('fetch', event => {
  // Anthropic API isteklerini direkt geçir
  if (event.request.url.includes('anthropic.com')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Başarılı cevabı cache'e ekle
        if (response && response.status === 200 && response.type === 'basic') {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
        }
        return response;
      });
    }).catch(() => {
      // Offline fallback
      if (event.request.destination === 'document') {
        return caches.match('./index.html');
      }
    })
  );
});
