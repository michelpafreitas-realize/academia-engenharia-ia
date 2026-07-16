# Módulo 1 — Python para IA

> 🏛️ Período 1 · ⏱️ Carga estimada: 12h · 📋 Pré-requisitos: Módulo 0 (ambiente configurado)

## 🎯 Objetivos

- Ao final, você será capaz de escrever Python idiomático: funções bem desenhadas, comprehensions, tipagem e docstrings.
- Ao final, você será capaz de manipular arrays NumPy com vetorização e broadcasting, sem loops desnecessários.
- Ao final, você será capaz de limpar, transformar e agregar dados reais com Pandas (DataFrames, `groupby`, tratamento de nulos).
- Ao final, você será capaz de visualizar dados com Matplotlib e consumir APIs HTTP com `requests`.
- Ao final, você será capaz de conduzir uma análise exploratória completa de um dataset real, do carregamento à conclusão.

## 🗺️ Por que isso importa

Python é a ferramenta de trabalho número 1 do engenheiro de IA — mas não qualquer Python. O Python que resolve exercício de faculdade (loops, `print`, listas) é diferente do Python que processa milhões de linhas em segundos. A diferença tem nome: **vetorização**. Quem opera NumPy e Pandas com fluência escreve em 5 linhas o que o iniciante escreve em 50 — e roda 100x mais rápido. Em qualquer empresa, 60 a 80% do tempo de um projeto de IA é gasto entendendo e limpando dados; este módulo treina exatamente esse músculo.

Há também o lado da engenharia: notebooks bagunçados não vão para produção. Times contratam quem sabe transformar exploração em código confiável — funções puras, docstrings, testes mínimos, dependências controladas com uv. Ao final deste módulo, você terá feito o percurso completo que fará centenas de vezes na carreira: pegar um dataset cru que nunca viu, entendê-lo, limpá-lo e extrair respostas dele com código que outro humano consegue ler.

## 📚 Aulas

