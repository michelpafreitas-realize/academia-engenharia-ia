# Módulo 6 — Como LLMs Funcionam

> 🏛️ Período 2 · ⏱️ Carga estimada: 10h · 📋 Pré-requisitos: Módulo 5 (Disciplinas de ML)

## 🎯 Objetivos

- Ao final, você será capaz de explicar o gradiente como medida de sensibilidade ("se eu mexer aqui, a loss sobe ou desce?") e listar as causas clássicas de uma loss que não desce.
- Ao final, você será capaz de explicar por que a tokenização causa comportamentos famosos dos LLMs (errar contagem de letras, tropeçar em aritmética, português custar mais caro que inglês).
- Ao final, você será capaz de calcular à mão um exemplo numérico pequeno de self-attention (Q, K, V) e explicar o que cada vetor representa.
- Ao final, você será capaz de descrever a arquitetura decoder-only em nível de diagrama e apontar cada peça na visualização 3D do bbycroft.net/llm.
- Ao final, você será capaz de diferenciar pré-treino, SFT e RLHF e explicar o que temperatura e top-p fazem na geração.
- Ao final, você será capaz de explicar por que contexto longo custa caro (atenção quadrática + KV cache) e resumir as leis de escala em um parágrafo.

## 🎛️ Núcleo manual deste módulo

À mão, você faz **o exemplo numérico de atenção** (Q·K, softmax, mistura de V — papel e calculadora) e **um gradiente minúsculo** de uma função de um peso só: é nesses dois cálculos que a intuição de "o modelo é só números se movendo" se forma e nunca mais sai. Todo o resto — scripts de experimento, chamadas de API, gráficos — você dirige com seu assistente de IA.

## 🗺️ Por que isso importa

Desde o Módulo 2 você chama LLMs por API todos os dias — e já viu o modelo alucinar, cortar resposta no meio, errar conta de padaria e cobrar mais caro pelo mesmo texto em português. Este módulo abre o capô: quase todos esses comportamentos "misteriosos" têm explicação em uma das ideias daqui — tokenização, amostragem, pós-treino, janela de contexto. Quem dirige IA sem esse mapa aprova o que não entende; quem tem o mapa reconhece a falha pelo cheiro e sabe qual botão ajustar. É a diferença entre supervisionar e só assistir.

Ele também fecha o Período 2 conectando os vizinhos: o gradiente e o softmax que você calculou no Módulo 4 são exatamente o motor de treino e de geração de um GPT; a disciplina de validação do Módulo 5 é o que separa "o modelo parece bom" de "o modelo é bom". E prepara os próximos: embeddings são a fundação do RAG (Módulo 7), e custo de contexto é a variável que você vai gerenciar em todo sistema com agentes (Módulo 8). Quem quiser descer até o metal — backprop à mão, GPT do zero com o Karpathy — tem a trilha optativa **Módulo 13 (Por Dentro da Máquina)** esperando, com condecoração própria; aqui o objetivo é critério, não implementação.

## 📚 Aulas

