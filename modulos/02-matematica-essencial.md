# Módulo 2 — Matemática Essencial (abordagem visual)

> 🏛️ Período 1 · ⏱️ Carga estimada: 10h · 📋 Pré-requisitos: Módulo 1 (Python e NumPy)

## 🎯 Objetivos

- Ao final, você será capaz de interpretar vetores e matrizes geometricamente e operar com eles em NumPy.
- Ao final, você será capaz de explicar o produto escalar como medida de semelhança e conectá-lo a embeddings.
- Ao final, você será capaz de entender derivada como sensibilidade e executar a descida do gradiente à mão, passo a passo.
- Ao final, você será capaz de raciocinar com probabilidade: distribuições, esperança e o teorema de Bayes de forma intuitiva.
- Ao final, você será capaz de explicar por que a softmax transforma números quaisquer numa distribuição de probabilidade.

## 🗺️ Por que isso importa

Você não precisa de um mestrado em matemática para ser engenheiro de IA — mas precisa de intuição sólida sobre um punhado de ideias, porque *tudo* na área é construído sobre elas. Embeddings são vetores; "semelhança semântica" é produto escalar; treinar um modelo é descida do gradiente; a saída de um classificador é uma softmax; a temperatura de um LLM mexe numa distribuição de probabilidade. Quem não tem essa base usa as ferramentas como caixas-pretas e trava no primeiro comportamento inesperado. Quem tem, lê um erro de shape, um loss que não desce ou uma probabilidade estranha e sabe *onde* olhar.

No dia a dia das empresas, essa intuição aparece em decisões concretas: escolher a métrica de similaridade do seu sistema de busca, entender por que o fine-tuning divergiu com learning rate alto, explicar para o time de produto o que significa "o modelo está 90% confiante". Este módulo é deliberadamente visual e numérico — cada conceito vem com um exemplo que você calcula à mão e depois confere em NumPy. Matemática que você calculou uma vez com os próprios dedos nunca mais vira caixa-preta.

## 📚 Aulas

