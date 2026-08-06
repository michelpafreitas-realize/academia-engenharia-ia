# Módulo 3 — Python & Dados para quem dirige IA

> 🏛️ Período 1 · ⏱️ Carga estimada: 6h · 📋 Pré-requisitos: Módulo 2 (Prompt Engineering & APIs de LLM)

## 🎯 Objetivos

- Ao final, você será capaz de ler um trecho de Python idiomático (comprehensions, `enumerate`, `zip`, f-strings, tipagem) e explicar o que ele faz linha a linha.
- Ao final, você será capaz de explicar por que NumPy é rápido — vetorização e broadcasting como conceito — e prever o shape do resultado de uma operação.
- Ao final, você será capaz de ler um pipeline Pandas (filtros, `groupby`, split-apply-combine) e dizer o que cada etapa produz antes de rodar.
- Ao final, você será capaz de revisar um notebook gerado por IA: apontar os red flags típicos, verificar cada conclusão contra os dados e pedir correções precisas.
- Ao final, você será capaz de decidir quando usar notebook e quando usar script, e manter o ambiente do projeto reprodutível com uv.
- Ao final, você será capaz de dirigir uma análise exploratória completa: você formula as perguntas, a IA escreve o código, você garante as respostas.

## 🎛️ Núcleo manual deste módulo

À mão, você faz duas coisas: **explica célula a célula** o notebook que a IA gerou (em voz alta ou por escrito — se não consegue explicar, não pode aceitar) e **escreve 3 operações vetorizadas com os próprios dedos**, cronometrando contra o loop equivalente, para sentir no corpo por que vetorização importa. Todo o resto — pipeline, gráficos, limpeza — é dirigido com IA.

## 🗺️ Por que isso importa

Em 2026, a IA escreve o Pandas por você — e escreve bem. O que ela não faz é responder pelo resultado. Quando o Claude Code te entrega um notebook de 20 células concluindo que "as vendas caíram 30% no Sudeste", alguém precisa saber ler aquele `groupby`, notar que o filtro descartou metade das linhas sem justificativa e perguntar "por que você preencheu os nulos com zero?". Esse alguém é você. Este módulo comprime as 12 horas que o antigo currículo gastava treinando digitação em 6 horas treinando **leitura com critério**: o Python que você precisa reconhecer, não o que precisa datilografar.

Ele também fecha o Período 1: no Módulo 1 você aprendeu a especificar e verificar, no Módulo 2 aprendeu a conversar com modelos via prompt e API — agora aplica os dois ao terreno onde 60 a 80% de qualquer projeto de IA acontece: entender e limpar dados. E planta a base do que vem: o broadcasting que você entende aqui é o mesmo das matrizes do Módulo 4 e dos tensores do Módulo 6; o hábito de desconfiar de conclusão sem verificação é o embrião dos evals do Módulo 10.

## 📚 Aulas

