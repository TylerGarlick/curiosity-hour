/// <reference lib="webworker" />

const CACHE_NAME = 'curiosity-hour-v3';
const CACHE_VERSION = 'v3';

// Static assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

// Note: Question data is bundled at build time via lib/questions.ts
// No need to cache /data/*.json files separately as they're imported statically

declare const self: ServiceWorkerGlobalScope;

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      console.log('[SW] Installation complete, skipping waiting');
      self.skipWaiting();
    }).catch((error) => {
      console.error('[SW] Failed to cache assets:', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Activation complete, claiming clients');
      self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (!url.origin.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Determine caching strategy based on request type
  if (isStaticAsset(url)) {
    // Cache-first for static assets
    event.respondWith(cacheFirst(request));
  } else if (request.destination === 'image') {
    // Cache-first for images
    event.respondWith(cacheFirst(request));
  } else if (request.mode === 'navigate') {
    // Network-first for navigation (HTML pages)
    event.respondWith(networkFirst(request));
  } else {
    // Stale-while-revalidate for other assets (CSS, JS, fonts)
    // Note: Question data is bundled in JS at build time
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Helper: Check if request is for a static asset we pre-cached
function isStaticAsset(url: URL): boolean {
  return STATIC_ASSETS.some(asset => {
    if (asset === '/') return url.pathname === '/';
    return url.pathname === asset;
  });
}

// Cache-First Strategy: Fast for static content
async function cacheFirst(request: Request): Promise<Response> {
  const cached = await caches.match(request);
  if (cached) {
    console.log('[SW] Cache hit:', request.url);
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Fetch failed, no cache:', request.url, error);
    return new Response('Offline - Resource not cached', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Network-First Strategy: Fresh content when online
async function networkFirst(request: Request): Promise<Response> {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    // Return offline fallback for navigation
    return caches.match('/') || new Response('Offline', { status: 503 });
  }
}

// Stale-While-Revalidate Strategy: Best of both worlds
async function staleWhileRevalidate(request: Request): Promise<Response> {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    console.log('[SW] Background fetch failed:', request.url);
    return null;
  });

  return cached || fetchPromise || new Response('Offline', { status: 503 });
}

// Handle messages from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    event.ports[0].postMessage({
      cacheName: CACHE_NAME,
      version: CACHE_VERSION
    });
  }
});