| # | Aula | Tipo | Recurso | Duração estimada |
|---|------|------|---------|------------------|
| 1 | Essence of Linear Algebra (série visual do 3Blue1Brown) — caps. 1 a 4 | 🎥 vídeo | [3blue1brown.com/topics/linear-algebra](https://www.3blue1brown.com/topics/linear-algebra) | 1h30 |
| 2 | Essence of Calculus (3Blue1Brown) — caps. 1 a 3 (derivadas) | 🎥 vídeo | [3blue1brown.com/topics/calculus](https://www.3blue1brown.com/topics/calculus) | 1h |
| 3 | Gradient Descent e estatística básica no canal StatQuest | 🎥 vídeo | [youtube.com/@statquest](https://www.youtube.com/@statquest) | 1h30 |
| 4 | Reforço de álgebra linear e probabilidade em pt-BR (Khan Academy) | 💻 lab | [pt.khanacademy.org](https://pt.khanacademy.org) | 2h |
| 5 | Mathematics for Machine Learning (livro grátis) — cap. 2, seções iniciais | 📖 leitura | [mml-book.github.io](https://mml-book.github.io) | 1h30 |
| 6 | Lab guiado: descida do gradiente em NumPy puro | 💻 lab | este módulo (abaixo) | 1h30 |

## 🧠 Conteúdo essencial

### 1. Vetores: setas e listas ao mesmo tempo

Um vetor é duas coisas simultaneamente: uma **lista de números** (`[2, 3]`) e uma **seta no espaço** (do ponto (0,0) ao ponto (2,3)). Essa dupla identidade é o truque central da IA: qualquer coisa que você consiga descrever com números vira um ponto no espaço — e aí geometria vira semântica.

Um cliente pode ser o vetor `[idade, renda, compras_no_mes]`. Uma palavra, num LLM, é um vetor de centenas de dimensões chamado **embedding** (representação numérica densa que captura significado). Não conseguimos *ver* 768 dimensões, mas toda a intuição de 2D — distância, ângulo, direção — continua funcionando.

```python
import numpy as np
cliente_a = np.array([25, 4000, 3])
cliente_b = np.array([27, 4300, 4])   # próximos no espaço = perfis parecidos
```

### 2. Produto escalar: a régua de semelhança

O **produto escalar** (dot product) multiplica coordenada a coordenada e soma tudo:

```text
a · b = [1, 2, 3] · [4, 5, 6] = 1·4 + 2·5 + 3·6 = 4 + 10 + 18 = 32
```

A leitura geométrica é o que importa: `a · b = |a| |b| cos(θ)`, onde θ é o ângulo entre as setas. Ou seja:

- Setas na **mesma direção** → cos(θ) ≈ 1 → produto escalar **grande e positivo**;
- Setas **perpendiculares** → cos(θ) = 0 → produto escalar **zero** (nada a ver uma com a outra);
- Setas **opostas** → produto escalar **negativo**.

É exatamente assim que a busca semântica funciona: a pergunta do usuário e cada documento viram embeddings, e o documento com maior **similaridade de cosseno** (produto escalar dos vetores normalizados) vence:

```python
def similaridade_cosseno(a: np.ndarray, b: np.ndarray) -> float:
    """Retorna a semelhança entre -1 (opostos) e 1 (idênticos)."""
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))

rei    = np.array([0.9, 0.8, 0.1])   # embeddings de brinquedo
rainha = np.array([0.85, 0.75, 0.2])
banana = np.array([0.1, 0.2, 0.95])
print(similaridade_cosseno(rei, rainha))  # ~0.99 -> muito parecidos
print(similaridade_cosseno(rei, banana))  # ~0.33 -> pouco parecidos
```

Guarde a frase: **produto escalar é a régua de semelhança da IA.**

### 3. Matrizes: máquinas de transformar vetores

Uma matriz é uma grade de números — e, geometricamente, uma **transformação do espaço**: rotação, esticada, projeção. Multiplicar matriz por vetor é aplicar a transformação; multiplicar matriz por matriz é **compor** transformações (aplicar uma depois da outra).

A conta: o elemento (i, j) do produto é o produto escalar da **linha i** da primeira com a **coluna j** da segunda. Exemplo 2×2 à mão:

```text
A = [1 2]    B = [5 6]    AB = [1·5+2·7  1·6+2·8]   [19 22]
    [3 4]        [7 8]         [3·5+4·7  3·6+4·8] = [43 50]
```

Regra de compatibilidade: `(m, n) @ (n, p) -> (m, p)` — o "n do meio" precisa bater. Uma rede neural é, essencialmente, uma pilha de multiplicações de matrizes intercaladas com funções não-lineares; quando você vê "o modelo tem 7B de parâmetros", está contando os números dentro dessas matrizes.

```python
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
print(A @ B)            # [[19 22] [43 50]] — confere com a conta à mão
```

### 4. Derivada: o medidor de sensibilidade

Esqueça a definição formal por um instante. A derivada responde uma pergunta prática: **"se eu mexer um tiquinho na entrada, quanto mexe a saída?"** É um medidor de sensibilidade.

Para `f(w) = w²`, a derivada é `f'(w) = 2w`. Em `w = 3`, `f'(3) = 6`: aumentar `w` em 0,01 aumenta `f` em aproximadamente 0,06. O **sinal** diz a direção (positivo = subindo), a **magnitude** diz a intensidade.

Quando a função tem várias entradas (um modelo real tem bilhões), calculamos a sensibilidade em relação a cada uma e empacotamos tudo num vetor: o **gradiente**. O gradiente aponta na direção de **maior subida** da função — logo, o negativo dele aponta para a maior descida. Essa frase é o coração de todo o deep learning.

### 5. Descida do gradiente: o algoritmo que treina tudo

Treinar um modelo = encontrar os parâmetros que **minimizam o erro** (a função de perda, ou *loss*). A receita, chamada **descida do gradiente** (gradient descent):

1. Comece com parâmetros quaisquer.
2. Calcule o gradiente da perda (para onde o erro *sobe*).
3. Dê um passinho na direção **contrária**: `w_novo = w - lr · gradiente`, onde `lr` é o **learning rate** (tamanho do passo).
4. Repita até o erro parar de cair.

Exemplo numérico completo — minimizar `f(w) = (w - 3)²` (mínimo óbvio em `w = 3`), com `f'(w) = 2(w - 3)`, começando em `w = 0` e `lr = 0.1`:

| Passo | w atual | gradiente `2(w-3)` | w novo `w - 0.1·grad` |
|-------|---------|--------------------|------------------------|
| 1 | 0,000 | −6,000 | 0,600 |
| 2 | 0,600 | −4,800 | 1,080 |
| 3 | 1,080 | −3,840 | 1,464 |
| 4 | 1,464 | −3,072 | 1,771 |
| 5 | 1,771 | −2,458 | 2,017 |

Repare no comportamento: os passos vão **encurtando sozinhos** conforme se aproximam do mínimo (gradiente menor = passo menor). E o learning rate é a decisão crítica: com `lr = 0.01` a convergência demora uma eternidade; com `lr = 1.1` o `w` *explode* para longe do mínimo a cada passo. Você verá isso com os próprios olhos no lab.

### 6. Probabilidade: distribuições e esperança

Uma **distribuição de probabilidade** diz quanto de "crença" vai para cada resultado possível — e tudo tem que somar 1. Um dado honesto: 1/6 para cada face. As alturas de uma população: a curva do sino (distribuição normal), onde valores perto da média são prováveis e extremos são raros.

A **esperança** (valor esperado) é a média ponderada pelas probabilidades — "se eu repetisse isso infinitas vezes, qual seria a média?". Exemplo: um bilhete custa R$ 5 e paga R$ 100 com probabilidade 3%:

```text
E[ganho] = 0,03 · 100 + 0,97 · 0 − 5 = 3 − 5 = −R$ 2  -> no longo prazo, prejuízo
```

Em IA, a esperança está por toda parte: a perda que minimizamos é a esperança do erro sobre os dados; a resposta de um LLM é uma amostragem de uma distribuição sobre o vocabulário.

### 7. Bayes intuitivo: atualizando crenças com evidência

O teorema de Bayes responde: **"dado que vi uma evidência, quanto devo acreditar na hipótese?"** O jeito intuitivo é pensar em contagens. Doença que atinge 1% da população; teste que acerta 90% dos doentes, mas dá falso positivo em 5% dos saudáveis. Seu teste deu positivo — qual a chance de você estar doente?

Pense em 1.000 pessoas:

- Doentes: 10. Positivos entre eles: 10 × 0,90 = **9**.
- Saudáveis: 990. Falsos positivos: 990 × 0,05 = **49,5**.
- Total de positivos: 9 + 49,5 = 58,5. Doentes de verdade: 9.

`P(doente | positivo) = 9 / 58,5 ≈ 15%` — e não 90%! A intuição falha porque ignora a **taxa base** (a doença é rara, então os falsos positivos dos muitos saudáveis dominam). Essa armadilha reaparece direto em IA: um classificador "95% de acurácia" para fraude que ocorre em 1% dos casos pode ser pior que um chute — tema central do Módulo 3.

### 8. Softmax: transformando números em probabilidades

Um classificador produz **scores** brutos (logits), tipo `[2.0, 1.0, 0.1]` para as classes gato/cachorro/pato. A **softmax** os converte numa distribuição legítima: exponencia cada um (tudo fica positivo e as diferenças se acentuam) e divide pela soma (tudo soma 1):

```python
def softmax(z: np.ndarray) -> np.ndarray:
    e = np.exp(z - z.max())        # subtrair o máximo evita overflow numérico
    return e / e.sum()

print(softmax(np.array([2.0, 1.0, 0.1])))
# [0.659 0.242 0.099]  -> 66% gato, 24% cachorro, 10% pato (soma = 1)
```

Conferindo à mão: `e² ≈ 7,39`, `e¹ ≈ 2,72`, `e^0.1 ≈ 1,11`; soma ≈ 11,21; `7,39/11,21 ≈ 0,66`. É exatamente isso que um LLM faz a cada token: scores para todo o vocabulário → softmax → sorteia a próxima palavra. A famosa **temperatura** apenas divide os logits antes da softmax: temperatura alta achata a distribuição (mais criatividade), baixa a afunila (mais determinismo).

## 💻 Lab guiado

Implementar **descida do gradiente em NumPy puro** para uma regressão linear e ver a convergência. Roda no Colab ou localmente. Modelo: `y = w·x + b`; perda: erro quadrático médio (MSE).

```python
# Célula 1 — Dados sintéticos com resposta conhecida (w=2.5, b=7)
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)
x = rng.uniform(0, 10, 100)
y = 2.5 * x + 7 + rng.normal(0, 2, 100)   # reta verdadeira + ruído
plt.scatter(x, y, s=12); plt.title("Dados: y = 2.5x + 7 + ruído"); plt.show()
```

```python
# Célula 2 — Perda e gradientes (derivados da MSE analiticamente)
def perda_mse(w, b, x, y):
    """Erro quadrático médio da reta (w, b) sobre os dados."""
    return np.mean((y - (w * x + b)) ** 2)

def gradientes(w, b, x, y):
    """dMSE/dw e dMSE/db — a direção em que o erro SOBE."""
    erro = y - (w * x + b)
    dw = -2 * np.mean(erro * x)
    db = -2 * np.mean(erro)
    return dw, db
```

```python
# Célula 3 — O loop de treino (isto É treinar um modelo)
w, b, lr = 0.0, 0.0, 0.01
historico = []
for passo in range(200):
    dw, db = gradientes(w, b, x, y)
    w -= lr * dw                      # passo contra o gradiente
    b -= lr * db
    historico.append(perda_mse(w, b, x, y))

print(f"w aprendido: {w:.3f} (verdadeiro 2.5)")
print(f"b aprendido: {b:.3f} (verdadeiro 7.0)")
assert abs(w - 2.5) < 0.3, "w não convergiu — confira lr e gradientes"
```

```python
# Célula 4 — Visualizar a convergência e o ajuste
fig, eixos = plt.subplots(1, 2, figsize=(12, 4))
eixos[0].plot(historico)
eixos[0].set(title="Perda caindo a cada passo", xlabel="Passo", ylabel="MSE")
eixos[1].scatter(x, y, s=12, label="dados")
eixos[1].plot(np.sort(x), w * np.sort(x) + b, color="red", label="reta aprendida")
eixos[1].set(title=f"y = {w:.2f}x + {b:.2f}"); eixos[1].legend()
plt.tight_layout(); plt.show()
```

```python
# Célula 5 — Experimento: o efeito do learning rate
for lr_teste in [0.001, 0.01, 0.05]:
    w_t, b_t, hist = 0.0, 0.0, []
    for _ in range(200):
        dw, db = gradientes(w_t, b_t, x, y)
        w_t, b_t = w_t - lr_teste * dw, b_t - lr_teste * db
        hist.append(perda_mse(w_t, b_t, x, y))
    plt.plot(hist, label=f"lr={lr_teste}")
plt.legend(); plt.title("Learning rate: lento, bom, e no limite"); plt.show()
# Desafio: rode com lr=0.03 e lr=0.1 e explique o que acontece com a curva.
```

## 🚀 Mini-projeto

**Enunciado:** construa um notebook-relatório "Matemática da IA com meus próprios números" com três seções, cada uma calculada primeiro **à mão** (em Markdown) e depois **conferida em NumPy**.

**Requisitos:**

1. **Semelhança**: crie embeddings de brinquedo (3 a 5 dimensões) para 5 itens de um domínio seu (filmes, músicas, produtos); calcule a matriz 5×5 de similaridade de cosseno e comente os pares mais e menos parecidos.
2. **Gradiente**: refaça a tabela de descida do gradiente de `f(w) = (w−3)²` à mão para 5 passos com `lr = 0.2` e confirme os valores com um loop em NumPy.
3. **Probabilidade**: monte um cenário de Bayes do seu cotidiano (spam, exame, alarme falso) com números escolhidos por você; resolva pelo método das contagens e implemente `softmax` aplicada a 4 logits, mostrando que a saída soma 1.

### 🧭 Passo a passo

Reserve ~3h no total (pode dividir em 2 sessões). Siga na ordem — cada etapa termina com um **checkpoint**; só avance quando ele passar.

**Etapa 1 — Criar o notebook no repositório (15 min)**

No terminal, dentro do seu repositório `academia-ia` (mesmo ritual do Módulo 1; se preferir o Colab, crie o notebook lá e baixe o `.ipynb` para o repositório no final):

```bash
uv init modulo02-matematica
cd modulo02-matematica
uv add numpy jupyter
uv run jupyter lab
```

Crie um notebook `matematica.ipynb`. Na primeira célula (tipo *Markdown*, não código), escreva o título "Matemática da IA com meus próprios números" e crie as seções `## 1. Semelhança`, `## 2. Gradiente` e `## 3. Probabilidade`.

✅ **Checkpoint:** `uv run python -c "import numpy"` roda sem erro e o notebook tem as 3 seções criadas.

**Etapa 2 — Escolher os 5 itens e inventar os embeddings (20 min)**

1. Escolha um domínio que você conhece de cor: filmes, músicas, pratos, jogos.
2. Invente 3 a 4 **dimensões com significado** — cada número responde "quanto disso o item tem?", de 0 a 1. Ex. para filmes: `[ação, romance, comédia]`. Atribua os valores de cabeça, sem sofrer com precisão: o que importa é que itens parecidos ganhem vetores parecidos.
3. Registre tudo numa célula Markdown, assim:

```text
Dimensões: [ação, romance, comédia]
Matrix    = [0.9, 0.2, 0.1]    (muita ação, quase nada de romance)
John Wick = [0.95, 0.1, 0.1]
... (complete os 5)
```

✅ **Checkpoint:** 5 itens listados, todos com o mesmo número de dimensões, e você sabe dizer o que cada dimensão mede.

**Etapa 3 — Seção 1: similaridade à mão e em NumPy (40 min)**

1. Escolha o par que você **aposta** ser o mais parecido e calcule a similaridade de cosseno à mão numa célula Markdown — texto simples serve, sem precisar de fórmula bonita:

```text
Matrix · John Wick = 0.9·0.95 + 0.2·0.1 + 0.1·0.1 = 0.885
|Matrix| = raiz(0.81 + 0.04 + 0.01) ≈ 0.927   |John Wick| ≈ 0.961
similaridade = 0.885 / (0.927 · 0.961) ≈ 0.993 -> quase idênticos, como eu apostava
```

2. Na célula de código logo abaixo, monte os 5 vetores com `np.array`, copie a função `similaridade_cosseno` da seção 2 do módulo e gere a matriz 5×5 com um `for` dentro de outro.
3. Numa célula Markdown, comente o par mais e o menos parecido — e se algum resultado te surpreendeu.

✅ **Checkpoint:** a diagonal da matriz é toda 1 e o valor do seu par bate com a conta à mão (2 casas decimais).

**Etapa 4 — Seção 2: gradiente à mão e conferido em NumPy (45 min)**

1. Refaça a tabela da seção 5 do módulo, agora com `lr = 0.2`, partindo de `w = 0`, por 5 passos, numa célula Markdown. As duas primeiras linhas, por extenso:

```text
Passo 1: w = 0    gradiente = 2·(0 − 3) = −6      w novo = 0 − 0.2·(−6) = 1.2
Passo 2: w = 1.2  gradiente = 2·(1.2 − 3) = −3.6  w novo = 1.2 − 0.2·(−3.6) = 1.92
```

2. Na célula de código abaixo, confira com um loop (é o loop do lab guiado, sem os dados) e compare linha a linha com a sua tabela:

```python
w, lr = 0.0, 0.2
for passo in range(1, 6):
    grad = 2 * (w - 3)
    w = w - lr * grad
    print(f"passo {passo}: w = {w:.4f}")
```

✅ **Checkpoint:** os 5 valores impressos batem com a tabela à mão — e você percebeu que com `lr = 0.2` o `w` corre para 3 mais rápido que na tabela do texto (`lr = 0.1`).

**Etapa 5 — Seção 3: Bayes por contagens (30 min)**

1. Monte um cenário do seu cotidiano (spam, exame, alarme de carro) com 3 números escolhidos por você — taxa base, taxa de detecção e taxa de falso alarme — e resolva pelo método das 1.000 pessoas (seção 7 do módulo) numa célula Markdown:

```text
Cenário: spam. Taxa base: 20% dos e-mails são spam; o filtro pega 95% deles e marca 3% dos legítimos por engano.
De 1000 e-mails: 200 spam -> 190 marcados; 800 legítimos -> 24 marcados por engano.
P(spam | marcado) = 190 / (190 + 24) ≈ 0.89
```

2. Confira as contagens numa célula de código (aritmética simples em Python) e feche a seção com a conclusão em uma frase, citando a taxa base.

✅ **Checkpoint:** conta à mão e código dão a mesma probabilidade, e a taxa base aparece explícita na conclusão.

**Etapa 6 — Seção 3: softmax + entrega (25 min)**

1. Copie a função `softmax` da seção 8 do módulo, invente 4 logits (ex.: scores do seu filtro de spam imaginário para 4 categorias) e imprima a saída.
2. Prove que é uma distribuição: `assert np.isclose(softmax(z).sum(), 1.0)`.
3. Rode *Restart & Run All*; conserte qualquer célula que falhar. Depois: `git add . && git commit -m "Módulo 2: matemática com meus números" && git push`.

✅ **Checkpoint:** todos os critérios de aceite abaixo marcados.

**🆘 Se travar:** erro de shape na similaridade → os 5 vetores precisam ter o mesmo tamanho, confira com `.shape`; diagonal dando `0.9999999` em vez de 1 → arredondamento de ponto flutuante, compare com `np.isclose`; tabela do gradiente divergindo do loop → 90% das vezes é sinal trocado (o passo é `w − lr·grad`; com gradiente negativo, isso **soma**); travou 30+ minutos em qualquer etapa → pergunte ao seu assistente de IA colando a conta ou o erro e dizendo em qual etapa está (mas peça a *explicação*, não só a resposta — o objetivo é treinar).

**Critérios de aceite:**

- [ ] Toda conta à mão bate com o resultado NumPy (mostre os dois lados)
- [ ] Matriz de similaridade tem diagonal igual a 1 (item é idêntico a si mesmo)
- [ ] Tabela do gradiente com 5 passos corretos para `lr = 0.2`
- [ ] Cenário de Bayes com taxa base explícita e conclusão em uma frase
- [ ] `assert np.isclose(softmax(z).sum(), 1.0)` passando no notebook
- [ ] Notebook publicado no repositório `academia-ia` com *Restart & Run All* limpo

**Dicas:** no item 1, escolha dimensões interpretáveis (ex.: ação, romance, comédia) — a semelhança fica visível a olho nu; no item 2, com `lr = 0.2` o gradiente `2(w−3)` dá passos maiores que os do texto — compare os dois ritmos; se travar no Bayes, desenhe as 1.000 pessoas.

## ✅ Quiz

**1.** Um produto escalar próximo de zero entre dois embeddings normalizados indica:
A) Vetores idênticos B) Vetores sem relação (perpendiculares) C) Vetores opostos D) Erro de cálculo

**2.** Na multiplicação `(4, 3) @ (3, 2)`, o resultado tem shape:
A) `(4, 2)` B) `(3, 3)` C) `(4, 3)` D) incompatível