| # | Aula | Tipo | Recurso | Duração estimada |
|---|------|------|---------|------------------|
| 1 | Tutorial oficial do Python em pt-BR (cap. 3 a 5) — leia para reconhecer, não para decorar | 📖 leitura | [docs.python.org/pt-br/3/tutorial](https://docs.python.org/pt-br/3/tutorial/) | 1h |
| 2 | NumPy para iniciantes: o conceito de array e vetorização | 📖 leitura | [numpy.org/learn](https://numpy.org/learn) | 45 min |
| 3 | 10 minutes to pandas (o vocabulário mínimo de DataFrame) | 📖 leitura | [pandas.pydata.org](https://pandas.pydata.org) | 45 min |
| 4 | Gerenciando projetos e dependências com uv | 📖 leitura | [docs.astral.sh/uv](https://docs.astral.sh/uv) | 30 min |
| 5 | Lab guiado: sentir a vetorização na mão (cronômetro incluso) | 💻 lab | este módulo (abaixo) | 45 min |
| 6 | Sessão de Direção: EDA do Titanic dirigida por você | 🎛️ sessão de direção | este módulo (abaixo) | 1h15 |
| 7 | Mini-projeto: EDA dirigida de um dataset à sua escolha | 💻 lab | este módulo (abaixo) | 1h |

## 🧠 Conteúdo essencial

### 3.1 Python de leitor: reconhecer o idiomático

A IA escreve Python "pythônico" — e você precisa lê-lo sem tropeçar. As construções que mais aparecem em código gerado:

```python
# List comprehension: "colete n² para cada n em nums, se n for par"
quadrados = [n ** 2 for n in nums if n % 2 == 0]

# Dict comprehension: mapeia id -> nome
por_id = {c.id: c.nome for c in clientes}

# enumerate e zip: índice junto com item / duas listas em paralelo
for i, linha in enumerate(linhas): ...
for nome, valor in zip(nomes, valores): ...

# f-string com formatação
print(f"média: {media:.2f}")
```

O teste de leitura: consegue traduzir cada linha para uma frase em português? `[n ** 2 for n in nums if n % 2 == 0]` = "os quadrados dos pares". Se uma comprehension gerada pela IA tem três condições aninhadas e você não consegue traduzi-la em uma frase, isso é um achado de revisão — peça para reescrever como loop legível. Legibilidade é critério de aceite, não frescura.

Funções bem desenhadas continuam sendo o padrão-ouro que você deve **exigir** do código gerado:

```python
def taxa_conversao(visitas: int, vendas: int) -> float:
    """Calcula a taxa de conversão de vendas por visita.

    Levanta ValueError se visitas for zero.
    """
    if visitas == 0:
        raise ValueError("visitas não pode ser zero")
    return vendas / visitas

assert taxa_conversao(100, 5) == 0.05
```

Quatro coisas para conferir em toda função que a IA entregar: nome que diz o que faz, tipos declarados, docstring com o contrato (o que entra, o que sai, o que pode dar errado) e — se a função é **pura** (mesmo input → mesmo output, sem efeitos colaterais) — pelo menos um `assert` que quebra se a lógica quebrar. Função sem teste é promessa sem prova.

### 3.2 Ambiente com uv: reprodutibilidade é inegociável

A IA pode gerar todo o código do projeto; o que ela não pode é fazer o projeto rodar na máquina do colega se o ambiente não estiver versionado:

```bash
uv init analise-vendas && cd analise-vendas
uv add pandas matplotlib jupyter   # registrado no pyproject.toml
uv run jupyter lab                 # roda dentro do ambiente do projeto
```

O par `pyproject.toml` + `uv.lock` no Git garante que qualquer máquina reproduz o ambiente com um único `uv sync`. Item fixo do seu checklist de revisão: o notebook gerado importa alguma biblioteca que não está no `pyproject.toml`? Então o projeto está quebrado para todo mundo, menos para quem gerou.

### 3.3 Vetorização: por que NumPy é rápido (o conceito)

NumPy guarda números em **arrays contíguos na memória** e executa a operação sobre todos de uma vez, em código C compilado. Um loop Python paga o custo do interpretador a cada elemento; a operação vetorizada paga uma vez só. É por isso que `precos * 0.9` é 10–100× mais rápido que o `for` equivalente — e é por isso que TODO o ecossistema de IA (Pandas, PyTorch, os tensores dentro de um LLM) é construído sobre essa ideia.

```python
import numpy as np
precos = np.array([100.0, 250.0, 80.0, 40.0])
com_desconto = precos * 0.9          # todos de uma vez, sem loop
acima_de_50 = precos[precos > 50]    # filtro booleano: array([100., 250., 80.])
```

**Broadcasting** é a regra que permite operar arrays de shapes diferentes: dimensões de tamanho 1 (ou inexistentes) são "esticadas" virtualmente para casar. Exemplo numérico — 3 alunos × 2 provas, cada prova com um peso:

```python
notas = np.array([[8.0, 6.0],
                  [5.0, 9.0],
                  [7.0, 7.0]])       # shape (3, 2)
pesos = np.array([0.4, 0.6])         # shape (2,)

ponderadas = notas * pesos           # o (2,) é replicado para as 3 linhas
medias = ponderadas.sum(axis=1)      # [6.8, 7.4, 7.0]
```

A regra formal: comparando os shapes **da direita para a esquerda**, cada dimensão deve ser igual, 1 ou inexistente. `(3,2)` com `(2,)` casa; `(3,2)` com `(3,)` **não** — e o `ValueError` de shape que a IA às vezes gera (e às vezes "conserta" com um `reshape` errado que silenciosamente embaralha os dados) é exatamente o tipo de bug que só quem entende a regra pega. Quando aparecer, imprima `array.shape` dos dois lados e aplique a regra.

Por que isso é conceito e não datilografia: você quase nunca vai digitar essas operações — mas vai **ler** o código vetorizado que a IA escreve e precisa saber se `(3,2) * (2,)` faz o que a análise precisa ou se está multiplicando a coisa errada na dimensão errada.

### 3.4 Pandas: split-apply-combine e o vocabulário de leitura

O **DataFrame** é uma tabela onde cada coluna é um array NumPy com nome. O ritual de abertura de qualquer análise — e a primeira coisa a exigir de qualquer notebook gerado:

```python
import pandas as pd
df = pd.read_csv("vendas.csv")
df.head()        # espiar
df.info()        # tipos e nulos por coluna — o raio-X
df.describe()    # estatísticas das numéricas
```

O coração analítico é o **`groupby`**, padrão *split-apply-combine*: divida em grupos, calcule por grupo, junte o resultado.

```python
resumo = df.groupby("uf")["valor"].agg(total="sum", ticket_medio="mean")
resumo.sort_values("total", ascending=False).head(10)
```

Leitura em frase: "para cada UF, some e tire a média de valor; ordene pelo total". Se você consegue verbalizar assim qualquer `groupby` que a IA escrever, você lê Pandas. Filtros seguem a mesma lógica: `df[df["valor"] > 1000]` ("as linhas com valor acima de mil"), `df.loc[df["uf"] == "SP", ["valor", "data"]]` ("valor e data das linhas de SP").

**Limpeza é decisão de modelagem, não detalhe.** `df.isna().sum()` mostra os buracos; preencher com mediana (`fillna(df["idade"].median())` — resiste a outliers), descartar coluna, remover duplicatas — cada escolha muda as conclusões. A IA fará essas escolhas por padrão sem te avisar; o seu trabalho de revisão é achar cada uma e perguntar "por quê?". Toda decisão de limpeza sem justificativa escrita é um achado.

### 3.5 Notebook vs script — e onde a IA entra

- **Notebook** (`.ipynb`): explorar — resultado visível por célula, texto e gráfico juntos. Perigo: células rodadas fora de ordem criam estado fantasma. Antídoto: *Restart & Run All* antes de dar por concluído — regra que vale em dobro para notebook gerado por IA, que você não viu nascer célula por célula.
- **Script** (`.py`): entregar — roda de cima a baixo, versiona bem, agenda no servidor.

O fluxo maduro de 2026: você especifica a análise, a IA gera o notebook, você revisa e itera; quando a lógica estabiliza, dirige a IA para extrair as funções reutilizáveis para um `.py` com tipos, docstrings e `assert`s. Exploração no notebook, entrega no script — quem decide o momento da transição é você.

### 3.6 Como revisar um notebook gerado por IA (o checklist do módulo)

Este é o músculo novo. Red flags em ordem de frequência:

| Red flag | Por que importa | O que pedir |
|----------|-----------------|-------------|
| `for` + `iterrows()` sobre DataFrame | 100× mais lento; sinal de código "traduzido" de outra linguagem | "Reescreva vetorizado e explique a diferença" |
| `fillna(0)` ou `dropna()` sem justificativa | Muda as estatísticas silenciosamente | "Justifique cada tratamento de nulo em comentário" |
| Filtro que descarta linhas sem reportar quantas | Conclusão pode vir de 10% dos dados | "Imprima o shape antes e depois de cada filtro" |
| Conclusão em Markdown sem número que a sustente | Pode ser alucinação estatística | "Mostre a célula cujo output prova esta frase" |
| Gráfico sem título/eixos, média onde cabia mediana | Comunicação e robustez | "Rotule tudo; justifique média vs mediana" |
| Import que não está no `pyproject.toml` | Quebra a reprodutibilidade | "Adicione com uv add ou remova" |

E a regra que resume o módulo: **a IA propõe, o dado dispõe**. Nenhuma frase de conclusão entra no relatório sem você ter localizado o número que a sustenta no output de uma célula que você entendeu.

## 💻 Lab guiado

O núcleo manual, parte 1: **escreva à mão** (sem IA, sem copiar — é curto de propósito) três pares loop-vs-vetorizado e cronometre. Rode num notebook ou script com `uv add numpy pandas`.

```python
# Lab: sentir a vetorização — digite você mesmo, são ~20 linhas
import time
import numpy as np

n = 5_000_000
valores = np.random.rand(n) * 100     # 5 milhões de preços fictícios

# --- Par 1: desconto de 10% ---
t0 = time.perf_counter()
com_loop = [v * 0.9 for v in valores]            # jeito loop
t_loop = time.perf_counter() - t0

t0 = time.perf_counter()
vetorizado = valores * 0.9                        # jeito NumPy
t_vec = time.perf_counter() - t0
print(f"desconto  -> loop: {t_loop:.3f}s | vetorizado: {t_vec:.4f}s | {t_loop/t_vec:.0f}x")

# --- Par 2: filtro (valores acima de 50) ---
t0 = time.perf_counter()
filtro_loop = [v for v in valores if v > 50]
t_loop = time.perf_counter() - t0

t0 = time.perf_counter()
filtro_vec = valores[valores > 50]                # máscara booleana
t_vec = time.perf_counter() - t0
print(f"filtro    -> loop: {t_loop:.3f}s | vetorizado: {t_vec:.4f}s | {t_loop/t_vec:.0f}x")

# --- Par 3: média ponderada com broadcasting ---
notas = np.random.rand(1_000_000, 2) * 10         # (1M, 2)
pesos = np.array([0.4, 0.6])                      # (2,)
t0 = time.perf_counter()
medias = (notas * pesos).sum(axis=1)              # broadcasting (1M,2)*(2,)
t_vec = time.perf_counter() - t0
print(f"ponderada -> vetorizado: {t_vec:.4f}s | shape resultado: {medias.shape}")

assert np.allclose(com_loop[:5], vetorizado[:5])  # mesmos números, outro motor
```

**Experimentos obrigatórios:**

1. Anote os três fatores de aceleração que **a sua máquina** imprimiu (eles variam — o conceito não).
2. Antes de rodar o Par 3, escreva no papel o shape do resultado de `(1_000_000, 2) * (2,)`. Confira.
3. Troque `pesos` por `np.array([0.4, 0.3, 0.3])` (shape `(3,)`) e rode. Leia o erro inteiro, explique-o com a regra da direita-para-a-esquerda — e só então desfaça.
4. Pergunte ao seu assistente de IA: "por que o loop Python é mais lento se os dois fazem a mesma conta?" e compare a resposta com a seção 3.3.

## 🎛️ Sessão de Direção

**EDA do Titanic — você dirige, a IA executa, os dados julgam.** (~1h15)

**1. Especifique (15 min, sem IA).** Escreva `SPEC-sessao.md` com: 3 perguntas de negócio sobre o naufrágio (moldes: "qual grupo teve maior...?", "como X varia com Y?", "existe relação entre X e Y?"), as regras da casa (toda decisão de limpeza justificada em comentário; shape impresso antes/depois de filtros; todo gráfico com título e eixos; toda conclusão com o número que a prova) e o critério de aceite: "notebook roda com Restart & Run All".

**2. Dirija (25 min).** Cole a spec no seu assistente (Claude Code, Cursor ou chat) e peça o notebook completo da EDA (`sns.load_dataset("titanic")` carrega o dataset). Itere: se vier `fillna` sem justificativa ou conclusão sem número, cobre usando o checklist da seção 3.6 — cada cobrança é a prática de direção.

**3. Verifique (35 min — o núcleo manual, parte 2).** Percorra o notebook célula a célula e escreva **uma frase sua explicando cada célula** (em comentário ou Markdown). Não consegue explicar uma célula? Peça explicação à IA, entenda, e só então escreva a SUA frase. Depois, para cada conclusão, localize o output que a sustenta e marque `VERIFICADO: célula N`. Caça obrigatória: encontre ao menos **uma** escolha silenciosa da IA (um default de limpeza, um filtro, uma agregação) que você não pediu na spec — e decida se aceita, documentando.

**Entregável:** `SPEC-sessao.md` + notebook explicado célula a célula + um resumo de 5 linhas da sessão (o que a IA acertou de primeira, o que você precisou cobrar, qual foi a escolha silenciosa encontrada).

## 🚀 Mini-projeto

**Enunciado:** conduza uma **EDA dirigida com IA** de um dataset real à sua escolha (qualquer CSV do [kaggle.com/datasets](https://www.kaggle.com/datasets) que não seja o Titanic — filmes, futebol, imóveis, música; 500+ linhas, ao menos uma coluna numérica e uma categórica). Você especifica as perguntas, a IA escreve o código, você verifica cada achado contra os dados e responde pelo resultado.

**Requisitos:**

1. **`SPEC.md` escrito ANTES de qualquer código** (critério universal a): as 3+ perguntas de negócio, as regras de qualidade da sessão de direção e os critérios de aceite.
2. Projeto criado com uv (`pyproject.toml` + `uv.lock` versionados); tudo que o notebook importa está declarado.
3. Notebook gerado por IA com **cada célula explicada por uma frase sua** e cada decisão de limpeza justificada.
4. **Verificação escrita de cada achado** (critério b): seção "Verificação" onde cada conclusão aponta a célula e o número que a provam, mais os `assert`s de sanidade (ex.: limpeza completa, shapes esperados) passando.
5. `DECISIONS.md` (critério c): as escolhas suas e as escolhas silenciosas da IA que você aceitou ou reverteu, com o porquê.
6. *Restart & Run All* executa sem erros, gráficos com título e eixos, e você é capaz de defender qualquer linha (critério d — Defesa no Campus).

### 🧭 Passo a passo

Reserve ~2h30. Cada etapa termina com um checkpoint; só avance quando ele passar.

**Etapa 1 — Escolher o dataset e escrever o SPEC.md (25 min, sem IA)**

Escolha o CSV no Kaggle (confira na aba *Data*: 500+ linhas, coluna numérica + categórica). **Antes de abrir os dados**, escreva o `SPEC.md`: as 3 perguntas, as regras de qualidade (copie da sessão de direção e ajuste) e os critérios de aceite. A spec é sua âncora — sem ela, você vira aprovador automático do que a IA decidir.

✅ **Checkpoint:** `SPEC.md` escrito e CSV baixado — e você ainda não rodou nenhuma análise.

**Etapa 2 — Criar o projeto com uv (10 min)**

```bash
cd academia-ia
uv init modulo03-eda-dirigida && cd modulo03-eda-dirigida
uv add pandas matplotlib jupyter
mkdir dados && mv ~/Downloads/seu_arquivo.csv dados/
git add . && git commit -m "Módulo 3: spec e projeto da EDA dirigida"
```

✅ **Checkpoint:** `uv run python -c "import pandas"` roda sem erro e o primeiro commit (com o SPEC.md) está feito.

**Etapa 3 — Dirigir a geração do notebook (30 min)**

Cole o `SPEC.md` no seu assistente e peça a EDA completa. Itere com o checklist da seção 3.6: shapes impressos nos filtros, limpeza justificada, conclusão com número. Guarde os prompts principais — eles entram no DECISIONS.md.

✅ **Checkpoint:** o notebook responde as 3 perguntas e *Restart & Run All* executa sem erro.

**Etapa 4 — Ler e explicar célula a célula (30 min, núcleo manual)**

Adicione a cada célula uma frase SUA explicando o que ela faz e por quê. Marque com `# REVISAR` o que não conseguir explicar, destrave com a IA (peça a explicação, não a absolvição) e reescreva a frase com suas palavras.

✅ **Checkpoint:** zero marcas `# REVISAR` restantes — você explica o notebook inteiro.

**Etapa 5 — Verificar cada achado contra os dados (25 min)**

Crie a seção "Verificação": para cada conclusão, a célula e o número que a sustentam (`VERIFICADO: célula N — 74% vs 19%`). Acrescente `assert`s de sanidade (nulos zerados nas colunas tratadas, shape final esperado). Achado sem prova volta para a Etapa 3.

✅ **Checkpoint:** toda conclusão tem célula + número, e os `assert`s passam no *Restart & Run All*.

**Etapa 6 — DECISIONS.md e entrega (20 min)**

Escreva o `DECISIONS.md`: suas decisões (dataset, perguntas, tratamentos), as escolhas silenciosas da IA que você aceitou ou reverteu, e o que faria diferente. Atualize o `SPEC.md` se alguma pergunta mudou no caminho (mudou = documente por quê). Publique:

```bash
git add . && git commit -m "Módulo 3: EDA dirigida com verificação e DECISIONS.md"
git push
```

Feche com a Defesa do módulo no Campus — ela vai perguntar "por quê?" sobre linhas que a IA escreveu e você assinou.

✅ **Checkpoint:** repositório no GitHub com notebook explicado, SPEC.md e DECISIONS.md atualizados, e Defesa feita.

> *Regra de ouro: "Você pode usar IA para escrever qualquer código. Você não pode entregar nada que não consiga explicar e defender."*

## 🧠 Quiz de fixação

**1.** Por que operações vetorizadas do NumPy são mais rápidas que loops Python?
A) Usam a GPU automaticamente B) Executam em C sobre arrays contíguos, sem o custo do interpretador por elemento C) Usam menos memória, só isso D) São paralelas em múltiplas máquinas

**2.** Um array `(3, 2)` pode operar via broadcasting com um array de shape:
A) `(3,)` B) `(2,)` C) `(4, 2)` D) `(3, 3)`

