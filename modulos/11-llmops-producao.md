# Módulo 11 — LLMOps: IA em Produção

> 🏛️ Período 4 · ⏱️ Carga estimada: 12h · 📋 Pré-requisitos: Módulo 10 (Avaliação & Segurança)

## 🎯 Objetivos

- Ao final, você será capaz de desenhar a arquitetura de referência de um app LLM em produção (gateway → guardrails → LLM → evals/logs).
- Ao final, você será capaz de decidir entre servir modelos abertos com vLLM e usar uma API gerenciada, usando uma tabela de custo/controle/latência.
- Ao final, você será capaz de reduzir latência e custo com streaming, prompt caching, batching e roteamento/cascata de modelos.
- Ao final, você será capaz de tornar o sistema resiliente com retries, timeouts, fallback entre provedores e respeito a rate limits.
- Ao final, você será capaz de instrumentar observabilidade específica de LLM (prompt, resposta, tokens, custo, latência, tracing) e montar um FinOps de tokens.

## 🗺️ Por que isso importa

Escrever o protótipo de um app de IA é a parte fácil e barata. O que separa o protótipo do produto — e o júnior do sênior — é tudo que acontece *depois*: o app aguenta 10 mil usuários? Quando um provedor cai, o serviço degrada com elegância ou explode? Quanto custa por usuário, e onde o dinheiro está indo? Quando a resposta demora, dá para saber *qual* etapa demorou? LLMOps é a disciplina que responde a essas perguntas, e é onde a maioria dos projetos de IA morre — não por falta de inteligência do modelo, mas por falta de engenharia de produção em volta dele.

