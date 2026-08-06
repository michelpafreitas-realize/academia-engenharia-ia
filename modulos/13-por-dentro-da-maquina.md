# Módulo 13 — ⭐ Por Dentro da Máquina (trilha optativa)

> 🏛️ Trilha optativa · ⏱️ Carga estimada: 20h · 📋 Pré-requisitos: Módulo 6 (Como LLMs Funcionam)

> ⭐ **Este módulo é OPTATIVO.** Ele não bloqueia nenhum outro módulo nem o capstone: pode ser feito a qualquer momento depois do Módulo 6, em paralelo com o que você estiver cursando. Quem completa ganha **XP bônus** e a condecoração **🔬 Por Dentro da Máquina** no Campus. É a trilha de quem quer **profundidade de implementação** — construir com as próprias mãos o que o Módulo 6 explicou com diagramas.

## 🎯 Objetivos

- Ao final, você será capaz de implementar um motor de autograd mínimo (estilo micrograd) e explicar backpropagation linha por linha, não por analogia.
- Ao final, você será capaz de escrever um loop de treino em PyTorch à mão — forward, loss, backward, step — e diagnosticar treinos quebrados (loss que não desce, NaN, overfitting) com o checklist do engenheiro.
- Ao final, você será capaz de implementar um tokenizador BPE funcional e prever, olhando o algoritmo, os comportamentos estranhos de tokenização que você viu no Módulo 6.
- Ao final, você será capaz de implementar self-attention causal em PyTorch e conectar cada linha do código ao exemplo numérico conceitual do Módulo 6.
- Ao final, você será capaz de montar e treinar um GPT pequeno (nanoGPT) do zero num corpus em português, lendo a curva de loss como evidência do que o modelo está aprendendo.
- Ao final, você será capaz de defender, em entrevista técnica, qualquer componente interno de um transformer — porque você o escreveu.

## 🎛️ Núcleo manual deste módulo

**Aqui, o núcleo manual é o módulo inteiro — e isso é proposital.** Na trilha principal, a regra é "a IA executa, você dirige e verifica"; nesta trilha, o objetivo É a implementação: a intuição que este módulo forma só nasce digitando o backward, o BPE e a attention com as próprias mãos, vendo cada tensor quebrar e consertando. A IA continua na bancada — mas como **tutor socrático** (te faz perguntas, revisa seu código, explica erros), nunca como executora. Se a IA escrever o código por você aqui, você concluiu o módulo sem obter o que ele oferece.

## 🗺️ Por que isso importa

O Módulo 6 te deu o mapa conceitual: tokens, embeddings, attention, amostragem, pós-treino. Para dirigir sistemas com LLMs no dia a dia — RAG, agentes, evals — esse mapa basta, e é por isso que esta trilha é optativa. Mas existe um degrau de profundidade que só a implementação dá: quem já escreveu `loss.backward()` do zero nunca mais trata gradiente como mágica; quem já implementou BPE sabe *exatamente* por que "strawberry" confunde o modelo; quem já treinou um GPT vendo a loss descer de 4.3 para 1.5 sabe, no corpo, o que "o modelo aprendeu a estrutura da língua" significa. É a diferença entre ler o manual do motor e desmontar o motor.

Profissionalmente, esta trilha é uma **especialização**: abre portas em times que treinam ou fazem fine-tuning de modelos (o Módulo 9 fica muito mais profundo depois daqui), em entrevistas técnicas de nível sênior ("implemente attention no quadro" ainda cai em 2026) e em qualquer debugging de treino — porque treino quebra, e quem entende o mecanismo resolve em minutos o que trava os outros por dias. E há o motivo mais honesto: é o conteúdo mais bonito do programa. A série Zero to Hero do Karpathy é considerada por muita gente o melhor material didático já feito sobre redes neurais — esta trilha existe para você percorrê-la inteira, com estrutura e entrega no final.

## 📚 Aulas

