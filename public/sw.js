const CACHE_NAME = 'dm-v2';
const STATIC_CACHE = 'dm-static-v2';
const DYNAMIC_CACHE = 'dm-dynamic-v2';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/devils-marketplace-logo.png'
];

// API routes to cache
const API_CACHE_PATTERNS = [
  /^https:\/\/hubdjvohoqcrguylmsaj\.supabase\.co\/rest\/v1\/(listings|profiles|colleges)/,
  /^https:\/\/hubdjvohoqcrguylmsaj\.supabase\.co\/storage\/v1\/object\/public/
];

self.addEventListener('install', event => {
  console.log('Service Worker installing (dm-v2)');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating (dm-v2)');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete ALL old caches that don't match current version
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // In Capacitor (capacitor://), skip caching entirely — always use local files
  if (url.protocol === 'capacitor:') {
    return;
  }

  // Handle navigation requests (app shell)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/')
        .then(response => response || fetch(request))
        .catch(() => caches.match('/'))
    );
    return;
  }

  // Handle static assets
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request)
        .then(response => response || fetch(request))
    );
    return;
  }

  // Handle API requests with network-first strategy
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Handle image requests with cache-first strategy
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(request)
            .then(response => {
              if (response.ok) {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE)
                  .then(cache => cache.put(request, responseClone));
              }
              return response;
            });
        })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync-messages') {
    event.waitUntil(syncMessages());
  }
  if (event.tag === 'background-sync-listings') {
    event.waitUntil(syncListings());
  }
});

async function syncMessages() {
  console.log('Syncing messages in background');
}

async function syncListings() {
  console.log('Syncing listings in background');
}

// Push notification handling
self.addEventListener('push', event => {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body: data.body,
    icon: '/devils-marketplace-logo.png',
    badge: '/devils-marketplace-logo.png',
    tag: data.tag || 'dm-notification',
    data: data.data,
    actions: [
      { action: 'view', title: 'View', icon: '/devils-marketplace-logo.png' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then(clientList => {
          const data = event.notification.data;
          const url = data?.url || '/';

          for (const client of clientList) {
            if (client.url.includes(url) && 'focus' in client) {
              return client.focus();
            }
          }

          if (clients.openWindow) {
            return clients.openWindow(url);
          }
        })
    );
  }
});
