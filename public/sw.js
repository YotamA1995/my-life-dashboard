const CACHE_NAME = "lifehub-shell-__BUILD_ID__";
const SHELL_URL = "/";
const CORE_ASSETS = [
  "/manifest.webmanifest",
  "/app-icon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
  "/fonts/material-symbols-outlined.ttf",
];

async function cacheAppShell() {
  const cache = await caches.open(CACHE_NAME);
  const shellResponse = await fetch(SHELL_URL, { cache: "reload" });

  if (!shellResponse.ok) {
    throw new Error("Unable to download the application shell.");
  }

  await cache.put(SHELL_URL, shellResponse.clone());

  const html = await shellResponse.text();
  const linkedAssets = Array.from(html.matchAll(/(?:src|href)=["']([^"']+)["']/g))
    .map((match) => match[1])
    .filter((url) => url.startsWith("/") && !url.startsWith("//"));

  await cache.addAll([...new Set([...CORE_ASSETS, ...linkedAssets])]);
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheAppShell());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.startsWith("lifehub-shell-") && cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);

  if (requestUrl.origin !== self.location.origin || requestUrl.pathname === "/sw.js") {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response.clone());
            await cache.put(SHELL_URL, response.clone());
          }
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          return (await cache.match(request)) ?? (await cache.match(SHELL_URL));
        }),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((response) => {
        if (response.ok) {
          const responseToCache = response.clone();
          void caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
        }
        return response;
      });
    }),
  );
});
