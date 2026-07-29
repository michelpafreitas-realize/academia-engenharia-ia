# Módulo 9 — Fine-tuning & Modelos Abertos

> 🏛️ Período 3 · ⏱️ Carga estimada: 12h · 📋 Pré-requisitos: Módulo 5 (Como LLMs funcionam: tokens, embeddings, transformers)

## 🎯 Objetivos

- Ao final, você será capaz de aplicar a árvore de decisão prompt → RAG → fine-tuning e justificar por que fine-tuning é a última opção, não a primeira.
- Ao final, você será capaz de rodar modelos abertos localmente com Ollama, llama.cpp ou LM Studio, e escolher a quantização adequada à sua VRAM.
- Ao final, você será capaz de explicar LoRA e QLoRA com as dimensões das matrizes na mão, e usar PEFT/Unsloth para treinar barato.
- Ao final, você será capaz de preparar um dataset de treino no formato correto (chat template, JSONL) e evitar os erros clássicos de formatação.
- Ao final, você será capaz de avaliar um modelo pós-fine-tune com eval de tarefa (não confiando no loss) e publicá-lo no Hugging Face Hub.

## 🗺️ Por que isso importa

"Vamos treinar nosso próprio modelo" é uma das frases mais ditas — e mais erradas — em reuniões de produto com IA. Na maioria dos casos, o problema se resolve com um prompt melhor ou com RAG, por uma fração do custo e do risco. O engenheiro de IA profissional é frequentemente a única pessoa na sala capaz de dizer *quando* fine-tuning realmente compensa (estilo, formato, domínio estreito, latência/custo em escala) e quando é dinheiro queimado (injetar conhecimento factual que muda toda semana). Saber essa fronteira vale tanto quanto saber treinar.

Ao mesmo tempo, modelos abertos viraram infraestrutura séria: empresas rodam Llama, Qwen, Mistral e afins localmente por privacidade (dados que não podem sair do prédio), custo em alto volume e controle total do comportamento. O ecossistema — Hugging Face Hub, quantização GGUF, LoRA/QLoRA, Ollama — é um corpo de conhecimento próprio, e dominá-lo diferencia quem "usa API de LLM" de quem é engenheiro de IA completo. Este módulo cobre as duas pontas: rodar modelos abertos e especializá-los com eficiência.

## 📚 Aulas