| # | Aula | Tipo | Recurso | Duração estimada |
|---|------|------|---------|------------------|
| 1 | Tutorial oficial do Python em pt-BR (cap. 3 a 5: estruturas de dados) | 📖 leitura | [docs.python.org/pt-br/3/tutorial](https://docs.python.org/pt-br/3/tutorial/) | 2h |
| 2 | Curso "Python" do Kaggle Learn (grátis, com certificado) | 💻 lab | [kaggle.com/learn](https://www.kaggle.com/learn) | 2h30 |
| 3 | Trilha de aprendizado oficial do NumPy (guias e vídeos para iniciantes) | 🎥 vídeo | [numpy.org/learn](https://numpy.org/learn) | 1h30 |
| 4 | Guia "Getting started" do Pandas (10 minutes to pandas) | 📖 leitura | [pandas.pydata.org](https://pandas.pydata.org) | 1h |
| 5 | Curso "Pandas" do Kaggle Learn | 💻 lab | [kaggle.com/learn](https://www.kaggle.com/learn) | 2h30 |
| 6 | Tutoriais oficiais do Matplotlib (Quick start guide) | 📖 leitura | [matplotlib.org](https://matplotlib.org) | 45 min |
| 7 | Gerenciando projetos e dependências com uv | 📖 leitura | [docs.astral.sh/uv](https://docs.astral.sh/uv) | 30 min |
| 8 | Lab guiado: análise exploratória do Titanic | 💻 lab | este módulo (abaixo) | 1h30 |

## 🧠 Conteúdo essencial

### 1. Python idiomático: escreva como a comunidade escreve

Python tem um jeito próprio ("pythônico") de fazer as coisas. Compare:

```python
# Iniciante: loop com índice
quadrados = []
for i in range(len(numeros)):
    if numeros[i] % 2 == 0:
        quadrados.append(numeros[i] ** 2)

# Pythônico: list comprehension — mais curto, mais legível, mais rápido
quadrados = [n ** 2 for n in numeros if n % 2 == 0]
```

Comprehensions existem para listas, dicionários e conjuntos: `{cliente.id: cliente.nome for cliente in clientes}`. Use quando a expressão cabe em uma linha legível; se precisar de três condições aninhadas, volte para o loop — legibilidade vence.

Outras marcas de Python idiomático que você usará todo dia: desempacotamento (`menor, *resto = valores`), `enumerate` em vez de `range(len(...))`, `zip` para percorrer duas listas juntas, e f-strings para formatar (`f"média: {media:.2f}"`).

### 2. Funções bem desenhadas e tipagem

Uma função boa faz **uma coisa**, tem nome que diz o que faz, e declara seus tipos:

```python
def taxa_conversao(visitas: int, vendas: int) -> float:
    """Calcula a taxa de conversão de vendas por visita.

    Levanta ValueError se visitas for zero (divisão indefinida).
    """
    if visitas == 0:
        raise ValueError("visitas não pode ser zero")
    return vendas / visitas
```

Três hábitos profissionais aqui: a **docstring** explica o contrato (o que entra, o que sai, o que pode dar errado); as **anotações de tipo** (`int`, `-> float`) documentam e permitem que o editor pegue erros antes de rodar; e a função é **pura** — mesmo input, mesmo output, sem mexer em nada fora dela. Funções puras são triviais de testar:

```python
assert taxa_conversao(100, 5) == 0.05
assert taxa_conversao(200, 0) == 0.0
```

Esse par de `assert` no final do arquivo já é um teste mínimo. Antes de frameworks de teste, crie o hábito: toda função não-trivial ganha ao menos um `assert` que quebra se a lógica quebrar.

### 3. Ambientes com uv: um projeto, uma caixinha

Revisão prática do Módulo 0, agora como rotina de trabalho:

```bash
uv init analise-vendas && cd analise-vendas
uv add pandas matplotlib          # dependências ficam registradas no pyproject.toml
uv run python analise.py          # roda dentro do ambiente do projeto
```

O `pyproject.toml` + `uv.lock` garantem que qualquer colega (ou você em outra máquina) reproduz o ambiente com um único `uv sync`. Em empresa, "funciona na minha máquina" morreu — o ambiente é parte do código.

### 4. NumPy: vetorização e broadcasting

NumPy guarda números em **arrays** contíguos na memória e opera sobre todos de uma vez em C — isso é **vetorização**. A regra do jogo: *se você escreveu um `for` sobre um array, provavelmente existe um jeito NumPy melhor*.

```python
import numpy as np

precos = np.array([100.0, 250.0, 80.0, 40.0])
com_desconto = precos * 0.9          # multiplica TODOS de uma vez, sem loop
acima_de_50 = precos[precos > 50]    # filtro booleano: array([100., 250., 80.])
```

**Broadcasting** é a mágica que permite operar arrays de formatos diferentes: o NumPy "estica" virtualmente o menor para casar com o maior. Exemplo numérico — notas de 3 alunos em 2 provas, e cada prova tem um peso:

```python
notas = np.array([[8.0, 6.0],
                  [5.0, 9.0],
                  [7.0, 7.0]])       # shape (3, 2): 3 alunos x 2 provas
pesos = np.array([0.4, 0.6])         # shape (2,):   peso de cada prova

ponderadas = notas * pesos           # (3,2) * (2,) -> o vetor de pesos é
                                     # "replicado" para cada uma das 3 linhas
# [[8*0.4, 6*0.6],      [[3.2, 3.6],
#  [5*0.4, 9*0.6],  =>   [2.0, 5.4],
#  [7*0.4, 7*0.6]]       [2.8, 4.2]]

medias = ponderadas.sum(axis=1)      # soma ao longo das colunas -> [6.8, 7.4, 7.0]
```

A regra formal: comparando os shapes da direita para a esquerda, cada dimensão precisa ser **igual** ou **1** (ou inexistente). `(3, 2)` com `(2,)` é compatível; `(3, 2)` com `(3,)` **não** é — e o erro de shape resultante será seu companheiro de carreira. Quando ele aparecer, imprima `array.shape` dos dois lados e confira a regra.

### 5. Pandas: a planilha programável

O **DataFrame** é uma tabela com superpoderes: cada coluna é um array NumPy com nome. O fluxo básico de qualquer análise:

```python
import pandas as pd

df = pd.read_csv("vendas.csv")       # 1. carregar
df.head()                            # 2. espiar as primeiras linhas
df.info()                            # 3. tipos e nulos de cada coluna
df.describe()                        # 4. estatísticas das colunas numéricas
```

Seleção e filtro:

```python
df["valor"]                            # uma coluna (Series)
df[df["valor"] > 1000]                 # filtro por condição
df.loc[df["uf"] == "SP", ["valor", "data"]]  # filtro + colunas específicas
```

**`groupby`** é o coração analítico — "divida em grupos, calcule por grupo, junte":

```python
# faturamento total e ticket médio por estado
resumo = df.groupby("uf")["valor"].agg(total="sum", ticket_medio="mean")
resumo.sort_values("total", ascending=False).head(10)
```

**Limpeza**, onde mora a vida real: `df.isna().sum()` mostra os buracos; `df["idade"].fillna(df["idade"].median())` preenche com a mediana; `df.drop_duplicates()` remove repetidas; `pd.to_datetime(df["data"])` conserta datas lidas como texto. Decisão importante: preencher ou descartar nulos **é uma escolha de modelagem**, não um detalhe — anote sempre o que fez e por quê.

### 6. Matplotlib: ver antes de concluir

Estatísticas resumem; gráficos revelam. Quatro gráficos cobrem 90% da exploração:

```python
import matplotlib.pyplot as plt

df["valor"].hist(bins=30)                        # distribuição de uma variável
df.plot.scatter(x="idade", y="valor")            # relação entre duas
df.groupby("uf")["valor"].sum().plot.bar()       # comparação entre categorias
df.groupby("mes")["valor"].sum().plot.line()     # evolução no tempo
plt.show()
```

Hábito profissional: todo gráfico com título e eixos nomeados (`plt.title`, `plt.xlabel`, `plt.ylabel`). Gráfico sem rótulo é adivinhação com estilo.

### 7. Notebooks vs scripts

- **Notebook** (`.ipynb`): ideal para explorar — você vê cada resultado, itera rápido, mistura texto e gráfico. Perigo: células executadas fora de ordem criam estados fantasma. Antes de dar por encerrado, sempre rode *Restart & Run All*.
- **Script** (`.py`): ideal para entregar — roda de cima a baixo, versiona bem no Git, agenda no servidor.

O fluxo maduro: explore no notebook; quando a lógica estabilizar, extraia as partes reutilizáveis para funções em um `.py` e importe-as no notebook. É assim que times de IA trabalham.

### 8. Consumindo APIs HTTP

Muitos dados (e todos os LLMs) chegam por API. O padrão com `requests`:

```python
import requests

resp = requests.get(
    "https://api.github.com/repos/python/cpython",
    timeout=10,                      # nunca chame API sem timeout
)
resp.raise_for_status()              # vira exceção se status for 4xx/5xx
dados = resp.json()                  # o corpo JSON já vira dict Python
print(dados["stargazers_count"])
```

Três disciplinas de produção desde já: **timeout** sempre (rede trava), **`raise_for_status()`** sempre (falha silenciosa é bug escondido), e **nunca** confie cegamente no formato da resposta — use `dados.get("campo")` quando o campo puder faltar.

## 💻 Lab guiado

Análise exploratória do **Titanic** — o dataset clássico de sobreviventes do naufrágio. Rode no Colab ou localmente (`uv add pandas matplotlib seaborn jupyter`). Digite cada célula, não copie em bloco.

```python
# Célula 1 — Carregar os dados
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns   # usamos o seaborn apenas para baixar o dataset

df = sns.load_dataset("titanic")
print(df.shape)          # (891, 15) -> 891 passageiros, 15 colunas
df.head()
```

```python
# Célula 2 — Raio-X: tipos, nulos e estatísticas
df.info()                          # 'age' e 'deck' têm muitos nulos
print(df.isna().sum().sort_values(ascending=False).head())
df.describe()
```

```python
# Célula 3 — Limpeza mínima e justificada
df = df.drop(columns=["deck"])                     # 77% nulo: coluna inaproveitável
df["age"] = df["age"].fillna(df["age"].median())   # mediana resiste a outliers
df["embark_town"] = df["embark_town"].fillna(df["embark_town"].mode()[0])
assert df[["age", "embark_town"]].isna().sum().sum() == 0  # prova da limpeza
```

```python
# Célula 4 — Perguntas ao dado: quem sobreviveu?
print(df["survived"].mean())                        # ~0.38: 38% sobreviveram
print(df.groupby("sex")["survived"].mean())         # mulheres ~74%, homens ~19%
print(df.groupby("pclass")["survived"].mean())      # 1a classe ~63%, 3a ~24%

# Cruzando os dois fatores de uma vez
tabela = df.pivot_table(values="survived", index="sex",
                        columns="pclass", aggfunc="mean")
print(tabela.round(2))
```

```python
# Célula 5 — Visualizar as descobertas
fig, eixos = plt.subplots(1, 3, figsize=(15, 4))

df["age"].hist(bins=30, ax=eixos[0])
eixos[0].set(title="Distribuição de idades", xlabel="Idade", ylabel="Passageiros")

df.groupby("sex")["survived"].mean().plot.bar(ax=eixos[1], rot=0)
eixos[1].set(title="Sobrevivência por sexo", ylabel="Taxa de sobrevivência")

df.groupby("pclass")["survived"].mean().plot.bar(ax=eixos[2], rot=0)
eixos[2].set(title="Sobrevivência por classe", xlabel="Classe")

plt.tight_layout()
plt.show()
```

```python
# Célula 6 — Conclusões (escreva em Markdown no notebook)
# 1. Mulheres tiveram taxa de sobrevivência ~4x maior que homens.
# 2. Passageiros da 1a classe sobreviveram ~2.6x mais que os da 3a.
# 3. "Mulheres e crianças primeiro" + posição no navio explicam boa parte.
```

Feche com *Restart & Run All*: se tudo executa de ponta a ponta sem erro, o lab está entregue.

## 🚀 Mini-projeto

**Enunciado:** escolha um dataset real que **não** seja o Titanic (sugestões: qualquer CSV do [kaggle.com](https://www.kaggle.com) sobre um tema que te interesse — filmes, futebol, imóveis, música) e conduza uma análise exploratória completa que responda **3 perguntas** que você mesmo formular antes de olhar os dados.

**Requisitos:**

1. Projeto criado com uv (`pyproject.toml` versionado) e notebook no repositório `academia-ia`.
2. As 3 perguntas escritas em Markdown **no topo** do notebook, antes de qualquer código.
3. Etapa de limpeza documentada: cada decisão sobre nulos/duplicatas com uma linha de justificativa.
4. Pelo menos um `groupby` com agregação e pelo menos 3 gráficos com título e eixos nomeados.
5. Uma função pura com docstring, tipos e 2 `assert`s de teste, extraída para um arquivo `utils.py` e importada no notebook.
6. Seção final "Conclusões" respondendo as 3 perguntas com números.

**Critérios de aceite:**

- [ ] *Restart & Run All* executa sem erros
- [ ] As 3 perguntas iniciais são respondidas com dados na conclusão
- [ ] Nenhum loop `for` onde uma operação vetorizada resolveria
- [ ] `utils.py` importado e os `assert`s passando
- [ ] Gráficos legíveis (título + eixos) e commit no GitHub com mensagem descritiva

**Dicas:** escolha dataset com 500+ linhas e ao menos uma coluna categórica e uma numérica; se a limpeza consumir mais de metade do tempo, está normal — é o trabalho real; perguntas boas começam com "qual grupo...", "como varia...", "existe relação entre...".

## ✅ Quiz

**1.** Qual é a forma pythônica de criar uma lista com os quadrados dos números pares de `nums`?
A) `map(quadrado, nums)` B) `[n**2 for n in nums if n % 2 == 0]` C) loop `for` com `append` D) `filter(nums, pares)`

**2.** Por que operações vetorizadas do NumPy são mais rápidas que loops Python?
A) Usam a GPU automaticamente B) Executam em C sobre arrays contíguos, sem o custo do interpretador por elemento C) Usam menos memória, só isso D) São paralelas em múltiplas máquinas

**3.** Um array `(3, 2)` pode operar via broadcasting com um array de shape:
A) `(3,)` B) `(2,)` C) `(4, 2)` D) `(3, 3)`

