# Módulo 5 — Transformers & LLMs por Dentro

> 🏛️ Período 2 · ⏱️ Carga estimada: 16h · 📋 Pré-requisitos: Módulo 4 (Deep Learning na Prática)

## 🎯 Objetivos

- Ao final, você será capaz de explicar como um texto vira tokens (BPE) e por que a tokenização causa comportamentos estranhos nos LLMs.
- Ao final, você será capaz de descrever self-attention passo a passo (Q, K, V), incluindo um exemplo numérico pequeno, e o papel de multi-head e positional encoding.
- Ao final, você será capaz de explicar a arquitetura transformer decoder-only e como um GPT gera texto token a token (amostragem, temperatura, top-p).
- Ao final, você será capaz de diferenciar pré-treino de pós-treino (SFT, RLHF/RLAIF) e situar as principais famílias de modelos de 2026.
- Ao final, você será capaz de gerar texto com um modelo da Hugging Face e inspecionar tokens, logits e o efeito da temperatura.

## 🗺️ Por que isso importa

O transformer é a arquitetura que sustenta praticamente toda a IA generativa em produção — GPT, Claude, Gemini, Llama, os modelos de embedding do seu RAG, até os de visão e áudio. Como engenheiro de IA, você vai passar os próximos anos construindo *em cima* desses modelos. Dá para fazer isso tratando o LLM como caixa-preta, mas os melhores profissionais do mercado não fazem: quando o modelo alucina, corta texto no meio, cobra caro demais ou ignora a instrução, a explicação quase sempre está em algo deste módulo — tokenização, janela de contexto, amostragem, pós-treino.

Além do valor de debugging, este é o módulo que dá vocabulário para decisões de arquitetura que valem dinheiro: escolher entre modelo aberto e fechado, estimar custo por token, entender por que contexto longo custa caro (KV cache), avaliar se um modelo pequeno resolve. Entrevistas técnicas para vagas de engenharia de IA cobram exatamente isso: "explique attention", "o que é temperatura", "o que muda entre pré-treino e RLHF". Saia deste módulo sabendo responder com confiança.

## 📚 Aulas

