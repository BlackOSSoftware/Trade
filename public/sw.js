const CACHE_NAME = "als-trader-v1";
const ASSETS_TO_CACHE = ["/", "/manifest.json", "/apple-touch-icon.png", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null))
    ))
    .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (evt) => {
  // network-first for API calls, cache-first for navigation / static
  const url = new URL(evt.request.url);
  if (url.pathname.startsWith("/api/")) {
    evt.respondWith(fetch(evt.request).catch(() => caches.match(evt.request)));
    return;
  }

  evt.respondWith(
    caches.match(evt.request).then((cached) => cached || fetch(evt.request).then((res) => {
      // cache fetched static resources
      if (evt.request.method === "GET" && res && res.status === 200 && res.type === "basic") {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(evt.request, copy));
      }
      return res;
    })).catch(() => caches.match("/"))
  );
});