Este é o módulo que faz de você alguém que uma empresa pode confiar para *colocar e manter* IA no ar. Chip Huyen, no blog [huyenchip.com](https://huyenchip.com) e no livro "AI Engineering" (O'Reilly, 2025 — sua leitura-guia deste módulo), argumenta que o engenheiro de IA é, cada vez mais, um engenheiro de *sistemas* que por acaso usa modelos: latência, custo, resiliência e observabilidade são o trabalho real. Dominar LLMOps é o que transforma "sei chamar a API" em "sei operar IA em produção com custo e SLA sob controle".

## 📚 Aulas

| # | Aula | Tipo | Recurso | Duração estimada |
|---|------|------|---------|------------------|
| 1 | Blog e livro "AI Engineering" de Chip Huyen (leitura-guia) | 📖 leitura | [huyenchip.com](https://huyenchip.com) | 2h |
| 2 | vLLM: servir modelos abertos com alto throughput | 📖 leitura | [docs.vllm.ai](https://docs.vllm.ai) | 1h |
| 3 | Langfuse: observabilidade e tracing open-source de LLM | 💻 lab | [langfuse.com](https://langfuse.com) | 1h30 |
| 4 | LangSmith: tracing e avaliação da LangChain | 📖 leitura | [smith.langchain.com](https://smith.langchain.com) | 45 min |
| 5 | W&B Weave: observabilidade de aplicações de LLM | 📖 leitura | [wandb.ai](https://wandb.ai) | 45 min |
| 6 | Modal: GPU serverless para servir seus modelos | 💻 lab | [modal.com](https://modal.com) | 1h |
| 7 | Made With ML: boas práticas de MLOps aplicadas | 📖 leitura | [madewithml.com](https://madewithml.com) | 1h30 |
| 8 | Full Stack Deep Learning: deploy e operação | 🎥 vídeo | [fullstackdeeplearning.com](https://fullstackdeeplearning.com) | 1h30 |
| 9 | Lab guiado: FastAPI na frente de um LLM com logging e fallback | 💻 lab | este módulo, seção Lab guiado | 2h |
| 10 | Mini-projeto: containerizar e medir o serviço | 💻 lab | este módulo, seção Mini-projeto | 1h |

## 🧠 Conteúdo essencial

### 1. Arquitetura de referência de um app LLM

Nenhum app sério chama a API do LLM direto do frontend. O padrão de produção é uma cadeia:

```
Cliente → Gateway → Guardrails (entrada) → LLM → Guardrails (saída) → Cliente
                        │                    │                │
                        └──────── Logs / Evals / Métricas ────┘
```

- **Gateway**: o seu backend (FastAPI, Express...) fica entre o cliente e o LLM. Ele detém as chaves de API (nunca no cliente!), aplica autenticação, rate limiting por usuário e roteamento. É o único ponto que fala com os provedores.
- **Guardrails de entrada** (Módulo 10): valida/filtra a entrada antes de gastar tokens.
- **LLM**: a chamada em si — para uma API gerenciada ou para o seu modelo servido.
- **Guardrails de saída**: valida a resposta antes de devolvê-la (JSON válido? PII? conteúdo proibido?).
- **Observabilidade transversal**: cada request registra prompt, resposta, tokens, custo e latência; os evals do Módulo 10 rodam sobre esses logs.

Essa arquitetura é o que dá pontos de controle: sem o gateway, você não consegue trocar de modelo, medir custo nem impor guardrails de forma central.

### 2. vLLM vs API gerenciada

A decisão de fundo: você hospeda o modelo ou aluga a inferência?

**Servir aberto com [vLLM](https://docs.vllm.ai)** — vLLM é o servidor de inferência de referência para modelos abertos, com throughput altíssimo graças ao **PagedAttention**, que gerencia o KV cache em "páginas" de memória (como a memória virtual de um SO), eliminando o desperdício que limitava o número de requisições simultâneas. Ele expõe uma API compatível com o formato OpenAI, então seu código-cliente não muda.

**Usar API gerenciada** (Claude, e outros provedores) — você chama um endpoint e paga por token, sem operar GPU.

Tabela de decisão:

| Critério | vLLM (self-hosted) | API gerenciada |
|----------|--------------------|----------------|
| Custo em baixo volume | Alto (GPU parada custa) | Baixo (paga o que usa) |
| Custo em alto volume constante | Pode compensar muito | Caro em escala |
| Controle / privacidade | Total (dados não saem) | Limitado ao provedor |
| Latência | Você controla (sem fila de terceiros) | Depende do provedor |
| Esforço operacional | Alto (GPU, escala, uptime) | Quase nenhum |
| Modelos de fronteira | Só os abertos | Acesso aos melhores |

Regra prática: **comece com API gerenciada** (velocidade de desenvolvimento, sem ops) e migre para self-hosting quando volume constante, privacidade ou custo em escala justificarem. [Modal](https://modal.com) oferece um meio-termo: GPU *serverless* — você sobe seu modelo/vLLM e paga só pelo tempo de execução, sem manter GPU ligada 24/7.

### 3. Latência e custo: as alavancas

Quatro alavancas, da mais barata de aplicar à mais estrutural:

- **Streaming**: envie os tokens conforme são gerados. Não reduz o custo nem o tempo total, mas derruba o *time-to-first-token* percebido — o usuário vê a resposta começar em 1s em vez de esperar 15s por tudo. Também evita timeouts de HTTP em respostas longas. É a melhoria de UX de maior retorno.
- **Prompt caching**: o prefixo estável do prompt (system, exemplos, contexto longo) é lido do cache do provedor a ~10% do preço de entrada e mais rápido. Reaproveita o que você já viu no Módulo 8: mantenha o prefixo *byte-idêntico* entre requests e ponha o conteúdo volátil no fim. Em apps com system prompt grande, corta custo e latência dramaticamente.
- **Batching**: agrupe requisições não urgentes e processe em lote (muitos provedores oferecem uma API de batch a ~50% do preço, para trabalho assíncrono). Ideal para classificação em massa, geração de embeddings, evals noturnos.
- **Escolher o menor modelo que resolve (cascata/roteamento)**: nem toda requisição precisa do modelo mais caro. **Roteamento**: um classificador barato decide qual modelo atende cada request (perguntas simples → modelo pequeno; complexas → grande). **Cascata**: tente primeiro o modelo barato e só escale para o caro se a resposta não passar num teste de qualidade. Ambos podem cortar custo pela metade sem perda perceptível.

### 4. Resiliência: o mundo real falha

APIs caem, dão timeout, retornam 429. Um app de produção assume isso:

- **Retries com backoff exponencial**: em erros transitórios (429 rate limit, 5xx do servidor, falha de rede), tente de novo com espera crescente (1s, 2s, 4s...) e *jitter* (aleatoriedade para não sincronizar retries). Os SDKs oficiais já fazem isso por padrão (ex.: `max_retries=2`) — não reimplemente sem necessidade.
- **Timeouts**: defina um teto por request. Sem timeout, uma chamada travada segura a conexão indefinidamente. Combine com streaming para respostas longas.
- **Fallback entre provedores/modelos**: se o provedor A falha ou está sobrecarregado, redirecione para o provedor B ou para um modelo secundário. É o que mantém o serviço no ar quando um provedor tem um dia ruim. (Alguns modelos oferecem fallback nativo por política de segurança, mas o fallback de *disponibilidade* é responsabilidade sua.)
- **Rate limits**: respeite os limites do provedor (requisições e tokens por minuto). Em 429, leia o header `retry-after` e espere; do lado do seu app, imponha rate limiting *por usuário* no gateway para um cliente não esgotar a cota de todos.

O erro clássico do iniciante é o *catch* genérico que engole tudo. O profissional distingue erro **retryável** (429, 5xx, rede) de **não-retryável** (400, 401, 404) e trata cada classe apropriadamente — retry só faz sentido no primeiro grupo.

### 5. Observabilidade específica de LLM

Logs de app tradicional não bastam. Para cada request de LLM você quer registrar: **prompt completo, resposta, contagem de tokens (entrada/saída/cache), custo estimado, latência, modelo usado, e o resultado dos guardrails**. E, para agentes e cadeias, você precisa de **tracing**: a árvore de chamadas (qual tool foi chamada, com que input, quanto demorou cada passo) — sem isso, depurar um agente que deu voltas é impossível.

Ferramentas dedicadas:

- **[Langfuse](https://langfuse.com)** — open-source, self-hostável; tracing, custo, avaliação, num painel. Ótimo ponto de partida (e é o que o lab usa). Instrumentação por decorador ou wrapper do cliente.
- **[LangSmith](https://smith.langchain.com)** — da LangChain; tracing e eval fortemente integrados ao ecossistema LangChain/LangGraph.
- **[W&B Weave](https://wandb.ai)** — da Weights & Biases; observabilidade de apps de LLM com o histórico da W&B em experimentação.

O princípio: **se não está instrumentado, não existe.** Você não consegue otimizar custo, latência ou qualidade daquilo que não mede.

### 6. Versionamento de prompts e CI/CD com eval gate

Prompts são código: devem ser versionados, revisados e testados. Na prática:

- Prompts vivem no repositório (arquivos, não hard-coded espalhado), com histórico no git.
- Todo PR que toca prompt, modelo ou pipeline dispara a **suite de evals do Módulo 10** no CI.
- O **eval gate** barra o merge se a qualidade cai abaixo do limiar — igual a um teste unitário quebrado.

Isso fecha o ciclo com o módulo anterior: os evals que você construiu viram o portão de deploy. "Mudei o prompt, os evals ficaram verdes, subiu" é o fluxo maduro; "editei o prompt em produção e torci" é o que você deixa para trás.

### 7. Deploy prático

Onde o serviço roda:

- **Docker**: empacote o app num container. Reprodutível, portátil, base de tudo abaixo. Um `Dockerfile` de app FastAPI é curto e é o que o mini-projeto pede.
- **Railway / Render / Fly.io**: PaaS que fazem deploy de um container/repo com pouca configuração. Ideal para APIs e apps de porte pequeno/médio — do git push ao ar em minutos.
- **Hugging Face Spaces**: hospedagem grátis de *demos* (Gradio/Streamlit). Perfeito para portfólio e provas de conceito (Módulo 12).
- **[Modal](https://modal.com)**: GPU serverless, para quando você serve o próprio modelo e não quer manter GPU ligada 24/7.

A escolha segue a carga: demo → Spaces; API de produto → container em Railway/Render/Fly; inferência própria em GPU → Modal ou vLLM em nuvem.

### 8. FinOps de tokens

Custo de IA é variável e cresce com o uso — e sem visibilidade ele surpreende no fim do mês. FinOps de tokens é a prática de *atribuir e controlar* esse custo:

- **Dashboard de custo por feature e por usuário**: como você loga tokens e modelo por request (seção 5), consegue somar custo por rota, por feature e por cliente. Isso revela a feature que consome 70% do orçamento e o usuário que sozinho gera metade das chamadas.
- **Alertas e limites**: alarme quando o custo diário ultrapassa um teto; cota por usuário para evitar abuso.
- **Otimização guiada por dado**: com o dashboard, você sabe *onde* aplicar as alavancas da seção 3 — cache no prompt caro, roteamento na feature de alto volume, batch no processamento assíncrono.

FinOps transforma custo de IA de "susto mensal" em métrica de produto gerenciável — e é frequentemente o que garante a continuidade do projeto quando o financeiro pergunta "quanto isso custa?".

## 💻 Lab guiado

Objetivo: um endpoint **FastAPI** na frente de uma API de LLM, com **streaming**, **logging de custo/latência** e **fallback de modelo**, empacotado num **container**.

**Passo 1 — Setup**

```bash
mkdir llm-gateway && cd llm-gateway
pip install fastapi "uvicorn[standard]" anthropic
export ANTHROPIC_API_KEY="sua-chave"
```

**Passo 2 — `app.py`** (completo e executável):

```python
"""Gateway LLM: streaming + logging de custo/latência + fallback de modelo."""
import json
import time
import logging
import anthropic
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(message)s")
log = logging.getLogger("gateway")
app = FastAPI()
client = anthropic.Anthropic()

# Preço por 1M de tokens (entrada, saída) — ajuste aos valores atuais
PRECOS = {
    "claude-opus-4-8": (5.0, 25.0),
    "claude-haiku-4-5": (1.0, 5.0),
}
MODELO_PRIMARIO = "claude-opus-4-8"
MODELO_FALLBACK = "claude-haiku-4-5"

class Pergunta(BaseModel):
    texto: str

def custo(modelo: str, entrada: int, saida: int) -> float:
    p_in, p_out = PRECOS[modelo]
    return (entrada * p_in + saida * p_out) / 1_000_000

def stream_modelo(modelo: str, texto: str):
    """Gera tokens em streaming e loga custo/latência ao final."""
    inicio = time.time()
    with client.messages.stream(
        model=modelo, max_tokens=1024,
        messages=[{"role": "user", "content": texto}],
    ) as stream:
        for pedaco in stream.text_stream:
            yield pedaco
        final = stream.get_final_message()
    dur = time.time() - inicio
    u = final.usage
    c = custo(modelo, u.input_tokens, u.output_tokens)
    log.info(json.dumps({
        "modelo": modelo, "input_tokens": u.input_tokens,
        "output_tokens": u.output_tokens, "custo_usd": round(c, 6),
        "latencia_s": round(dur, 2),
    }))

@app.post("/perguntar")
def perguntar(p: Pergunta):
    def gerar():
        try:
            yield from stream_modelo(MODELO_PRIMARIO, p.texto)
        except anthropic.APIStatusError as e:
            # Fallback só em erro do provedor (sobrecarga/5xx), não em 4xx do cliente
            if e.status_code >= 500 or e.status_code == 429:
                log.warning(f"primário falhou ({e.status_code}); usando fallback")
                yield from stream_modelo(MODELO_FALLBACK, p.texto)
            else:
                raise
    return StreamingResponse(gerar(), media_type="text/plain")

@app.get("/saude")
def saude():
    return {"status": "ok"}
```

**Passo 3 — Rode e teste**:

```bash
uvicorn app:app --reload
# noutro terminal:
curl -N -X POST http://localhost:8000/perguntar \
  -H "Content-Type: application/json" \
  -d '{"texto":"Explique streaming de LLM em 3 frases."}'
```

Você vê a resposta chegar token a token (streaming), e no terminal do servidor uma linha de log JSON com tokens, custo e latência — a base da sua observabilidade.

**Passo 4 — Containerize.** Crie `Dockerfile`:

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

E `requirements.txt`:

```
fastapi
uvicorn[standard]
anthropic
```

```bash
docker build -t llm-gateway .
docker run -p 8000:8000 -e ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY" llm-gateway
```

**Passo 5 — Teste o fallback.** Troque temporariamente `MODELO_PRIMARIO` por um ID inexistente para simular falha (vai dar 404, que *não* deve cair no fallback — só 429/5xx devem). Depois force um cenário de 429/sobrecarga (ou stubbe a exceção) e confirme que o log de "usando fallback" aparece e a resposta ainda chega. Essa distinção retryável vs não-retryável é o coração da resiliência.

## 🚀 Mini-projeto

**Enunciado**: **"Serviço de IA observável"** — evolua o gateway do lab para um serviço com observabilidade completa e um dashboard de custo, deployado num container acessível.

**Requisitos**:
- API FastAPI com pelo menos 2 rotas de IA distintas (ex.: `/resumir` e `/classificar`), cada uma com streaming quando fizer sentido.
- Observabilidade real: integre **Langfuse** (ou logging estruturado próprio) registrando por request prompt, resposta, tokens, custo, latência e modelo. Trace pelo menos uma cadeia/agente (2+ passos).
- Resiliência: retries com backoff (pode ser o do SDK), timeout explícito, e fallback de modelo apenas em erros retryáveis.
- Roteamento de modelo: uma das rotas escolhe entre modelo pequeno e grande conforme uma heurística simples de complexidade da entrada.
- FinOps: um endpoint `/custos` (ou uma página) que agrega o custo total e por rota a partir dos logs.
- Deploy num container, subido em Railway/Render/Fly (ou rodando localmente via Docker com instruções claras).

### 🧭 Passo a passo

Reserve ~3h30 no total (pode dividir em 2 sessões). Siga na ordem — cada etapa termina com um **checkpoint**; só avance quando ele passar.

**Etapa 1 — Partir do gateway do lab (15 min)**

Copie o projeto do Lab guiado (Passos 1 a 4) para uma pasta nova: `cp -r llm-gateway servico-ia && cd servico-ia`. Suba com `uvicorn app:app --reload` e repita o `curl -N` do Passo 3 do lab.

✅ **Checkpoint:** a resposta chega token a token e o servidor imprime o log JSON com tokens, custo e latência.

**Etapa 2 — Duas rotas de IA com streaming e roteamento (45 min)**

Acrescente um parâmetro `rota` a `stream_modelo` e inclua-o no `log.info`; troque o cliente por `client = anthropic.Anthropic(timeout=30, max_retries=2)` — timeout explícito + retries com backoff do próprio SDK (seção 4). Depois, extraia o streaming+fallback de `/perguntar` para reutilizar nas rotas novas:

```python
def responder(rota: str, prompt: str, modelo: str = MODELO_PRIMARIO):
    def gerar():
        try:
            yield from stream_modelo(modelo, prompt, rota)
        except anthropic.APIStatusError as e:
            if e.status_code < 500 and e.status_code != 429:
                raise  # 4xx do cliente não cai no fallback (seção 4)
            yield from stream_modelo(MODELO_FALLBACK, prompt, rota)
    return StreamingResponse(gerar(), media_type="text/plain")

@app.post("/resumir")
def resumir(p: Pergunta):
    return responder("resumir", f"Resuma em 3 frases:\n{p.texto}")
@app.post("/classificar")
def classificar(p: Pergunta):
    modelo = MODELO_PRIMARIO if len(p.texto) > 400 else MODELO_FALLBACK  # roteamento (seção 3)
    return responder("classificar", f"Sentimento em 1 palavra (positivo/negativo/neutro):\n{p.texto}", modelo)
```

✅ **Checkpoint:** `curl -N -X POST http://localhost:8000/resumir -H "Content-Type: application/json" -d '{"texto":"Streaming derruba o time-to-first-token."}'` retorna 200 com a resposta chegando aos poucos; o mesmo curl em `/classificar` também.

**Etapa 3 — Observabilidade persistida (40 min)**

O `/custos` da Etapa 6 precisa dos registros guardados ("se não está instrumentado, não existe", seção 5). Em `stream_modelo`, acumule os pedaços numa string `resposta`, acrescente `trace_id=None` à assinatura e, junto ao `log.info`, chame `registrar(rota, modelo, texto, resposta, u, c, dur, trace_id)` — com `import sqlite3` no topo. Prefere um painel pronto? A aula 3 (Langfuse) faz o mesmo com decorador; aqui a biblioteca padrão basta:

```python
def registrar(rota, modelo, prompt, resposta, u, c, dur, trace_id=None):
    con = sqlite3.connect("registros.db")
    con.execute("CREATE TABLE IF NOT EXISTS registros(ts REAL, rota TEXT, modelo TEXT, prompt TEXT, resposta TEXT, input_tokens INT, output_tokens INT, custo_usd REAL, latencia_s REAL, trace_id TEXT)")
    con.execute("INSERT INTO registros VALUES(?,?,?,?,?,?,?,?,?,?)", (time.time(), rota, modelo, prompt, resposta, u.input_tokens, u.output_tokens, c, dur, trace_id))
    con.commit(); con.close()
```

✅ **Checkpoint:** após um curl com texto curto e outro com 500+ caracteres em `/classificar`, `python -c "import sqlite3; print(sqlite3.connect('registros.db').execute('SELECT rota, modelo, custo_usd FROM registros').fetchall())"` mostra linhas com modelos **diferentes** na mesma rota — roteamento comprovado.

**Etapa 4 — Provar o fallback retryável (20 min)**

Repita o Passo 5 do lab guiado: com `MODELO_PRIMARIO` trocado por um id inexistente, o 404 deve estourar **sem** acionar o fallback; com um 429/5xx simulado (stub da exceção), a resposta deve vir do modelo B. Desfaça a troca ao terminar.

✅ **Checkpoint:** no caso 429/5xx a resposta chega e o SQLite registra o modelo de fallback; no caso 404 nenhuma linha nova aparece.

**Etapa 5 — Cadeia com trace de 2 passos (30 min)**

Crie a rota `/analisar`: resume e depois classifica o resumo — dois passos com o mesmo `trace_id` (`import uuid` no topo do arquivo):

```python
@app.post("/analisar")
def analisar(p: Pergunta):
    tid = str(uuid.uuid4())
    resumo = "".join(stream_modelo(MODELO_FALLBACK, f"Resuma em 1 frase:\n{p.texto}", "analisar", tid))
    sentimento = "".join(stream_modelo(MODELO_FALLBACK, f"Sentimento em 1 palavra:\n{resumo}", "analisar", tid))
    return {"resumo": resumo, "sentimento": sentimento, "trace_id": tid}
```

✅ **Checkpoint:** `python -c "import sqlite3; print(sqlite3.connect('registros.db').execute('SELECT trace_id, COUNT(*) FROM registros WHERE trace_id IS NOT NULL GROUP BY trace_id').fetchall())"` mostra 1 trace com 2 passos — o tracing da seção 5 em versão mínima.

**Etapa 6 — FinOps: endpoint /custos (20 min)**

```python
@app.get("/custos")
def custos():
    por_rota = dict(sqlite3.connect("registros.db").execute("SELECT rota, ROUND(SUM(custo_usd), 6) FROM registros GROUP BY rota"))
    return {"total_usd": round(sum(por_rota.values()), 6), "por_rota": por_rota}
```

✅ **Checkpoint:** `curl http://localhost:8000/custos` retorna o total e o custo por rota, coerentes com as chamadas que você fez até aqui.

**Etapa 7 — Container, deploy e entrega (40 min)**

1. Reaproveite o `Dockerfile` e o `requirements.txt` do Passo 4 do lab (nada novo a instalar — `sqlite3` e `uuid` são da biblioteca padrão): `docker build -t servico-ia .` e depois `docker run -p 8000:8000 -e ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY" servico-ia`. Repita os curls das Etapas 2, 5 e 6 contra o container (o `registros.db` nasce zerado dentro dele — chame as rotas de IA antes do `/custos`).
2. Quer público? Suba o container em Railway/Render/Fly (seção 7), com `ANTHROPIC_API_KEY` no painel do serviço — nunca no Dockerfile. Feche com um README explicando como subir e testar cada rota, e rode a suite de evals do Módulo 10 contra o serviço como gate.
3. Entregue no seu repositório `academia-ia` — Dockerfile e README vão junto; `registros.db` e chave de API ficam fora (confira o `.gitignore` com `git status` antes):

```bash
git add .
git commit -m "Módulo 11: serviço de IA com logs, custos, fallback e container"
git push
```

✅ **Checkpoint:** todas as rotas respondem no container (ou na URL pública), o projeto aparece no seu GitHub e todos os critérios de aceite abaixo estão marcados.

**🆘 Se travar:** `Address already in use` na porta 8000 → o uvicorn da Etapa 1 ainda está rodando; encerre-o (Ctrl+C) antes do `docker run`, ou use `-p 8001:8000`. Erro 401/`authentication_error` só dentro do container → a `ANTHROPIC_API_KEY` não entra sozinha: falta o `-e` no `docker run` (ou a variável no painel do PaaS). A resposta chega inteira de uma vez em vez de em streaming → falta o `-N` no curl (é ele que desliga o buffer do lado do cliente). Travou 30+ minutos em qualquer etapa → pergunte ao seu assistente de IA colando o erro completo e dizendo em qual etapa está (mas peça a *explicação*, não só a resposta — o objetivo é treinar).

**Critérios de aceite**:
- [ ] Duas rotas de IA funcionando, com streaming onde aplicável
- [ ] Cada request registra prompt, resposta, tokens, custo, latência e modelo (Langfuse ou logs estruturados)
- [ ] Pelo menos um trace de cadeia/agente com 2+ passos visível no painel
- [ ] Fallback dispara em 429/5xx e NÃO dispara em 4xx do cliente (demonstrado)
- [ ] Roteamento de modelo comprovado (mesma rota, entradas diferentes → modelos diferentes)
- [ ] Endpoint/painel de custos agregando por rota
- [ ] Container roda e o README explica como subir e testar
- [ ] (Liga com Módulo 10) A suite de evals roda contra o serviço como gate
- [ ] Projeto no seu repositório `academia-ia` no GitHub — Dockerfile e README inclusos, chave de API e `registros.db` fora

**Dicas**: comece do lab e adicione uma rota por vez. Para o trace de cadeia, um mini-agente com 2 tools do Módulo 8 já serve. No roteamento, uma heurística boba (comprimento da entrada, presença de palavras-chave) já demonstra o conceito — o importante é o mecanismo. Guarde os custos num arquivo/SQLite simples; não precisa de banco de verdade para o exercício.

## ✅ Quiz

**1.** Por que o app não deve chamar a API do LLM direto do frontend?
A) Porque o frontend é lento
B) Porque exporia a chave de API e removeria o ponto central de controle (auth, rate limit, guardrails, troca de modelo)
C) Porque o CORS não permite
D) Porque LLMs só aceitam chamadas de servidores

**2.** O que o PagedAttention do vLLM otimiza?
A) A qualidade das respostas
B) O gerenciamento do KV cache em memória, elevando o throughput de requisições simultâneas
C) O download dos pesos
D) A quantização do modelo

**3.** Qual é o principal benefício do streaming?
A) Reduz o custo total em tokens
B) Reduz o tempo total de geração
C) Derruba o time-to-first-token percebido e evita timeouts em respostas longas
D) Melhora a qualidade da resposta

**4.** Você tem alto volume constante e dados sensíveis que não podem sair da empresa. A escolha tende a ser:
A) API gerenciada, sempre
B) Self-hosting (ex.: vLLM), pelo custo em escala e privacidade
C) Não usar IA
D) Frontend chamando o provedor direto

