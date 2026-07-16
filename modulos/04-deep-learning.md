# Módulo 4 — Deep Learning na Prática

> 🏛️ Período 2 · ⏱️ Carga estimada: 16h · 📋 Pré-requisitos: Módulo 3 (Fundamentos de Machine Learning)

## 🎯 Objetivos

- Ao final, você será capaz de explicar o que um neurônio artificial computa e por que funções de ativação não lineares são indispensáveis.
- Ao final, você será capaz de executar um forward pass à mão, com números reais, e interpretar o valor de uma loss function (MSE e cross-entropy).
- Ao final, você será capaz de explicar backpropagation pela intuição da regra da cadeia e o papel dos otimizadores (SGD, Adam) e do learning rate.
- Ao final, você será capaz de treinar uma rede neural em PyTorch com loop de treino escrito à mão, rodando em GPU no Colab.
- Ao final, você será capaz de diagnosticar problemas de treino (loss que não desce, overfitting) usando técnicas como o teste do batch único e regularização.

## 🗺️ Por que isso importa

Todo modelo que você vai usar como engenheiro de IA — do classificador de churn ao LLM de trilhões de parâmetros — é, por baixo, a mesma máquina: camadas de neurônios artificiais treinadas por backpropagation. Empresas contratam gente que sabe *usar* essas ferramentas, mas pagam melhor quem sabe *o que está acontecendo por dentro* quando o treino quebra. E ele quebra: loss que vira NaN, modelo que decora o dataset, GPU que estoura memória. Quem só conhece a API do framework fica travado; quem entende o mecanismo resolve em minutos.

Na prática do dia a dia, este módulo é o que separa "rodei o tutorial" de "sou capaz de treinar e depurar um modelo de verdade". Mesmo que sua carreira siga para LLMs e você quase nunca treine redes do zero (cenário comum em 2026), os conceitos daqui — gradiente, learning rate, overfitting, batch — aparecem em fine-tuning, em avaliação de modelos e em toda conversa técnica séria. É vocabulário obrigatório da profissão.

## 📚 Aulas