| # | Aula | Tipo | Recurso | Duração estimada |
|---|------|------|---------|------------------|
| 1 | Intro to Large Language Models (palestra) | 🎥 vídeo | [Canal do Andrej Karpathy](https://www.youtube.com/@AndrejKarpathy) | 1h00 |
| 2 | The Illustrated Transformer | 📖 leitura | [jalammar.github.io/illustrated-transformer](https://jalammar.github.io/illustrated-transformer/) | 1h00 |
| 3 | Let's build GPT: from scratch, in code | 🎥 vídeo | [Karpathy — Zero to Hero](https://karpathy.ai/zero-to-hero.html) | 2h30 |
| 4 | Let's build the GPT Tokenizer | 🎥 vídeo | [Karpathy — Zero to Hero](https://karpathy.ai/zero-to-hero.html) | 2h00 |
| 5 | Experimentos com tokenização | 💻 lab | [Tiktokenizer](https://tiktokenizer.vercel.app) | 0h30 |
| 6 | Visualização 3D de um GPT em execução | 💻 lab | [bbycroft.net/llm](https://bbycroft.net/llm) | 0h30 |
| 7 | NLP Course — capítulo de transformers | 📖 leitura | [Hugging Face Learn](https://huggingface.co/learn) | 1h30 |
| 8 | Deep Dive into LLMs like ChatGPT | 🎥 vídeo | [Canal do Andrej Karpathy](https://www.youtube.com/@AndrejKarpathy) | 2h00 |
| 9 | Aprofundamento opcional: Build a LLM From Scratch | 📖 leitura | [github.com/rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | livre |
| 10 | Lab guiado: gerar texto e inspecionar logits | 💻 lab | Seção 💻 abaixo | 2h30 |

Referência acadêmica para quem quiser ir além: [Stanford CS224N](https://cs224n.stanford.edu).

## 🧠 Conteúdo essencial

### 5.1 Tokenização: o texto vira números

LLMs não leem letras nem palavras: leem **tokens** — pedaços de texto de tamanho variável. O algoritmo dominante é o **BPE (Byte Pair Encoding)**: começa com bytes individuais e vai fundindo os pares mais frequentes do corpus até formar um vocabulário (tipicamente 50k–200k tokens). Palavras comuns viram 1 token ("the"); palavras raras são quebradas ("tokenização" → `token` + `ização`, por exemplo).

Abra o [Tiktokenizer](https://tiktokenizer.vercel.app) e digite frases em português e inglês. Você vai notar: (a) português gasta mais tokens que inglês para dizer o mesmo — o corpus de treino tinha mais inglês; (b) espaços fazem parte dos tokens (` casa` ≠ `casa`); (c) números são fatiados de formas imprevisíveis.

Isso explica comportamentos famosos: LLMs tropeçam em aritmética e em contar letras ("quantos R em strawberry?") porque não veem letras — veem tokens. E explica custo: APIs cobram por token, então o mesmo prompt em português custa ~20-30% mais que em inglês.

### 5.2 Embeddings: o espaço vetorial de significado

Cada token do vocabulário tem um vetor denso associado (ex.: 4096 dimensões), aprendido no treino. Nesse espaço, **proximidade geométrica ≈ semelhança semântica**: "rei" fica perto de "rainha", "gato" perto de "felino". A primeira camada de um LLM é exatamente essa tabela de consulta: token 5301 → vetor correspondente.

A intuição que importa: o modelo não manipula símbolos, manipula **coordenadas em um espaço de significado**. Toda a matemática das camadas seguintes é sobre mover esses vetores para posições que representem o significado *em contexto* ("banco" da praça vs. "banco" de dados começam iguais e terminam distantes). Essa mesma ideia — texto vira vetor comparável — é a fundação do RAG no Módulo 7.

### 5.3 Self-attention passo a passo: Q, K e V

Attention é o mecanismo que deixa cada token "olhar" para os outros e decidir de quais absorver informação. Cada token gera três vetores por multiplicação de matrizes aprendidas:

- **Q (query)**: "o que estou procurando?"
- **K (key)**: "o que eu ofereço?"
- **V (value)**: "o que eu entrego, se você me escolher"

Analogia: uma busca em biblioteca. Sua pergunta é a Q; a lombada de cada livro é a K; o conteúdo do livro é o V. Você compara sua pergunta com todas as lombadas, dá notas, e leva uma mistura dos conteúdos ponderada pelas notas.

Exemplo numérico minúsculo (2 tokens, vetores de dimensão 2). O token 2 quer decidir a quem prestar atenção:

```
q2 = [1, 0]          (a query do token 2)
k1 = [1, 0]  v1 = [10, 0]
k2 = [0, 1]  v2 = [0, 10]

scores:  q2·k1 = 1      q2·k2 = 0
softmax([1, 0]) ≈ [0.73, 0.27]
saída do token 2 = 0.73·[10,0] + 0.27·[0,10] = [7.3, 2.7]
```

O token 2 "puxou" 73% da informação do token 1. Na fórmula real há ainda a divisão por √d (estabiliza o softmax) e, em modelos de geração, uma **máscara causal**: cada token só pode olhar para os anteriores — ninguém enxerga o futuro.

### 5.4 Multi-head attention e positional encoding

**Multi-head**: em vez de uma attention, o modelo roda várias em paralelo (ex.: 32 "cabeças"), cada uma com suas próprias matrizes Q/K/V. Cada cabeça se especializa em uma relação diferente — uma acompanha sintaxe, outra correferência ("ela" → "Maria"), outra padrões de código. Os resultados são concatenados e projetados de volta.

**Positional encoding**: attention, por si só, é um saco de tokens — não sabe ordem. "João ama Maria" e "Maria ama João" teriam a mesma representação. A solução é injetar informação de posição nos vetores (nos modelos originais, somas de senos e cossenos; nos modernos, RoPE — rotações aplicadas a Q e K). O que você precisa reter: **a ordem entra no modelo como parte do vetor**, não da arquitetura.

### 5.5 A arquitetura decoder-only

Um GPT moderno é uma pilha do mesmo bloco repetido dezenas de vezes:

```
tokens → embeddings (+ posição)
  → [ attention (com máscara causal) → MLP ] × N camadas
  → camada final → logits (um score por token do vocabulário)
```

A attention mistura informação **entre tokens**; o MLP (duas camadas densas com ativação — exatamente o que você viu no Módulo 4) processa cada token **individualmente**, e é onde mora boa parte do "conhecimento" do modelo. Residual connections e normalização mantêm o treino estável em dezenas de camadas. "Decoder-only" significa: só a metade geradora do transformer original de 2017, com máscara causal — a arquitetura de GPT, Claude, Llama, Qwen e DeepSeek. Veja tudo isso animado em 3D em [bbycroft.net/llm](https://bbycroft.net/llm).

### 5.6 Como um GPT gera texto: amostragem, temperatura, top-p

O modelo faz uma única coisa: dado o contexto, produz **logits** — um score para cada token do vocabulário — que o softmax converte em probabilidades. Gerar texto é repetir: prever → escolher 1 token → anexar ao contexto → prever de novo.

A escolha do token é onde entram os botões que você vai ajustar a vida inteira:

- **Greedy**: sempre o token mais provável. Determinístico, mas repetitivo e sem graça.
- **Temperatura**: divide os logits por T antes do softmax. `T < 1` afia a distribuição (conservador, factual); `T > 1` achata (criativo, arriscado); `T → 0` vira greedy.
- **Top-p (nucleus)**: amostra apenas do menor conjunto de tokens cuja probabilidade acumulada atinge p (ex.: 0.9), cortando a cauda de tokens absurdos.

Exemplo: se as probabilidades são `[gato: 0.55, cão: 0.30, peixe: 0.10, resto: 0.05]`, com top-p = 0.9 só "gato", "cão" e "peixe" ficam no jogo. Regra prática: tarefas factuais/extração → temperatura baixa; brainstorm/escrita criativa → mais alta.

### 5.7 Pré-treino vs. pós-treino (SFT, RLHF/RLAIF) — e scaling laws em uma frase

O treino de um LLM tem dois grandes atos:

1. **Pré-treino**: prever o próximo token em trilhões de tokens da internet, livros e código. Meses de milhares de GPUs. O resultado é um **modelo base**: um autocompletador brilhante que não conversa — se você perguntar algo, ele pode simplesmente continuar com mais perguntas parecidas.
2. **Pós-treino**: transformar o autocompletador em assistente.
   - **SFT (supervised fine-tuning)**: treinar em exemplos de conversas de alta qualidade (pergunta → boa resposta), ensinando o *formato* assistente.
   - **RLHF/RLAIF**: humanos (ou uma IA guiada por princípios, no caso do RLAIF/IA constitucional) comparam respostas; um modelo de recompensa aprende essas preferências; o LLM é otimizado para agradá-lo. É daqui que vêm o tom, a recusa de pedidos nocivos e o "jeito de assistente".

**Scaling laws em uma frase:** a performance melhora de forma previsível (lei de potência) conforme crescem, juntos, modelo, dados e computação — foi essa previsibilidade que justificou investir bilhões em modelos cada vez maiores.

### 5.8 Panorama 2026, janela de contexto e KV cache

Famílias que você precisa conhecer (o quadro muda rápido; os *eixos* de comparação, não):

| Família | Origem | Aberto/Fechado |
|---------|--------|----------------|
| GPT | OpenAI | Fechado (API) |
| Claude | Anthropic | Fechado (API) |
| Gemini | Google | Fechado (API) |
| Llama | Meta | Pesos abertos |
| Qwen | Alibaba | Pesos abertos |
| DeepSeek | DeepSeek | Pesos abertos |

**Fechado** = você paga por token e não vê os pesos; melhor qualidade de ponta, zero infraestrutura. **Aberto** = você baixa os pesos e roda onde quiser; controle, privacidade e custo fixo, mas a operação é por sua conta. A escolha é uma decisão de engenharia (dados sensíveis? volume? equipe de infra?), não de torcida.

**Janela de contexto** é o máximo de tokens que o modelo processa de uma vez (de ~128k a 1M+ em 2026). **KV cache** é a intuição de por que contexto longo custa caro: ao gerar, o modelo guarda os vetores K e V de todos os tokens anteriores para não recalculá-los a cada novo token. Esse cache cresce linearmente com o contexto e devora memória de GPU — contexto 10× maior ≈ 10× mais memória só de cache. É por isso que APIs cobram input e output separados e que "jogar tudo no contexto" nem sempre é a arquitetura certa (spoiler do Módulo 7: RAG).

## 💻 Lab guiado

**Objetivo:** gerar texto com um modelo pequeno da Hugging Face e enxergar tokens, logits e o efeito da temperatura. Roda no Colab (GPU ajuda, mas CPU aguenta o GPT-2).

```python
# ── 1. Instalação ───────────────────────────────────────────
!pip -q install transformers torch

# ── 2. Pipeline: o caminho de 3 linhas ──────────────────────
from transformers import pipeline

gerador = pipeline("text-generation", model="gpt2")  # 124M params, modelo BASE
saida = gerador("The capital of France is", max_new_tokens=20)
print(saida[0]["generated_text"])
# Note: é um modelo base (só pré-treino, sem SFT/RLHF) — ele completa texto,
# não conversa. Compare com o que você espera de um chat.

# ── 3. Abrindo o capô: tokenizer ────────────────────────────
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

tok = AutoTokenizer.from_pretrained("gpt2")
model = AutoModelForCausalLM.from_pretrained("gpt2")

texto = "The capital of France is"
ids = tok(texto, return_tensors="pt")
print("IDs dos tokens :", ids["input_ids"][0].tolist())
print("Tokens         :", tok.convert_ids_to_tokens(ids["input_ids"][0]))
# Repare no 'Ġ' — é o espaço embutido no token (BPE em ação).

# Experimente também tokenizar português e compare a contagem:
pt = tok("A capital da França é")
print("PT usa", len(pt["input_ids"]), "tokens; EN usou", len(ids["input_ids"][0]))

# ── 4. Logits: a previsão crua do próximo token ─────────────
with torch.no_grad():
    out = model(**ids)
logits_ultimo = out.logits[0, -1]           # scores p/ TODOS os 50257 tokens
probs = torch.softmax(logits_ultimo, dim=-1)

top5 = torch.topk(probs, 5)
print("\nTop-5 candidatos ao próximo token:")
for p, i in zip(top5.values, top5.indices):
    print(f"  {tok.decode(i)!r:12} prob={p.item():.3f}")
# Esperado: ' Paris' com folga no topo.

# ── 5. O efeito da temperatura, medido ──────────────────────
def top5_com_temperatura(T):
    probs_t = torch.softmax(logits_ultimo / T, dim=-1)
    top = torch.topk(probs_t, 5)
    return [(tok.decode(i), round(p.item(), 3))
            for p, i in zip(top.values, top.indices)]

for T in [0.2, 1.0, 2.0]:
    print(f"\nT={T}: {top5_com_temperatura(T)}")
# T baixa: quase toda a massa em ' Paris'. T alta: distribuição achatada.

# ── 6. Gerando com estratégias diferentes ───────────────────
ids_prompt = tok("Once upon a time", return_tensors="pt")

# Greedy (determinístico)
g = model.generate(**ids_prompt, max_new_tokens=30, do_sample=False)
print("\nGREEDY:", tok.decode(g[0], skip_special_tokens=True))

# Amostragem com temperatura + top-p
torch.manual_seed(42)
s = model.generate(**ids_prompt, max_new_tokens=30, do_sample=True,
                   temperature=0.9, top_p=0.9)
print("\nSAMPLING:", tok.decode(s[0], skip_special_tokens=True))
# Rode a célula de sampling 3 vezes (mude a seed): cada vez sai diferente.
# Rode a greedy 3 vezes: sempre igual.
```

**Perguntas para responder no caderno:** (1) Quantos tokens o GPT-2 gastou na frase em português vs. inglês? Por quê? (2) O que aconteceu com o top-5 quando T=2.0? (3) Por que a geração greedy é sempre idêntica?

## 🚀 Mini-projeto

**Enunciado:** construa um **relatório interativo de anatomia de um LLM** — um notebook que documenta, com código e medições suas, como um modelo gera texto. Pense nele como o material que você usaria para explicar LLMs a um colega dev.

**Requisitos:**

1. Seção *Tokenização*: comparar a contagem de tokens de 5 frases em PT e EN, e mostrar 3 exemplos de palavras quebradas em subpalavras.
2. Seção *Logits*: para 3 prompts diferentes, mostrar o top-10 de candidatos ao próximo token com probabilidades.
3. Seção *Temperatura*: gerar o mesmo prompt com T ∈ {0.2, 0.7, 1.0, 1.5} (3 gerações cada) e comentar a diferença qualitativa.
4. Seção *Top-p*: fixar a temperatura e variar top-p ∈ {0.5, 0.9, 1.0}, comentando o efeito.
5. Seção *Base vs. Instruct*: gerar a mesma pergunta com o `gpt2` (base) e com um modelo instruído pequeno da Hugging Face de sua escolha, e explicar a diferença usando os conceitos de SFT/RLHF.
6. Conclusão de 10-15 linhas conectando o que você mediu com a teoria (seções 5.1, 5.6 e 5.7).

### 🧭 Passo a passo

Reserve ~4h no total (dá para dividir em 2 sessões). Siga na ordem — cada etapa termina com um **checkpoint**; só avance quando ele passar.

**Etapa 1 — Notebook no Colab + esqueleto (15 min)**

1. Abra o [Colab](https://colab.research.google.com), crie um notebook novo chamado `modulo05-anatomia-llm.ipynb` e, em células *Markdown*, monte o esqueleto: título + `## 1. Tokenização`, `## 2. Logits`, `## 3. Temperatura`, `## 4. Top-p`, `## 5. Base vs. Instruct`, `## Conclusão`.
2. Na primeira célula de código, repita a instalação e a carga do lab guiado (passos 1 e 3 de `## 💻 Lab guiado`): `!pip -q install transformers torch`, depois `tok = AutoTokenizer.from_pretrained("gpt2")` e `model = AutoModelForCausalLM.from_pretrained("gpt2")` (com `import torch`).

✅ **Checkpoint:** a célula de carga roda sem erro e o notebook tem as 6 seções criadas.

**Etapa 2 — Tokenização: PT vs. EN + subpalavras (30 min)**

1. Monte 5 pares de frases (PT e sua tradução EN), imprima a contagem com percentual de diferença e mostre 3 palavras quebradas em subpalavras (o `Ġ` é o espaço embutido — seção 5.1):

```python
pares = [("A capital da França é Paris", "The capital of France is Paris")]  # + 4 pares seus
for pt_f, en_f in pares:
    n_pt, n_en = len(tok(pt_f)["input_ids"]), len(tok(en_f)["input_ids"])
    print(f"PT={n_pt:2} | EN={n_en:2} | {100*(n_pt-n_en)/n_en:+.0f}% | {pt_f}")
for palavra in ["tokenização", "paralelepípedo", "strawberry"]:  # 3 exemplos de subpalavras
    print(palavra, "→", tok.convert_ids_to_tokens(tok(palavra)["input_ids"]))
```

✅ **Checkpoint:** tabela com 5 linhas e percentuais impressa, e 3 palavras exibindo suas subpalavras.

**Etapa 3 — Logits: top-10 de 3 prompts, com gráfico (35 min)**

1. Transforme o passo 4 do lab em uma função e aplique a 3 prompts variados (fato, início de história, aritmética):

```python
import matplotlib.pyplot as plt
def top10(prompt):
    ids = tok(prompt, return_tensors="pt")
    with torch.no_grad():
        probs = torch.softmax(model(**ids).logits[0, -1], dim=-1)
    top = torch.topk(probs, 10)
    return [tok.decode(i) for i in top.indices], top.values.tolist()
for prompt in ["The capital of France is", "Once upon a time", "2 + 2 ="]:
    tokens, probs = top10(prompt)
    plt.figure(); plt.bar(tokens, probs); plt.xticks(rotation=45); plt.title(prompt); plt.show()
```

✅ **Checkpoint:** 3 gráficos de barra na tela, cada um com 10 candidatos e suas probabilidades (isso já cumpre o critério do gráfico).

**Etapa 4 — Amostragem: temperatura e top-p (1h)**

1. Fixe um prompt e varra as 4 temperaturas do enunciado, com 3 gerações cada:

```python
ids_prompt = tok("Once upon a time", return_tensors="pt")
for T in [0.2, 0.7, 1.0, 1.5]:
    print(f"\n=== T={T} ===")
    for i in range(3):  # 3 gerações por temperatura
        g = model.generate(**ids_prompt, max_new_tokens=40, do_sample=True,
                           temperature=T, pad_token_id=tok.eos_token_id)
        print(f"[{i+1}]", tok.decode(g[0], skip_special_tokens=True))
```

2. Comente a diferença qualitativa numa célula Markdown (reveja a seção 5.6: T baixa afia a distribuição, T alta achata). Depois copie a célula de código, fixe `temperature=1.0` e troque a varredura por `for p in [0.5, 0.9, 1.0]`, passando `top_p=p` ao `generate` — e comente o efeito (p=0.5 corta a cauda; p=1.0 não corta nada).

✅ **Checkpoint:** 12 gerações de temperatura + 9 de top-p impressas, cada varredura com seu comentário em Markdown.

**Etapa 5 — Base vs. Instruct (40 min)**

1. Faça a mesma pergunta ao `gpt2` (base) e a um modelo instruído pequeno. Da família Qwen, que você conheceu na seção 5.8, a versão de 0.5B cabe no Colab:

```python
from transformers import pipeline
pergunta = "What is the capital of France?"
base = pipeline("text-generation", model="gpt2")
print("BASE:", base(pergunta, max_new_tokens=40)[0]["generated_text"])
chat = pipeline("text-generation", model="Qwen/Qwen2.5-0.5B-Instruct")
msgs = [{"role": "user", "content": pergunta}]
print("INSTRUCT:", chat(msgs, max_new_tokens=40)[0]["generated_text"][-1]["content"])
```

2. Numa célula Markdown, explique a diferença usando a seção 5.7: o base só continua texto (pré-treino); o instruído responde como assistente porque passou por SFT + RLHF/RLAIF.

✅ **Checkpoint:** as duas saídas visíveis lado a lado e a explicação cita SFT e RLHF.

**Etapa 6 — Conclusão e entrega (40 min)**

1. Na seção `## Conclusão`, escreva 10-15 linhas conectando o que você **mediu** à teoria: a tabela PT vs. EN com a seção 5.1 (BPE, custo por token), as varreduras com a 5.6 e o contraste base vs. instruct com a 5.7. Cite explicitamente "temperatura", "top-p" e "pós-treino" — os critérios de aceite cobram.
2. Confira se todo bloco de código tem comentários em português e rode *Ambiente de execução → Reiniciar e executar tudo*; se qualquer célula falhar, conserte antes de seguir.
3. Baixe o notebook (*Arquivo → Fazer download → .ipynb*), mova-o para a pasta do seu repositório `academia-ia` e faça commit e push — o projeto só conta entregue quando aparece no seu GitHub.

✅ **Checkpoint:** todos os critérios de aceite abaixo marcados.

**🆘 Se travar:** o Colab caiu ou travou ao carregar o modelo instruído → é download/RAM; reinicie a sessão (*Ambiente de execução → Reiniciar sessão*), rode só as células da Etapa 5 e, se persistir, troque por um modelo instruído ainda menor (a dica do enunciado vale: menos de 1B de parâmetros); aviso ou erro de `pad_token` no `generate` → o GPT-2 não tem pad token, por isso os trechos acima passam `pad_token_id=tok.eos_token_id` — não remova; as 3 gerações saíram idênticas → confira `do_sample=True` e não chame `torch.manual_seed()` antes de cada geração (seed fixa a cada chamada zera a variação); travou 30+ minutos em qualquer etapa → pergunte ao seu assistente de IA colando o erro completo e dizendo em qual etapa está (mas peça a *explicação*, não só a resposta — o objetivo é treinar).

**Critérios de aceite:**

- [ ] Notebook roda de ponta a ponta no Colab sem intervenção.
- [ ] Todas as 6 seções presentes, com código e saída visíveis.
- [ ] Tabela de tokens PT vs. EN incluída, com percentual de diferença.
- [ ] Ao menos um gráfico (ex.: barra das probabilidades top-10, ou efeito de T).
- [ ] Comentários em português explicando cada bloco de código.
- [ ] Conclusão referencia explicitamente temperatura, top-p e pós-treino.
- [ ] Notebook no seu repositório `academia-ia` no GitHub (commit + push).

**Dicas:** use `torch.manual_seed()` para gerações reproduzíveis quando quiser comparar; para o gráfico, `matplotlib` com `plt.bar` resolve; se o Colab reclamar de memória com o modelo instruído, escolha um com menos de 1B de parâmetros.

## ✅ Quiz

1. O que o algoritmo BPE faz?
   - A) Traduz palavras para inglês antes do treino
   - B) Constrói um vocabulário fundindo os pares de caracteres/bytes mais frequentes
   - C) Remove stopwords do corpus
   - D) Comprime o modelo para caber na GPU

2. Por que LLMs erram ao contar letras de uma palavra?
   - A) Falta de dados de treino
   - B) A janela de contexto é pequena demais
   - C) Eles processam tokens, não caracteres — a palavra pode ser 1 token opaco
   - D) A temperatura padrão é alta demais

3. Na self-attention, o score entre dois tokens é calculado por:
   - A) Produto escalar entre a query de um e a key do outro
   - B) Distância euclidiana entre embeddings
   - C) Soma dos values
   - D) Média dos positional encodings

