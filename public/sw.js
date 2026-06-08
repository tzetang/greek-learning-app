const CACHE = "biblical-greek-v1";

const PRECACHE = [
  "/",
  "/quiz",
  "/morphology",
  "/topics",
  "/john-316",
  "/tutor",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET, cross-origin, and API requests
  if (
    request.method !== "GET" ||
    url.origin !== location.origin ||
    url.pathname.startsWith("/api/")
  ) {
    return;
  }

  // Cache-first for static assets (_next/static, images, fonts)
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/_next/image") ||
    url.pathname.match(/\.(png|svg|ico|woff2?|ttf)$/)
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) => cached ?? fetch(request).then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then((cache) => cache.put(request, clone));
          return res;
        })
      )
    );
    return;
  }

  // Network-first for pages — fall back to cache when offline
  event.respondWith(
    fetch(request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((cache) => cache.put(request, clone));
        return res;
      })
      .catch(() => caches.match(request))
  );
});
