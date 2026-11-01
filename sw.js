const CACHE="pmp8-v1";
const FILES=["./","index.html","manifest.webmanifest","icons/icon-180.png","icons/icon-192.png","icons/icon-512.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const u=new URL(e.request.url);
  if(u.origin===location.origin){
    // Network first so updates arrive, cache when offline.
    e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request).then(m=>m||caches.match("index.html"))));
  }else if(u.hostname==="fonts.googleapis.com"||u.hostname==="fonts.gstatic.com"){
    e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r})));
  }
});
