const CACHE_NAME = 'english-tests-pwa-cache-v4'; // Увеличиваем версию кэша
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './vite.svg',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/react@18/umd/react.development.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
  'https://unpkg.com/react-router@6/umd/react-router.development.js',
  'https://unpkg.com/react-router-dom@6/umd/react-router-dom.development.js',
  'https://unpkg.com/@babel/standalone/babel.min.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Принудительная активация нового Service Worker
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Кэш открыт и ассеты добавляются');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Мы обрабатываем только GET запросы
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Если ресурс найден в кэше, возвращаем его.
      if (response) {
        return response;
      }
      
      // Иначе, делаем запрос к сети.
      return fetch(event.request).then(networkResponse => {
        // Опционально: можно кэшировать новые запросы "на лету"
        // Но для этого нужна более сложная логика, чтобы не кэшировать всё подряд
        return networkResponse;
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Удаляем старые кэши
            console.log('Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Захватываем контроль над открытыми страницами
  );
});
  );
});