**5.** Em qual situação faz sentido acionar um fallback de provedor/modelo?
A) Erro 400 (requisição malformada)
B) Erro 404 (modelo inexistente)
C) Erro 429 (rate limit) ou 5xx (falha do servidor)
D) Sempre, em qualquer erro

**6.** O que caracteriza "cascata" de modelos?
A) Rodar todos os modelos em paralelo e votar
B) Tentar primeiro o modelo barato e escalar para o caro só se a resposta não passar num teste de qualidade
C) Treinar um modelo em cima de outro
D) Encadear prompts fixos

**7.** "Se não está instrumentado, não existe" refere-se a:
A) Testes unitários
B) Observabilidade: você não otimiza custo, latência ou qualidade daquilo que não mede
C) Documentação
D) Versionamento de código

**8.** Qual é o papel do FinOps de tokens?
A) Reduzir a qualidade para economizar
B) Atribuir e controlar custo por feature/usuário, revelando onde aplicar otimizações e evitando surpresas na fatura
C) Negociar preço com o provedor
D) Eliminar o uso de modelos grandes

<details><summary>Ver respostas</summary>

**1-B.** O gateway no backend detém as chaves (nunca no cliente), centraliza auth, rate limiting, guardrails e a troca de modelo. Sem ele, você perde todos os pontos de controle e vaza credenciais.

