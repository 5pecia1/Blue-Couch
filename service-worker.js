const version = "0.6.2"
const cacheName = `BlueCouch-${version}`;
const filesToCache = [
  './',
  './app.js',
  './index.html',
  './manifest.json',
  './service-worker.js',
  './page3.html',
  './page4.html',
  './page6.html',
  //'/css',
  './css/all.css',
  './css/page1.css',
  './css/page3.css',
  './css/page4.css',
  './css/page6.css',
   //'/font',
  './font/batang.woff',
   //'/img',
  './img/backarrow.png',
  './img/bluecouch.png',
  './img/bluecouch.svg',
  './img/menu-bar.png',
  './img/rightarrow.png',
  //'/js',
  './js/chart.js',
  './js/chart_loader.js',
  './js/page1.js',
  './js/page3.js',
  './js/page4.js',
  './js/page6.js',
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
