// The Pages build replaces this value with the deployed commit.
const RELEASE = "dev";
const scope = self.registration.scope;
const cachePrefix = "denge-shell:" + scope + ":";
const cacheName = cachePrefix + RELEASE;
const shellFiles = new Set([
  "", "styles.css", "app.js", "domain.js", "backup.js", "reader.js", "favicon.svg", "manifest.webmanifest",
  "assets/denge-sprout.webp", "assets/denge-icon-192.png", "assets/denge-icon-512.png",
  "assets/dm-sans-latin-wght-normal.woff2", "assets/dm-sans-latin-ext-wght-normal.woff2",
  "assets/manrope-latin-wght-normal.woff2", "assets/manrope-latin-ext-wght-normal.woff2",
]);

function releaseUrl(file) {
  const url = new URL(file, scope);
  if (RELEASE !== "dev") url.searchParams.set("denge-release", RELEASE);
  return url.href;
}

self.addEventListener("install", event => {
  event.waitUntil(caches.open(cacheName).then(cache => {
    const requests = [...shellFiles].map(file => new Request(releaseUrl(file), { cache: "reload" }));
    return cache.addAll(requests);
  }));
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const oldCaches = (await caches.keys()).filter(name => name.startsWith(cachePrefix) && name !== cacheName);
    await Promise.all(oldCaches.map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", event => {
  if (event.data === "activate-release") event.waitUntil(self.skipWaiting());
});

self.addEventListener("fetch", event => {
  const { request } = event;
  if (request.method !== "GET" || !request.url.startsWith(scope)) return;
  const url = new URL(request.url);
  const file = url.pathname.slice(new URL(scope).pathname.length);
  const asset = file === "index.html" && request.mode === "navigate" ? "" : file;
  if (!shellFiles.has(asset)) return;
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    return (await cache.match(releaseUrl(asset))) ?? fetch(request);
  })());
});