| # | Aula | Tipo | Recurso | Duração estimada |
|---|------|------|---------|------------------|
| 1 | Redes neurais visualmente (série completa) | 🎥 vídeo | [3Blue1Brown — Neural Networks](https://www.3blue1brown.com/topics/neural-networks) | 1h30 |
| 2 | Brincando com uma rede no navegador | 💻 lab | [TensorFlow Playground](https://playground.tensorflow.org) | 0h30 |
| 3 | Micrograd: backpropagation soletrado, do zero | 🎥 vídeo | [Karpathy — Neural Networks: Zero to Hero](https://karpathy.ai/zero-to-hero.html) | 2h30 |
| 4 | PyTorch básico: tensores, autograd, nn.Module | 📖 leitura | [PyTorch Tutorials — Learn the Basics](https://pytorch.org/tutorials/) | 2h00 |
| 5 | Deep learning na prática, abordagem top-down | 🎥 vídeo | [fast.ai — Practical Deep Learning for Coders (lição 1)](https://course.fast.ai) | 1h30 |
| 6 | Panorama moderno de deep learning | 🎥 vídeo | [MIT 6.S191 — Intro to Deep Learning](http://introtodeeplearning.com) | 1h00 |
| 7 | Conteúdo essencial deste módulo | 📖 leitura | Seção 🧠 abaixo | 2h00 |
| 8 | Lab guiado: MNIST em PyTorch com loop à mão | 💻 lab | Seção 💻 abaixo | 3h00 |

## 🧠 Conteúdo essencial

### 4.1 O neurônio artificial: uma média ponderada com opinião

Um neurônio artificial faz três coisas: multiplica cada entrada por um peso, soma tudo com um viés (*bias*) e passa o resultado por uma função de ativação:

```
z = w1·x1 + w2·x2 + ... + wn·xn + b
saída = ativação(z)
```

Analogia: imagine um comitê decidindo se aprova um empréstimo. Cada membro (entrada) dá uma opinião, mas o presidente (o neurônio) dá pesos diferentes a cada um — confia mais no analista de crédito (peso alto) do que no estagiário (peso baixo) — e ainda tem um humor de base (o bias). Os **pesos são o que a rede aprende**: treinar uma rede é só ajustar milhões desses numerozinhos.

Exemplo numérico: entradas `x = [2, 3]`, pesos `w = [0.5, -1.0]`, bias `b = 1`:

```
z = 0.5·2 + (-1.0)·3 + 1 = 1 - 3 + 1 = -1
ReLU(-1) = 0   → o neurônio "não dispara"
```

### 4.2 Funções de ativação: o ingrediente não linear

Se você empilhar camadas lineares sem ativação, o resultado continua sendo... uma função linear. Dez camadas viram uma só. A ativação quebra essa linearidade e é o que permite a redes aprenderem fronteiras curvas, hierarquias de padrões, qualquer coisa interessante.

As que você precisa conhecer:

- **ReLU** — `max(0, z)`. O padrão em quase tudo. Barata, funciona.
- **Sigmoid** — espreme z para (0, 1). Boa para probabilidade na saída, ruim em camadas internas (satura, gradiente some).
- **Tanh** — espreme para (-1, 1). Centrada em zero; aparece em redes recorrentes.
- **Softmax** — transforma um vetor de scores em uma distribuição de probabilidade (tudo soma 1). É a saída padrão de classificadores multi-classe.

Teste você mesmo no [TensorFlow Playground](https://playground.tensorflow.org): troque a ativação de ReLU para Linear no dataset em espiral e veja a rede fracassar.

### 4.3 Forward pass com números de verdade

Vamos passar uma entrada por uma rede mínima: 2 entradas → 2 neurônios escondidos (ReLU) → 1 saída (sigmoid).

```
Entrada: x = [1, 2]

Camada escondida:
  h1: z = 1·1 + 2·(-0.5) + 0.5 = 0.5   → ReLU(0.5) = 0.5
  h2: z = 1·(-1) + 2·1 + 0    = 1.0    → ReLU(1.0) = 1.0

Saída:
  z = 0.5·2 + 1.0·(-1) + 0.5 = 0.0     → sigmoid(0.0) = 0.5
```

O modelo previu 0.5 — "não sei, 50%". Todo forward pass, de qualquer rede, incluindo um GPT, é essa mesma mecânica repetida bilhões de vezes: multiplicar, somar, ativar.

### 4.4 Loss functions: medindo o quão errado o modelo está

A loss é um número único que resume o erro do modelo. Treinar = minimizar a loss.

- **MSE (erro quadrático médio)** — para regressão. Se o alvo era 10 e o modelo disse 7, o erro é (10−7)² = 9. Elevar ao quadrado pune erros grandes desproporcionalmente.
- **Cross-entropy** — para classificação. Mede o quanto a distribuição prevista diverge da verdadeira. Se a classe correta recebeu probabilidade 0.9, a loss é −ln(0.9) ≈ 0.105 (baixa, ótimo). Se recebeu 0.1, a loss é −ln(0.1) ≈ 2.303 (alta, castigo). Note a assimetria: estar confiantemente errado custa caro.

Regra prática: regressão → MSE (`nn.MSELoss`); classificação → cross-entropy (`nn.CrossEntropyLoss`, que já embute o softmax no PyTorch — não aplique softmax duas vezes, é um bug clássico).

### 4.5 Backpropagation: a regra da cadeia em ação

Pergunta central do treino: "se eu mexer um tiquinho neste peso, a loss sobe ou desce, e quanto?". A resposta é a **derivada parcial da loss em relação ao peso** — e a backpropagation calcula isso para todos os pesos de uma vez, usando a regra da cadeia do cálculo.

Intuição com uma corrente: se `loss = f(g(h(w)))`, então o efeito de `w` na loss é o produto dos efeitos locais: `dloss/dw = f'·g'·h'`. A rede é uma corrente gigante dessas; a backprop percorre o grafo de trás para frente multiplicando derivadas locais.

Exemplo mínimo: `z = w·x + b`, `loss = (z − alvo)²`, com `x = 2`, `w = 3`, `b = 0`, `alvo = 10`:

```
z = 6;  loss = (6-10)² = 16
dloss/dz = 2·(6-10) = -8
dz/dw = x = 2
dloss/dw = -8 · 2 = -16   → aumentar w diminui a loss; o gradiente aponta o caminho
```

A melhor explicação já feita disso é o vídeo do **micrograd** de Andrej Karpathy ([karpathy.ai/zero-to-hero.html](https://karpathy.ai/zero-to-hero.html)): ele constrói um motor de autograd inteiro em ~100 linhas de Python, e você nunca mais vê `loss.backward()` como mágica.

### 4.6 Otimizadores e learning rate

O gradiente diz a direção; o **otimizador** decide o passo.

- **SGD (gradiente descendente estocástico)**: `w = w − lr · gradiente`, calculado em mini-batches (daí "estocástico"). Simples e ainda usado, geralmente com *momentum* (uma inércia que suaviza o zigue-zague).
- **Adam**: adapta o passo por parâmetro usando médias móveis do gradiente e do gradiente ao quadrado. É o "modo automático": funciona bem sem muito ajuste e é o default sensato em 2026 (`torch.optim.AdamW`).

O **learning rate (lr)** é o hiperparâmetro mais importante do treino:

| lr | Sintoma |
|----|---------|
| Muito alto | Loss oscila ou explode (NaN) |
| Muito baixo | Loss desce em câmera lenta, treino eterno |
| Bom | Loss cai rápido e estabiliza |

Ponto de partida típico com Adam: `1e-3`. Se divergir, divida por 10.

### 4.7 Regularização: impedindo o modelo de decorar

**Overfitting** = loss de treino baixa, loss de validação alta: o modelo decorou em vez de aprender. As três defesas clássicas:

- **Dropout** — durante o treino, desliga aleatoriamente uma fração dos neurônios (ex.: `nn.Dropout(0.5)`). Força a rede a não depender de nenhum neurônio específico. Na inferência, desliga-se o dropout (`model.eval()` cuida disso).
- **Weight decay** — penaliza pesos grandes, empurrando o modelo para soluções mais simples. No PyTorch: `AdamW(params, weight_decay=0.01)`.
- **Early stopping** — monitore a loss de validação e pare (ou guarde o melhor checkpoint) quando ela parar de melhorar. Grátis e eficaz.

### 4.8 PyTorch essencial, GPUs, CNNs e debugging de treino

O PyTorch se resume a quatro ideias: **tensores** (arrays com suporte a GPU), **autograd** (cada operação registra como calcular seu gradiente), **`nn.Module`** (a classe que agrupa camadas e pesos) e o **loop de treino** — que você escreve à mão e sempre tem a mesma liturgia:

```python
for x, y in dataloader:
    optimizer.zero_grad()   # 1. zera gradientes acumulados
    pred = model(x)         # 2. forward pass
    loss = criterion(pred, y)  # 3. calcula a loss
    loss.backward()         # 4. backpropagation
    optimizer.step()        # 5. atualiza os pesos
```

Esquecer o `zero_grad()` é o bug de iniciante mais comum: os gradientes se acumulam entre batches e o treino degringola.

**GPU**: `device = "cuda" if torch.cuda.is_available() else "cpu"`, depois `model.to(device)` e `x.to(device)` para cada batch. No Colab: Ambiente de execução → Alterar tipo → GPU (T4 é grátis).

**CNNs em um parágrafo**: para imagens, camadas convolucionais (`nn.Conv2d`) deslizam filtros pequenos pela imagem, detectando padrões locais (bordas → texturas → partes → objetos) com muito menos parâmetros que camadas densas. Você não precisa dominar CNNs para trabalhar com LLMs, mas precisa saber que existem e por quê.

**Debugging de treino — checklist do engenheiro:**

1. **Loss não desce?** Confira: learning rate (tente 10× menor e 10× maior), `zero_grad()` presente, labels alinhadas com as previsões, dados normalizados.
2. **Sanity check do batch único**: pegue UM batch e treine nele centenas de passos. Uma rede saudável tem que decorar um batch (loss → ~0). Se nem isso acontece, o bug está no código, não no modelo.
3. **Loss inicial faz sentido?** Classificação com 10 classes deve começar perto de −ln(1/10) ≈ 2.30. Muito diferente disso = bug na inicialização ou na loss.
4. **Overfit crescente?** Loss de treino cai, validação sobe → adicione dropout/weight decay, ou pare mais cedo, ou consiga mais dados.

## 💻 Lab guiado

**Objetivo:** treinar um classificador de dígitos MNIST em PyTorch, com loop de treino escrito à mão (sem `Trainer` pronto), na GPU do Colab. Cole cada bloco em uma célula.

```python
# ── 1. Setup ────────────────────────────────────────────────
# No Colab: Ambiente de execução > Alterar tipo > GPU (T4)
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Treinando em: {device}")

# ── 2. Dados: MNIST (60k dígitos 28x28 em tons de cinza) ───
transform = transforms.Compose([
    transforms.ToTensor(),                      # imagem -> tensor [0,1]
    transforms.Normalize((0.1307,), (0.3081,)), # média/desvio do MNIST
])
train_ds = datasets.MNIST("data", train=True, download=True, transform=transform)
test_ds = datasets.MNIST("data", train=False, download=True, transform=transform)
train_dl = DataLoader(train_ds, batch_size=128, shuffle=True)
test_dl = DataLoader(test_ds, batch_size=256)

# ── 3. Modelo: MLP simples com dropout ──────────────────────
class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Flatten(),          # 28x28 -> 784
            nn.Linear(784, 256),
            nn.ReLU(),
            nn.Dropout(0.2),       # regularização
            nn.Linear(256, 10),    # 10 classes; SEM softmax aqui
        )
    def forward(self, x):
        return self.net(x)

model = MLP().to(device)
criterion = nn.CrossEntropyLoss()   # embute o softmax
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.01)

# ── 4. Sanity check: overfit em UM batch ────────────────────
xb, yb = next(iter(train_dl))
xb, yb = xb.to(device), yb.to(device)
for step in range(200):
    optimizer.zero_grad()
    loss = criterion(model(xb), yb)
    loss.backward()
    optimizer.step()
print(f"Loss no batch único após 200 passos: {loss.item():.4f}")
assert loss.item() < 0.1, "A rede deveria decorar 1 batch! Há um bug."

# ── 5. Reinicia o modelo e treina de verdade ────────────────
model = MLP().to(device)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.01)

def avalia(model, dl):
    model.eval()                      # desliga o dropout
    acertos, total = 0, 0
    with torch.no_grad():             # sem gradientes: mais rápido
        for x, y in dl:
            x, y = x.to(device), y.to(device)
            acertos += (model(x).argmax(dim=1) == y).sum().item()
            total += y.size(0)
    model.train()
    return acertos / total

for epoca in range(5):
    soma_loss = 0.0
    for x, y in train_dl:
        x, y = x.to(device), y.to(device)
        optimizer.zero_grad()          # 1. zera gradientes
        pred = model(x)                # 2. forward
        loss = criterion(pred, y)      # 3. loss
        loss.backward()                # 4. backprop
        optimizer.step()               # 5. atualiza pesos
        soma_loss += loss.item()
    acc = avalia(model, test_dl)
    print(f"Época {epoca+1}: loss média {soma_loss/len(train_dl):.4f} | acurácia teste {acc:.2%}")

# Esperado: ~97-98% de acurácia em 5 épocas.
```

**Experimentos obrigatórios depois de rodar:** (a) mude `lr` para `1.0` e observe a loss explodir; (b) mude para `1e-6` e veja o treino se arrastar; (c) remova o `Dropout` e compare loss de treino vs. teste; (d) remova o `optimizer.zero_grad()` e explique o que aconteceu.

## 🚀 Mini-projeto

**Enunciado:** treine um classificador para o **Fashion-MNIST** (mesmo formato do MNIST, mas com roupas — mais difícil), escrevendo você mesmo todo o pipeline: dados, modelo, loop de treino à mão, avaliação e curvas de aprendizado.

**Requisitos:**

1. Usar `datasets.FashionMNIST` (troca de uma linha em relação ao lab).
2. Loop de treino escrito à mão (proibido `Trainer`/Lightning).
3. Separar 10% do treino como conjunto de validação e implementar early stopping (guardar o melhor modelo).
4. Plotar (matplotlib) as curvas de loss de treino e de validação por época.
5. Testar pelo menos 2 arquiteturas (ex.: MLP raso vs. fundo, com/sem dropout) e comparar em tabela.
6. Reportar a acurácia final no conjunto de teste.

**Critérios de aceite:**

- [ ] Acurácia de teste ≥ 88%.
- [ ] Sanity check do batch único incluído e passando antes do treino completo.
- [ ] Curvas de treino/validação plotadas e comentadas (há overfitting? onde?).
- [ ] Early stopping funcionando (o treino para ou restaura o melhor checkpoint).
- [ ] Tabela comparando as arquiteturas testadas.
- [ ] Código roda de ponta a ponta no Colab sem edição manual.

**Dicas:** Fashion-MNIST satura por volta de 89-91% com MLP; se quiser passar disso, experimente uma CNN pequena (`Conv2d → ReLU → MaxPool` duas vezes e uma `Linear` no final). Normalização dos dados importa. Se a validação oscilar muito, diminua o learning rate.

## ✅ Quiz

1. Por que funções de ativação não lineares são necessárias?
   - A) Para acelerar o treino na GPU
   - B) Porque sem elas, várias camadas equivalem a uma única transformação linear
   - C) Para evitar overflow numérico
   - D) Para reduzir o número de parâmetros

2. Um neurônio recebe x=[1, 2], pesos w=[2, -1] e bias b=1. Qual é a saída após ReLU?
   - A) 0
   - B) 1
   - C) 2
   - D) 3

3. Qual loss é apropriada para classificação multi-classe?
   - A) MSE
   - B) MAE
   - C) Cross-entropy
   - D) Hinge loss em regressão

