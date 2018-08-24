const version = "0.1.0"
const cacheName = `BlueCouch-${version}`;
const filesToCache = [
  '/',
  '/manifest.json',
  '/index.html',
  '/service-worker.js',
  '/app.js',
  '/page2.html',
  '/page3.html',
  '/page4.html',
  '/page5-x.html',
  '/page5.html',
  '/page6.html',
  '/page7.html',
  '/page8-x.html',
  '/page8.html',
  '/page9.html',
  '/page10.html',
  '/page11.html',
  '/page12.html',
  '/page13.html',
  '/page14.html',
  '/page15.html',
  '/pagelogin.html',
  '/js/chart.js',
  '/js/chart_loader.js',
  '/js/page1.js',
  '/js/page3.js',
  '/js/page4.js',
  '/js/page6.js',
  '/js/page7.js',
  '/js/page8.js',
  '/css/all.css',
  '/css/page1.css',
  '/css/page2.css',
  '/css/page3.css',
  '/css/page4.css',
  '/css/page5.css',
  '/css/page6.css',
  '/css/page7.css',
  '/css/page8-x.css',
  '/css/page8.css',
  '/css/page9.css',
  '/css/page10.css',
  '/css/page11.css',
  '/css/page12.css',
  '/css/page13.css',
  '/css/page14.css',
  '/css/pagelogin.css',
  '/img/ackarrow.png',
  '/img/bluecouch.png',
  '/img/menu-bar.png',
  '/img/rightarrow.png',
  '/img/bluecouch.png',
  '/img/bluecouch.svg',
  '/font/batang.woff'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request, {'ignoreSearch': true}).then(function(response) {
    return response || fetch(e.request);
    })
  );
});