**4.** O que faz `df.groupby("uf")["valor"].mean()`?
A) Ordena o DataFrame por UF B) Calcula a média de `valor` para cada UF C) Remove as UFs duplicadas D) Cria uma coluna nova

**5.** Preencher nulos de idade com a mediana (e não a média) é preferível quando:
A) Há outliers que distorceriam a média B) A coluna é categórica C) Queremos apagar as linhas D) O dataset é pequeno

**6.** Qual prática é obrigatória ao chamar uma API com `requests`?
A) Usar sempre POST B) Definir `timeout` e checar o status da resposta C) Converter tudo para string D) Chamar dentro de um loop

**7.** Qual o maior risco de trabalhar só em notebooks?
A) Não aceitam gráficos B) Células executadas fora de ordem criam estado inconsistente C) Não rodam Pandas D) São mais lentos que scripts

**8.** Uma função pura é aquela que:
A) Não tem parâmetros B) Sempre retorna o mesmo output para o mesmo input, sem efeitos colaterais C) Usa apenas NumPy D) Não pode levantar exceções

<details><summary>Ver respostas</summary>

1. **B** — List comprehension com condição: curta, legível e mais rápida que o loop com `append`.
2. **B** — O loop acontece em C, de uma vez, sobre memória contígua; o loop Python paga o custo do interpretador a cada elemento.
3. **B** — Comparando da direita para a esquerda: `(3,2)` vs `(2,)` casa na última dimensão (2==2). `(3,)` falharia porque 3 ≠ 2.
4. **B** — `groupby` divide por UF, aplica a média de `valor` em cada grupo e junta o resultado.
5. **A** — A mediana é robusta a valores extremos; uma única idade absurda (ex.: 999) arrastaria a média.
6. **B** — Sem `timeout` seu programa pode travar para sempre; sem checar status, erros 4xx/5xx passam despercebidos.
7. **B** — Executar células fora de ordem deixa variáveis com valores que o código visível não explica; *Restart & Run All* é o antídoto.
8. **B** — Determinística e sem efeitos colaterais — por isso é fácil de testar com um simples `assert`.

