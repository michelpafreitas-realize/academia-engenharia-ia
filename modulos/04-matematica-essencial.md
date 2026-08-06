# Módulo 4 — Matemática Essencial (visual)

> 🏛️ Período 2 · ⏱️ Carga estimada: 8h · 📋 Pré-requisitos: Módulo 3 (Python & Dados para quem dirige IA)

## 🎯 Objetivos

- Ao final, você será capaz de interpretar vetores e matrizes geometricamente e operar com eles em NumPy.
- Ao final, você será capaz de explicar o produto escalar como medida de semelhança e conectá-lo a embeddings e busca semântica.
- Ao final, você será capaz de entender derivada como sensibilidade e executar a descida do gradiente à mão, passo a passo.
- Ao final, você será capaz de raciocinar com probabilidade: distribuições, esperança e o teorema de Bayes de forma intuitiva.
- Ao final, você será capaz de explicar por que a softmax transforma números quaisquer numa distribuição de probabilidade — e o que a temperatura de um LLM faz com ela.
- Ao final, você será capaz de verificar, à mão, se um cálculo que uma IA gerou para você está certo.

## 🎛️ Núcleo manual deste módulo

Três cálculos você faz **com as próprias mãos, no papel**: o produto escalar, a descida do gradiente passo a passo e a softmax — porque é calculando uma vez com os próprios dedos que a intuição se forma e esses conceitos deixam de ser caixa-preta. Todo o resto (montar notebooks, gerar variações, plotar gráficos) você dirige com IA.

## 🗺️ Por que isso importa

Você não precisa de um mestrado em matemática para dirigir IA — mas precisa de intuição sólida sobre um punhado de ideias, porque *tudo* na área é construído sobre elas. Embeddings são vetores; "semelhança semântica" é produto escalar; treinar um modelo é descida do gradiente; a temperatura de um LLM mexe numa softmax. Quem não tem essa base usa as ferramentas como caixas-pretas e — pior, na era da IA — **aprova cálculos errados sem perceber**. Quem tem, lê um erro de shape, um loss que não desce ou uma probabilidade estranha e sabe *onde* olhar. É exatamente o critério que o Período 2 existe para construir.

Este módulo é deliberadamente visual e numérico, e prepara diretamente o Módulo 6 (Como LLMs Funcionam): a atenção é feita de produtos escalares, o pós-treino é descida do gradiente, e a previsão do próximo token é uma softmax sobre o vocabulário. Se depois de terminar você quiser ir mais fundo — backprop completo, loop de treino à mão, GPT do zero — a trilha optativa "Por Dentro da Máquina" (Módulo 13) é o seu caminho; aqui, o objetivo é intuição suficiente para dirigir com julgamento.

## 📚 Aulas

