// Check do sistema de crescimento: extrai o <script> do index.html e valida
// os loops de dia (missões/baú/1ª vitória), semana (liga/escudo) e temporada (passe).
// Rodar: node test-crescimento.mjs
import {readFileSync} from 'fs';
import vm from 'vm';
import assert from 'assert';

const html=readFileSync(new URL('./index.html',import.meta.url),'utf8');
const src=html.match(/<script>([\s\S]*)<\/script>/)[1];

const store={};
const el=()=>({textContent:'',innerHTML:'',value:'',style:{},title:'',href:'',dataset:{},
  classList:{add(){},remove(){},toggle(){}},querySelector:()=>el(),querySelectorAll:()=>[],
  appendChild(){},remove(){},focus(){},select(){},onclick:null});
const sandbox={
  document:{getElementById:()=>el(),createElement:()=>el(),querySelectorAll:()=>[],body:{appendChild(){}}},
  localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}},
  location:{hash:''},addEventListener(){},scrollTo(){},setTimeout:()=>0,clearTimeout(){},
  console,Math,Date,JSON,assert,
};
sandbox.window=sandbox;sandbox.globalThis=sandbox;
vm.createContext(sandbox);
vm.runInContext(src+'\n;globalThis.__T={S,hoje,wkey,misDone,amanha};',sandbox);

vm.runInContext(`{
  const {S,hoje,wkey,misDone,amanha}=__T,t=hoje();

  // boot: rollover inicializou dia/semana/temporada
  assert.equal(S.g.d,t);
  assert.equal(S.g.wk,wkey(t));
  assert.equal(S.g.se,t.slice(0,7));
  assert(amanha()>t);

  // 1ª vitória do dia dobra; segunda ação não
  addXP(10,'');
  assert.equal(S.xp,20);assert.equal(S.g.pl,20);assert.equal(S.g.sxp,20);
  addXP(10,'');
  assert.equal(S.xp,30);

  // missões diárias -> baú (recompensa variável muda algo no estado)
  mission(0);for(let i=0;i<5;i++)mission(1);for(let i=0;i<3;i++)mission(2);
  assert(misDone());
  const antes=JSON.stringify([S.xp,S.g.boost,S.g.shields,S.g.titles]);
  abrirBau();
  assert.equal(S.g.bau,t);
  assert.notEqual(JSON.stringify([S.xp,S.g.boost,S.g.shields,S.g.titles]),antes);
  abrirBau(); // segundo baú no mesmo dia não faz nada
  const depois=JSON.stringify([S.xp,S.g.boost,S.g.shields,S.g.titles]);
  abrirBau();assert.equal(JSON.stringify([S.xp,S.g.boost,S.g.shields,S.g.titles]),depois);

  // passe: tier sempre = piso(sxp/60)
  assert.equal(S.g.tier,Math.min(20,Math.floor(S.g.sxp/60)));
  S.g.fv=t;addXP(200,'');
  assert.equal(S.g.tier,Math.min(20,Math.floor(S.g.sxp/60)));

  // virada de semana: 150+ PL promove, <60 PL rebaixa
  S.g.wk='2000-01-03';S.g.pl=200;S.g.liga=0;S.g.d='2000-01-04';
  rollo();
  assert.equal(S.g.liga,1);assert.equal(S.g.pl,0);assert(S.g.lw&&S.g.lw.x>0);
  S.g.wk='2000-01-03';S.g.pl=10;S.g.d='2000-01-04';
  rollo();
  assert.equal(S.g.liga,0);

  // escudo cobre 1 dia perdido e o streak sobrevive
  const d2=new Date();d2.setUTCDate(d2.getUTCDate()-2);
  S.days=[d2.toISOString().slice(0,10)];S.g.sdays=[];S.g.shields=1;S.g.d=S.days[0];
  rollo();
  assert.equal(S.g.shields,0);assert.equal(S.g.sdays.length,1);
  assert.equal(streak(),2);
  // buraco maior que os escudos: escudos ficam, streak morre
  const d5=new Date();d5.setUTCDate(d5.getUTCDate()-5);
  S.days=[d5.toISOString().slice(0,10)];S.g.sdays=[];S.g.shields=1;S.g.d=S.days[0];
  rollo();
  assert.equal(S.g.shields,1);assert.equal(streak(),0);

  // virada de temporada: passe zera
  S.g.se='2000-01';S.g.sxp=500;S.g.tier=8;S.g.d='2000-01-05';
  rollo();
  assert.equal(S.g.sxp,0);assert.equal(S.g.tier,0);assert.equal(S.g.se,hoje().slice(0,7));

  // as views novas renderizam sem explodir
  vCrescimento();vPainel();

  console.log('✓ sistema de crescimento: dia, semana e temporada ok');
}`,sandbox);
