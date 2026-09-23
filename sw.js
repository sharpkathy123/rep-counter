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
  './images/rows.jpeg',
  './images/no-money.jpeg',
  './images/shoulder-horizontal-abduction.jpeg',
  './images/sit-to-stand.jpeg',
  './images/abdominal-bracing-marches.jpeg',
  './images/clamshell.jpeg',
  './images/bridge.jpeg',
  './images/shoulder-extension.jpeg',
  './images/90-90-ltr-finish.svg',
  './images/90-90-ltr-start.svg',
  './images/90-90-marching-ta-finish.svg',
  './images/90-90-marching-ta-start.svg',
  './images/bird-dog-finish.svg',
  './images/bird-dog-start.svg',
  './images/bridge-alternating-march-finish.svg',
  './images/bridge-alternating-march-start.svg',
  './images/bridge-single-leg-finish.svg',
  './images/bridge-single-leg-start.svg',
  './images/dead-bug-finish.svg',
  './images/dead-bug-start.svg',
  './images/pallof-press-standing-finish.svg',
  './images/pallof-press-standing-start.svg',
  './images/scapular-retraction-prone-arms-out-t-finish.svg',
  './images/scapular-retraction-prone-arms-out-t-start.svg',
  './images/slr-ta-activation-finish.svg',
  './images/slr-ta-activation-start.svg',
  './images/squats-multidirectional-finish.svg',
  './images/squats-multidirectional-start.svg',
  './images/ta-activation-supine-finish.svg',
  './images/ta-activation-supine-start.svg',
  './images/hip-abduction.svg',
  './images/hip-extension.svg',
  './images/pnf-d2.svg',
  './images/bicep-curl.svg',
  './images/scapular-retraction-prone-arms-side.svg',
  './images/scapular-retraction-prone-arms-side-lift.svg',
  './images/scapular-retraction-prone-arms-overhead-lift.svg',
  './images/bent-over-rows-dumbbell.svg',
  './images/heel-raise-single-leg.svg',
  './images/lower-trunk-rotation-feet-down-start.svg',
  './images/lower-trunk-rotation-feet-down-finish.svg',
  './images/stir-the-pot.svg'
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