**3.** A derivada de uma função num ponto mede:
A) O valor máximo da função B) A sensibilidade da saída a pequenas mudanças na entrada C) A área sob a curva D) O número de raízes

**4.** Na descida do gradiente, andamos na direção **contrária** ao gradiente porque:
A) O gradiente aponta para onde a função cresce mais B) O gradiente é sempre negativo C) É mais rápido computacionalmente D) O learning rate exige isso

**5.** Com learning rate grande demais, o treino tipicamente:
A) Converge mais rápido, sempre B) Diverge ou oscila, com a perda explodindo C) Fica igual D) Converge para outro mínimo melhor

**6.** No exemplo médico (doença 1%, sensibilidade 90%, falso positivo 5%), a chance de estar doente dado um positivo é ~15% porque:
A) O teste é ruim B) A doença rara faz os falsos positivos dos saudáveis dominarem C) A sensibilidade é baixa D) Bayes só vale para amostras grandes

**7.** A softmax exponencia os logits antes de normalizar para:
A) Deixar tudo positivo e acentuar as diferenças entre scores B) Economizar memória C) Evitar números decimais D) Ordenar as classes

**8.** Se os passos da descida do gradiente encurtam sozinhos perto do mínimo, é porque:
A) O learning rate diminui automaticamente B) O gradiente fica menor perto do mínimo C) O NumPy arredonda D) A função muda de forma

