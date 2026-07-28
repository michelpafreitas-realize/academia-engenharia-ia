# Especificação de roteiro de vídeo-aula (Academia de Engenharia de IA)

Gere um JSON de roteiro para o vídeo-aula de UM módulo, seguindo EXATAMENTE o formato do exemplo `videos/src/roteiros/00.json` (leia-o antes).

## Campos do topo
- `id`: "ModuloNN" (dois dígitos)
- `slug`: "modNN"
- `modulo`: N (número)
- `titulo`: título do módulo SEM o prefixo "Módulo N — " (do H1 do .md)
- `periodo`, `carga`: da linha de citação no topo do .md (ex.: "Período 2", "16h")

## Cenas (11 a 14 no total, nesta ordem)
1. `capa` — abertura: boas-vindas ao módulo, o que ele entrega.
2. `conceito` com kicker "POR QUE ISSO IMPORTA" — a motivação do módulo.
3. a N-2: 6 a 9 cenas cobrindo o **Conteúdo essencial** do .md, misturando:
   - `topico` (kicker, titulo, bullets[]) — para listas de ideias/ferramentas/comparações
   - `code` (kicker, titulo, code) — para trechos de código; use pelo menos 2 cenas `code` se o módulo tiver código; adapte/encurte o código do .md
   - `conceito` (kicker, frase) — para 1 ou 2 ideias-chave marcantes do módulo
4. penúltima: `topico` com kicker "MINI-PROJETO" — o que construir e critérios principais.
5. última: `fim` — bullets = checklist resumido (4-5 itens), `proximo` = próximo módulo, fala de encerramento anunciando o próximo módulo.

## Regras de conteúdo
- `fala` (narração TTS): pt-BR, professor direto falando com "você", 2 a 5 frases por cena, SEM emojis, SEM markdown, sem URLs faladas. Símbolos e nomes técnicos escritos de forma pronunciável. Total de fala do vídeo entre 2400 e 3400 caracteres.
- Fidelidade: ensine o que o .md ensina — mesmas ideias, mesmas regras de ouro, mesmas analogias quando fortes. Não invente conteúdo novo.
- `bullets`: máx 5 por cena, cada um com até 48 caracteres, sem ponto final.
- `frase` (conceito): até 110 caracteres, afirmação forte e memorável.
- `kicker`: MAIÚSCULAS, até 24 caracteres.
- `titulo` de cena: até 40 caracteres.
- `code`: até 12 linhas, até 52 colunas por linha; comentários em pt-BR curtos.
- JSON válido, UTF-8, sem comentários, sem vírgula sobrando.