| # | Aula | Tipo | Recurso | Duração estimada |
|---|------|------|---------|------------------|
| 1 | Redes neurais visualmente (revisão da série) | 🎥 vídeo | [3Blue1Brown — Neural Networks](https://www.3blue1brown.com/topics/neural-networks) | 1h00 |
| 2 | Micrograd: backpropagation soletrado, do zero | 🎥 vídeo | [Karpathy — Zero to Hero](https://karpathy.ai/zero-to-hero.html) | 2h30 |
| 3 | Makemore: modelos de linguagem de caracteres (partes 1–2) | 🎥 vídeo | [Karpathy — Zero to Hero](https://karpathy.ai/zero-to-hero.html) | 3h00 |
| 4 | PyTorch: tensores, autograd, nn.Module | 📖 leitura | [PyTorch Tutorials — Learn the Basics](https://pytorch.org/tutorials/) | 1h30 |
| 5 | Let's build GPT: from scratch, in code | 🎥 vídeo | [Karpathy — Zero to Hero](https://karpathy.ai/zero-to-hero.html) | 2h30 |
| 6 | Let's build the GPT Tokenizer | 🎥 vídeo | [Karpathy — Zero to Hero](https://karpathy.ai/zero-to-hero.html) | 2h00 |
| 7 | O GPT em 3D — agora com olhos de implementador | 💻 lab | [bbycroft.net/llm](https://bbycroft.net/llm) | 0h30 |
| 8 | Lab guiado: autograd, loop à mão e uma cabeça de attention | 💻 lab | Seção 💻 abaixo | 3h00 |
| 9 | Sessão de Direção: a IA como tutor socrático | 🎛️ sessão de direção | Seção 🎛️ abaixo | 1h00 |

Aprofundamento livre para quem terminar querendo mais: [Build a LLM From Scratch (Raschka)](https://github.com/rasbt/LLMs-from-scratch) e [Stanford CS224N](https://cs224n.stanford.edu).

## 🧠 Conteúdo essencial

### 13.1 O contrato desta trilha: digitar é o método

Na trilha principal você aprendeu que digitação mecânica não gera critério — direção e verificação geram. Esta trilha não contradiz isso: ela trata de um tipo de conhecimento diferente. Ninguém forma intuição sobre gradientes *lendo* um autograd; forma implementando um, errando o sinal da derivada, vendo a loss subir e entendendo por quê. Então o contrato aqui é invertido e explícito: **todo código deste módulo sai dos seus dedos**. Assista ao vídeo do Karpathy, pause, digite, quebre, conserte. A IA participa como tutor (seção 🎛️), não como par de mãos.

### 13.2 Autograd do zero: o micrograd

O coração de todo framework de deep learning é um **grafo de computação com derivadas locais**. O micrograd do Karpathy implementa isso em ~100 linhas: uma classe `Value` que guarda um número, os `Value` que o geraram e uma funçãozinha `_backward` que sabe propagar o gradiente um passo para trás.

Relembre o exemplo numérico do Módulo 6 (e do antigo material de deep learning): com `z = w·x + b`, `loss = (z − alvo)²`, `x = 2`, `w = 3`, `b = 0`, `alvo = 10`:

```
z = 6;  loss = (6-10)² = 16
dloss/dz = 2·(6-10) = -8
dz/dw = x = 2
dloss/dw = -8 · 2 = -16   → aumentar w diminui a loss
```

O micrograd faz exatamente essa conta, mas de forma genérica: cada operação (`+`, `*`, `tanh`...) registra sua derivada local, e `backward()` percorre o grafo em ordem topológica reversa multiplicando derivadas — a regra da cadeia virou código. O essencial em três regras:

| Operação | Derivada local que o nó propaga |
|----------|--------------------------------|
| `c = a + b` | o gradiente passa inteiro para os dois lados (`da = dc`, `db = dc`) |
| `c = a * b` | cada lado recebe o gradiente vezes o *outro* operando (`da = b·dc`) |
| nó usado 2+ vezes | os gradientes **se acumulam** (`+=`, nunca `=`) |

A terceira regra é a mais traiçoeira — e é a razão de existir o `optimizer.zero_grad()` do PyTorch: gradientes se acumulam por padrão, então é preciso zerá-los entre passos.

### 13.3 A liturgia do loop de treino

Todo treino em PyTorch, do MNIST ao GPT, é a mesma liturgia de 5 passos — e nesta trilha você a escreve à mão até ela virar reflexo:

```python
for x, y in dataloader:
    optimizer.zero_grad()      # 1. zera gradientes acumulados (regra 3 acima!)
    pred = model(x)            # 2. forward pass
    loss = criterion(pred, y)  # 3. quão errado estamos?
    loss.backward()            # 4. backprop — o micrograd em escala industrial
    optimizer.step()           # 5. um passo na direção oposta ao gradiente
```

Sobre os botões do passo 5: **SGD** dá o passo cru (`w = w − lr·grad`); **AdamW** adapta o passo por parâmetro e é o default sensato de 2026. O **learning rate** é o hiperparâmetro que mais mata treinos:

| lr | Sintoma |
|----|---------|
| Muito alto | Loss oscila ou explode (NaN) |
| Muito baixo | Loss desce em câmera lenta |
| Bom | Loss cai rápido e estabiliza |

Ponto de partida com AdamW: `1e-3` (para o GPT do mini-projeto, `3e-4` é o clássico). Divergiu? Divida por 10.

### 13.4 Debugging de treino: o checklist do engenheiro

Quatro verificações que resolvem 90% dos treinos quebrados — decore-as:

1. **Loss inicial faz sentido?** Um modelo de linguagem com vocabulário de tamanho V deve começar com loss ≈ −ln(1/V). Vocabulário de 65 caracteres → ≈ 4.17. Muito diferente disso = bug na inicialização ou na loss.
2. **Teste do batch único**: pegue UM batch e treine nele centenas de passos. Uma rede saudável **decora** um batch (loss → ~0). Se nem isso acontece, o bug está no código, não no modelo.
3. **Loss não desce?** Confira learning rate (tente 10× menor e 10× maior), `zero_grad()` presente, alvos alinhados com as previsões (off-by-one no deslocamento x/y é o bug clássico de modelo de linguagem).
4. **Overfitting?** Loss de treino cai, validação sobe → o modelo está decorando o corpus. Em GPTs pequenos com corpus pequeno isso É esperado no fim do treino — o interessante é identificar *quando* começa.

E um quinto, específico de classificação: `nn.CrossEntropyLoss` **já embute o softmax** — a última camada do modelo entrega logits crus. Softmax duas vezes é bug silencioso.

### 13.5 Makemore: modelos de linguagem no nível mínimo

Antes de montar um GPT, o makemore treina o modelo de linguagem mais simples possível: prever o **próximo caractere**. Começa com um bigrama (uma tabela: dado o caractere atual, a probabilidade de cada próximo) e evolui para uma rede neural — e no caminho você descobre que *contar frequências* e *treinar com gradiente* convergem para a mesma resposta, o que desmistifica o que "treinar" significa. A pergunta que o modelo responde nunca muda, do bigrama ao GPT-4: **dado o contexto, qual é a distribuição do próximo token?** O que muda é quanta capacidade e quanto contexto o modelo tem para responder.

### 13.6 O tokenizador BPE, implementado

No Módulo 6 você viu *o que* o BPE faz; aqui você o escreve. O algoritmo cabe num parágrafo: comece com o texto como bytes; conte todos os pares adjacentes; funda o par mais frequente num token novo; repita até atingir o tamanho de vocabulário desejado. Cada fusão vira uma regra (`merge`), e tokenizar texto novo é aplicar as regras na ordem em que foram aprendidas.

Implementando, você *vê* as causas dos comportamentos estranhos: português quebra em mais pedaços porque o corpus de treino tinha mais inglês (pares frequentes em inglês foram fundidos primeiro); espaços fazem parte dos tokens (` casa` ≠ `casa`); números fatiam de formas imprevisíveis. E entende o trade-off central: vocabulário maior = sequências mais curtas (menos custo por chamada) mas matriz de embedding maior.

### 13.7 Self-attention: do exemplo numérico ao código

Este é o momento de costurar a trilha: o Módulo 6 te deu o exemplo conceitual (Q = "o que procuro", K = "o que ofereço", V = "o que entrego", com a busca em biblioteca). Reveja o exemplo numérico de lá:

```
q2 = [1, 0]
k1 = [1, 0]  v1 = [10, 0]
k2 = [0, 1]  v2 = [0, 10]

scores:  q2·k1 = 1      q2·k2 = 0
softmax([1, 0]) ≈ [0.73, 0.27]
saída do token 2 = 0.73·[10,0] + 0.27·[0,10] = [7.3, 2.7]
```

Agora, a mesma coisa em PyTorch — cada linha do código é uma linha do exemplo:

```python
import torch, torch.nn.functional as F
# x: (B, T, C) — batch, tokens, canais
q = x @ Wq   # queries : "o que estou procurando?"
k = x @ Wk   # keys    : "o que eu ofereço?"
v = x @ Wv   # values  : "o que eu entrego, se escolhido"

scores = q @ k.transpose(-2, -1) / (k.shape[-1] ** 0.5)  # q·k, escalado por √d
mask = torch.tril(torch.ones(T, T))                      # máscara causal:
scores = scores.masked_fill(mask == 0, float("-inf"))    # ninguém vê o futuro
pesos = F.softmax(scores, dim=-1)                        # os 0.73/0.27 do exemplo
saida = pesos @ v                                        # mistura ponderada dos values
```

Três detalhes que só a implementação revela: (1) a divisão por √d existe para o softmax não saturar quando a dimensão cresce; (2) a máscara causal é um triângulo de `-inf` *antes* do softmax — `-inf` vira probabilidade zero, elegância pura; (3) **multi-head** é só rodar esse bloco N vezes em paralelo com matrizes menores e concatenar — nada de novo, só paralelismo de especialistas.

### 13.8 Montando o GPT: o bloco que se repete

Um GPT é surpreendentemente pouco código. A receita completa, que você monta no vídeo "Let's build GPT" e reusa no mini-projeto:

```
tokens → embedding de token + embedding de posição
  → [ LayerNorm → multi-head attention causal → soma residual
      LayerNorm → MLP (Linear 4×, GELU, Linear) → soma residual ] × N blocos
  → LayerNorm final → Linear → logits (um score por token do vocabulário)
```

A attention mistura informação **entre** tokens; o MLP processa cada token **individualmente** e concentra boa parte do "conhecimento". As **conexões residuais** (`x = x + bloco(x)`) são o que permite empilhar dezenas de blocos sem o gradiente sumir — o gradiente tem uma "avenida" direta até as primeiras camadas. O **LayerNorm** mantém as ativações em escala saudável. Treinar é a mesma liturgia da seção 13.3, com a cross-entropy prevendo o próximo token. Só. Todo o resto — GPT-4, Claude, Llama — é essa receita com mais blocos, mais dados e engenharia de escala.

Depois de escrever o seu, volte ao [bbycroft.net/llm](https://bbycroft.net/llm) e passeie pela visualização 3D: agora cada caixinha tem nome, e o nome está no seu código.

## 💻 Lab guiado

**Objetivo:** três construções à mão que preparam o mini-projeto: um autograd mínimo, o loop de treino com sanity check, e uma cabeça de self-attention verificada contra o exemplo numérico. Roda no Colab (CPU basta). **Digite cada célula — nesta trilha, é o método.**

```python
# ── 1. Autograd mínimo: a essência do micrograd ────────────────
class Value:
    """Um número que sabe de onde veio e como propagar gradiente."""
    def __init__(self, data, filhos=()):
        self.data, self.grad = data, 0.0
        self._backward, self._filhos = lambda: None, set(filhos)

    def __add__(self, other):
        out = Value(self.data + other.data, (self, other))
        def _backward():                 # regra da soma: gradiente passa inteiro
            self.grad += out.grad        # += , nunca = : gradientes ACUMULAM
            other.grad += out.grad
        out._backward = _backward
        return out

    def __mul__(self, other):
        out = Value(self.data * other.data, (self, other))
        def _backward():                 # regra do produto: vezes o OUTRO operando
            self.grad += other.data * out.grad
            other.grad += self.data * out.grad
        out._backward = _backward
        return out

    def backward(self):                  # ordem topológica reversa + regra da cadeia
        topo, visitados = [], set()
        def visita(v):
            if v not in visitados:
                visitados.add(v)
                for f in v._filhos: visita(f)
                topo.append(v)
        visita(self)
        self.grad = 1.0
        for v in reversed(topo): v._backward()

# Verificação com o exemplo da seção 13.2: dloss/dw deve dar -16
x, w, alvo = Value(2.0), Value(3.0), Value(-10.0)
z = w * x                       # z = 6
erro = z + alvo                 # 6 - 10 = -4
loss = erro * erro              # 16
loss.backward()
print(f"loss={loss.data}, dloss/dw={w.grad}")
assert w.grad == -16.0, "A regra da cadeia falhou — revise os _backward!"

# ── 2. O mesmo gradiente, agora com o autograd do PyTorch ──────
import torch
w = torch.tensor(3.0, requires_grad=True)
loss = (w * 2.0 - 10.0) ** 2
loss.backward()
print("PyTorch concorda:", w.grad.item())   # -16.0 — sua Value fez o mesmo trabalho

# ── 3. Loop de treino à mão + teste do batch único ─────────────
import torch.nn as nn
torch.manual_seed(42)
X = torch.randn(256, 10)                          # dados sintéticos
y = (X.sum(dim=1) > 0).long()                     # rótulo: soma positiva?
model = nn.Sequential(nn.Linear(10, 32), nn.ReLU(), nn.Linear(32, 2))
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)
criterion = nn.CrossEntropyLoss()                 # softmax embutido — logits crus!

print(f"Loss inicial: {criterion(model(X), y).item():.3f}  (esperado ≈ {-torch.log(torch.tensor(1/2)).item():.3f})")
for passo in range(300):                          # a liturgia dos 5 passos
    optimizer.zero_grad()
    loss = criterion(model(X), y)
    loss.backward()
    optimizer.step()
print(f"Loss após 300 passos no mesmo batch: {loss.item():.4f}")
assert loss.item() < 0.1, "Uma rede saudável DECORA um batch. Há bug no código."

# ── 4. Uma cabeça de self-attention, verificada no exemplo ─────
import torch.nn.functional as F
# Os vetores do exemplo numérico do Módulo 6 (seção 13.7):
q = torch.tensor([[1., 0.]])                      # query do token 2
k = torch.tensor([[1., 0.], [0., 1.]])            # keys dos tokens 1 e 2
v = torch.tensor([[10., 0.], [0., 10.]])          # values
scores = q @ k.T                                  # [1, 0] — sem √d p/ bater com o exemplo
pesos = F.softmax(scores, dim=-1)
print("pesos:", pesos)                            # ≈ [0.73, 0.27]
print("saída:", pesos @ v)                        # ≈ [7.3, 2.7] — o papel confere com o código

# ── 5. A máscara causal em ação ────────────────────────────────
T = 4
scores = torch.randn(T, T)
mask = torch.tril(torch.ones(T, T))
scores = scores.masked_fill(mask == 0, float("-inf"))
print(F.softmax(scores, dim=-1))
# Linha i só tem probabilidade > 0 nas colunas ≤ i: ninguém enxerga o futuro.
```

**Experimentos obrigatórios depois de rodar:** (a) na célula 3, troque `lr` por `1.0` e veja a loss oscilar/explodir; (b) remova o `optimizer.zero_grad()` e explique o que acontece usando a regra do `+=` da célula 1; (c) na célula 4, mude `q` para `[0, 1]` e preveja no papel a saída ANTES de rodar; (d) na célula 5, remova a máscara e explique por que isso quebraria a geração de texto.

## 🎛️ Sessão de Direção

Nesta trilha a Sessão de Direção tem um formato especial: você dirige a IA como **tutor socrático, nunca como executora**. O código sai de você; da IA saem perguntas, revisões e explicações.

**O que especificar:** abra uma sessão com seu assistente e cole este contrato — "Vou implementar [micrograd / BPE / attention / nanoGPT] com as minhas mãos. Seu papel: (1) NÃO escrever código de implementação, mesmo que eu peça num momento de fraqueza; (2) quando eu travar, me fazer perguntas que me levem à resposta; (3) quando eu colar meu código, apontar onde está o erro sem corrigi-lo; (4) ao final de cada parte, me sabatinar com 3 perguntas de entrevista sobre o que implementei."

**Como dirigir:** use o tutor em três momentos — antes (explique seu plano em português e peça furos), durante (cole o erro e peça hipóteses, não patches) e depois (peça a sabatina). Se perceber que a IA escreveu código por você, registre no DECISIONS.md e refaça o trecho.

**O que verificar:** você deve sair da sessão sabendo responder, sem consultar nada: por que gradientes acumulam com `+=`? Por que a máscara usa `-inf` antes do softmax? Por que a loss inicial é −ln(1/V)?

**Entregável:** o arquivo `SESSAO.md` no repositório do mini-projeto com: o contrato usado, 2–3 trechos da sessão em que uma pergunta do tutor destravou você, e as respostas da sabatina final.

## 🚀 Mini-projeto

**Enunciado:** treine um **nanoGPT do zero, com suas mãos, num corpus pequeno em português** (ex.: um livro do Machado de Assis do [Project Gutenberg](https://www.gutenberg.org), ~300–600 KB de texto puro) e escreva um **relatório de treino**: o que você aprendeu vendo a loss descer — com amostras de texto geradas em 4 momentos do treino provando o que o modelo sabia em cada fase.

**Requisitos:**

1. **SPEC.md escrita ANTES do código**: arquitetura-alvo (nº de camadas, cabeças, dimensão, tamanho de contexto), corpus escolhido, loss inicial esperada (−ln(1/V) — calcule!), meta de loss final e as 4 marcas de treino em que você vai amostrar texto.
2. Modelo de linguagem de caracteres decoder-only implementado por você (embedding + posição, N blocos [attention causal multi-head + MLP + residuais + LayerNorm], cabeça final) — na linha do "Let's build GPT".
3. Loop de treino escrito à mão (a liturgia da seção 13.3) com split treino/validação e loss das duas registrada.
4. Sanity checks documentados: loss inicial ≈ −ln(1/V) verificada e teste do batch único passando antes do treino completo.
5. Relatório com curva de loss (matplotlib) e amostras de texto geradas nas 4 marcas da SPEC, cada uma com 2–3 linhas suas descrevendo o que o modelo já aprendeu (espaços? pontuação? palavras? estilo?).
6. **Testes que provam os requisitos, com números**: os asserts dos sanity checks + loss final ≤ meta da SPEC (ou a explicação honesta de por que não chegou).
7. **DECISIONS.md** com decisões e trade-offs (tamanho do modelo vs. tempo de Colab, contexto, learning rate, o que você faria com 10× mais computação) e os registros da Sessão de Direção.
8. **Defesa**: ser capaz de responder "por quê?" sobre qualquer linha do modelo — e passar na Defesa do módulo no Campus.

### 🧭 Passo a passo

Reserve ~6h (divida em 3 sessões). Cada etapa termina com um checkpoint; só avance quando ele passar. Lembre do contrato: IA só como tutor socrático.

**Etapa 1 — SPEC.md antes de qualquer código (30 min)**

1. Crie a pasta `modulo13-nanogpt` no seu repositório `academia-ia`, com `SPEC.md` preenchendo o requisito 1. Sugestão de alvo para Colab com GPU T4: 4 camadas, 4 cabeças, dimensão 128, contexto 128, batch 64 — ~1M de parâmetros, treina em minutos.
2. Baixe o corpus (ex.: Dom Casmurro em texto puro do Project Gutenberg), limpe cabeçalho/rodapé da licença e salve como `corpus.txt`.
3. Calcule na SPEC a loss inicial esperada: liste os caracteres únicos do corpus (V ≈ 90–110 com acentos) e anote −ln(1/V).

✅ **Checkpoint:** SPEC.md commitada ANTES do primeiro código do modelo; `corpus.txt` com 300 KB+ de texto limpo.

**Etapa 2 — Dados: vocabulário de caracteres e batches (40 min)**

```python
import torch
texto = open("corpus.txt", encoding="utf-8").read()
chars = sorted(set(texto))
V = len(chars)
stoi = {c: i for i, c in enumerate(chars)}
itos = {i: c for c, i in stoi.items()}
codifica = lambda s: [stoi[c] for c in s]
decodifica = lambda ids: "".join(itos[i] for i in ids)

dados = torch.tensor(codifica(texto), dtype=torch.long)
n = int(0.9 * len(dados))
treino, valid = dados[:n], dados[n:]          # split 90/10

def pega_batch(split, contexto=128, batch=64):
    d = treino if split == "treino" else valid
    ix = torch.randint(len(d) - contexto - 1, (batch,))
    x = torch.stack([d[i:i+contexto] for i in ix])
    y = torch.stack([d[i+1:i+contexto+1] for i in ix])   # y = x deslocado 1 → "próximo caractere"
    return x, y

print(f"V={V}, loss inicial esperada ≈ {-torch.log(torch.tensor(1/V)).item():.3f}")
```

✅ **Checkpoint:** `decodifica(codifica("Capitu"))` devolve `"Capitu"` e o V impresso bate com a sua SPEC.

**Etapa 3 — O modelo, bloco a bloco (1h30)**

1. Seguindo o vídeo "Let's build GPT" (pause → digite → rode), implemente: `Head` (a célula 4 do lab com projeções e máscara), `MultiHead` (N heads concatenadas + projeção), `MLP` (Linear 4×, GELU, Linear), `Bloco` (LayerNorm + residuais) e a classe `NanoGPT` juntando embedding de token + posição, os blocos e a cabeça final.
2. Rode os dois sanity checks do requisito 4: loss inicial ≈ o valor da SPEC e batch único decorado (loss < 0.5 em algumas centenas de passos).

✅ **Checkpoint:** os dois asserts passam. Se a loss inicial estiver longe de −ln(1/V), o bug clássico é o deslocamento x/y ou softmax duplicado — sabatine seu tutor com hipóteses, não peça o patch.

**Etapa 4 — Treino de verdade, com amostras nas 4 marcas (1h30)**

1. Loop de treino à mão com AdamW (`lr=3e-4`), avaliando loss de validação a cada N passos e guardando os históricos.
2. Nas 4 marcas da SPEC (ex.: passos 0, 500, 2000, final), gere e salve uma amostra de ~300 caracteres (geração autoregressiva com temperatura 0.8 — você implementou o mecanismo, use-o).

✅ **Checkpoint:** treino completo rodado; loss de validação final ≤ meta da SPEC (típico: de ~4.5 para ~1.4–1.7) e 4 amostras salvas — da sopa de letras inicial a algo que parece Machado de longe.

**Etapa 5 — Relatório: o que a loss descendo ensina (1h)**

1. Plote as curvas de treino e validação (matplotlib) e marque no gráfico as 4 marcas de amostragem.
2. Para cada amostra, escreva 2–3 linhas: o que o modelo já sabia ali? (Primeiro vêm os espaços e a frequência das letras; depois sílabas plausíveis; depois palavras reais e pontuação; o estilo vem por último.) Conecte com a seção 13.5: é a mesma pergunta do bigrama, com mais capacidade.
3. Feche o relatório respondendo: as curvas de treino e validação se separaram? Quando? O que isso diz sobre decorar vs. aprender num corpus deste tamanho?

✅ **Checkpoint:** notebook com curva + 4 amostras comentadas + conclusão; um colega leigo entenderia a história do treino só pelas amostras.

**Etapa 6 — DECISIONS.md, SESSAO.md e entrega (40 min)**

1. Escreva o `DECISIONS.md` (requisito 7) e o `SESSAO.md` da Sessão de Direção.
2. *Ambiente de execução → Reiniciar e executar tudo*: o notebook precisa rodar de ponta a ponta.
3. Publique e agende sua Defesa no Campus:

```bash
git add modulo13-nanogpt/
git commit -m "Módulo 13: nanoGPT do zero em português — treino, amostras e relatório"
git push
```

✅ **Checkpoint:** projeto no GitHub com SPEC.md, DECISIONS.md, SESSAO.md, corpus, notebook e relatório; Defesa do módulo feita no Campus.

**Regra de ouro (rodapé de critérios):** *"Você pode usar IA para escrever qualquer código. Você não pode entregar nada que não consiga explicar e defender."* — nesta trilha, por opção sua, o padrão é mais alto: aqui você também escreveu.

## 🧠 Quiz de fixação

1. No micrograd, por que os gradientes são acumulados com `+=` em vez de atribuídos com `=`?
   - A) Por performance
   - B) Porque um nó usado em vários caminhos do grafo recebe contribuição de gradiente de cada um deles
   - C) Para evitar overflow numérico
   - D) Porque o Python não permite reatribuição em closures

2. Um modelo de linguagem de caracteres com vocabulário de 65 símbolos deve começar o treino com loss próxima de:
   - A) 0
   - B) 1.0
   - C) −ln(1/65) ≈ 4.17
   - D) 65

3. O teste do batch único serve para:
   - A) Medir a velocidade da GPU
   - B) Escolher o tamanho ideal de batch
   - C) Verificar generalização
   - D) Verificar se o código consegue ao menos decorar um batch, isolando bugs de implementação

