/*global UVServiceWorker,__uv$config*/
importScripts('/frog/bundle.js');
importScripts('/frog/config.js');
importScripts('/frog/fr.sw.js');

const sw = new UVServiceWorker();

self.addEventListener('fetch', (event) => event.respondWith(sw.fetch(event)));