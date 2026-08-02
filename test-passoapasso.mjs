// Check do material na página: extrai mdSecs do <script> do index.html e valida
// a renderização das seções (conteúdo, lab, checklist, projeto) dos 13 módulos.
// Rodar: node test-passoapasso.mjs
import {readFileSync,readdirSync} from 'fs';
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
  console,Math,Date,JSON,assert,atob,btoa,
};
sandbox.window=sandbox;sandbox.globalThis=sandbox;
vm.createContext(sandbox);
vm.runInContext(src+'\n;globalThis.__mdSecs=mdSecs;',sandbox);
const mdSecs=sandbox.__mdSecs;

const semCodigo=h=>h.replace(/<pre><code>[\s\S]*?<\/code><\/pre>/g,'').replace(/<code>[\s\S]*?<\/code>/g,'');
const cru=h=>/\*\*|```|- \[ \]/.test(semCodigo(h));

const files=readdirSync(new URL('./modulos',import.meta.url)).filter(f=>f.endsWith('.md')).sort();
assert.equal(files.length,13);
let tabelas=0;
for(const f of files){
  const sec=mdSecs(readFileSync(new URL('./modulos/'+f,import.meta.url),'utf8'));
  for(const k of ['obj','pq','ce','ck','proj'])assert(sec[k],f+': seção '+k+' não encontrada');
  if(!f.startsWith('12'))assert(sec.lab,f+': sem lab guiado');
  assert(sec.ce.length>2000,f+': conteúdo essencial curto demais');
  assert(sec.ck.includes('☐'),f+': checklist sem itens');
  for(const [k,h] of Object.entries(sec)){
    assert(!cru(h),f+'/'+k+': markdown cru vazou na prosa');
    assert(!/<script|onerror=/i.test(h),f+'/'+k+': html do .md não foi escapado');
  }
  // projeto: mesmas garantias de antes
  if(!f.startsWith('12'))assert(sec.proj.includes('<pre><code>'),f+': projeto sem bloco de código');
  assert(/class="ck"/.test(sec.proj),f+': checkpoint sem destaque');
  assert(/git push|commit|reposit/i.test(sec.proj),f+': roteiro não entrega no GitHub');
  tabelas+=(sec.ce.match(/<table>/g)||[]).length;
}
assert(tabelas>=5,'tabelas do conteúdo essencial não renderizaram ('+tabelas+')');
console.log('✓ material dos 13 módulos renderiza na página (conteúdo, lab, checklist, projeto, '+tabelas+' tabelas)');