4. Na implementação da attention causal, a máscara aplica `-inf` aos scores futuros ANTES do softmax porque:
   - A) `-inf` vira probabilidade exatamente zero após o softmax
   - B) Acelera a multiplicação de matrizes
   - C) Evita NaN no backward
   - D) É uma convenção do PyTorch sem efeito matemático

5. No BPE, o que acontece a cada iteração do treinamento do tokenizador?
   - A) Uma rede neural ajusta os embeddings dos tokens
   - B) O par de tokens adjacentes mais frequente é fundido num token novo
   - C) As palavras mais raras são removidas do vocabulário
   - D) O corpus é traduzido para bytes UTF-16

6. Por que a última camada do seu nanoGPT entrega logits crus, sem softmax?
   - A) Porque softmax só se usa em regressão
   - B) Porque os logits já somam 1
   - C) Porque `nn.CrossEntropyLoss` embute o softmax — aplicá-lo no modelo seria fazê-lo duas vezes
   - D) Para economizar memória de GPU

7. As conexões residuais (`x = x + bloco(x)`) existem principalmente para:
   - A) Reduzir o número de parâmetros
   - B) Dar ao gradiente um caminho direto até as camadas iniciais, permitindo empilhar muitos blocos
   - C) Implementar a máscara causal
   - D) Normalizar as ativações