**3.** Num notebook gerado por IA, você encontra `for i, row in df.iterrows():` calculando uma coluna nova. A leitura correta é:
A) Está ótimo, loops são mais legíveis B) Red flag de desempenho — pedir a versão vetorizada e a explicação da diferença C) Erro de sintaxe D) Só é problema se o DataFrame tiver nulos

**4.** O que faz `df.groupby("uf")["valor"].agg(total="sum", ticket_medio="mean")`?
A) Ordena por UF B) Para cada UF, calcula soma e média de valor (split-apply-combine) C) Remove UFs duplicadas D) Cria duas colunas no df original

**5.** A IA preencheu os nulos de uma coluna com `fillna(0)` sem comentário. A atitude profissional é:
A) Aceitar — zero é neutro B) Tratar como achado de revisão: exigir justificativa, pois o tratamento de nulos muda as estatísticas C) Trocar por média sempre D) Apagar a coluna

**6.** O notebook gerado conclui "o grupo X comprou 40% mais". Antes de aceitar, você deve:
A) Conferir se a frase está bem escrita B) Localizar a célula cujo output numérico sustenta exatamente essa afirmação C) Pedir para a IA confirmar que está certo D) Rodar o notebook duas vezes

**7.** Por que *Restart & Run All* é ainda mais importante em notebook gerado por IA?
A) A IA gera células mais lentas B) Você não viu o notebook nascer célula a célula, então só a execução de ponta a ponta prova que não há estado fantasma C) O Git exige D) Libera memória dos gráficos

