// Cache names - update version when you want to invalidate caches
const CACHE_VERSION = 'v2';
const STATIC_CACHE = `maneb-prep-static-${CACHE_VERSION}`;
const API_CACHE = `maneb-prep-api-${CACHE_VERSION}`;
const IMAGE_CACHE = `maneb-prep-images-${CACHE_VERSION}`;

// Critical static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
];

// Images to cache on install
const IMAGE_ASSETS = [
  '/images/hero-students.jpg',
  '/images/subject-math.jpg',
  '/images/subject-science.jpg',
  '/images/subject-english.jpg',
  '/images/subject-physics.jpg',
  '/images/achievement-trophy.jpg',
  '/images/study-desk.jpg',
];

// API endpoints that are safe to cache (GET only, no sensitive data)
const CACHEABLE_API_PATTERNS = [
  '/api/subjects',
  '/api/topics',
  '/api/questions',
  '/api/past-papers',
  '/api/leaderboard',
  '/api/achievements',
];

/**
 * Check if an API endpoint should be cached
 */
function shouldCacheAPI(url) {
  return CACHEABLE_API_PATTERNS.some(pattern => url.includes(pattern));
}

/**
 * Check if response is JSON
 */
function isJSON(response) {
  const contentType = response.headers.get('content-type');
  return contentType && contentType.includes('application/json');
}

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_ASSETS).catch(() => {
          // Continue even if some fail
        });
      }),
      // Cache images
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.addAll(IMAGE_ASSETS).catch(() => {
          // Continue even if some fail
        });
      }),
    ])
  );
  self.skipWaiting();
});

// Activate event - clean up old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            // Delete old version caches
            return (
              (name.startsWith('maneb-prep-static-') && name !== STATIC_CACHE) ||
              (name.startsWith('maneb-prep-api-') && name !== API_CACHE) ||
              (name.startsWith('maneb-prep-images-') && name !== IMAGE_CACHE) ||
              // Clean up legacy cache name
              name === 'maneb-prep-v1'
            );
          })
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event handler
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external URLs
  if (url.origin !== location.origin) {
    return;
  }

  // Handle API requests with Network First strategy
  if (url.pathname.startsWith('/api/')) {
    if (shouldCacheAPI(url.toString())) {
      event.respondWith(networkFirstStrategy(event.request));
    }
    return;
  }

  // Handle images with Cache First strategy
  if (
    event.request.destination === 'image' ||
    url.pathname.includes('/images/')
  ) {
    event.respondWith(cacheFirstStrategy(event.request, IMAGE_CACHE));
    return;
  }

  // Handle documents (HTML) with Network First strategy
  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirstStrategy(event.request, STATIC_CACHE));
    return;
  }

  // Handle other static assets with Cache First strategy
  event.respondWith(
    cacheFirstStrategy(event.request, STATIC_CACHE)
  );
});

/**
 * Network First strategy:
 * 1. Try network first
 * 2. Fall back to cache if network fails
 * 3. Update cache in background on success
 */
async function networkFirstStrategy(request, cacheName = API_CACHE) {
  try {
    const response = await fetch(request);

    // Cache successful responses
    if (response && response.status === 200) {
      const responseClone = response.clone();
      try {
        const cache = await caches.open(cacheName);
        cache.put(request, responseClone);
      } catch (error) {
        console.error('Cache put failed:', error);
      }
    }

    return response;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // No cache, return offline response
    if (request.mode === 'navigate') {
      // Return home page for navigation
      const cachedPage = await caches.match('/');
      if (cachedPage) {
        return cachedPage;
      }
    }

    // Return offline error response
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'No internet connection and no cached response available',
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * Cache First strategy:
 * 1. Try cache first
 * 2. Fall back to network if not in cache
 * 3. Update cache in background
 */
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Not in cache, fetch from network
    const response = await fetch(request);

    // Cache successful responses
    if (response && response.status === 200) {
      const responseClone = response.clone();
      try {
        const cache = await caches.open(cacheName);
        cache.put(request, responseClone);
      } catch (error) {
        console.error('Cache put failed:', error);
      }
    }

    return response;
  } catch (error) {
    // Network failed and not in cache
    if (request.mode === 'navigate') {
      const cachedPage = await caches.match('/');
      if (cachedPage) {
        return cachedPage;
      }
    }

    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

// Listen for messages from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // Handle cache clearing request
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      Promise.all([
        caches.delete(STATIC_CACHE),
        caches.delete(API_CACHE),
        caches.delete(IMAGE_CACHE),
      ]).then(() => {
        event.ports[0]?.postMessage({ success: true });
      })
    );
  }

  // Handle cache size check
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    event.waitUntil(
      (async () => {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
          try {
            const estimate = await navigator.storage.estimate();
            event.ports[0]?.postMessage({
              usage: estimate.usage,
              quota: estimate.quota,
            });
          } catch (error) {
            console.error('Failed to get cache size:', error);
            event.ports[0]?.postMessage({ error: error.message });
          }
        }
      })()
    );
  }
});
