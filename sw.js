// Service Worker for offline use (Add to Home Screen, then works in
// Airplane Mode after at least one online visit).
//
// Must be a real file served over http(s) — browsers refuse to register a
// Service Worker from a data: or blob: URL.
//
// Strategy: network-first, falling back to cache when offline (same
// approach as the Sudoku app in this account, which is already known to
// work reliably for this exact use case - see its sw.js for the original
// version of this reasoning). The app is static and self-contained, so
// every successful online load simply refreshes the cached copy, and an
// offline load serves whatever was last cached. Bump CACHE_NAME only if
// the caching strategy itself changes and old cached entries should be
// discarded - ordinary content edits don't need a version bump.
const CACHE_NAME = 'rep-counter-cache-v1';
const APP_SHELL = [
  './',
  './index.html',
  './counter.html',
  './exercises.txt',
  './manifest.json',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png',
  './IMG_0306.jpeg',
  './IMG_0307.jpeg',
  './IMG_0309.jpeg',
  './IMG_0310.jpeg',
  './IMG_0311.jpeg',
  './IMG_0312.jpeg',
  './IMG_0313.jpeg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(
        // cache.addAll() would fetch with default (HTTP-cache-respecting)
        // semantics; fetch each shell entry with no-store instead so
        // install always precaches what's actually live right now.
        APP_SHELL.map((url) => fetch(url, { cache: 'no-store' }).then((res) => cache.put(url, res)))
      ))
      .catch(() => {}) // don't block install if the initial precache fails; fetch handler still caches on first successful load
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : undefined)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    // cache: 'no-store' bypasses the browser's own HTTP cache - without it,
    // GitHub Pages' Cache-Control headers can let fetch() silently hand back
    // a stale response instead of hitting the network, which then gets
    // written into the SW cache as if it were fresh.
    fetch(event.request, { cache: 'no-store' })
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return networkResponse;
      })
      .catch(() =>
        // ignoreSearch: counter.html is always requested with query params
        // (sets/reps/voice/slug/etc.), which would otherwise miss the cache
        // entry precached at install time under the bare URL.
        caches.match(event.request, { ignoreSearch: true }).then((cached) => {
          if (cached) return cached;
          return caches.match('./index.html');
        })
      )
  );
});
