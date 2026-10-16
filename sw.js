// sw.js - Service Worker untuk Checklist Proyek

const CACHE_NAME = 'checklist-proyek-v1';
const ASSETS = [
    './index.html',
    './app.js',
    './manifest.json',
    'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4'
];

// Install Event
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Fetch Event (Offline First)
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            return cachedResponse || fetch(e.request);
        })
    );
});