| # | Aula | Tipo | Recurso | Duração estimada |
|---|------|------|---------|------------------|
| 1 | Redes neurais e atenção, visualmente | 🎥 vídeo | [3Blue1Brown — Neural Networks](https://www.3blue1brown.com/topics/neural-networks) | 1h30 |
| 2 | Intro to Large Language Models (palestra) | 🎥 vídeo | [Canal do Andrej Karpathy](https://www.youtube.com/@AndrejKarpathy) | 1h00 |
| 3 | Deep Dive into LLMs like ChatGPT | 🎥 vídeo | [Canal do Andrej Karpathy](https://www.youtube.com/@AndrejKarpathy) | 2h00 |
| 4 | Um GPT rodando em 3D, peça por peça | 💻 lab | [bbycroft.net/llm](https://bbycroft.net/llm) | 0h30 |
| 5 | Experimentos com tokenização | 💻 lab | [Tiktokenizer](https://tiktokenizer.vercel.app) | 0h30 |
| 6 | The Illustrated Transformer | 📖 leitura | [jalammar.github.io/illustrated-transformer](https://jalammar.github.io/illustrated-transformer/) | 1h00 |
| 7 | Conteúdo essencial deste módulo | 📖 leitura | Seção 🧠 abaixo | 1h30 |
| 8 | Lab guiado: anatomia ao vivo, via API | 💻 lab | Seção 💻 abaixo | 1h00 |
| 9 | Sessão de Direção: experimentos dirigidos | 🎛️ sessão de direção | Seção 🎛️ abaixo | 1h00 |

Quer profundidade de implementação (Zero to Hero completo, GPT do zero)? Isso é o **Módulo 13 — Por Dentro da Máquina**, a trilha optativa. Aqui, os vídeos do Karpathy que você assiste são as duas palestras conceituais — e elas bastam.

## 🧠 Conteúdo essencial

### 6.1 Gradiente como sensibilidade — e por que a loss não desce

Treinar qualquer rede neural — de um classificador de churn a um GPT de trilhões de parâmetros — é responder bilhões de vezes a mesma pergunta: **"se eu mexer um tiquinho neste peso, o erro (a loss) sobe ou desce, e quanto?"**. A resposta é o **gradiente**: a sensibilidade da loss a cada peso. O algoritmo que calcula todos os gradientes de uma vez chama-se backpropagation (regra da cadeia aplicada de trás para frente), e o treino inteiro é: medir o erro → calcular sensibilidades → dar um passinho na direção que diminui o erro → repetir.

Faça este uma vez à mão (é o segundo item do núcleo manual). Modelo de um peso: `z = w·x`, loss = `(z − alvo)²`, com `x = 2`, `w = 3`, `alvo = 10`:

```
z = 3·2 = 6          loss = (6 − 10)² = 16
dloss/dz = 2·(6−10) = −8
dz/dw = x = 2
dloss/dw = −8 · 2 = −16   → gradiente negativo: AUMENTAR w diminui a loss
```

O passo de atualização é `w = w − lr · gradiente`, onde **lr (learning rate)** é o tamanho do passo. E aqui mora o diagnóstico mais útil do módulo — por que uma loss não desce:

| Sintoma | Causa provável |
|---------|----------------|
| Loss oscila ou explode (NaN) | Learning rate alto demais: cada passo salta além do vale e o erro se amplifica |
| Loss desce em câmera lenta | Learning rate baixo demais |
| Loss parada desde o início | Bug: dados desalinhados dos rótulos, gradiente que não chega (rede "morta") |
| Loss de treino ótima, de validação péssima | Overfitting: o modelo decorou — o leakage e a validação do Módulo 5 são a defesa |

Você quase nunca vai treinar uma rede do zero — mas vai fazer fine-tuning (Módulo 9), e lá esses sintomas aparecem idênticos. Este vocabulário é o que você levará para aquela conversa.

### 6.2 Tokens: o que o modelo realmente vê

LLMs não leem letras nem palavras: leem **tokens** — pedaços de texto de tamanho variável criados pelo algoritmo **BPE (Byte Pair Encoding)**, que parte de bytes e vai fundindo os pares mais frequentes do corpus até formar um vocabulário de 50k–200k entradas. Palavra comum em inglês vira 1 token (`the`); palavra rara ou em português quebra em vários (`tokenização` → `token` + `ização`).

Abra o [Tiktokenizer](https://tiktokenizer.vercel.app) e digite frases em português e inglês. Você vai constatar três coisas: (a) **português gasta ~20–30% mais tokens** que inglês para o mesmo conteúdo — o corpus tinha mais inglês, e como APIs cobram por token, isso é custo real; (b) o espaço faz parte do token (` casa` ≠ `casa`); (c) números são fatiados de formas imprevisíveis (`2024` pode ser 1 token, `2025` pode ser dois).

A tokenização explica falhas famosas que você já viu desde o Módulo 2. "Quantos R em strawberry?" falha porque o modelo não vê 10 letras — vê 1 a 3 tokens opacos; contar o que está *dentro* de um token é como você contar os átomos de uma cadeira olhando para ela. Aritmética tropeça porque `12345 + 6789` vira uma sequência de fatias arbitrárias, não dígitos alinhados. Quando um LLM falhar de um jeito estranho, a primeira pergunta do engenheiro é: **"como isso foi tokenizado?"**

### 6.3 Embeddings: coordenadas de significado

Cada token do vocabulário tem um **vetor denso** associado (centenas a milhares de dimensões), aprendido no treino. Nesse espaço, **proximidade geométrica ≈ semelhança semântica**: "rei" fica perto de "rainha", "gato" perto de "felino". A primeira camada de um LLM é literalmente uma tabela de consulta: token 5301 → vetor correspondente.

A intuição que importa: o modelo **não manipula símbolos, manipula coordenadas em um espaço de significado**. Todo o trabalho das camadas seguintes é mover esses vetores para posições que representem o significado *em contexto* — "banco" da praça e "banco" de dados entram iguais e saem distantes. E a semelhança entre dois vetores se mede com o **produto escalar** que você calculou à mão no Módulo 4: vetores alinhados → produto alto → significados próximos. Guarde essa ideia com carinho: "texto vira vetor comparável" é a fundação inteira do RAG no Módulo 7.

### 6.4 Atenção: o exemplo que você faz à mão

Atenção é o mecanismo que deixa cada token "olhar" para os outros e decidir de quais absorver informação. Cada token gera três vetores (por multiplicação com matrizes aprendidas):

- **Q (query)**: "o que estou procurando?"
- **K (key)**: "o que eu ofereço?"
- **V (value)**: "o que eu entrego, se você me escolher"

Analogia da biblioteca: sua pergunta é a Q; a lombada de cada livro é a K; o conteúdo do livro é o V. Você compara sua pergunta com todas as lombadas, dá notas, e leva uma **mistura dos conteúdos ponderada pelas notas**.

Agora o núcleo manual — pegue papel e faça junto (2 tokens, vetores de dimensão 2; o token 2 decide a quem prestar atenção):

```
q2 = [1, 0]                        (a query do token 2)
k1 = [1, 0]   v1 = [10, 0]
k2 = [0, 1]   v2 = [0, 10]

scores:   q2·k1 = 1·1 + 0·0 = 1
          q2·k2 = 1·0 + 0·1 = 0
softmax([1, 0]) = [e¹, e⁰] / (e¹ + e⁰) ≈ [0.73, 0.27]
saída do token 2 = 0.73·[10, 0] + 0.27·[0, 10] = [7.3, 2.7]
```

O token 2 "puxou" 73% da informação do token 1. É só isto: produto escalar, softmax, média ponderada — três operações que você já domina do Módulo 4. Na fórmula real entram dois detalhes: a divisão por √d (estabiliza o softmax) e a **máscara causal** — em modelos de geração, cada token só enxerga os anteriores; ninguém vê o futuro. E em vez de uma atenção, o modelo roda dezenas em paralelo (**multi-head**), cada cabeça especializada em uma relação (sintaxe, correferência, padrões de código). Um último detalhe com nome de pergunta de entrevista: atenção sozinha não sabe **ordem** ("João ama Maria" = "Maria ama João") — a posição é injetada nos próprios vetores (**positional encoding**, hoje tipicamente RoPE).

### 6.5 O transformer em nível de diagrama

Um GPT moderno é uma pilha do mesmo bloco repetido dezenas de vezes:

```
tokens → embeddings (+ posição)
  → [ atenção (com máscara causal) → MLP ] × N camadas
  → camada final → logits (um score por token do vocabulário)
```

Divisão de trabalho: a **atenção mistura informação entre tokens**; o **MLP** (duas camadas densas com ativação) **processa cada token individualmente** — e é onde mora boa parte do "conhecimento" do modelo. Conexões residuais e normalização mantêm tudo estável em dezenas de camadas. "Decoder-only" = só a metade geradora do transformer original de 2017, com máscara causal — a arquitetura de GPT, Claude, Gemini, Llama, Qwen e DeepSeek.

Não decore o diagrama: **caminhe por ele**. Abra [bbycroft.net/llm](https://bbycroft.net/llm) e siga um token da entrada até o logit de saída, nomeando cada peça que a visualização anima (embedding, Q/K/V, softmax da atenção, MLP, logits). Quando você conseguir narrar esse passeio para um colega sem olhar, este objetivo do módulo está cumprido.

### 6.6 Como o texto sai: logits, temperatura, top-p

O modelo faz uma única coisa: dado o contexto, produz **logits** — um score para cada token do vocabulário — que o softmax converte em probabilidades. Gerar texto é repetir: prever → escolher 1 token → anexar ao contexto → prever de novo. A **escolha** do token é onde ficam os botões que você ajusta desde o Módulo 2:

- **Greedy (T→0)**: sempre o mais provável. Determinístico, repetitivo.
- **Temperatura**: divide os logits por T antes do softmax. `T < 1` afia a distribuição (conservador, bom para extração e tarefas factuais); `T > 1` achata (criativo, arriscado).
- **Top-p (nucleus)**: sorteia apenas do menor conjunto de tokens cuja probabilidade acumulada atinge p, cortando a cauda de absurdos. Com probabilidades `[gato 0.55, cão 0.30, peixe 0.10, resto 0.05]` e top-p = 0.9: gato + cão = 0.85 ainda não chega; peixe entra (0.95) e o resto é cortado.

Duas consequências práticas que explicam "bugs" que não são bugs: mesmo com T = 0 a API pode variar levemente entre chamadas (paralelismo numérico em GPU), e "o modelo respondeu diferente ontem" quase sempre é amostragem, não humor.

### 6.7 Pré-treino, SFT e RLHF: de autocompletador a assistente

O treino de um LLM tem dois grandes atos:

1. **Pré-treino**: prever o próximo token em trilhões de tokens de internet, livros e código, por meses, em milhares de GPUs. O resultado é um **modelo base**: um autocompletador brilhante que não conversa — pergunte algo e ele pode simplesmente continuar com mais perguntas parecidas.
2. **Pós-treino**: transformar o autocompletador em assistente.
   - **SFT (supervised fine-tuning)**: treinar em exemplos de conversa de alta qualidade, ensinando o *formato* assistente.
   - **RLHF/RLAIF**: humanos (ou uma IA guiada por princípios, no RLAIF) comparam respostas; um modelo de recompensa aprende essas preferências; o LLM é otimizado para agradá-lo. Daqui vêm o tom, as recusas e o "jeito de assistente" — e também a **concordância servil** que você aprendeu a desconfiar no Módulo 1: o modelo foi literalmente treinado para agradar.

**Leis de escala, em um parágrafo:** a performance de um LLM melhora de forma **previsível** (uma lei de potência) quando modelo, dados e computação crescem juntos — foi essa previsibilidade, medida empiricamente, que justificou investir bilhões em modelos cada vez maiores, e é por ela que cada geração (GPT-5.x, família Claude 5, Gemini 2.5) chega melhor que a anterior sem nenhuma mudança mágica de arquitetura: é a mesma máquina desta página, maior e mais bem treinada.

### 6.8 Por que contexto longo custa caro

Duas razões, e as duas caem em entrevista:

**Atenção é quadrática.** Cada token compara sua query com a key de *todos* os anteriores. Dobrar o contexto ≈ 4× mais comparações; 10× o contexto ≈ 100×. É o custo de processar o prompt.

**KV cache devora memória.** Ao gerar, o modelo guarda os vetores K e V de todos os tokens anteriores para não recalculá-los a cada novo token. Esse cache cresce linearmente com o contexto e ocupa memória de GPU — contexto 10× maior ≈ 10× mais memória só de cache, o tempo todo, durante toda a geração.

É por isso que APIs cobram entrada e saída separadas, que existe prompt caching com desconto (o provedor reaproveita o KV cache entre chamadas), e que "jogar tudo no contexto" nem sempre é a arquitetura certa — spoiler do Módulo 7: RAG existe exatamente para trazer só o trecho relevante em vez do arquivo inteiro.

## 💻 Lab guiado

**Objetivo:** ver tokenização e amostragem acontecendo de verdade — metade local (tokenizador BPE real), metade via API (a mesma que você usa desde o Módulo 2). Roda no Colab ou na sua máquina; conferir o exemplo de atenção em NumPy fecha o círculo do núcleo manual.

```python
# ── 1. Setup ────────────────────────────────────────────────
# pip install tiktoken google-genai numpy
import os, tiktoken
import numpy as np
from google import genai

client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])  # a chave do Módulo 0
MODELO = "gemini-2.5-flash"

# ── 2. Tokenização BPE de verdade (local, sem custo) ────────
enc = tiktoken.get_encoding("o200k_base")  # tokenizador dos modelos OpenAI recentes

for frase in ["The capital of France is Paris",
              "A capital da França é Paris"]:
    ids = enc.encode(frase)
    print(f"{len(ids):2d} tokens | {[enc.decode([i]) for i in ids]}")
# Compare: o português quebra em mais pedaços — e custa mais caro por chamada.

for palavra in ["strawberry", "tokenização", "paralelepípedo", "12345"]:
    print(palavra, "→", [enc.decode([i]) for i in enc.encode(palavra)])
# 'strawberry' em 1-2 tokens explica por que contar os R dá errado:
# o modelo não vê letras, vê estes pedaços.

# ── 3. O exemplo de atenção do papel, conferido em NumPy ────
q2 = np.array([1.0, 0.0])
K  = np.array([[1.0, 0.0], [0.0, 1.0]])   # k1, k2
V  = np.array([[10.0, 0.0], [0.0, 10.0]]) # v1, v2

scores = K @ q2                            # [1, 0] — os mesmos do papel
pesos = np.exp(scores) / np.exp(scores).sum()
saida = pesos @ V
print(f"pesos={pesos.round(2)}  saída={saida.round(1)}")
# Esperado: pesos=[0.73 0.27]  saída=[7.3 2.7] — bateu com sua conta à mão?

# ── 4. Temperatura, medida ao vivo na API ───────────────────
prompt = "Complete com UMA palavra: O contrário de quente é"
for T in [0.0, 1.0, 2.0]:
    respostas = [client.models.generate_content(
        model=MODELO, contents=prompt,
        config={"temperature": T, "max_output_tokens": 200}
    ).text.strip() for _ in range(5)]
    print(f"T={T}: {respostas} → {len(set(respostas))} resposta(s) distinta(s)")
# T=0: praticamente sempre igual. T=2: a distribuição achatada aparece na variedade.

# ── 5. A falha de tokenização, provocada de propósito ───────
for pergunta in ["Quantas letras R existem em 'strawberry'? Responda só o número.",
                 "Soletre 'strawberry' com hífens e depois conte os R."]:
    r = client.models.generate_content(model=MODELO, contents=pergunta)
    print(f"\n{pergunta}\n→ {r.text.strip()}")
# Soletrar força o modelo a expor os caracteres como tokens separados —
# aí contar funciona. A falha não é burrice: é tokenização.
```

**Experimentos obrigatórios depois de rodar:** (a) troque as frases do passo 2 por 3 pares PT/EN seus e calcule o % de diferença; (b) no passo 3, troque `q2` por `[0, 1]` e preveja no papel, ANTES de rodar, quais serão os pesos; (c) no passo 4, rode a mesma varredura com um prompt criativo ("Invente um nome para uma cafeteria") e compare a variedade com o prompt factual; (d) explique em 3 linhas, no seu caderno, o resultado do passo 5 usando a seção 6.2.

## 🎛️ Sessão de Direção

A prática de direção deste módulo: **dirigir a IA para construir seus experimentos de anatomia — e ser capaz de explicar cada resultado.** Você é o cientista; a IA é o laboratório.

1. **Especifique** (15 min): escreva uma mini-spec de 2 experimentos que *você* quer rodar sobre o comportamento de LLMs — um de tokenização, um de amostragem. Exemplos de perguntas boas: "números grandes gastam quantos tokens em cada tokenizador?", "a partir de que temperatura a resposta factual começa a degradar?", "top-p baixo mata a criatividade mesmo com T alta?". A spec de cada experimento diz: hipótese, procedimento (que chamadas de API, quantas repetições), e o que você vai medir.
2. **Dirija** (30 min): peça ao seu assistente de IA que implemente os scripts (use o lab guiado como referência de estilo). Itere como aprendeu no Módulo 1: contexto, critérios de aceite, revisão do diff. A IA escreve o código; você decide se o experimento mede o que a hipótese pede.
3. **Verifique** (15 min): rode, colete os números e escreva a explicação de cada resultado **com suas palavras**, citando a seção do conteúdo essencial que o explica (6.2, 6.6...). Resultado que você não consegue explicar = experimento não terminado: volte à teoria ou refine o experimento.

**Entregável:** a mini-spec, os scripts gerados e um resumo da sessão (o que a hipótese previa × o que os números mostraram × qual conceito explica). Esse material entra direto no mini-projeto abaixo.

## 🚀 Mini-projeto

**Enunciado:** produza o **relatório de anatomia de um LLM** — um repositório onde você documenta, com experimentos reais via API e explicações conceituais suas, como um LLM funciona por dentro. Pense nele como o material que você usaria para explicar LLMs a um colega dev — com números seus, não frases decoradas.

**Requisitos:**

1. `SPEC.md` escrito ANTES do código: quais experimentos, quais hipóteses, o que será medido (critério universal a).
2. Seção *Tokenização*: ≥5 pares de frases PT/EN com contagem e % de diferença, ≥3 palavras quebradas em subpalavras, e a explicação de uma falha de contagem/aritmética provocada por você.
3. Seção *Amostragem*: varredura de temperatura (≥3 valores × ≥5 repetições, com uma métrica de variedade) e um experimento de top-p, com comentário conceitual de cada um.
4. Seção *Arquitetura*: o seu exemplo de atenção feito à mão (foto do papel ou reprodução em texto) + verificação em NumPy + um parágrafo narrando o caminho de um token no bbycroft.net/llm.
5. Seção *Treino*: explicação sua (10–15 linhas) de pré-treino vs. SFT vs. RLHF e por que contexto longo custa caro — sem copiar o módulo: reescreva com suas palavras e seus exemplos.
6. Scripts reproduzíveis: qualquer pessoa com uma chave de API roda `python experimentos.py` e obtém a mesma estrutura de resultados (critério universal b — os números provam os requisitos).
7. `DECISIONS.md`: quais experimentos você escolheu e por quê, o que descartou, o que o surpreendeu (critério universal c).
8. Defesa: ser capaz de responder "por quê?" sobre qualquer trecho do relatório — a Defesa por LLM do Campus vai perguntar (critério universal d).

### 🧭 Passo a passo

Reserve ~3h (dá para dividir em 2 sessões). Cada etapa termina com um checkpoint; só avance quando ele passar.

**Etapa 1 — Repo + SPEC.md antes de qualquer código (20 min)**

1. Crie a pasta `modulo06-anatomia-llm` no seu repositório `academia-ia`, com `SPEC.md`, `DECISIONS.md` vazio e `experimentos.py` vazio.
2. Escreva o `SPEC.md`: liste os experimentos (inclua os 2 da sua Sessão de Direção), a hipótese de cada um e o que será medido. 15–25 linhas bastam — spec é contrato, não romance.

```bash
mkdir modulo06-anatomia-llm && cd modulo06-anatomia-llm
touch SPEC.md DECISIONS.md experimentos.py RELATORIO.md
git add . && git commit -m "Módulo 6: SPEC antes do código"
```

✅ **Checkpoint:** `SPEC.md` commitado ANTES de existir código nos outros arquivos — o histórico do git é a prova.

**Etapa 2 — Núcleo manual: atenção no papel + verificação (30 min)**

1. Refaça no papel o exemplo da seção 6.4 e depois um seu: invente `q`, `K`, `V` pequenos (dimensão 2, valores inteiros), calcule scores, softmax e saída à mão.
2. Dirija a IA para escrever a verificação em NumPy (base: passo 3 do lab) e confira: bateu com sua conta? Se não bateu, ache o erro — seu ou do script — antes de seguir.
3. Guarde a foto do papel (ou a transcrição) para a seção *Arquitetura* do relatório.

✅ **Checkpoint:** sua conta à mão e o NumPy concordam nos pesos e na saída (2 casas decimais).

**Etapa 3 — Experimentos de tokenização (30 min)**

Dirija a IA para implementar em `experimentos.py` a bateria de tokenização do requisito 2 (base: passo 2 do lab), imprimindo uma tabela com os pares PT/EN e o % de diferença. Inclua a falha provocada (contagem de letras ou aritmética) com e sem a técnica de soletrar.

✅ **Checkpoint:** `python experimentos.py --tokenizacao` imprime a tabela completa e a demonstração da falha.

**Etapa 4 — Experimentos de amostragem via API (40 min)**

Implemente (dirigindo a IA) a varredura de temperatura com métrica de variedade — respostas distintas em N repetições é a métrica mínima — e o experimento de top-p da sua spec. Anote os números no `RELATORIO.md` assim que saírem.

✅ **Checkpoint:** varredura completa rodou; a métrica de variedade cresce com T (e você sabe explicar por quê, seção 6.6).

**Etapa 5 — Relatório: os números encontram a teoria (40 min)**

Monte o `RELATORIO.md` com as 4 seções dos requisitos 2–5. A regra de cada seção: **primeiro o número que você mediu, depois a explicação conceitual com suas palavras** citando a seção do módulo que a sustenta. Termine com a narração do passeio pelo bbycroft.net/llm e o parágrafo sobre leis de escala.

✅ **Checkpoint:** todas as seções têm ≥1 medição sua e nenhuma explicação é cópia do módulo (leia em voz alta: soa como você?).

**Etapa 6 — DECISIONS.md, defesa e publicação (20 min)**

1. Preencha o `DECISIONS.md`: escolhas, descartes, surpresas.
2. Releia o relatório se perguntando "por quê?" em cada afirmação — é exatamente o que a Defesa do Campus fará.
3. Publique:

```bash
git add . && git commit -m "Módulo 6: relatório de anatomia de um LLM"
git push
```

4. Faça a Defesa do módulo no Campus.

✅ **Checkpoint:** repo no GitHub com SPEC.md/DECISIONS.md atualizados e Defesa concluída no Campus.

> 📌 **Regra de ouro:** você pode usar IA para escrever qualquer código. Você não pode entregar nada que não consiga explicar e defender.

## 🧠 Quiz de fixação

1. O gradiente de um peso, na prática, responde a qual pergunta?
   - A) Qual é a saída da rede para esta entrada
   - B) Se eu mexer um pouco neste peso, a loss sobe ou desce, e quanto
   - C) Quantos parâmetros o modelo tem
   - D) Qual é a acurácia de validação

2. Por que LLMs erram "quantos R em strawberry"?
   - A) Falta de dados de treino em inglês
   - B) A janela de contexto é pequena demais
   - C) Eles processam tokens, não caracteres — a palavra pode ser 1 token opaco
   - D) A temperatura padrão é alta demais