**2-B.** PagedAttention gerencia o KV cache em páginas de memória (como memória virtual de SO), eliminando desperdício e permitindo muito mais requisições simultâneas — daí o alto throughput do vLLM.

**3-C.** Streaming não muda custo nem tempo total, mas mostra a resposta começando em ~1s (time-to-first-token) e evita timeouts de HTTP em saídas longas. É a melhoria de UX de maior retorno.

**4-B.** Volume constante alto + privacidade favorecem self-hosting: em escala o custo por token de GPU dedicada pode compensar, e os dados não saem da empresa. API gerenciada vence em baixo volume e velocidade de desenvolvimento.

**5-C.** Fallback e retry só fazem sentido em erros retryáveis: 429 (rate limit) e 5xx (servidor). Erros 4xx do cliente (400, 401, 404) são bugs seus — repetir não adianta.

**6-B.** Cascata: tenta o barato primeiro, escala para o caro só se necessário (teste de qualidade falha). Diferente de roteamento, que decide o modelo *antes* de chamar, por um classificador.

**7-B.** É o princípio da observabilidade: sem registrar tokens, custo, latência e traces, você não tem como otimizar nem depurar. Logs de app comum não capturam o que é específico de LLM.

**8-B.** FinOps de tokens atribui custo por feature e usuário, expõe onde o dinheiro vai, alerta sobre estouros e guia onde aplicar cache/roteamento/batch. Transforma custo de IA em métrica gerenciável.

