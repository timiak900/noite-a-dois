const C='nad-999a8d48';
self.addEventListener('install',e=>{ e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png']))); self.skipWaiting(); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch',e=>{ const r=e.request; if(r.method!=='GET') return;
  const isPage=r.mode==='navigate'||r.url.endsWith('/')||r.url.endsWith('index.html');
  if(isPage){ // network first: always get the newest game when online, fall back to the saved copy offline
    e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{ const cp=res.clone(); caches.open(C).then(c=>c.put('index.html',cp)); return res; }).catch(()=>caches.match('index.html').then(h=>h||caches.match('./')))); return; }
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{ if(res&&res.status===200){ const cp=res.clone(); caches.open(C).then(c=>c.put(r,cp)); } return res; }))); });