3. No exemplo de atenção com scores softmax([1, 0]) ≈ [0.73, 0.27], a saída do token é:
   - A) O value do token de maior score, ignorando os demais
   - B) A média simples de todos os values
   - C) A soma das queries
   - D) A mistura dos values ponderada pelos pesos: 0.73·v1 + 0.27·v2

4. No bloco do transformer, qual é a divisão de trabalho entre atenção e MLP?
   - A) A atenção mistura informação entre tokens; o MLP processa cada token individualmente
   - B) O MLP mistura os tokens e a atenção processa cada um sozinho
   - C) A atenção só atua no treino; o MLP só na inferência
   - D) Os dois fazem a mesma coisa em paralelo, por redundância

5. Um modelo base (só pré-treino) responde a uma pergunta com... mais perguntas parecidas. Por quê?
   - A) Bug de tokenização
   - B) Ele foi treinado só para continuar texto; o formato "assistente" vem do pós-treino (SFT + RLHF)
   - C) Temperatura alta demais
   - D) A janela de contexto acabou

6. Aumentar a temperatura na geração:
   - A) Afia a distribuição, tornando a saída determinística
   - B) Aumenta a janela de contexto
   - C) Achata a distribuição de probabilidades — tokens improváveis ganham chance
   - D) Reduz o custo por token