4. Para que serve a máscara causal em um decoder-only?
   - A) Esconder tokens ofensivos
   - B) Impedir que um token atenda a tokens futuros durante o treino/geração
   - C) Reduzir o uso de memória
   - D) Acelerar o softmax

5. Aumentar a temperatura na geração:
   - A) Achata a distribuição de probabilidades, aumentando a diversidade
   - B) Afia a distribuição, tornando a saída mais determinística
   - C) Aumenta a janela de contexto
   - D) Reduz o custo por token

6. O que diferencia um modelo base de um modelo instruído (chat)?
   - A) O número de parâmetros
   - B) O pós-treino (SFT + RLHF/RLAIF), que ensina formato de assistente e preferências
   - C) A tokenização usada
   - D) O tamanho da janela de contexto

7. O KV cache existe para:
   - A) Guardar os prompts dos usuários
   - B) Evitar recalcular os vetores K e V dos tokens anteriores a cada novo token gerado
   - C) Armazenar os pesos do modelo em disco
   - D) Fazer o modelo lembrar de conversas antigas

8. Top-p = 0.9 significa:
   - A) Amostrar apenas do menor conjunto de tokens cuja probabilidade acumulada chega a 90%
   - B) Escolher sempre o token com 90% de probabilidade
   - C) Usar 90% da janela de contexto
   - D) Gerar 90 tokens no máximo

