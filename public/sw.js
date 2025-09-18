const CACHE_NAME = 'bazaar-v1';
const STATIC_CACHE = 'bazaar-static-v1';
const DYNAMIC_CACHE = 'bazaar-dynamic-v1';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/src/main.tsx',
  '/src/index.css'
];

// API routes to cache
const API_CACHE_PATTERNS = [
  /^https:\/\/hubdjvohoqcrguylmsaj\.supabase\.co\/rest\/v1\/(listings|profiles|colleges)/,
  /^https:\/\/hubdjvohoqcrguylmsaj\.supabase\.co\/storage\/v1\/object\/public/
];

self.addEventListener('install', event => {
  console.log('Service Worker installing');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
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
  console.log('Background sync event:', event.tag);
  
  if (event.tag === 'background-sync-messages') {
    event.waitUntil(syncMessages());
  }
  
  if (event.tag === 'background-sync-listings') {
    event.waitUntil(syncListings());
  }
});

async function syncMessages() {
  // Implement message sync logic
  console.log('Syncing messages in background');
}

async function syncListings() {
  // Implement listing sync logic
  console.log('Syncing listings in background');
}

// Push notification handling
self.addEventListener('push', event => {
  console.log('Push received:', event);
  
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/lovable-uploads/bazaar-app-icon.png',
    badge: '/lovable-uploads/bazaar-app-icon.png',
    tag: data.tag || 'bazaar-notification',
    data: data.data,
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/lovable-uploads/bazaar-app-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then(clientList => {
          const data = event.notification.data;
          const url = data?.url || '/';
          
          // Check if app is already open
          for (const client of clientList) {
            if (client.url.includes(url) && 'focus' in client) {
              return client.focus();
            }
          }
          
          // Open new window if app not open
          if (clients.openWindow) {
            return clients.openWindow(url);
          }
        })
    );
  }
});