7. Por que dobrar o contexto mais que dobra o custo de processá-lo?
   - A) Porque a API cobra taxa fixa por chamada
   - B) Porque a atenção compara cada token com todos os outros — o custo cresce quadraticamente
   - C) Porque o modelo precisa ser retreinado para contextos maiores
   - D) Porque o vocabulário aumenta junto

8. O KV cache existe para:
   - A) Guardar as conversas antigas do usuário
   - B) Armazenar os pesos do modelo em disco
   - C) Aumentar a criatividade da geração
   - D) Evitar recalcular os vetores K e V dos tokens anteriores a cada novo token gerado

<details><summary>Ver respostas</summary>

1. **B** — gradiente = sensibilidade da loss ao peso; o treino inteiro é seguir essas sensibilidades em passinhos (learning rate).
2. **C** — o modelo vê 1–3 tokens opacos, não 10 letras; soletrar força os caracteres a virarem tokens separados, e aí contar funciona.
3. **D** — atenção é uma média ponderada dos values, com pesos dados pelo softmax dos scores q·k.
4. **A** — a atenção troca informação entre posições; o MLP transforma cada posição sozinho e concentra boa parte do conhecimento.
5. **B** — pré-treino só ensina "prever o próximo token"; SFT dá o formato de conversa e RLHF alinha com preferências.
6. **C** — dividir os logits por T > 1 aproxima as probabilidades; a variedade que você mediu no lab cresce com T.
7. **B** — cada query compara com todas as keys anteriores: 2× contexto ≈ 4× comparações, 10× ≈ 100×.
8. **D** — o cache troca computação por memória; por isso contexto longo devora GPU e as APIs oferecem prompt caching.

