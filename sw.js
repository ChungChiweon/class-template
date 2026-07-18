const CACHE_NAME = "loreax-class-erp-v95";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./styles.css?v=landing-platform-1",
  "./styles.css?v=course-portal-8",
  "./styles.css?v=course-portal-9",
  "./styles.css?v=course-portal-10",
  "./styles.css?v=course-portal-11",
  "./styles.css?v=course-portal-12",
  "./styles.css?v=course-portal-13",
  "./styles.css?v=course-portal-14",
  "./script.js",
  "./script.js?v=landing-platform-1",
  "./script.js?v=course-portal-8",
  "./script.js?v=course-portal-9",
  "./script.js?v=course-portal-10",
  "./script.js?v=course-portal-11",
  "./script.js?v=course-portal-12",
  "./script.js?v=course-portal-13",
  "./script.js?v=course-portal-14",
  "./data-courses.js",
  "./data-courses.js?v=landing-platform-1",
  "./data-courses.js?v=course-portal-8",
  "./data-courses.js?v=course-portal-9",
  "./data-courses.js?v=course-portal-10",
  "./data-courses.js?v=course-portal-11",
  "./data-courses.js?v=course-portal-13",
  "./data-courses.js?v=course-portal-15",
  "./data-lessons.js",
  "./data-lessons.js?v=9",
  "./data-lessons.js?v=12",
  "./manifest.json",
  "./diagnostics/index.html",
  "./diagnostics/styles.css",
  "./diagnostics/script.js",
  "./lib/supabase-config.js",
  "./lib/supabase-config.js?v=7",
  "./lib/supabase-config.js?v=8",
  "./lib/loreax-supabase.js",
  "./lib/loreax-supabase.js?v=7",
  "./lib/loreax-supabase.js?v=8",
  "./lib/loreax-supabase.js?v=9",
  "./lib/tenant-config.js",
  "./lib/tenant-config.js?v=tenant-usage-1",
  "./lib/tenant-config.js?v=tenant-usage-2",
  "./lib/usage-tracker.js",
  "./lib/usage-tracker.js?v=tenant-usage-1",
  "./lib/usage-tracker.js?v=tenant-usage-2",
  "./tenant-admin/usage.html",
  "./tenant-admin/usage.css",
  "./tenant-admin/usage.js",
  "./tenant-admin/usage.js?v=tenant-usage-1",
  "./tenant-admin/usage.js?v=tenant-usage-2",
  "./sessions/ai-practice/index.html",
  "./sessions/ai-practice/styles.css",
  "./sessions/ai-practice/script.js",
  "./sessions/ai-practice/script.js?v=class-ready-7",
  "./sessions/ai-practice/report/index.html",
  "./sessions/ai-practice/report/styles.css",
  "./sessions/ai-practice/report/script.js",
  "./sessions/topic-research-report/index.html",
  "./sessions/topic-research-report/styles.css",
  "./sessions/topic-research-report/styles.css?v=student-shell-1",
  "./sessions/topic-research-report/script.js",
  "./sessions/topic-research-report/script.js?v=3",
  "./sessions/topic-research-report/script.js?v=4",
  "./sessions/topic-research-report/script.js?v=5",
  "./sessions/topic-research-report/script.js?v=6",
  "./sessions/topic-research-report/script.js?v=7",
  "./sessions/topic-research-report/script.js?v=8",
  "./sessions/topic-research-report/script.js?v=9",
  "./sessions/topic-research-report/script.js?v=10",
  "./sessions/topic-research-report/script.js?v=11",
  "./sessions/topic-research-report/script.js?v=12",
  "./sessions/topic-research-report/script.js?v=13",
  "./sessions/topic-research-report/script.js?v=14",
  "./sessions/topic-research-report/script.js?v=15",
  "./sessions/topic-research-report/script.js?v=16",
  "./sessions/topic-research-report/script.js?v=17",
  "./sessions/topic-research-report/script.js?v=18",
  "./sessions/topic-research-report/script.js?v=19",
  "./sessions/topic-research-report/script.js?v=20",
  "./sessions/topic-research-report/report/index.html",
  "./sessions/topic-research-report/report/styles.css",
  "./sessions/topic-research-report/report/styles.css?v=report-shell-1",
  "./sessions/topic-research-report/report/script.js",
  "./sessions/topic-research-report/report/script.js?v=2",
  "./sessions/topic-research-report/report/script.js?v=3",
  "./sessions/topic-research-report/report/script.js?v=4",
  "./sessions/topic-research-report/report/script.js?v=5",
  "./sessions/topic-research-report/report/script.js?v=6",
  "./sessions/topic-research-report/report/script.js?v=7",
  "./sessions/topic-research-report/report/script.js?v=8",
  "./sessions/topic-research-report/report/script.js?v=9",
  "./sessions/topic-research-report/report/script.js?v=10",
  "./sessions/card-news/index.html",
  "./sessions/card-news/styles.css",
  "./sessions/card-news/styles.css?v=card-news-1",
  "./sessions/card-news/styles.css?v=card-news-2",
  "./sessions/card-news/styles.css?v=card-news-3",
  "./sessions/card-news/styles.css?v=card-news-4",
  "./sessions/card-news/styles.css?v=card-news-5",
  "./sessions/card-news/styles.css?v=card-news-6",
  "./sessions/card-news/styles.css?v=card-news-7",
  "./sessions/card-news/styles.css?v=card-news-8",
  "./sessions/card-news/styles.css?v=card-news-9",
  "./sessions/card-news/styles.css?v=card-news-10",
  "./sessions/card-news/styles.css?v=card-news-11",
  "./sessions/card-news/styles.css?v=card-news-12",
  "./sessions/card-news/styles.css?v=card-news-13",
  "./sessions/card-news/styles.css?v=card-news-14",
  "./sessions/card-news/styles.css?v=card-news-15",
  "./sessions/card-news/styles.css?v=card-news-16",
  "./sessions/card-news/styles.css?v=card-news-17",
  "./sessions/card-news/script.js",
  "./sessions/card-news/script.js?v=card-news-1",
  "./sessions/card-news/script.js?v=card-news-2",
  "./sessions/card-news/script.js?v=card-news-3",
  "./sessions/card-news/script.js?v=card-news-4",
  "./sessions/card-news/script.js?v=card-news-5",
  "./sessions/card-news/script.js?v=card-news-6",
  "./sessions/card-news/script.js?v=card-news-7",
  "./sessions/card-news/script.js?v=card-news-8",
  "./sessions/card-news/script.js?v=card-news-9",
  "./sessions/card-news/script.js?v=card-news-10",
  "./sessions/card-news/script.js?v=card-news-11",
  "./sessions/card-news/script.js?v=card-news-12",
  "./sessions/card-news/script.js?v=card-news-13",
  "./sessions/card-news/script.js?v=card-news-14",
  "./sessions/card-news/script.js?v=card-news-15",
  "./sessions/card-news/script.js?v=card-news-16",
  "./sessions/card-news/script.js?v=card-news-17",
  "./sessions/card-news/script.js?v=card-news-18",
  "./sessions/card-news/script.js?v=card-news-19",
  "./sessions/card-news/script.js?v=card-news-20",
  "./sessions/card-news/script.js?v=card-news-21",
  "./sessions/card-news/script.js?v=card-news-22",
  "./sessions/card-news/script.js?v=card-news-23",
  "./sessions/card-news/script.js?v=card-news-24",
  "./sessions/card-news/script.js?v=card-news-25",
  "./sessions/card-news/script.js?v=card-news-26",
  "./sessions/card-news/script.js?v=card-news-27",
  "./sessions/card-news/script.js?v=card-news-28",
  "./sessions/card-news/script.js?v=card-news-29",
  "./sessions/card-news/script.js?v=card-news-30",
  "./sessions/card-news/script.js?v=card-news-31",
  "./sessions/card-news/script.js?v=card-news-32",
  "./sessions/card-news/script.js?v=card-news-33",
  "./sessions/card-news/script.js?v=card-news-34",
  "./sessions/card-news/script.js?v=card-news-35",
  "./present/index.html",
  "./present/styles.css",
  "./present/script.js",
  "./present/script.js?v=14",
  "./present/script.js?v=15",
  "./present/script.js?v=16",
  "./present/script.js?v=17",
  "./present/script.js?v=18",
  "./vendor/supabase.min.js",
  "./vendor/supabase.min.js?v=7",
  "./vendor/html2pdf.bundle.min.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/brand/logo.svg",
  "./assets/brand/logo-symbol.svg",
  "./assets/hero/landing-poster.webp",
  "./assets/hero/portal-learning.webp",
  "./assets/courses/topic-research.webp",
  "./assets/courses/hotel-promotion.webp",
  "./assets/courses/class1.png",
  "./assets/courses/class2.png",
  "./assets/courses/class3.png",
  "./assets/courses/class4.png",
  "./assets/courses/class5.png",
  "./assets/courses/class6.png",
  "./assets/courses/class7.png",
  "./assets/courses/class8.png",
  "./assets/courses/class9.png",
  "./assets/courses/class10.png",
  "./assets/courses/class11.png",
  "./assets/empty/no-report.webp",
  "./assets/topic-research-report-qr.png",
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













