# Especificação de AULA COMPLETA (~40 min) — Academia de Engenharia de IA

Formato "aula de professor universitário" para TV, por módulo. Mesmo pipeline dos
resumos (Aula.tsx + gen_audio.py + render_all.sh); muda só a escala do roteiro.

Arquivo: `videos/src/roteiros/aNN.json` · `id: "AulaNN"` · `slug: "aulaNN"`.
Registrar o import em `src/Root.tsx` (ROTEIROS). Exemplo pronto: `a01.json`.

## Escala (alvo: 38–42 min)
- 50 a 55 cenas; fala total entre 37.000 e 40.000 caracteres.
- TTS lê ~17 chars/s (AntonioNeural +20%): chars/1020 ≈ minutos.
- Fala por cena: 600–900 chars (5–8 frases), professor falando com "você",
  SEM emojis/markdown/URLs; símbolos por extenso ("por cento", "ponto shape").

## Estrutura (espelha o .md do módulo)
1. `capa` — abertura de aula: o que veremos, tom de professor.
2. `conceito` POR QUE ISSO IMPORTA + `topico` ROTEIRO DA AULA (agenda) +
   `topico` COMO ESTUDAR (a tabela de aulas/recursos do .md, carga total).
3. Partes 1..N seguindo as seções do "Conteúdo essencial": cada parte abre com
   divisor (`conceito` kicker "PARTE X DE N", frase = tese da parte) ou `topico`
   com kicker "PARTE X DE N"; dentro, alterna `topico`/`code`/`conceito`.
   Todo código do .md vira cena `code` explicada linha a linha na fala.
4. Lab guiado: divisor + uma cena `code` por célula, narrando resultados reais.
5. Mini-projeto: 3–4 `topico` (enunciado, requisitos, passo a passo, se travar).
6. `topico` ERROS COMUNS (5 tropeços) + `conceito` RECAPITULANDO + `fim`
   (checklist do .md + próximo módulo).

## Limites visuais (iguais ao resumo)
kicker ≤24 · titulo ≤40 · frase ≤110 · bullets ≤5×48 · code ≤12 linhas×52 col.

## Didática da fala
Explicar o porquê antes do como; ler o código da tela em voz alta por partes;
exemplos numéricos conferíveis de cabeça; retomadas ("guarde isso", "repare");
avisos de erro comum; fidelidade ao .md — aprofunda, não inventa currículo novo.

## Produção
```bash
npm run audio    # gera public/audio/aulaNN-*.mp3 + durations.ts
# conferir minutos: somar chaves aulaNN- em durations.ts (alvo 38-42)
```
Atenção: inserir cena no meio desloca os índices — apagar `aulaNN-*.mp3` e
regerar o áudio antes de renderizar.

RENDER: um render único de ~71k frames ESTOURA a RAM do Chrome na WSL
(3,7 GiB), mesmo com --concurrency=2 (acúmulo ao longo do render).
Renderizar em ~6 blocos alinhados a INÍCIO DE CENA (cortes caem no
silêncio) e concatenar com ffmpeg -c copy. Modelo pronto:
`scripts/render_aula01_chunks.sh` (fronteiras = acumulado de
ceil(dur*30)+8 por cena; reexecutar retoma dos blocos que faltam).