</details>

## 🃏 Flashcards

| Frente | Verso |
|--------|-------|
| Gradiente | Sensibilidade da loss a um peso: "se eu mexer aqui, o erro sobe ou desce?" |
| Token | Unidade de subpalavra (BPE) que o modelo realmente processa; APIs cobram por token |
| Embedding | Vetor denso do token; proximidade geométrica ≈ semelhança semântica — fundação do RAG |
| Q, K, V | Query (o que busco), Key (o que ofereço), Value (o que entrego) — atenção = softmax(q·k)·V |
| Máscara causal | Na geração, cada token só enxerga os anteriores — ninguém vê o futuro |
| Atenção vs. MLP | Atenção mistura informação entre tokens; MLP processa cada token sozinho (e guarda conhecimento) |
| Temperatura | Divide os logits antes do softmax: baixa = conservador, alta = criativo |
| Pré-treino vs. pós-treino | Base = autocompletador (prever próximo token); SFT dá formato, RLHF alinha preferências |
| Atenção quadrática | Cada token compara com todos os anteriores: 10× contexto ≈ 100× comparações |
| KV cache | Guarda K/V já computados para gerar rápido; cresce com o contexto e devora memória de GPU |

## ☑️ Checklist de conclusão

- [ ] Assisti a "Intro to LLMs" e "Deep Dive into LLMs" do Karpathy e à série do 3Blue1Brown
- [ ] Fiz o exemplo de atenção à mão E o gradiente minúsculo — e o NumPy confirmou minhas contas
- [ ] Caminhei pelo bbycroft.net/llm e consigo narrar o caminho de um token até o logit
- [ ] Testei ≥5 frases no Tiktokenizer e sei explicar por que PT custa mais que EN
- [ ] Rodei o lab guiado completo, incluindo os 4 experimentos obrigatórios
- [ ] Fiz a Sessão de Direção: mini-spec, scripts dirigidos e explicação dos resultados
- [ ] SPEC.md escrito e commitado antes do código (o git prova)
- [ ] Mini-projeto entregue no GitHub com DECISIONS.md preenchido
- [ ] Passei na Defesa do módulo no Campus
- [ ] Acertei pelo menos 6 de 8 no quiz

**🆘 Se travar:** trabalhar com seu assistente de IA É o método deste módulo — cole o erro ou o resultado estranho, peça hipóteses e confronte-as com as seções 6.1–6.8 antes de aceitar qualquer correção. Um resultado de experimento que você não entende é a melhor pergunta que você pode fazer à IA ("meu experimento deu X, eu esperava Y — quais explicações são compatíveis com a teoria de tokenização?"). Travou de verdade (30+ min sem entender nem com IA)? Anote a dúvida no seu DECISIONS.md e leve para a comunidade — dúvida documentada vira material de defesa.
