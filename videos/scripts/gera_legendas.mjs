// Gera videos/legendas/modNN.vtt a partir dos roteiros + durations.ts.
// A linha do tempo replica o Aula.tsx: cena = ceil(dur*FPS)+PAD frames, FPS=30, PAD=8.
// Dentro da cena, a fala é dividida em frases com tempo proporcional ao tamanho.
// Rodar: node videos/scripts/gera_legendas.mjs (na raiz do repo)
import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'fs';

const FPS=30,PAD=8;
const raiz=new URL('../..',import.meta.url);
const DUR={};
for(const [,k,v] of readFileSync(new URL('videos/src/durations.ts',raiz),'utf8').matchAll(/"(mod\d\d-\d+)":\s*([\d.]+)/g))DUR[k]=+v;

const ts=s=>{const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=(s%60).toFixed(3).padStart(6,'0');
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${x}`;};
const frases=t=>t.split(/(?<=[.!?…:])\s+/).filter(Boolean);

mkdirSync(new URL('videos/legendas',raiz),{recursive:true});
for(const f of readdirSync(new URL('videos/src/roteiros',raiz)).sort()){
  const v=JSON.parse(readFileSync(new URL('videos/src/roteiros/'+f,raiz),'utf8'));
  let frame=0,cues=[],n=0;
  v.scenes.forEach((sc,i)=>{
    const d=DUR[`${v.slug}-${i}`]??4;
    const ini=frame/FPS,fs2=frases(sc.fala),tot=fs2.reduce((a,s)=>a+s.length,0);
    let t=ini;
    for(const fr of fs2){
      const dur=d*fr.length/tot;
      cues.push(`${++n}\n${ts(t)} --> ${ts(Math.min(t+dur,ini+d))}\n${fr}`);
      t+=dur;
    }
    frame+=Math.ceil(d*FPS)+PAD;
  });
  writeFileSync(new URL(`videos/legendas/${v.slug}.vtt`,raiz),'WEBVTT\n\n'+cues.join('\n\n')+'\n');
  console.log(`${v.slug}.vtt: ${n} cues, ${ts(frame/FPS)} total`);
}
