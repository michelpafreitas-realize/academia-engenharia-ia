#!/bin/bash
# Renderiza uma aula longa em blocos alinhados a início de cena e concatena
# com ffmpeg (RAM do Chrome na WSL). Reexecutar retoma de onde parou.
# Uso: scripts/render_aula_chunks.sh 03   -> renderiza Aula03 (out/aula03.mp4)
# Fronteiras calculadas de src/durations.ts — rodar gen_audio.py antes.
set -u
N="$1"
export LD_LIBRARY_PATH="$HOME/.local/chromium-libs/usr/lib/x86_64-linux-gnu"
export TMPDIR="$HOME/academia-engenharia-ia/videos/out/.tmp"
mkdir -p "$TMPDIR"
cd "$(dirname "$0")/.."
mkdir -p "out/aula$N-parts"

RANGES=$(node -e '
const fs=require("fs");
const N=process.argv[1];
const v=JSON.parse(fs.readFileSync(`src/roteiros/a${N}.json`));
const t=fs.readFileSync("src/durations.ts","utf8");
const DUR=JSON.parse(t.slice(t.indexOf("{"),t.lastIndexOf("}")+1));
const FPS=30,PAD=8,TAIL=20; // espelha src/Aula.tsx e src/lib.tsx
const sf=i=>{const d=DUR[`${v.slug}-${i}`];if(!d)throw new Error(`sem duração ${v.slug}-${i}`);return Math.ceil(d*FPS)+PAD;};
const starts=[0];
for(let i=0;i<v.scenes.length;i++) starts.push(starts[i]+sf(i));
const total=starts[v.scenes.length]+TAIL;
const alvo=Math.ceil(total/6);
const rs=[];let a=0;
for(let i=1;i<=v.scenes.length;i++){
  const end=i===v.scenes.length?total:starts[i];
  if(end-a>=alvo||i===v.scenes.length){rs.push(`${a}-${end-1}`);a=end;}
}
console.log(rs.join(" "));
' "$N") || exit 1
echo "Aula$N blocos: $RANGES"

i=0
for b in $RANGES; do
  i=$((i+1)); f="out/aula$N-parts/p$i.mp4"
  if [ -s "$f" ]; then echo "SKIP p$i"; continue; fi
  echo "== p$i ($b) $(date +%H:%M:%S)"
  npx remotion render src/index.ts "Aula$N" "$f" \
    --frames="$b" --concurrency=2 --log=error || { echo "FAIL p$i"; exit 1; }
done

: > "out/aula$N-parts/concat.txt"
for n in $(seq 1 $i); do echo "file 'p$n.mp4'"; done > "out/aula$N-parts/concat.txt"
node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg \
  -y -f concat -safe 0 -i "out/aula$N-parts/concat.txt" -c copy "out/aula$N.mp4" \
  || exit 1
echo "CONCAT_OK $(date +%H:%M:%S)"
cp "out/aula$N.mp4" "/mnt/c/Users/Realize/Downloads/academia-aula$N.mp4" \
  && echo COPIADO_DOWNLOADS