<details><summary>Ver respostas</summary>

1. **B** — BPE parte de bytes e funde iterativamente os pares mais frequentes até formar o vocabulário.
2. **C** — "strawberry" pode ser 1-2 tokens; o modelo nunca "vê" as letras individuais, só os IDs.
3. **A** — score = q·k (escalado por √d); o softmax desses scores define os pesos da mistura de values.
4. **B** — sem a máscara, o modelo "colaria" olhando o token que deveria prever; a geração exige causalidade.
5. **A** — dividir os logits por T > 1 aproxima as probabilidades umas das outras; tokens improváveis ganham chance.
6. **B** — o base só completa texto; SFT dá o formato de conversa e RLHF/RLAIF alinha com preferências humanas.
7. **B** — sem cache, gerar o token N exigiria reprocessar os N−1 anteriores; o cache troca computação por memória.
8. **A** — nucleus sampling corta a cauda: só o "núcleo" que acumula 90% de probabilidade participa do sorteio.

</details>

## 🃏 Flashcards

| Frente | Verso |
|--------|-------|
| Token | Unidade de texto do LLM (subpalavra), criada por BPE; APIs cobram por token |
| Embedding | Vetor denso que representa um token; proximidade ≈ semelhança semântica |
| Q, K, V | Query (o que busco), Key (o que ofereço), Value (o que entrego) — attention = softmax(QK)·V |
| Multi-head attention | Várias attentions em paralelo, cada uma especializada em uma relação diferente |
| Positional encoding | Informação de posição injetada nos vetores — attention sozinha não sabe ordem |
| Decoder-only | Arquitetura de GPT/Claude/Llama: pilha de [attention causal + MLP] |
| Temperatura | Divide os logits antes do softmax; baixa = conservador, alta = criativo |
| Top-p (nucleus) | Amostra só do menor conjunto de tokens com probabilidade acumulada ≥ p |
| SFT vs RLHF | SFT ensina o formato assistente com exemplos; RLHF otimiza por preferências (humanas ou de IA no RLAIF) |
| KV cache | Cache dos vetores K/V dos tokens já processados; cresce com o contexto e domina a memória na inferência |

## ☑️ Checklist de conclusão

- [ ] Assisti a "Intro to LLMs" e "Let's build GPT" do Karpathy
- [ ] Li o Illustrated Transformer e explorei a visualização 3D do bbycroft.net/llm
- [ ] Testei pelo menos 5 frases no Tiktokenizer e entendi por que PT gasta mais tokens
- [ ] Consigo explicar Q, K, V com o exemplo da biblioteca (ou meu próprio)
- [ ] Rodei o lab completo e respondi às 3 perguntas do caderno
- [ ] Sei explicar a diferença entre modelo base e modelo instruído
- [ ] Entreguei o mini-projeto com as 6 seções e critérios de aceite
- [ ] Acertei pelo menos 6 de 8 no quiz