| # | Aula | Tipo | Recurso | Duração estimada |
|---|------|------|---------|------------------|
| 1 | Essence of Linear Algebra (série visual do 3Blue1Brown) — caps. 1 a 4 | 🎥 vídeo | [3blue1brown.com/topics/linear-algebra](https://www.3blue1brown.com/topics/linear-algebra) | 1h30 |
| 2 | Essence of Calculus (3Blue1Brown) — caps. 1 a 3 (derivadas) | 🎥 vídeo | [3blue1brown.com/topics/calculus](https://www.3blue1brown.com/topics/calculus) | 1h |
| 3 | Gradient Descent no StatQuest (reforço visual) | 🎥 vídeo | [youtube.com/@statquest](https://www.youtube.com/@statquest) | 45min |
| 4 | Mathematics for Machine Learning (livro grátis) — cap. 2, seções iniciais | 📖 leitura | [mml-book.github.io](https://mml-book.github.io) | 1h |
| 5 | Lab guiado: descida do gradiente em NumPy puro | 💻 lab | este módulo (abaixo) | 1h15 |
| 6 | Sessão de Direção: a IA gera variações, você verifica à mão | 🎛️ sessão de direção | este módulo (abaixo) | 1h |

*(Se quiser reforço de base em pt-BR, a [Khan Academy](https://pt.khanacademy.org) segue como recurso opcional — use quando um vídeo acima não fechar.)*

## 🧠 Conteúdo essencial

### 4.1 Vetores: setas e listas ao mesmo tempo

Um vetor é duas coisas simultaneamente: uma **lista de números** (`[2, 3]`) e uma **seta no espaço** (do ponto (0,0) ao ponto (2,3)). Essa dupla identidade é o truque central da IA: qualquer coisa que você consiga descrever com números vira um ponto no espaço — e aí geometria vira semântica.

Um cliente pode ser o vetor `[idade, renda, compras_no_mes]`. Uma palavra, num LLM, é um vetor de centenas de dimensões chamado **embedding** (representação numérica densa que captura significado). Não conseguimos *ver* 768 dimensões, mas toda a intuição de 2D — distância, ângulo, direção — continua funcionando.

```python
import numpy as np
cliente_a = np.array([25, 4000, 3])
cliente_b = np.array([27, 4300, 4])   # próximos no espaço = perfis parecidos
```

### 4.2 Produto escalar: a régua de semelhança (núcleo manual)

O **produto escalar** (dot product) multiplica coordenada a coordenada e soma tudo:

```text
a · b = [1, 2, 3] · [4, 5, 6] = 1·4 + 2·5 + 3·6 = 4 + 10 + 18 = 32
```

A leitura geométrica é o que importa: `a · b = |a| |b| cos(θ)`, onde θ é o ângulo entre as setas. Ou seja:

- Setas na **mesma direção** → cos(θ) ≈ 1 → produto escalar **grande e positivo**;
- Setas **perpendiculares** → cos(θ) = 0 → produto escalar **zero** (nada a ver uma com a outra);
- Setas **opostas** → produto escalar **negativo**.

É exatamente assim que a busca semântica funciona (você vai construí-la no Módulo 7, RAG): a pergunta do usuário e cada documento viram embeddings, e o documento com maior **similaridade de cosseno** (produto escalar dos vetores normalizados) vence:

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

### 4.3 Matrizes: máquinas de transformar vetores

Uma matriz é uma grade de números — e, geometricamente, uma **transformação do espaço**: rotação, esticada, projeção. Multiplicar matriz por vetor é aplicar a transformação; multiplicar matriz por matriz é **compor** transformações.

A conta: o elemento (i, j) do produto é o produto escalar da **linha i** da primeira com a **coluna j** da segunda. Exemplo 2×2 à mão:

```text
A = [1 2]    B = [5 6]    AB = [1·5+2·7  1·6+2·8]   [19 22]
    [3 4]        [7 8]         [3·5+4·7  3·6+4·8] = [43 50]
```

Regra de compatibilidade: `(m, n) @ (n, p) -> (m, p)` — o "n do meio" precisa bater. Uma rede neural é, essencialmente, uma pilha de multiplicações de matrizes intercaladas com funções não-lineares; quando você lê "o modelo tem 7B de parâmetros", está contando os números dentro dessas matrizes. Erros de shape que a IA gera e não percebe quase sempre quebram essa regra — você vai flagrá-los de olho.

```python
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
print(A @ B)            # [[19 22] [43 50]] — confere com a conta à mão
```

### 4.4 Derivada: o medidor de sensibilidade

Esqueça a definição formal por um instante. A derivada responde uma pergunta prática: **"se eu mexer um tiquinho na entrada, quanto mexe a saída?"** É um medidor de sensibilidade.

Para `f(w) = w²`, a derivada é `f'(w) = 2w`. Em `w = 3`, `f'(3) = 6`: aumentar `w` em 0,01 aumenta `f` em aproximadamente 0,06. O **sinal** diz a direção (positivo = subindo), a **magnitude** diz a intensidade.

Quando a função tem várias entradas (um modelo real tem bilhões), calculamos a sensibilidade em relação a cada uma e empacotamos tudo num vetor: o **gradiente**. O gradiente aponta na direção de **maior subida** da função — logo, o negativo dele aponta para a maior descida. Essa frase é o coração de todo o deep learning.

### 4.5 Descida do gradiente: o algoritmo que treina tudo (núcleo manual)

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

Essa tabela é o núcleo manual mais importante do módulo: refaça-a no papel até sair sem consultar. É ela que, no Módulo 6, vai fazer "o modelo foi treinado com RLHF" deixar de ser frase mágica — e é dela que parte a trilha optativa 13 para quem quiser escrever o backprop completo à mão.

### 4.6 Probabilidade: distribuições, esperança e Bayes

Uma **distribuição de probabilidade** diz quanto de "crença" vai para cada resultado possível — e tudo tem que somar 1. A **esperança** (valor esperado) é a média ponderada pelas probabilidades. Exemplo: um bilhete custa R$ 5 e paga R$ 100 com probabilidade 3%:

```text
E[ganho] = 0,03 · 100 + 0,97 · 0 − 5 = 3 − 5 = −R$ 2  -> no longo prazo, prejuízo
```

Em IA, a esperança está por toda parte: a perda que minimizamos é a esperança do erro sobre os dados; a resposta de um LLM é uma amostragem de uma distribuição sobre o vocabulário.

O **teorema de Bayes** responde: "dado que vi uma evidência, quanto devo acreditar na hipótese?" O jeito intuitivo é contar. Doença que atinge 1% da população; teste que acerta 90% dos doentes, mas dá falso positivo em 5% dos saudáveis. Positivo — qual a chance de estar doente? Pense em 1.000 pessoas:

- Doentes: 10. Positivos entre eles: 10 × 0,90 = **9**.
- Saudáveis: 990. Falsos positivos: 990 × 0,05 = **49,5**.
- `P(doente | positivo) = 9 / 58,5 ≈ 15%` — e não 90%!

A intuição falha porque ignora a **taxa base**: a doença é rara, então os falsos positivos dos muitos saudáveis dominam. Essa armadilha reaparece direto no Módulo 5 (Disciplinas de ML): um classificador "95% de acurácia" para fraude que ocorre em 1% dos casos pode ser pior que um chute.

### 4.7 Softmax: transformando números em probabilidades (núcleo manual)

Um classificador produz **scores** brutos (logits), tipo `[2.0, 1.0, 0.1]` para as classes gato/cachorro/pato. A **softmax** os converte numa distribuição legítima: exponencia cada um (tudo fica positivo e as diferenças se acentuam) e divide pela soma (tudo soma 1):

```python
def softmax(z: np.ndarray) -> np.ndarray:
    e = np.exp(z - z.max())        # subtrair o máximo evita overflow numérico
    return e / e.sum()

print(softmax(np.array([2.0, 1.0, 0.1])))
# [0.659 0.242 0.099]  -> 66% gato, 24% cachorro, 10% pato (soma = 1)
```

Conferindo à mão: `e² ≈ 7,39`, `e¹ ≈ 2,72`, `e^0.1 ≈ 1,11`; soma ≈ 11,21; `7,39/11,21 ≈ 0,66`. É exatamente isso que um LLM faz a cada token: scores para todo o vocabulário → softmax → sorteia a próxima palavra. A famosa **temperatura** apenas divide os logits antes da softmax: temperatura alta achata a distribuição (mais criatividade), baixa a afunila (mais determinismo). No Módulo 6 você verá essa engrenagem girando dentro do transformer.

## 💻 Lab guiado

Implementar **descida do gradiente em NumPy puro** para uma regressão linear e ver a convergência. Roda no Colab ou localmente. Modelo: `y = w·x + b`; perda: erro quadrático médio (MSE). Você pode pedir à IA que monte o notebook — mas leia e explique cada célula antes de rodar; o loop de treino da Célula 3 é para entender linha a linha.

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

**Experimentos obrigatórios:**

1. Rode o loop com `lr` em `[0.001, 0.01, 0.05]` e plote as três curvas de perda juntas — identifique o lento, o bom e o no-limite.
2. Rode com `lr = 0.1` e explique por escrito o que aconteceu com a curva (e por quê, usando a seção 4.5).
3. Mude a semente do gerador (`default_rng(7)`) e confirme que `w` e `b` convergem para valores próximos — explique por que o resultado não é idêntico.

## 🎛️ Sessão de Direção

Aqui a IA é seu tutor socrático — e você, o verificador. Reserve ~1h com seu assistente (Claude, Gemini ou o que você configurou no Módulo 0) e siga o protocolo:

1. **Especifique**: escreva um mini-`SPEC.md` da sessão: "quero praticar produto escalar, descida do gradiente e softmax com variações que eu nunca vi; a IA gera o exercício com resposta escondida, eu calculo à mão, depois conferimos".
2. **Dirija**: peça à IA variações de cada núcleo manual — outro par de vetores para o cosseno, outra função para o gradiente (ex.: `f(w) = (w+2)²` com `lr = 0.3`), outros logits para a softmax. Uma variação de cada, por rodada.
3. **Verifique**: calcule **à mão, no papel**, antes de ver a resposta. Depois **explique cada passo de volta para a IA** com suas palavras e peça que ela aponte imprecisões na sua explicação — é o teste de Feynman com corretor infinito.
4. **Inverta**: peça à IA que resolva uma variação *com um erro sutil plantado* e encontre o erro você mesmo. É o treino direto de verificação que você vai usar a carreira inteira.

**Entregável:** o mini-SPEC da sessão + um resumo do log (quais variações fez, quantas acertou de primeira, qual erro plantado encontrou e onde a sua explicação foi corrigida) commitados junto com o mini-projeto.

## 🚀 Mini-projeto

**Enunciado:** construa um notebook-relatório "Matemática da IA com meus próprios números" com três seções, cada uma calculada primeiro **à mão** (em Markdown) e depois **conferida em NumPy**. A IA pode montar a estrutura e o código de conferência — as contas à mão são suas.

**Requisitos:**

1. **Semelhança**: crie embeddings de brinquedo (3 a 5 dimensões) para 5 itens de um domínio seu (filmes, músicas, produtos); calcule à mão a similaridade de cosseno do par que você aposta ser o mais parecido, gere a matriz 5×5 em NumPy e comente os pares mais e menos parecidos.
2. **Gradiente**: refaça a tabela de descida do gradiente de `f(w) = (w−3)²` à mão para 5 passos com `lr = 0.2` e confirme os valores com um loop em NumPy.
3. **Probabilidade**: monte um cenário de Bayes do seu cotidiano (spam, exame, alarme falso), resolva pelo método das contagens à mão e implemente `softmax` sobre 4 logits com `assert` provando que a saída soma 1.
4. **(a)** `SPEC.md` escrito **antes** do código, dizendo o que o notebook vai conter e como cada conta será verificada.
5. **(b)** As verificações são os seus testes: todo resultado à mão confere com o NumPy no notebook, com `assert` onde couber.
6. **(c)** `DECISIONS.md` registrando as escolhas (domínio dos embeddings, números do cenário de Bayes, o que a IA gerou vs. o que você fez à mão).
7. **(d)** Defesa: você responde "por quê?" sobre qualquer conta do notebook — e passa na Defesa do módulo no Campus.

### 🧭 Passo a passo

Reserve ~2h30 (pode dividir em 2 sessões). Cada etapa termina com um checkpoint; só avance quando ele passar.

**Etapa 1 — SPEC primeiro, depois o notebook (20 min)**

Escreva o `SPEC.md` (requisito 4) e só então crie o projeto — peça à IA o esqueleto do notebook a partir da sua spec, se quiser:

```bash
uv init modulo04-matematica
cd modulo04-matematica
uv add numpy jupyter
uv run jupyter lab
```

Crie `matematica.ipynb` com as seções `## 1. Semelhança`, `## 2. Gradiente` e `## 3. Probabilidade`.

✅ **Checkpoint:** `SPEC.md` existe e foi escrito antes de qualquer célula; `uv run python -c "import numpy"` roda sem erro.

**Etapa 2 — Seção 1: similaridade à mão e em NumPy (40 min)**

Escolha um domínio que você conhece de cor, invente 3 a 4 dimensões com significado (`[ação, romance, comédia]`), atribua valores 0–1 aos 5 itens. Calcule à mão a similaridade do par que você aposta ser o mais parecido, numa célula Markdown:

```text
Matrix · John Wick = 0.9·0.95 + 0.2·0.1 + 0.1·0.1 = 0.885
|Matrix| = raiz(0.81 + 0.04 + 0.01) ≈ 0.927   |John Wick| ≈ 0.961
similaridade = 0.885 / (0.927 · 0.961) ≈ 0.993 -> quase idênticos, como eu apostava
```

Abaixo, a matriz 5×5 em NumPy (dirija a IA se quiser) e um comentário sobre o par mais e o menos parecido.

✅ **Checkpoint:** diagonal da matriz toda 1 e o valor do seu par bate com a conta à mão (2 casas decimais).

**Etapa 3 — Seção 2: gradiente à mão e conferido (40 min)**

Refaça a tabela da seção 4.5, agora com `lr = 0.2`, partindo de `w = 0`, por 5 passos, numa célula Markdown — sem consultar o material. Confira com o loop:

```python
w, lr = 0.0, 0.2
for passo in range(1, 6):
    grad = 2 * (w - 3)
    w = w - lr * grad
    print(f"passo {passo}: w = {w:.4f}")
```

✅ **Checkpoint:** os 5 valores impressos batem com a sua tabela — e você sabe explicar por que `lr = 0.2` chega em 3 mais rápido que `lr = 0.1`.

**Etapa 4 — Seção 3: Bayes por contagens + softmax (35 min)**

Monte o cenário com 3 números seus (taxa base, detecção, falso alarme), resolva pelo método das 1.000 pessoas numa célula Markdown, confira as contagens em Python. Depois copie a `softmax` da seção 4.7, aplique a 4 logits inventados e prove: `assert np.isclose(softmax(z).sum(), 1.0)`.

✅ **Checkpoint:** conta à mão e código dão a mesma probabilidade, a taxa base aparece explícita na conclusão e o assert passa.

**Etapa 5 — Sessão de Direção + entrega (25 min)**

Faça a Sessão de Direção (acima) e anexe o mini-SPEC + resumo do log ao repositório. Atualize o `DECISIONS.md` (requisito 6), rode *Restart & Run All* e publique:

```bash
git add . && git commit -m "Módulo 4: matemática com meus números" && git push
```

✅ **Checkpoint:** notebook, SPEC.md, DECISIONS.md e o log da sessão publicados no GitHub com *Restart & Run All* limpo.

## 🧠 Quiz de fixação

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

**8.** A IA te entrega um passo de gradiente assim: `w = 2, grad = -2, lr = 0.1 → w novo = 1.8`. O que você conclui?

A) Está certo B) Está errado: com gradiente negativo, `w − lr·grad` soma, dando 2.2 C) Depende da função D) Faltou normalizar o gradiente

<details><summary>Ver respostas</summary>

1. **B** — Produto escalar ≈ 0 significa cos(θ) ≈ 0: vetores perpendiculares, sem semelhança. Idênticos dariam ~1; opostos, ~−1.
2. **A** — `(m, n) @ (n, p) -> (m, p)`: o 3 do meio "some" e resta `(4, 2)`.
3. **B** — Derivada é o medidor de sensibilidade: quanto a saída mexe quando a entrada mexe um tiquinho.
4. **A** — O gradiente aponta para a maior *subida*; para minimizar o erro, andamos no sentido oposto.
5. **B** — Passos grandes demais pulam por cima do mínimo e a perda oscila ou explode — o experimento do lab mostra isso.
6. **B** — Com taxa base de 1%, os 990 saudáveis geram ~49,5 falsos positivos contra só 9 verdadeiros: a maioria dos positivos é falsa.
7. **A** — A exponencial garante valores positivos e amplia diferenças; a divisão pela soma transforma tudo numa distribuição que soma 1.
8. **B** — `2 − 0.1·(−2) = 2.2`: subtrair um gradiente negativo soma. É o erro de sinal clássico — exatamente o tipo de deslize que o núcleo manual te ensina a flagrar.

</details>

## 🃏 Flashcards

| Frente | Verso |
|--------|-------|
| O que é um embedding? | Vetor denso que representa um objeto (palavra, imagem, usuário) num espaço onde distância = semelhança. |
| Produto escalar (leitura geométrica) | `a·b = |a||b|cos(θ)`: mesma direção → grande; perpendicular → 0; oposta → negativo. |
| Similaridade de cosseno | Produto escalar dos vetores normalizados; vai de −1 a 1; régua da busca semântica (base do RAG). |
| Regra de shapes na multiplicação de matrizes | `(m,n) @ (n,p) -> (m,p)`; o n do meio precisa bater. |
| Derivada em uma frase | Sensibilidade: quanto a saída muda quando a entrada muda um tiquinho. |
| O que é o gradiente? | Vetor com as derivadas parciais; aponta para a maior subida da função. |
| Fórmula do passo do gradient descent | `w ← w − lr · gradiente`. |
| Learning rate alto demais causa... | Oscilação ou divergência: a perda explode em vez de cair. |
| Teorema de Bayes (intuição) | Atualizar a crença com a evidência, sem esquecer a taxa base (contar os casos ajuda). |
| O que a temperatura de um LLM faz? | Divide os logits antes da softmax: alta achata a distribuição, baixa a afunila. |

## ☑️ Checklist de conclusão

- [ ] Assisti aos capítulos indicados de álgebra linear e cálculo do 3Blue1Brown
- [ ] Núcleo manual completo: calculei à mão produto escalar, 5 passos de descida do gradiente e uma softmax
- [ ] Lab do gradient descent executado, com os experimentos de learning rate explicados por escrito
- [ ] Sessão de Direção feita: verifiquei variações à mão, expliquei cada passo de volta e achei o erro plantado
- [ ] `SPEC.md` escrito antes do código e `DECISIONS.md` atualizado no repositório
- [ ] Mini-projeto "com meus próprios números" publicado, com toda conta à mão batendo com o NumPy
- [ ] Passei na Defesa do módulo no Campus
- [ ] Quiz com 6/8+ e flashcards agendados para revisão espaçada

**🆘 Se travar:** trabalhar com seu assistente de IA É o método — cole a conta ou o erro, peça hipóteses e refaça o passo à mão antes de aceitar a correção (num módulo de intuição matemática, a resposta pronta é a única coisa que não ensina). Erro de sinal na tabela do gradiente? 90% das vezes é `w − lr·grad` com gradiente negativo: isso **soma**. Travou de verdade (30+ min sem entender nem com IA)? Anote a dúvida no seu DECISIONS.md e leve para a comunidade.

> *Regra de ouro: você pode usar IA para escrever qualquer código. Você não pode entregar nada que não consiga explicar e defender.*