4. O que a backpropagation calcula?
   - A) A saída da rede para cada entrada
   - B) O gradiente da loss em relação a cada peso, via regra da cadeia
   - C) O learning rate ideal
   - D) A acurácia no conjunto de validação

5. Loss de treino caindo e loss de validação subindo indica:
   - A) Underfitting
   - B) Learning rate alto demais
   - C) Overfitting
   - D) Bug no forward pass

6. Qual é a função do `optimizer.zero_grad()` no loop de treino?
   - A) Zerar os pesos do modelo
   - B) Impedir que gradientes de batches anteriores se acumulem
   - C) Resetar o learning rate
   - D) Desligar o dropout

7. Seu treino com 10 classes começa com loss ≈ 2.3. Isso indica:
   - A) Um bug grave
   - B) Comportamento esperado: ≈ −ln(1/10) para chute uniforme
   - C) Learning rate baixo demais
   - D) Que o modelo já convergiu

8. O "teste do batch único" serve para:
   - A) Medir a velocidade da GPU
   - B) Verificar se o código consegue ao menos decorar um batch, isolando bugs de implementação
   - C) Escolher o tamanho ideal do batch
   - D) Avaliar generalização

<details><summary>Ver respostas</summary>

1. **B** — Composição de funções lineares é linear; a ativação é o que dá poder expressivo à rede.
2. **B** — z = 2·1 + (−1)·2 + 1 = 1; ReLU(1) = 1.
3. **C** — Cross-entropy compara a distribuição prevista (softmax) com a classe verdadeira e pune confiança errada.
4. **B** — Backprop propaga derivadas do fim para o começo do grafo, dando ∂loss/∂w para todos os pesos em uma passada.
5. **C** — O modelo está decorando o treino e perdendo generalização; hora de regularizar ou parar cedo.
6. **B** — O PyTorch acumula gradientes por padrão; sem zerar, cada passo usa uma mistura de gradientes velhos e novos.
7. **B** — Com 10 classes equiprováveis, a cross-entropy inicial esperada é −ln(0.1) ≈ 2.30. É um ótimo sanity check.
8. **B** — Se a rede não consegue decorar um único batch, o problema é código (dados, loss, otimização), não capacidade do modelo.

