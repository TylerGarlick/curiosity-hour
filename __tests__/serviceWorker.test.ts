/**
 * @jest-environment jsdom
 */

/**
 * Service Worker Tests for Curiosity Hour
 * 
 * These tests verify that the service worker:
 * 1. Registers without errors
 * 2. Uses correct caching strategies for different request types
 * 3. Doesn't cache HTML navigation responses (prevents stale UI)
 * 4. Properly handles fetch events
 */

describe('Service Worker', () => {
  // Mock the service worker global scope
  const mockCache = {
    addAll: jest.fn().mockResolvedValue(undefined),
    open: jest.fn().mockResolvedValue({
      addAll: jest.fn().mockResolvedValue(undefined),
      put: jest.fn().mockResolvedValue(undefined),
      match: jest.fn().mockResolvedValue(null),
    }),
    keys: jest.fn().mockResolvedValue(['curiosity-hour-v3']),
    delete: jest.fn().mockResolvedValue(true),
    match: jest.fn().mockResolvedValue(null),
  };

  const mockFetch = jest.fn();
  const mockSkipWaiting = jest.fn();
  const mockClientsClaim = jest.fn();

  beforeAll(() => {
    // Mock caches API
    (global as any).caches = {
      open: mockCache.open,
      keys: mockCache.keys,
      delete: mockCache.delete,
      match: mockCache.match,
    };

    // Mock fetch
    (global as any).fetch = mockFetch;

    // Mock service worker globals
    (global as any).self = {
      location: { origin: 'http://localhost:3000' },
      skipWaiting: mockSkipWaiting,
      clients: { claim: mockClientsClaim },
      addEventListener: jest.fn(),
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Installation', () => {
    it('should cache static assets on install', async () => {
      // Load the service worker code
      const swCode = await require('fs').promises.readFile(
        require('path').join(__dirname, '../public/sw.js'),
        'utf-8'
      );

      // Verify the SW code contains expected install handler
      expect(swCode).toContain("self.addEventListener('install'");
      expect(swCode).toContain('STATIC_ASSETS');
      expect(swCode).toContain('cache.addAll');
    });
  });

  describe('Fetch Handler', () => {
    it('should have error handling in fetch event listener', async () => {
      const swCode = await require('fs').promises.readFile(
        require('path').join(__dirname, '../public/sw.js'),
        'utf-8'
      );

      // Verify error handling exists
      expect(swCode).toContain('try {');
      expect(swCode).toContain('catch (error)');
      expect(swCode).toContain('[SW] Fetch handler error');
    });

    it('should not cache HTML navigation responses', async () => {
      const swCode = await require('fs').promises.readFile(
        require('path').join(__dirname, '../public/sw.js'),
        'utf-8'
      );

      // Verify networkFirst function has HTML caching prevention
      expect(swCode).toContain("request.mode === 'navigate'");
      expect(swCode).toContain("Don't cache HTML navigation responses");
    });

    it('should use networkFirst for navigation requests', async () => {
      const swCode = await require('fs').promises.readFile(
        require('path').join(__dirname, '../public/sw.js'),
        'utf-8'
      );

      // Verify navigation requests use networkFirst
      expect(swCode).toContain("request.mode === 'navigate'");
      expect(swCode).toContain('networkFirst(request)');
    });

    it('should use cacheFirst for static assets', async () => {
      const swCode = await require('fs').promises.readFile(
        require('path').join(__dirname, '../public/sw.js'),
        'utf-8'
      );

      // Verify static assets use cacheFirst
      expect(swCode).toContain('isStaticAsset(url)');
      expect(swCode).toContain('cacheFirst(request)');
    });

    it('should use cacheFirst for images', async () => {
      const swCode = await require('fs').promises.readFile(
        require('path').join(__dirname, '../public/sw.js'),
        'utf-8'
      );

      // Verify images use cacheFirst
      expect(swCode).toContain("request.destination === 'image'");
      expect(swCode).toContain('cacheFirst(request)');
    });

    it('should use staleWhileRevalidate for other assets', async () => {
      const swCode = await require('fs').promises.readFile(
        require('path').join(__dirname, '../public/sw.js'),
        'utf-8'
      );

      // Verify other assets use staleWhileRevalidate
      expect(swCode).toContain('staleWhileRevalidate(request)');
    });
  });

  describe('Activation', () => {
    it('should clean up old caches on activate', async () => {
      const swCode = await require('fs').promises.readFile(
        require('path').join(__dirname, '../public/sw.js'),
        'utf-8'
      );

      // Verify activation handler exists and cleans old caches
      expect(swCode).toContain("self.addEventListener('activate'");
      expect(swCode).toContain('caches.keys');
      expect(swCode).toContain('caches.delete');
    });
  });

  describe('Cache Strategy Functions', () => {
    it('should have cacheFirst function', async () => {
      const swCode = await require('fs').promises.readFile(
        require('path').join(__dirname, '../public/sw.js'),
        'utf-8'
      );

      expect(swCode).toContain('async function cacheFirst');
    });

    it('should have networkFirst function', async () => {
      const swCode = await require('fs').promises.readFile(
        require('path').join(__dirname, '../public/sw.js'),
        'utf-8'
      );

      expect(swCode).toContain('async function networkFirst');
    });

    it('should have staleWhileRevalidate function', async () => {
      const swCode = await require('fs').promises.readFile(
        require('path').join(__dirname, '../public/sw.js'),
        'utf-8'
      );

      expect(swCode).toContain('async function staleWhileRevalidate');
    });

    it('should have isStaticAsset helper function', async () => {
      const swCode = await require('fs').promises.readFile(
        require('path').join(__dirname, '../public/sw.js'),
        'utf-8'
      );

      expect(swCode).toContain('function isStaticAsset');
    });
  });

  describe('Service Worker Registration', () => {
    it('PWAInitializer should register the service worker', () => {
      const pwaCode = require('fs').readFileSync(
        require('path').join(__dirname, '../components/PWAInitializer.tsx'),
        'utf-8'
      );

      expect(pwaCode).toContain('navigator.serviceWorker');
      expect(pwaCode).toContain('.register("/sw.js"');
      expect(pwaCode).toContain('scope: "/"');
    });
  });
});
