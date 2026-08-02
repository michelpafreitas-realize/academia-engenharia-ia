// Check do passo a passo na página: extrai mdProj do <script> do index.html e
// valida a renderização da seção Mini-projeto/Capstone dos 13 módulos.
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
vm.runInContext(src+'\n;globalThis.__mdProj=mdProj;',sandbox);
const mdProj=sandbox.__mdProj;

const files=readdirSync(new URL('./modulos',import.meta.url)).filter(f=>f.endsWith('.md')).sort();
assert.equal(files.length,13);
for(const f of files){
  const out=mdProj(readFileSync(new URL('./modulos/'+f,import.meta.url),'utf8'));
  const prosa=out.replace(/<pre><code>[\s\S]*?<\/code><\/pre>/g,'').replace(/<code>[\s\S]*?<\/code>/g,'');
  assert(out.length>800,f+': seção curta demais');
  if(!f.startsWith('12'))assert(out.includes('<pre><code>'),f+': sem bloco de código'); // capstone é roteiro em prosa
  assert(!/\*\*|```|- \[ \]/.test(prosa),f+': markdown cru vazou na prosa');
  assert(/class="ck"/.test(out),f+': checkpoint sem destaque');
  assert(!/<script|onerror=/i.test(out),f+': html do .md não foi escapado');
  // o hábito-alvo: todo roteiro entrega o projeto num repositório (GitHub/commit/push)
  assert(/git push|commit e push|commit|reposit/i.test(out),f+': roteiro não entrega no GitHub');
}
console.log('✓ passo a passo dos 13 módulos renderiza na página e entrega no GitHub');
