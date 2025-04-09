const CACHE_NAME = 'presiones-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js',
  'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js',
  'https://cdn-icons-png.flaticon.com/512/4162/4162811.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Archivos cacheados');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Retorna del caché si está disponible, sino va a la red
      return response || fetch(event.request);
    }).catch(() => {
      // Opcional: podrías retornar una página offline personalizada aquí
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (!cacheWhitelist.includes(key)) {
            console.log('[SW] Cache viejo eliminado:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
});