**8.** Um colega clona seu projeto. O que garante que ele reproduza o ambiente?
A) Commitar a pasta `.venv` B) Instalar de memória com pip C) `pyproject.toml` + `uv.lock` versionados: um `uv sync` recria tudo D) Usar o mesmo sistema operacional

<details><summary>Ver respostas</summary>

1. **B** — O loop acontece em C, de uma vez, sobre memória contígua; o loop Python paga o interpretador a cada elemento.
2. **B** — Da direita para a esquerda: `(3,2)` vs `(2,)` casa na última dimensão (2==2). `(3,)` falharia porque 3 ≠ 2.
3. **B** — `iterrows()` é o red flag clássico: 100× mais lento e sinal de código não-idiomático. Peça a versão vetorizada e entenda a diferença.
4. **B** — Split-apply-combine: divide por UF, aplica as duas agregações por grupo, combina no resultado.
5. **B** — Preencher ou descartar nulos é decisão de modelagem. Escolha silenciosa sem justificativa é exatamente o que sua revisão existe para pegar.
6. **B** — "A IA propõe, o dado dispõe": nenhuma conclusão entra no relatório sem o número que a prova, numa célula que você entendeu.
7. **B** — Estado fantasma (células fora de ordem) fica invisível para quem só lê o resultado; a execução limpa de ponta a ponta é a prova de reprodutibilidade.
8. **C** — Dependências e versões exatas ficam nesses dois arquivos; a `.venv` nunca vai para o Git.

