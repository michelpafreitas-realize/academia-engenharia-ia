# Gera narração (edge-tts) por cena + durations.ts para o Remotion.
# Rodar: uv run --with edge-tts --with mutagen python scripts/gen_audio.py
import asyncio, json
from pathlib import Path

import edge_tts
from mutagen.mp3 import MP3

ROOT = Path(__file__).resolve().parent.parent
VOICE = "pt-BR-AntonioNeural"
RATE = "+20%"
OUT = ROOT / "public" / "audio"
OUT.mkdir(parents=True, exist_ok=True)

videos = [
    json.loads(p.read_text(encoding="utf-8"))
    for p in sorted((ROOT / "src" / "roteiros").glob("*.json"))
]
sem = asyncio.Semaphore(4)


async def synth(text: str, path: Path):
    async with sem:
        for attempt in range(3):
            try:
                await edge_tts.Communicate(text, VOICE, rate=RATE).save(str(path))
                return
            except Exception:
                if attempt == 2:
                    raise
                await asyncio.sleep(2 * (attempt + 1))


async def main():
    jobs = []
    for v in videos:
        for i, s in enumerate(v["scenes"]):
            path = OUT / f"{v['slug']}-{i}.mp3"
            if not path.exists():
                jobs.append(synth(s["fala"], path))
    print(f"{len(jobs)} áudios a gerar")
    await asyncio.gather(*jobs)

    durs = {}
    for v in videos:
        for i in range(len(v["scenes"])):
            key = f"{v['slug']}-{i}"
            durs[key] = round(MP3(OUT / f"{key}.mp3").info.length, 3)
    ts = "// gerado por scripts/gen_audio.py — segundos por cena\nexport const DUR: Record<string, number> = "
    (ROOT / "src" / "durations.ts").write_text(
        ts + json.dumps(durs, indent=2, ensure_ascii=False) + ";\n", encoding="utf-8"
    )
    total = sum(durs.values())
    print(f"{len(durs)} áudios ok · narração total {total:.0f}s")


asyncio.run(main())
