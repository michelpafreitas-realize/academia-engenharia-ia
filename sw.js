// Offline da Academia: rede primeiro (conteúdo sempre fresco), cache como fallback.
// Vídeos ficam de fora (cross-origin, pesados); aulas, quiz, cards e material funcionam sem rede.
const C='academia-v2'; // reforma ago/2026: nova grade
const SLUGS=['00-boas-vindas-setup','01-direcao-de-ia','02-prompt-engineering-apis','03-python-dados',
  '04-matematica-essencial','05-disciplinas-de-ml','06-como-llms-funcionam','07-rag','08-agentes-tool-use',
  '09-fine-tuning-modelos-abertos','10-avaliacao-seguranca','11-llmops-producao','12-capstone-carreira',
  '13-por-dentro-da-maquina'];
const FILES=['./','index.html','manifest.webmanifest','icon.svg',
  ...SLUGS.map(s=>'modulos/'+s+'.md'),
  ...SLUGS.map((_,i)=>'videos/legendas/mod'+String(i).padStart(2,'0')+'.vtt')];

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(C).then(c=>Promise.allSettled(FILES.map(f=>c.add(f)))));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==self.location.origin)return;
  e.respondWith(
    fetch(e.request).then(r=>{
      if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));}
      return r;
    }).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(m=>m||(e.request.mode==='navigate'?caches.match('index.html'):Response.error())))
  );
});
