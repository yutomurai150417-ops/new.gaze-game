```javascript
const CACHE_NAME = 'gaze-game-v5';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 1. キャッシュがあれば返す
      if (response) return response;

      // 2. なければネットに取りに行く
      return fetch(event.request).then((networkResponse) => {
        // 3. 取得したものをキャッシュに保存
        if (networkResponse && networkResponse.status === 200) {
          let responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // 4. どちらもダメならエラー
        return new Response('オフラインです');
      });
    })
  );
});

```
