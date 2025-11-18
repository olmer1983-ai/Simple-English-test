const CACHE_NAME = 'english-tests-pwa-cache-v2'; // Увеличиваем версию кэша
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './vite.svg',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react-dom@^19.2.0/client',
  'https://aistudiocdn.com/react-router-dom@^7.9.6'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Кэш открыт и ассеты добавляются');
      // Игнорируем ошибки при добавлении некоторых ресурсов, которые могут быть недоступны
      const promises = ASSETS_TO_CACHE.map(url => {
        return cache.add(url).catch(err => {
          console.warn(`Не удалось закэшировать: ${url}`, err);
        });
      });
      return Promise.all(promises);
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
        // Мы не кэшируем ответы от API или других динамических ресурсов здесь
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
    })
  );
});