8. No treino do seu nanoGPT, a loss de treino continua caindo e a de validação começa a subir. Num corpus de 500 KB, isso indica:
   - A) Bug no forward pass
   - B) Learning rate baixo demais
   - C) O modelo começou a decorar o corpus — overfitting esperado em corpus pequeno; hora de parar ou regularizar
   - D) O tokenizador foi mal treinado

<details><summary>Ver respostas</summary>

1. **B** — a regra da cadeia soma as contribuições de todos os caminhos; sobrescrever com `=` apagaria as anteriores. É também a razão do `zero_grad()` entre passos.
2. **C** — chute uniforme entre V opções dá cross-entropy −ln(1/V); é o sanity check nº 1 de qualquer treino.
3. **D** — se a rede não decora um batch, o problema é código (dados, loss, otimização), não capacidade.
4. **A** — softmax de `-inf` é 0: o token futuro recebe peso nulo na mistura, garantindo causalidade com elegância.
5. **B** — BPE é só isso repetido: contar pares, fundir o mais frequente, registrar a regra. Tokenizar = aplicar as regras na ordem.
6. **C** — softmax duplicado espreme as probabilidades duas vezes e distorce os gradientes; é bug silencioso clássico.
7. **B** — a "avenida" residual evita que o gradiente se dilua atravessando dezenas de blocos.
8. **C** — com poucos dados o modelo eventualmente decora; identificar o ponto da separação das curvas é parte do relatório do projeto.