</details>

## 🃏 Flashcards

| Frente | Verso |
|--------|-------|
| Arquitetura de referência | Cliente → Gateway → Guardrails → LLM → Guardrails → Cliente, com logs/evals transversais |
| Por que o gateway | Detém as chaves e centraliza auth, rate limit, guardrails e troca de modelo |
| PagedAttention (vLLM) | Gerencia o KV cache em páginas de memória → alto throughput de requisições simultâneas |
| Streaming: o que melhora | Time-to-first-token percebido e evita timeouts; não muda custo nem tempo total |
| As 4 alavancas de custo/latência | Streaming, prompt caching, batching, menor modelo que resolve (roteamento/cascata) |
| Roteamento vs cascata | Roteamento decide o modelo antes (classificador); cascata tenta o barato e escala se falhar |
| Erro retryável vs não-retryável | Retry/fallback: 429 e 5xx (sim); 4xx do cliente (não) |
| Observabilidade de LLM | Logar prompt, resposta, tokens, custo, latência, modelo + tracing de cadeias/agentes |
| Eval gate no CI | A suite de evals barra o PR que degrada a qualidade (liga com o Módulo 10) |
| FinOps de tokens | Dashboard de custo por feature/usuário para controlar gasto e guiar otimizações |

## ☑️ Checklist de conclusão

- [ ] Sei desenhar a arquitetura gateway → guardrails → LLM → logs e explicar o papel de cada camada
- [ ] Sei preencher a tabela de decisão vLLM (self-hosted) vs API gerenciada para um cenário dado
- [ ] Apliquei as 4 alavancas de custo/latência e sei em que caso cada uma rende mais
- [ ] Implementei fallback que dispara só em erros retryáveis (429/5xx), com retries e timeout
- [ ] Instrumentei prompt, resposta, tokens, custo e latência por request (Langfuse ou logs)
- [ ] Containerizei o serviço com Docker e sei subi-lo num PaaS
- [ ] Montei um agregador de custo por rota (FinOps básico)
- [ ] Conectei os evals do Módulo 10 como gate de deploy do serviço