| # | Aula | Tipo | Recurso | Duração estimada |
|---|------|------|---------|------------------|
| 1 | Instalar e explorar o Ollama (modelos locais em 5 minutos) | 💻 lab | [ollama.com](https://ollama.com) | 45 min |
| 2 | llama.cpp: o motor por trás da inferência local e o formato GGUF | 📖 leitura | [github.com/ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp) | 1h |
| 3 | LM Studio: interface gráfica para modelos locais | 💻 lab | [lmstudio.ai](https://lmstudio.ai) | 30 min |
| 4 | Hugging Face Learn: curso de fine-tuning de LLMs (grátis) | 🎥 vídeo + 📖 leitura | [huggingface.co/learn](https://huggingface.co/learn) | 2h30 |
| 5 | Documentação do PEFT: LoRA e adaptadores na prática | 📖 leitura | [huggingface.co/docs/peft](https://huggingface.co/docs/peft) | 1h |
| 6 | Unsloth: fine-tuning 2x mais rápido no Colab grátis | 💻 lab | [unsloth.ai](https://unsloth.ai) | 1h30 |
| 7 | LLMs from Scratch (Sebastian Raschka) — capítulos de fine-tuning | 📖 leitura | [github.com/rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | 2h |
| 8 | Lab guiado: Ollama local + comparação de quantizações | 💻 lab | este módulo, seção Lab guiado | 1h30 |
| 9 | Opcional: QLoRA com Unsloth num dataset de instruções | 💻 lab | este módulo, seção Lab guiado (parte B) | 1h30 |

## 🧠 Conteúdo essencial

### 1. A árvore de decisão: prompt → RAG → fine-tuning

Grave esta ordem. Ela existe porque cada degrau custa 10x mais que o anterior em esforço, tempo e manutenção:

1. **Prompt engineering** (horas): instruções melhores, exemplos few-shot, formato de saída explícito. Resolve a maioria dos casos de "o modelo não faz o que eu quero".
2. **RAG** (dias): o modelo não *sabe* algo? Traga o conhecimento no contexto. Dados que mudam, documentos internos, fatos recentes — tudo isso é problema de *recuperação*, não de *pesos*.
3. **Fine-tuning** (semanas): mudar o *comportamento* do modelo em si.

Fine-tuning é a última opção e serve para coisas específicas:

- **Estilo e tom**: o modelo deve escrever sempre como o jurídico da sua empresa escreve.
- **Formato**: saída num esquema rígido e idiossincrático que prompts longos não garantem.
- **Domínio/vocabulário estreito**: jargão médico, taxonomia interna de produtos, uma linguagem de query proprietária.
- **Destilar um modelo menor**: ensinar um modelo pequeno e barato a imitar o comportamento de um grande na *sua* tarefa, cortando custo e latência em escala.

E para o que fine-tuning **não** serve: **injetar conhecimento factual**. Fatos aprendidos por fine-tuning ficam congelados nos pesos, custam caro para atualizar, e o modelo mistura o novo com o velho alucinando com confiança. "Quero que o modelo conheça nossos 500 produtos" é RAG. "Quero que ele *descreva* produtos no nosso tom" é fine-tuning. Memorize o slogan: **RAG dá conhecimento; fine-tuning dá comportamento.**

### 2. Rodando modelos abertos localmente

Três ferramentas, três públicos, o mesmo motor por baixo:

- **[Ollama](https://ollama.com)** — a via CLI/servidor. `ollama run llama3.2` baixa e roda o modelo; `ollama serve` expõe uma API HTTP local compatível com o formato OpenAI, então seu código de app funciona igual apontando para `http://localhost:11434`. É o padrão de facto para desenvolvimento.
- **[llama.cpp](https://github.com/ggml-org/llama.cpp)** — o motor em C/C++ que tornou tudo isso possível: inferência eficiente em CPU e GPU, criador do formato **GGUF** (o arquivo único que empacota pesos quantizados + tokenizer + metadados). Ollama e LM Studio rodam llama.cpp por dentro. Use direto quando precisar de controle fino ou de embarcar num binário.
- **[LM Studio](https://lmstudio.ai)** — interface gráfica: buscar modelos, conversar, servir API local, tudo em cliques. Ótimo para explorar e para colegas não-terminal.

Por que rodar local? Privacidade (dados que não podem sair), custo zero por token (depois do hardware), latência sem rede, e liberdade para usar o modelo que quiser — inclusive o seu fine-tune.

### 3. Quantização: o que significa aquele "Q4"

Os pesos de um modelo são números. Treinados em 16 bits (FP16/BF16), cada parâmetro ocupa 2 bytes. **Quantizar** é armazená-los com menos bits, aceitando pequena perda de precisão. No nome do arquivo GGUF, `Q4_K_M` significa ~4 bits por peso (o `K_M` indica o esquema de agrupamento/mixagem).

Conta de padeiro que você fará para sempre — modelo de 8B parâmetros:

| Precisão | Bits/peso | Memória dos pesos | Qualidade |
|----------|-----------|-------------------|-----------|
| FP16 | 16 | ~16 GB | referência |
| Q8_0 | 8 | ~8 GB | quase indistinguível |
| Q5_K_M | ~5 | ~5,5 GB | perda mínima |
| Q4_K_M | ~4 | ~4,7 GB | **o ponto ideal** custo/qualidade |
| Q2_K | ~2 | ~3 GB | degradação visível — evite |

**Regra de bolso de VRAM**: pegue o tamanho do arquivo GGUF e some ~10–20% para o KV cache e ativações (mais se o contexto for longo). Um Q4 de 8B (~4,7 GB) roda numa GPU de 6–8 GB; um Q4 de 70B (~40 GB) precisa de múltiplas GPUs ou de paciência franciscana na CPU. Regra prática de escolha: **melhor um modelo maior em Q4 do que um menor em FP16** — para o mesmo orçamento de memória, os parâmetros extras valem mais que os bits extras.

### 4. O Hugging Face Hub

O [Hub](https://huggingface.co) é o GitHub dos modelos: **modelos** (pesos versionados com git + model cards descrevendo treino, licença e limitações), **datasets** (carregáveis com `load_dataset("nome")` em uma linha) e **Spaces** (demos hospedadas com Gradio/Streamlit — ótimo para portfólio, como você verá no Módulo 12). Habilidades práticas que este módulo exige: ler uma model card antes de usar qualquer modelo (licença! nem todo "open" permite uso comercial), navegar pelas quantizações GGUF publicadas pela comunidade, e usar `huggingface_hub` para baixar e subir artefatos.

### 5. LoRA: fine-tuning sem tocar nos pesos originais

Fine-tuning completo de um 8B atualiza 8 bilhões de parâmetros — precisa de dezenas de GB de VRAM só para os gradientes e estados do otimizador. **LoRA (Low-Rank Adaptation)** contorna isso com uma observação: a *mudança* que o fine-tuning provoca nos pesos tem posto (rank) baixo — pode ser bem aproximada por matrizes muito menores.

As dimensões contam a história. Pegue uma matriz de pesos `W` de uma camada de atenção, com 4096×4096 = **16,7 milhões** de parâmetros. Em vez de atualizá-la, o LoRA congela `W` e aprende duas matrizes finas com rank `r = 16`:

- `A`: 4096 × 16 = 65.536 parâmetros
- `B`: 16 × 4096 = 65.536 parâmetros
- Saída da camada: `h = W·x + B·(A·x)`

131 mil parâmetros treináveis no lugar de 16,7 milhões — **0,8%**. Somando todas as camadas adaptadas, um LoRA típico de 8B treina ~20–40M de parâmetros (menos de 1% do modelo). Consequências práticas: cabe em GPU modesta; o adaptador salvo tem poucos MB (não GB); você pode ter N adaptadores para N clientes sobre o mesmo modelo base; e "desligar" o fine-tune é só remover o adaptador. O hiperparâmetro `r` controla a capacidade (8–32 cobre quase tudo; maior = mais expressivo e mais propenso a overfitting), e `alpha` escala a contribuição do adaptador (convenção comum: `alpha = 2r`).

**QLoRA** = LoRA + modelo base quantizado em **4 bits** durante o treino. O base fica congelado mesmo, então a precisão baixa quase não dói; os adaptadores continuam em 16 bits. Resultado: fine-tuning de um 8B em ~6 GB de VRAM — ou seja, **no Colab grátis (T4, 16 GB)** sobra espaço. QLoRA é o que democratizou o fine-tuning.

### 6. PEFT e Unsloth: as ferramentas

**[PEFT](https://huggingface.co/docs/peft)** (Parameter-Efficient Fine-Tuning) é a biblioteca da Hugging Face que implementa LoRA e parentes. O núcleo da API:

```python
from peft import LoraConfig, get_peft_model

config = LoraConfig(
    r=16, lora_alpha=32,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],  # onde inserir A e B
    task_type="CAUSAL_LM",
)
model = get_peft_model(base_model, config)
model.print_trainable_parameters()
# trainable params: 27,262,976 || all params: 8,057,662,976 || trainable%: 0.34
```

**[Unsloth](https://unsloth.ai)** é uma camada sobre PEFT com kernels reescritos à mão: ~2x mais rápido e ~60–70% menos VRAM, mesma API de treino, e exporta direto para GGUF (ou seja: treinou → roda no Ollama). Para treinar QLoRA no Colab grátis, é a escolha padrão da comunidade. Os notebooks oficiais em [unsloth.ai](https://unsloth.ai) são o caminho mais curto do zero ao modelo treinado.

### 7. Dados de treino: chat template e JSONL

O formato dos dados é onde a maioria dos fine-tunes morre. Dois conceitos:

**JSONL** — um JSON por linha, cada linha um exemplo de conversa:

```json
{"messages": [{"role": "system", "content": "Você é o assistente de suporte da Acme."}, {"role": "user", "content": "Como emitir 2ª via do boleto?"}, {"role": "assistant", "content": "Acesse Portal > Financeiro > Boletos e clique em 'Segunda via'. O boleto chega ao seu e-mail em até 5 minutos."}]}
```

**Chat template** — o modelo não vê esse JSON: vê uma string com tokens especiais que demarcam papéis (`<|start_header_id|>user<|end_header_id|>` no Llama 3, `<|im_start|>` no Qwen...). Cada família de modelo tem o seu, e **treinar com o template errado produz um modelo que fala sozinho, não para de gerar ou ignora o system prompt**. Nunca monte a string na mão — use `tokenizer.apply_chat_template(messages)`, que aplica o template correto do modelo carregado.

Sobre o dataset em si: **qualidade esmaga quantidade**. 500–1.000 exemplos limpos, consistentes e representativos batem 50 mil exemplos sujos. Os exemplos devem mostrar exatamente o comportamento desejado (a resposta como você *quer*, não como o modelo base responderia). E separe 10% para validação **antes** de treinar.

### 8. Avaliar depois do treino — e publicar

O gráfico de loss descendo é hipnótico e **não prova nada** sobre o que interessa. Loss baixo significa "o modelo prevê bem os tokens do dataset" — que pode significar overfitting (decorou seus exemplos) ou até esquecimento catastrófico (ficou ótimo no seu formato e emburreceu no resto). O que vale é **eval de tarefa**: um conjunto de teste que o treino nunca viu, métricas do *seu* problema, comparação lado a lado base vs fine-tuned nas mesmas entradas. No mínimo absoluto: 30–50 prompts de teste, saídas dos dois modelos em colunas, e um julgamento honesto (seu ou de um LLM-juiz — assunto do Módulo 10, que aprofunda tudo isso).

Publicar no Hub é uma linha por artefato:

```python
model.push_to_hub("seu-usuario/acme-suporte-lora")
tokenizer.push_to_hub("seu-usuario/acme-suporte-lora")
```

Escreva a model card: modelo base, dados (descrição, não necessariamente os dados), hiperparâmetros, resultados do eval, limitações e licença. Um fine-tune publicado com eval antes/depois documentado é peça de portfólio — exatamente o Projeto 3 do Módulo 12.

## 💻 Lab guiado

### Parte A — Modelo local com Ollama + comparação de quantizações

**Passo 1 — Instale o Ollama** ([ollama.com](https://ollama.com); no Linux/WSL):

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama --version
```

**Passo 2 — Baixe o mesmo modelo em duas quantizações**:

```bash
ollama pull llama3.2:3b            # Q4_K_M por padrão (~2 GB)
ollama pull llama3.2:3b-instruct-fp16   # FP16 (~6,4 GB)
ollama list                        # confira os tamanhos em disco
```

**Passo 3 — Compare qualidade e velocidade.** Crie `compara.py`:

```python
"""Compara duas quantizações do mesmo modelo via API local do Ollama."""
import json
import time
import urllib.request

PROMPTS = [
    "Explique em 3 frases o que é juros compostos.",
    "Escreva uma função Python que valide um CPF (só o algoritmo dos dígitos).",
    "Qual a capital da Austrália? Responda em uma palavra.",
]
MODELOS = ["llama3.2:3b", "llama3.2:3b-instruct-fp16"]

def gerar(modelo: str, prompt: str) -> tuple[str, float, float]:
    corpo = json.dumps({"model": modelo, "prompt": prompt,
                        "stream": False}).encode()
    req = urllib.request.Request("http://localhost:11434/api/generate",
                                 data=corpo,
                                 headers={"Content-Type": "application/json"})
    inicio = time.time()
    with urllib.request.urlopen(req) as r:
        dados = json.loads(r.read())
    dur = time.time() - inicio
    tokens = dados.get("eval_count", 0)
    return dados["response"], dur, tokens / dur if dur else 0.0

for prompt in PROMPTS:
    print("=" * 70, f"\nPROMPT: {prompt}\n")
    for m in MODELOS:
        texto, dur, tps = gerar(m, prompt)
        print(f"--- {m} | {dur:.1f}s | {tps:.1f} tok/s\n{texto.strip()}\n")
```

```bash
python compara.py
```

**Passo 4 — Analise.** Registre num arquivo `observacoes.md`: (1) diferença de tok/s entre Q4 e FP16 na sua máquina; (2) alguma diferença *perceptível* de qualidade nas 3 respostas? (spoiler comum: quase nenhuma — é por isso que Q4_K_M é o padrão); (3) uso de RAM/VRAM durante cada rodada (`ollama ps` mostra).

### Parte B (opcional, Colab grátis) — QLoRA com Unsloth

**Passo 1** — Abra um notebook novo no Colab com GPU T4 (Runtime → Change runtime type → T4) e instale:

```python
!pip install unsloth
```

**Passo 2** — Carregue o modelo base quantizado em 4 bits e aplique o LoRA:

```python
from unsloth import FastLanguageModel

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/Llama-3.2-3B-Instruct-bnb-4bit",  # QLoRA: base em 4 bits
    max_seq_length=2048,
    load_in_4bit=True,
)
model = FastLanguageModel.get_peft_model(
    model, r=16, lora_alpha=32,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                    "gate_proj", "up_proj", "down_proj"],
)
```

**Passo 3** — Prepare um dataset pequeno de instruções. Para o exercício, monte 100–200 exemplos seus em JSONL (ex.: perguntas e respostas no tom da sua empresa) e converta com o chat template:

```python
import json
from datasets import Dataset

with open("dados.jsonl", encoding="utf-8") as f:
    exemplos = [json.loads(l) for l in f]

def formatar(ex):
    return {"text": tokenizer.apply_chat_template(
        ex["messages"], tokenize=False, add_generation_prompt=False)}

ds = Dataset.from_list(exemplos).map(formatar)
```

**Passo 4** — Treine (poucos minutos para um dataset pequeno):

```python
from trl import SFTTrainer
from transformers import TrainingArguments

trainer = SFTTrainer(
    model=model, tokenizer=tokenizer, train_dataset=ds,
    dataset_text_field="text", max_seq_length=2048,
    args=TrainingArguments(
        output_dir="saida", per_device_train_batch_size=2,
        gradient_accumulation_steps=4, num_train_epochs=2,
        learning_rate=2e-4, logging_steps=5, fp16=True,
    ),
)
trainer.train()
```

**Passo 5** — Compare antes/depois com 10 prompts de teste que **não** estão no treino, gerando com o modelo base e com o adaptado, lado a lado. Só então (se gostar do resultado) publique: `model.push_to_hub("seu-usuario/meu-primeiro-lora")`.

## 🚀 Mini-projeto

**Enunciado**: **"Formatador especialista"** — faça QLoRA de um modelo aberto pequeno (1B–3B) para uma tarefa de formato bem definida: transformar mensagens informais de clientes em registros JSON padronizados (`{"intencao": ..., "produto": ..., "urgencia": ..., "resumo": ...}`). O objetivo é experimentar o ciclo completo: dados → treino → eval antes/depois → publicação.

**Requisitos**:
- Dataset próprio com ≥ 150 exemplos em JSONL (pode gerar os rascunhos com um LLM forte e revisar à mão — revisão manual é obrigatória), com split treino/validação/teste (80/10/10).
- Treino com QLoRA via Unsloth ou PEFT no Colab grátis.
- Eval de tarefa: nos exemplos de teste, medir % de saídas que são JSON válido e % com campos corretos — para o modelo base e para o fine-tuned.
- Publicação do adaptador no Hugging Face Hub com model card completa (base, dados, hiperparâmetros, tabela de resultados, limitações).

### 🧭 Passo a passo

Reserve ~6h no total (dá para dividir em 3 sessões: dados, treino+eval, publicação). Siga na ordem — cada etapa termina com um **checkpoint**; só avance quando ele passar.

**Etapa 1 — Definir o esquema e gerar rascunhos com um LLM forte (1h)**

1. Fixe os valores permitidos antes de gerar qualquer exemplo: `intencao` ∈ {duvida, compra, reclamacao, cancelamento}, `urgencia` ∈ {baixa, media, alta}, `produto` texto livre, `resumo` com até 15 palavras.
2. Peça rascunhos a um LLM forte (o assistente de IA que você já usa) em lotes de 20, variando tom e tema a cada lote: *"Gere 20 pares `mensagem do cliente → JSON` para treinar um formatador. Mensagens de clientes de [tema do lote: telefonia / e-commerce / academia...], em tom [formal / com gírias / irritado / cheio de erros de digitação]. O JSON tem exatamente os campos intencao (duvida|compra|reclamacao|cancelamento), produto, urgencia (baixa|media|alta) e resumo (até 15 palavras)."*
3. Repita trocando tema e tom até juntar ~180 rascunhos — sobra para os cortes da revisão.

✅ **Checkpoint:** ~180 pares num arquivo de rascunho, com pelo menos 5 combinações diferentes de tom/tema.

**Etapa 2 — Revisar TODOS à mão e salvar `dataset.jsonl` (1h30)**

A revisão manual é o requisito inegociável: LLMs geram exemplos inconsistentes, e é exatamente isso que o seu modelo aprenderia. Para **cada** rascunho pergunte: o JSON é válido? Os campos batem com a mensagem? Corrija ou apague. Salve uma linha por exemplo no formato da seção 7, usando o **mesmo system** em todas as linhas — a resposta do assistant é o JSON *como string*:

```json
{"messages": [{"role": "system", "content": "Converta a mensagem do cliente em JSON com os campos intencao, produto, urgencia e resumo."}, {"role": "user", "content": "oi, meu plano ta caro dms, quero cancelar logo isso"}, {"role": "assistant", "content": "{\"intencao\": \"cancelamento\", \"produto\": \"plano\", \"urgencia\": \"alta\", \"resumo\": \"Cliente acha o plano caro e pede cancelamento.\"}"}]}
```

✅ **Checkpoint:** `python -c "import json; L = [json.loads(l) for l in open('dataset.jsonl', encoding='utf-8')]; [json.loads(x['messages'][2]['content']) for x in L]; print(len(L))"` imprime ≥ 150 sem erro.

**Etapa 3 — Split 80/10/10 antes do treino (15 min)**

Crie `split.py` na pasta do dataset e rode uma única vez. A partir daqui, `teste.jsonl` fica lacrado — só o eval (Etapas 4 e 5) pode abri-lo — e `validacao.jsonl` fica de reserva para ajustes de hiperparâmetros:

```python
import random
linhas = open("dataset.jsonl", encoding="utf-8").read().splitlines()
random.seed(42); random.shuffle(linhas)
n = len(linhas); c1, c2 = int(n * 0.8), int(n * 0.9)
for nome, parte in [("treino", linhas[:c1]), ("validacao", linhas[c1:c2]), ("teste", linhas[c2:])]:
    open(f"{nome}.jsonl", "w", encoding="utf-8").write("\n".join(parte) + "\n")
```

✅ **Checkpoint:** três arquivos criados e a soma das linhas dos três bate com o total do `dataset.jsonl`.

**Etapa 4 — Subir para o Colab e medir o "antes" (1h15)**

1. Abra [colab.research.google.com](https://colab.research.google.com), crie um notebook, ligue a GPU (menu *Runtime → Change runtime type → T4 GPU → Save*) e envie os três `.jsonl` pelo ícone de pasta da barra lateral esquerda (botão de upload).
2. Instale e carregue copiando os Passos 1 e 2 do Lab guiado, Parte B (`!pip install unsloth`, `FastLanguageModel.from_pretrained` com um base de 1B–3B em 4 bits, `get_peft_model`).
3. Meça o modelo base **agora**: o adaptador recém-criado nasce neutro, então antes do treino o modelo se comporta como o base. No código abaixo, `do_sample=False` é a temperatura 0 das Dicas; as métricas usam os campos categóricos (`produto` e `resumo` são texto livre — avalie-os por leitura).

```python
import json
teste = [json.loads(l) for l in open("teste.jsonl", encoding="utf-8")]
def avaliar(model, tokenizer):
    FastLanguageModel.for_inference(model)
    validos = corretos = 0
    for ex in teste:
        prompt = tokenizer.apply_chat_template(ex["messages"][:2], tokenize=False, add_generation_prompt=True)
        entrada = tokenizer(prompt, return_tensors="pt").to("cuda")
        gerado = model.generate(**entrada, max_new_tokens=200, do_sample=False)[0]
        saida = tokenizer.decode(gerado[entrada["input_ids"].shape[1]:], skip_special_tokens=True)
        try:
            obtido, esperado = json.loads(saida.strip()), json.loads(ex["messages"][2]["content"])
            validos += 1
            corretos += int(obtido.get("intencao") == esperado["intencao"] and obtido.get("urgencia") == esperado["urgencia"])
        except (json.JSONDecodeError, AttributeError):
            pass
    print(f"JSON válido: {100*validos/len(teste):.0f}% | campos corretos: {100*corretos/len(teste):.0f}%")
avaliar(model, tokenizer)  # anote os números: é a linha "base" da tabela
```

✅ **Checkpoint:** duas porcentagens anotadas para o modelo base (baixas — é exatamente o esperado).

**Etapa 5 — Treinar o QLoRA e medir o "depois" (1h15)**

1. Volte ao modo de treino com `FastLanguageModel.for_training(model)` e treine copiando os Passos 3 e 4 do Lab guiado, Parte B, trocando `dados.jsonl` por `treino.jsonl` — o chat template entra ali via `apply_chat_template` (seção 7); nunca monte a string na mão.
2. Loss caindo bonito ainda não prova nada (seção 8): terminado o treino, rode `avaliar(model, tokenizer)` de novo — agora com o adaptador treinado.
3. Monte numa célula Markdown a tabela antes/depois: linhas Base e Fine-tuned, colunas "JSON válido (%)" e "campos corretos (%)".

✅ **Checkpoint:** treino terminou no Colab sem OOM e o fine-tuned supera o base em pelo menos uma métrica (se não superou, veja o 🆘 antes de publicar).

**Etapa 6 — Publicar no Hub com model card completa (45 min)**

1. Crie sua conta em [huggingface.co](https://huggingface.co) e pegue o token: clique no seu avatar (canto superior direito) → *Settings* → *Access Tokens* → *Create new token* → tipo **Write** → copie o valor (começa com `hf_`). No Colab, autentique e publique:

```python
from huggingface_hub import login
login(token="hf_...")  # cole o seu token Write
model.push_to_hub("seu-usuario/formatador-especialista-lora")
tokenizer.push_to_hub("seu-usuario/formatador-especialista-lora")
```

2. Na página do modelo no Hub, edite o `README.md` (a model card) com o roteiro da seção 8: modelo base, descrição dos dados, hiperparâmetros (`r`, `alpha`, épocas, learning rate), a tabela antes/depois da Etapa 5, limitações — e a seção "quando NÃO usar este modelo".

✅ **Checkpoint:** a URL pública do modelo abre com a model card completa — e todos os critérios de aceite abaixo marcados.

**🆘 Se travar:** `CUDA out of memory` no Colab → *Runtime → Restart runtime* e treine com `per_device_train_batch_size=1` e `max_seq_length=1024` (as mensagens deste projeto são curtas, sobra folga); o fine-tuned gera JSON quebrado ou texto que não para → suspeito nº 1 é chat template errado — volte à seção 7 e confira que **tudo** passa por `apply_chat_template`, inclusive o prompt do eval; o loss não desce (ou despenca para perto de zero) → exemplos repetidos ou template aplicado duas vezes — imprima `ds[0]["text"]` e leia a string com os próprios olhos; travou 30+ minutos em qualquer etapa → pergunte ao seu assistente de IA colando o erro completo e dizendo em qual etapa está (mas peça a *explicação*, não só a resposta — o objetivo é treinar).

**Critérios de aceite**:
- [ ] Dataset revisado manualmente, com os 3 splits separados antes do treino
- [ ] Treino conclui no Colab grátis sem OOM (ajuste batch size/seq length se preciso)
- [ ] Tabela antes/depois: JSON válido (%) e campos corretos (%) para base vs fine-tuned
- [ ] Fine-tuned supera o modelo base em pelo menos uma das duas métricas
- [ ] Modelo publicado no Hub com model card preenchida
- [ ] Uma seção "quando NÃO usar este modelo" na model card

**Dicas**: use temperatura 0 no eval para resultados reproduzíveis. Se o JSON sair quebrado no fine-tuned, o suspeito nº 1 é chat template errado no preparo dos dados. Se o modelo "esquecer" instruções gerais, seu dataset provavelmente é homogêneo demais — misture variações de fraseado.

## ✅ Quiz

**1.** Um cliente quer que o chatbot "conheça os 800 produtos do catálogo, que muda toda semana". A abordagem correta é:
A) Fine-tuning mensal com o catálogo
B) RAG sobre o catálogo
C) Prompt com o catálogo inteiro
D) Treinar um modelo do zero

**2.** Fine-tuning é a escolha certa principalmente para:
A) Adicionar fatos recentes ao modelo
B) Estilo, formato e comportamento em domínio estreito
C) Reduzir alucinação factual
D) Aumentar a janela de contexto

**3.** Num GGUF chamado `Q4_K_M`, o "4" indica:
A) 4 GB de tamanho
B) ~4 bits por peso
C) 4ª versão da quantização
D) Necessidade de 4 GPUs

**4.** Regra de bolso: um modelo de 8B em Q4 ocupa aproximadamente:
A) 16 GB
B) 8 GB
C) 4–5 GB
D) 1 GB

**5.** No LoRA com `W` de 4096×4096 e rank r=16, os parâmetros treináveis da camada são aproximadamente:
A) 16,7 milhões
B) 131 mil (duas matrizes 4096×16)
C) 4096
D) 262 milhões

**6.** O que o QLoRA acrescenta ao LoRA?
A) Quantiza os adaptadores para 4 bits
B) Mantém o modelo base congelado em 4 bits durante o treino, derrubando a VRAM necessária
C) Treina só a última camada
D) Usa aprendizado por reforço

**7.** Por que usar `tokenizer.apply_chat_template()` em vez de montar a string de treino na mão?
A) É mais rápido em CPU
B) Cada modelo tem tokens especiais próprios de papéis; errar o template quebra o comportamento do modelo treinado
C) Reduz o tamanho do dataset
D) É exigência do Hub para publicar

**8.** O loss de treino caiu bonito. O que isso garante sobre a qualidade do modelo na sua tarefa?
A) Que o modelo generaliza bem
B) Que não houve overfitting
C) Nada — só que ele prevê bem os tokens do próprio dataset; a prova é eval de tarefa em dados nunca vistos
D) Que o modelo supera o base

<details><summary>Ver respostas</summary>

**1-B.** Conhecimento factual que muda com frequência é problema de *recuperação*: RAG. Fine-tuning congela fatos nos pesos e custa caro para atualizar. (C) estoura contexto/custo e degrada qualidade.

**2-B.** RAG dá conhecimento; fine-tuning dá comportamento — estilo, formato rígido, vocabulário de domínio, destilação para modelo menor.

**3-B.** O número após o Q é a quantidade aproximada de bits por peso; `K_M` descreve o esquema de agrupamento. Menos bits = menos memória, alguma perda de qualidade.

**4-C.** 8B × ~0,5 byte/peso ≈ 4 GB, mais overhead de metadados: ~4,7 GB de arquivo. Some 10–20% de KV cache para estimar a VRAM em uso.

**5-B.** A (4096×16) + B (16×4096) = 65.536 + 65.536 = 131.072 parâmetros — ~0,8% dos 16,7M da matriz original. Essa é a mágica do posto baixo.

**6-B.** QLoRA = base congelado quantizado em 4 bits + adaptadores LoRA em 16 bits. Como o base não é atualizado, a quantização quase não custa qualidade — e um 8B treina em ~6 GB de VRAM (Colab grátis).

**7-B.** Llama, Qwen, Mistral etc. usam tokens especiais diferentes para demarcar system/user/assistant. Treinar com o template errado gera modelos que não param de gerar, falam sozinhos ou ignoram instruções.

**8-C.** Loss baixo pode ser memorização (overfitting) e não mede o que interessa. Avalie com conjunto de teste separado, métricas da tarefa e comparação base vs fine-tuned nas mesmas entradas.

</details>

## 🃏 Flashcards

| Frente | Verso |
|--------|-------|
| Árvore de decisão de adaptação | Prompt → RAG → fine-tuning; cada degrau custa ~10x mais; fine-tuning por último |
| RAG vs fine-tuning (slogan) | RAG dá conhecimento; fine-tuning dá comportamento |
| Para que fine-tuning serve | Estilo, formato rígido, domínio/vocabulário estreito, destilar modelo menor |
| GGUF | Formato do llama.cpp: pesos quantizados + tokenizer + metadados num arquivo só |
| Q4_K_M | ~4 bits por peso; o ponto ideal custo/qualidade para uso local |
| Regra de VRAM | Tamanho do arquivo GGUF + 10–20% (KV cache); maior em Q4 > menor em FP16 |
| LoRA em uma frase | Congela W e aprende ΔW ≈ B·A com rank baixo — <1% dos parâmetros treináveis |
| QLoRA | LoRA com base congelado em 4 bits: fine-tune de 8B em ~6 GB de VRAM (Colab grátis) |
| Chat template | String com tokens especiais de papéis, própria de cada modelo; aplique com `apply_chat_template()` |
| Por que não confiar no loss | Loss mede previsão de tokens do dataset, não desempenho na tarefa; use eval em dados nunca vistos |

## ☑️ Checklist de conclusão

- [ ] Sei recitar a árvore prompt → RAG → fine-tuning com um exemplo real de cada degrau
- [ ] Rodei um modelo aberto localmente com Ollama e comparei duas quantizações (Parte A do lab)
- [ ] Sei estimar de cabeça a VRAM de um modelo dado tamanho e quantização
- [ ] Consigo explicar LoRA desenhando as matrizes A e B com dimensões num papel
- [ ] Preparei um dataset em JSONL e apliquei o chat template corretamente
- [ ] Treinei um QLoRA (lab parte B ou mini-projeto) e fiz eval antes/depois em dados de teste
- [ ] Publiquei um modelo no Hugging Face Hub com model card completa
- [ ] Sei argumentar contra um fine-tuning desnecessário numa reunião de produto
