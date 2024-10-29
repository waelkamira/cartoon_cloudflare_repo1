// استيراد مكتبة Workbox لإدارة الـ service worker
importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js'
);

// تحقق من توافر مكتبة workbox وأدرج الملفات المطلوبة في الخدمة
if (workbox) {
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);
}

// قائمة النطاقات العشوائية
const domains = [
  'https://cartoon-cloudflare-repo61.pages.dev/',
  'https://cartoon-cloudflare-repo62.pages.dev/',
  'https://cartoon-cloudflare-repo63.pages.dev/',
  'https://cartoon-cloudflare-repo64.pages.dev/',
];

// الاستماع لحدث 'fetch' لتوجيه الطلبات إلى نطاق عشوائي
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const newUrl = randomDomain + new URL(event.request.url).pathname;

    event.respondWith(fetch(newUrl).catch(() => fetch(event.request)));
  }
});
