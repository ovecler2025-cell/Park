const C='cb-v4',F=['./','./index.html','./editor.html','./app.js','./manifest.json','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F).catch(()=>{})).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(/anthropic|unsplash|maps\.google|wa\.me/.test(e.request.url))return;e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{if(r&&r.status===200&&r.type==='basic'){const cl=r.clone();caches.open(C).then(ca=>ca.put(e.request,cl))}return r})).catch(()=>caches.match('./index.html')))});