<details><summary>Ver respostas</summary>

1. **B** — Produto escalar ≈ 0 significa cos(θ) ≈ 0: vetores perpendiculares, sem semelhança. Idênticos dariam ~1; opostos, ~−1.
2. **A** — `(m, n) @ (n, p) -> (m, p)`: o 3 do meio "some" e resta `(4, 2)`.
3. **B** — Derivada é o medidor de sensibilidade: quanto a saída mexe quando a entrada mexe um tiquinho.
4. **A** — O gradiente aponta para a maior *subida*; para minimizar o erro, andamos no sentido oposto.
5. **B** — Passos grandes demais pulam por cima do mínimo e a perda oscila ou explode — foi o que o experimento da célula 5 mostrou.
6. **B** — Com taxa base de 1%, os 990 saudáveis geram ~49,5 falsos positivos contra só 9 verdadeiros: a maioria dos positivos é falsa.
7. **A** — A exponencial garante valores positivos e amplia diferenças; a divisão pela soma transforma tudo numa distribuição que soma 1.
8. **B** — O passo é `lr · gradiente`; como o gradiente tende a zero no mínimo, os passos encolhem naturalmente, mesmo com lr fixo.

</details>

## 🃏 Flashcards

| Frente | Verso |
|--------|-------|
| O que é um embedding? | Vetor denso que representa um objeto (palavra, imagem, usuário) num espaço onde distância = semelhança. |
| Produto escalar (leitura geométrica) | `a·b = |a||b|cos(θ)`: mesma direção → grande; perpendicular → 0; oposta → negativo. |
| Similaridade de cosseno | Produto escalar dos vetores normalizados; vai de −1 a 1; régua da busca semântica. |
| Regra de shapes na multiplicação de matrizes | `(m,n) @ (n,p) -> (m,p)`; o n do meio precisa bater. |
| Derivada em uma frase | Sensibilidade: quanto a saída muda quando a entrada muda um tiquinho. |
| O que é o gradiente? | Vetor com as derivadas parciais; aponta para a maior subida da função. |
| Fórmula do passo do gradient descent | `w ← w − lr · gradiente`. |
| Learning rate alto demais causa... | Oscilação ou divergência: a perda explode em vez de cair. |
| Teorema de Bayes (intuição) | Atualizar a crença com a evidência, sem esquecer a taxa base (contar os casos ajuda). |
| O que a softmax faz? | Exponencia os logits e normaliza pela soma → distribuição de probabilidade que soma 1. |

## ☑️ Checklist de conclusão

- [ ] Assisti aos capítulos indicados de álgebra linear e cálculo do 3Blue1Brown
- [ ] Calculei à mão um produto escalar, uma multiplicação de matrizes 2×2 e 5 passos de gradient descent
- [ ] Sei explicar produto escalar como medida de semelhança e ligar com embeddings
- [ ] Lab do gradient descent executado, com o experimento de learning rates
- [ ] Resolvi o problema de Bayes pelo método das 1.000 pessoas sem consultar o material
- [ ] Implementei softmax e verifiquei que a saída soma 1
- [ ] Mini-projeto "com meus próprios números" publicado no repositório `academia-ia`
- [ ] Quiz respondido e flashcards agendados para revisão espaçada