</details>

## 🃏 Flashcards

| Frente | Verso |
|--------|-------|
| O que um neurônio artificial computa? | Soma ponderada das entradas + bias, passada por uma função de ativação |
| Por que ativações não lineares? | Sem elas, N camadas colapsam em uma única função linear |
| ReLU | max(0, z) — a ativação padrão das camadas internas |
| Cross-entropy com p(correta)=0.9 | −ln(0.9) ≈ 0.105 — quanto maior a confiança certa, menor a loss |
| Backpropagation | Cálculo dos gradientes de todos os pesos via regra da cadeia, de trás para frente |
| Learning rate alto demais | Loss oscila ou explode (NaN) |
| Adam vs SGD | Adam adapta o passo por parâmetro; é o default prático (AdamW) |
| Dropout | Desliga neurônios aleatórios no treino para evitar dependência excessiva; desligado em eval |
| Early stopping | Parar o treino (ou restaurar checkpoint) quando a loss de validação para de melhorar |
| Teste do batch único | Treinar em 1 batch até decorar; se não decorar, o bug está no código |

## ☑️ Checklist de conclusão

- [ ] Assisti à série do 3Blue1Brown e ao vídeo do micrograd (Karpathy)
- [ ] Consigo fazer um forward pass à mão em uma rede 2-2-1
- [ ] Sei explicar backpropagation para um colega usando a regra da cadeia
- [ ] Rodei o lab do MNIST no Colab com GPU e obtive ≥ 97% de acurácia
- [ ] Fiz os 4 experimentos de learning rate / dropout / zero_grad do lab
- [ ] Entreguei o mini-projeto Fashion-MNIST com todos os critérios de aceite
- [ ] Acertei pelo menos 6 de 8 no quiz
