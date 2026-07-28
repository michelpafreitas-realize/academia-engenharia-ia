#!/bin/bash
# Renderiza os 13 vídeos-aula em sequência. Log: out/render.log
set -u
export LD_LIBRARY_PATH="$HOME/.local/chromium-libs/usr/lib/x86_64-linux-gnu"
cd "$(dirname "$0")/.."
mkdir -p out
node -e 'const fs=require("fs");fs.readdirSync("src/roteiros").filter(f=>f.endsWith(".json")).sort().forEach(f=>{const v=JSON.parse(fs.readFileSync("src/roteiros/"+f));console.log(v.id+" "+v.slug)})' |
while read -r id slug; do
  if [ -s "out/$slug.mp4" ]; then echo "SKIP $id"; continue; fi
  echo "== $id ($(date +%H:%M:%S))"
  npx remotion render src/index.ts "$id" "out/$slug.mp4" --log=error && echo "OK $id" || echo "FAIL $id"
done
echo "FIM $(date +%H:%M:%S)"