</details>

## 🃏 Flashcards

| Frente | Verso |
|--------|-------|
| O que é vetorização? | Operar sobre o array inteiro de uma vez (em C), em vez de elemento a elemento num loop Python. |
| Regra do broadcasting | Comparando shapes da direita p/ esquerda, cada dimensão deve ser igual, 1 ou inexistente. |
| `df.info()` serve para... | Ver tipos, contagem de não-nulos e memória de cada coluna — o raio-X inicial. |
| O que faz `groupby`? | Divide em grupos → agrega por grupo → junta (split-apply-combine). |
| Média vs mediana p/ preencher nulos | Mediana resiste a outliers; média é distorcida por valores extremos. |
| Notebook vs script | Notebook explora e comunica; script automatiza e vai para produção. |
| Antídoto p/ estado fantasma em notebook | Restart & Run All antes de dar o trabalho por concluído. |
| Duas disciplinas ao chamar API | `timeout` sempre + `raise_for_status()` para não engolir erro. |
| Função pura | Mesmo input → mesmo output, sem efeitos colaterais; testável com `assert`. |
| Arquivos que reproduzem o ambiente uv | `pyproject.toml` + `uv.lock`; qualquer máquina replica com `uv sync`. |

## ☑️ Checklist de conclusão

- [ ] Cursos Python e Pandas do Kaggle Learn concluídos (certificados salvos)
- [ ] Sei explicar broadcasting com um exemplo numérico de shapes
- [ ] Lab do Titanic executado de ponta a ponta com *Restart & Run All*
- [ ] Mini-projeto de análise exploratória publicado no repositório `academia-ia`
- [ ] `utils.py` com função pura, docstring, tipos e `assert`s passando
- [ ] Fiz ao menos uma chamada de API real com `requests` (timeout + status)
- [ ] Quiz respondido e erros revisados
- [ ] Flashcards do módulo agendados na rotina de repetição espaçada