</details>

## 🃏 Flashcards

| Frente | Verso |
|--------|-------|
| O que é vetorização? | Operar o array inteiro de uma vez (em C), em vez de elemento a elemento num loop Python — 10–100× mais rápido. |
| Regra do broadcasting | Comparando shapes da direita para a esquerda, cada dimensão deve ser igual, 1 ou inexistente. |
| O que faz `groupby`? | Split-apply-combine: divide em grupos, agrega por grupo, junta o resultado. |
| Red flag nº 1 em Pandas gerado por IA | Loop com `iterrows()` onde uma operação vetorizada resolve — peça a versão vetorizada. |
| Tratamento de nulos é... | Decisão de modelagem, nunca detalhe: exigir justificativa escrita para cada `fillna`/`dropna`. |
| "A IA propõe, o dado dispõe" | Nenhuma conclusão entra no relatório sem a célula e o número que a provam. |
| Notebook vs script | Notebook explora e comunica; script entrega e vai para produção — você decide o momento da transição. |
| Antídoto para estado fantasma | *Restart & Run All* antes de dar por concluído — em dobro para notebook que você não viu nascer. |
| Função pura | Mesmo input → mesmo output, sem efeitos colaterais; exigível da IA com tipos, docstring e `assert`. |
| Arquivos que reproduzem o ambiente uv | `pyproject.toml` + `uv.lock`; qualquer máquina replica com `uv sync`. |

## ☑️ Checklist de conclusão

- [ ] Lab da vetorização digitado à mão, com os 3 fatores de aceleração da minha máquina anotados
- [ ] Sei explicar broadcasting com um exemplo numérico de shapes (e prever o erro de `(3,2)` com `(3,)`)
- [ ] Sessão de Direção do Titanic feita: spec, notebook explicado célula a célula e uma escolha silenciosa da IA encontrada
- [ ] Mini-projeto publicado com `SPEC.md` escrito **antes** do código
- [ ] Toda conclusão da EDA tem verificação escrita (célula + número) e os `assert`s de sanidade passam
- [ ] `DECISIONS.md` registra minhas decisões e as escolhas da IA que aceitei ou reverti
- [ ] Passei na Defesa do módulo no Campus
- [ ] Quiz com 6/8 ou mais e flashcards agendados na repetição espaçada

**🆘 Se travar:** trabalhar com seu assistente de IA É o método deste módulo — cole o erro completo (com o `shape` dos arrays, se for erro de dimensão), peça hipóteses e entenda a causa antes de aceitar a correção; para célula que você não entende, peça a explicação, não a absolvição. Travou de verdade (30+ min sem entender nem com IA)? Anote a dúvida no seu DECISIONS.md e leve para a comunidade.