</details>

## 🃏 Flashcards

| Frente | Verso |
|--------|-------|
| Regra da soma no backprop | O gradiente passa inteiro para os dois operandos |
| Regra do produto no backprop | Cada operando recebe o gradiente vezes o OUTRO operando |
| Por que `zero_grad()`? | Gradientes acumulam com `+=` por design (nós reutilizados); é preciso zerar entre passos |
| Loss inicial esperada (V classes) | −ln(1/V) — o sanity check nº 1 do treino |
| Teste do batch único | Treinar em 1 batch até decorar; se não decorar, o bug é seu código |
| Liturgia do loop de treino | zero_grad → forward → loss → backward → step |
| BPE em uma frase | Fundir iterativamente o par de tokens adjacentes mais frequente até fechar o vocabulário |
| Máscara causal na prática | Triângulo de `-inf` nos scores antes do softmax → peso zero para o futuro |
| Divisão por √d na attention | Evita que scores grandes saturem o softmax quando a dimensão cresce |
| Conexão residual | `x = x + bloco(x)` — avenida direta para o gradiente; viabiliza redes fundas |

## ☑️ Checklist de conclusão

- [ ] Assisti à série Zero to Hero completa: micrograd, makemore (1–2), Let's build GPT e o tokenizer
- [ ] Digitei e rodei o lab inteiro: minha classe `Value` bate com o autograd do PyTorch no mesmo exemplo
- [ ] Fiz os 4 experimentos obrigatórios do lab e sei explicar cada resultado
- [ ] Conduzi a Sessão de Direção com a IA como tutor socrático e registrei o SESSAO.md
- [ ] SPEC.md do nanoGPT escrita ANTES do código, com loss inicial calculada e meta de loss final
- [ ] Sanity checks passaram: loss inicial ≈ −ln(1/V) e batch único decorado
- [ ] Relatório entregue: curva de loss + 4 amostras comentadas mostrando o que o modelo aprendeu em cada fase
- [ ] DECISIONS.md registra os trade-offs (tamanho do modelo, contexto, lr, tempo de Colab)
- [ ] Projeto no GitHub (commit + push) e Defesa do módulo aprovada no Campus
- [ ] Acertei pelo menos 6 de 8 no quiz
- [ ] 🔬 Condecoração "Por Dentro da Máquina" desbloqueada no Campus

**🆘 Se travar:** trabalhar com seu assistente de IA É o método — mas nesta trilha ele é tutor, não executor: cole o erro e o SEU código, peça hipóteses e perguntas-guia, e escreva a correção você mesmo (é exatamente o travamento que forma a intuição que você veio buscar aqui). Os tropeços clássicos: shape mismatch nas projeções da attention → imprima `q.shape/k.shape/v.shape` e confira a cadeia; loss inicial errada → deslocamento x/y ou softmax duplicado; NaN → learning rate 10× menor. Travou de verdade (30+ min sem entender nem com o tutor)? Anote a dúvida no seu DECISIONS.md e leve para a comunidade.
