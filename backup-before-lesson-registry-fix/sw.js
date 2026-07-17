const CACHE_NAME = "loreax-class-erp-v8";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./script.js",
  "./data-courses.js",
  "./data-lessons.js",
  "./data-lessons.js?v=8",
  "./manifest.json",
  "./diagnostics/index.html",
  "./diagnostics/styles.css",
  "./diagnostics/script.js",
  "./lib/supabase-config.js",
  "./lib/supabase-config.js?v=7",
  "./lib/loreax-supabase.js",
  "./lib/loreax-supabase.js?v=7",
  "./sessions/ai-practice/index.html",
  "./sessions/ai-practice/styles.css",
  "./sessions/ai-practice/script.js",
  "./sessions/ai-practice/report/index.html",
  "./sessions/ai-practice/report/styles.css",
  "./sessions/ai-practice/report/script.js",
  "./present/index.html",
  "./present/styles.css",
  "./present/script.js",
  "./vendor/supabase.min.js",
  "./vendor/supabase.min.js?v=7",
  "./vendor/html2pdf.bundle.min.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
];

const EXCLUDED_EXTENSIONS = [".mp4", ".mov", ".webm"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch((error) => {
        console.warn("Core asset caching failed:", error);
      })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  const extension = requestUrl.pathname.slice(requestUrl.pathname.lastIndexOf(".")).toLowerCase();

  if (requestUrl.hostname.includes("supabase.co")) return;

  if (EXCLUDED_EXTENSIONS.includes(extension)) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
