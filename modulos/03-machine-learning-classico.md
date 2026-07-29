# Módulo 3 — Machine Learning Clássico

> 🏛️ Período 1 · ⏱️ Carga estimada: 16h · 📋 Pré-requisitos: Módulo 2 (matemática essencial)

## 🎯 Objetivos

- Ao final, você será capaz de escolher entre regressão, classificação e clustering conforme o problema, e treinar modelos lineares, árvores e ensembles com scikit-learn.
- Ao final, você será capaz de diagnosticar overfitting e underfitting usando o trade-off viés-variância e curvas de validação.
- Ao final, você será capaz de montar separação treino/validação/teste e validação cruzada corretamente, sem vazar informação.
- Ao final, você será capaz de escolher a métrica certa (precisão, recall, F1, ROC-AUC, MAE/RMSE) e explicar quando cada uma engana.
- Ao final, você será capaz de construir um pipeline completo de ML — pré-processamento, modelo, validação — e submeter a uma competição do Kaggle.

## 🗺️ Por que isso importa

Sim, estamos na era dos LLMs — e mesmo assim uma fatia enorme dos problemas de dados nas empresas continua sendo resolvida com ML clássico: prever churn, aprovar crédito, estimar demanda, detectar fraude, ranquear leads. Para dados tabulares (planilhas, tabelas de banco), gradient boosting ainda vence redes neurais na maioria dos casos, custando uma fração do preço. O engenheiro de IA que só sabe chamar API de LLM usa um canhão de R$ 500 para matar mosquitos que um XGBoost de R$ 0,50 mata melhor.

Mas o motivo mais profundo é outro: o ML clássico é onde você aprende as **disciplinas que valem para toda a IA** — separar dados de treino e teste, desconfiar de resultados bons demais, escolher métricas que refletem o negócio, caçar data leakage. Avaliar um sistema com LLM em 2026 usa exatamente os mesmos fundamentos de avaliação que você aprende aqui. Errar essas disciplinas custa caro de verdade: um modelo com leakage aprovado em teste e falhando em produção é um dos incidentes mais comuns (e mais constrangedores) da área.

## 📚 Aulas

| # | Aula | Tipo | Recurso | Duração estimada |
|---|------|------|---------|------------------|
| 1 | Machine Learning Specialization (Andrew Ng) — curso 1, semanas 1-3 (auditável grátis) | 🎥 vídeo | [coursera.org/specializations/machine-learning-introduction](https://www.coursera.org/specializations/machine-learning-introduction) | 4h |
| 2 | Intro to Machine Learning (Kaggle Learn, com certificado) | 💻 lab | [kaggle.com/learn](https://www.kaggle.com/learn) | 2h |
| 3 | Intermediate Machine Learning (Kaggle Learn) | 💻 lab | [kaggle.com/learn](https://www.kaggle.com/learn) | 2h30 |
| 4 | Machine Learning Crash Course do Google (interativo) | 🎥 vídeo | [developers.google.com/machine-learning/crash-course](https://developers.google.com/machine-learning/crash-course) | 3h |
| 5 | Árvores, Random Forest, Gradient Boost e ROC no StatQuest | 🎥 vídeo | [youtube.com/@statquest](https://www.youtube.com/@statquest) | 2h |
| 6 | ML For Beginners (Microsoft) — módulos de regressão e classificação | 📖 leitura | [github.com/microsoft/ML-For-Beginners](https://github.com/microsoft/ML-For-Beginners) | 1h30 |
| 7 | Guia do usuário do scikit-learn (pipelines e validação cruzada) | 📖 leitura | [scikit-learn.org](https://scikit-learn.org) | 1h |
| 8 | Lab guiado: pipeline completo no Titanic | 💻 lab | este módulo (abaixo) | 1h30 |

## 🧠 Conteúdo essencial

### 1. Os dois grandes modos de aprender

- **Aprendizado supervisionado**: os dados vêm com a resposta certa (o *rótulo*). Prever preço de casa (regressão: resposta numérica) ou se o cliente cancela (classificação: resposta categórica). É 90% do ML nas empresas.
- **Aprendizado não-supervisionado**: sem rótulo — o algoritmo procura estrutura sozinho. Agrupar clientes parecidos (clustering), reduzir dimensões para visualizar.

Pergunta-guia para todo projeto: *"eu tenho a resposta certa para exemplos do passado?"* Tem → supervisionado. Não tem → não-supervisionado, ou repense o problema.

### 2. Modelos lineares: comece simples, sempre

A **regressão linear** você já implementou no Módulo 2: `y = w·x + b`, ajustada por descida do gradiente. A **regressão logística**, apesar do nome, é um **classificador**: passa a saída linear por uma sigmoide, que espreme qualquer número para o intervalo (0, 1) — uma probabilidade.

```python
from sklearn.linear_model import LogisticRegression
modelo = LogisticRegression(max_iter=1000)
modelo.fit(X_treino, y_treino)
probs = modelo.predict_proba(X_teste)[:, 1]   # probabilidade da classe positiva
```

Por que começar por modelos lineares? São rápidos, interpretáveis (os coeficientes dizem o peso de cada variável) e formam o **baseline**: se seu modelo sofisticado não bate a regressão logística, o problema não é o modelo — é o dado ou a formulação.

### 3. Árvores, florestas e boosting: os reis do dado tabular

Uma **árvore de decisão** aprende regras se/então: "se idade < 10 e classe = 1ª, então sobreviveu". Interpretável, mas uma árvore sozinha decora o treino com facilidade (overfitting). As soluções são os **ensembles** (comitês de modelos):

- **Random Forest**: centenas de árvores, cada uma treinada com uma amostra aleatória dos dados e das colunas; a previsão é a votação do comitê. Erros individuais se cancelam. Robusto, quase sem ajuste fino.
- **Gradient Boosting** (XGBoost, LightGBM): árvores construídas **em sequência**, cada nova focada em corrigir os erros das anteriores. É o padrão-ouro de dado tabular — anos de competições do Kaggle confirmam.

Analogia: Random Forest é pedir opinião a 300 médicos independentes e tirar a maioria; boosting é um médico estudando caso a caso exatamente os pacientes que os colegas anteriores erraram.

### 4. Overfitting, underfitting e o trade-off viés-variância

O objetivo do ML **não** é acertar o passado — é **generalizar** para dados novos. Dois modos de fracasso:

- **Underfitting** (alto *viés*): modelo simples demais; vai mal no treino e no teste. Um aluno que não estudou.
- **Overfitting** (alta *variância*): modelo decorou o treino, inclusive o ruído; brilha no treino e fracassa no teste. Um aluno que decorou o simulado e trava na prova de verdade.

O diagnóstico é sempre comparativo: **treino bom + teste ruim = overfitting; treino ruim = underfitting.** Remédios para overfitting: mais dados, modelo mais simples, regularização, menos features. Para underfitting: modelo mais capaz, melhores features. Esse cabo de guerra é o **trade-off viés-variância** — e você o gerenciará em todo projeto da carreira, incluindo fine-tuning de LLMs.

### 5. Treino, validação, teste — e validação cruzada

A regra sagrada: **o modelo só pode ser avaliado em dados que nunca viu.** O protocolo:

- **Treino** (~70%): onde o modelo aprende.
- **Validação** (~15%): onde você compara modelos e ajusta hiperparâmetros.
- **Teste** (~15%): tocado **uma única vez**, no final. É a estimativa honesta do mundo real. Quem ajusta o modelo olhando o teste transforma o teste em validação — e fica sem estimativa honesta nenhuma.

Com poucos dados, use **validação cruzada** (k-fold): divida em k=5 pedaços, treine 5 vezes usando 4 pedaços e validando no quinto, e reporte média ± desvio. Todo exemplo é usado para treinar e validar, e o desvio mostra a estabilidade:

```python
from sklearn.model_selection import cross_val_score
scores = cross_val_score(modelo, X, y, cv=5, scoring="f1")
print(f"F1: {scores.mean():.3f} ± {scores.std():.3f}")
```

### 6. Métricas: cada uma engana de um jeito

Para **classificação**, tudo nasce da matriz de confusão (VP, FP, FN, VN):

| Métrica | O que mede | Quando engana |
|---------|------------|----------------|
| Acurácia | % de acertos total | Classes desbalanceadas: fraude em 1% dos casos → chutar "não é fraude" dá 99% de acurácia e zero utilidade |
| Precisão | Dos que marquei positivos, quantos eram? | Ignora os positivos que deixei escapar (FN) |
| Recall | Dos positivos reais, quantos achei? | Ignora os alarmes falsos: marcar *tudo* como positivo dá recall 100% |
| F1 | Média harmônica de precisão e recall | Esconde qual dos dois está ruim; não considera custo assimétrico |
| ROC-AUC | Qualidade do ranking de probabilidades em todos os cortes | Pode parecer ótima com classes muito desbalanceadas; não diz nada sobre o threshold que você vai usar |

A escolha é **decisão de negócio**: diagnóstico de câncer prioriza recall (deixar passar um doente custa vidas); filtro de spam prioriza precisão (jogar e-mail legítimo no spam irrita o cliente).

Para **regressão**: **MAE** (erro absoluto médio) é na unidade do problema e robusto a outliers; **RMSE** pune erros grandes desproporcionalmente — prefira quando errar feio é muito pior que errar pouco. Um RMSE muito maior que o MAE denuncia outliers dominando o erro.

### 7. Feature engineering: onde se ganha o jogo

Modelos enxergam apenas as colunas que você entrega. **Feature engineering** é criar representações que tornam o padrão visível:

- Extrair: de uma data, criar `dia_da_semana`, `mes`, `eh_feriado`.
- Combinar: `renda / n_dependentes` pode dizer mais que as duas separadas.
- Transformar: `log(preco)` doma distribuições muito assimétricas.
- Codificar categorias: **one-hot encoding** transforma `uf` em colunas 0/1 (modelos não comem texto).
- Escalar: modelos lineares e de distância precisam de features na mesma escala (`StandardScaler`); árvores não se importam.

No Titanic, extrair o **título** do nome (Mr., Mrs., Master...) prevê melhor que a idade crua — "Master" identifica meninos. Feature boa vem de entender o *domínio*, não de força bruta.

### 8. Data leakage: o erro nº 1 do iniciante

**Data leakage** (vazamento de dados) é quando informação que não existiria no momento da previsão contamina o treino. O modelo fica ótimo no papel e inútil em produção. As três formas clássicas:

1. **Feature do futuro**: prever inadimplência usando a coluna `data_do_calote`. Absurdo explícito assim é raro; disfarçado (um `status_conta` atualizado depois do evento) é comuníssimo.
2. **Pré-processamento antes do split**: calcular média/desvio para normalizar usando o dataset **inteiro** — estatísticas do teste vazaram para o treino.
3. **Duplicatas atravessando o split**: o mesmo cliente (ou quase-duplicata) no treino e no teste — o modelo "decora" e o teste vira ilusão.

Sintoma clássico: **resultado bom demais** (99% em problema difícil = desconfie primeiro do leakage, não do seu gênio). O antídoto estrutural é o **Pipeline** do scikit-learn: encadeando pré-processamento + modelo num único objeto, o `fit` das transformações acontece só no treino de cada fold da validação cruzada, automaticamente. Pipeline não é frescura de organização — é dispositivo de segurança contra leakage.

## 💻 Lab guiado

Pipeline completo no Titanic: pré-processamento + modelos + validação cruzada + métricas. Roda no Colab ou localmente (`uv add scikit-learn pandas matplotlib seaborn`).

```python
# Célula 1 — Dados e alvo
import pandas as pd
import numpy as np
import seaborn as sns

df = sns.load_dataset("titanic")
alvo = "survived"
features = ["pclass", "sex", "age", "sibsp", "parch", "fare", "embarked"]
X, y = df[features], df[alvo]
print(X.shape, "| taxa de sobrevivência:", y.mean().round(3))
```

```python
# Célula 2 — Split ANTES de qualquer pré-processamento (anti-leakage)
from sklearn.model_selection import train_test_split
X_treino, X_teste, y_treino, y_teste = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y  # stratify preserva proporção
)
```

```python
# Célula 3 — Pipeline: imputação + escala + one-hot + modelo, tudo junto
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression

numericas = ["age", "sibsp", "parch", "fare"]
categoricas = ["pclass", "sex", "embarked"]

pre = ColumnTransformer([
    ("num", Pipeline([("imputar", SimpleImputer(strategy="median")),
                      ("escalar", StandardScaler())]), numericas),
    ("cat", Pipeline([("imputar", SimpleImputer(strategy="most_frequent")),
                      ("onehot", OneHotEncoder(handle_unknown="ignore"))]), categoricas),
])

pipe_lr = Pipeline([("pre", pre),
                    ("modelo", LogisticRegression(max_iter=1000))])
```

```python
# Célula 4 — Validação cruzada: baseline vs Random Forest
from sklearn.model_selection import cross_val_score
from sklearn.ensemble import RandomForestClassifier

pipe_rf = Pipeline([("pre", pre),
                    ("modelo", RandomForestClassifier(n_estimators=300,
                                                      random_state=42))])

for nome, pipe in [("Logística", pipe_lr), ("RandomForest", pipe_rf)]:
    scores = cross_val_score(pipe, X_treino, y_treino, cv=5, scoring="accuracy")
    print(f"{nome}: {scores.mean():.3f} ± {scores.std():.3f}")
# O pipeline garante que imputação/escala são ajustadas SÓ no treino de cada fold.
```

```python
# Célula 5 — Avaliação final no teste (uma única vez!)
from sklearn.metrics import (classification_report, confusion_matrix,
                             roc_auc_score)

melhor = pipe_rf.fit(X_treino, y_treino)
pred = melhor.predict(X_teste)
probs = melhor.predict_proba(X_teste)[:, 1]

print(confusion_matrix(y_teste, pred))
print(classification_report(y_teste, pred, digits=3))
print("ROC-AUC:", roc_auc_score(y_teste, probs).round(3))
assert roc_auc_score(y_teste, probs) > 0.8, "AUC baixa: revise o pipeline"
```

```python
# Célula 6 — Interprete: quais features pesam?
import matplotlib.pyplot as plt
nomes = melhor.named_steps["pre"].get_feature_names_out()
imp = melhor.named_steps["modelo"].feature_importances_
pd.Series(imp, index=nomes).sort_values().plot.barh(figsize=(8, 5))
plt.title("Importância das features (Random Forest)")
plt.tight_layout(); plt.show()
# Repare: sexo e tarifa dominam — coerente com a exploração do Módulo 1.
```

## 🚀 Mini-projeto

**Enunciado:** compita de verdade. Inscreva-se na competição [Titanic](https://www.kaggle.com/competitions/titanic) (ou, se quiser regressão, [House Prices](https://www.kaggle.com/competitions/house-prices-advanced-regression-techniques)) no Kaggle, construa seu pipeline e **submeta** suas previsões ao leaderboard.

**Requisitos:**

1. Baixar os dados da competição e explorar (reaproveite o roteiro do Módulo 1).
2. Pipeline scikit-learn com pré-processamento completo (imputação, one-hot, escala quando necessário).
3. Pelo menos 2 features novas criadas por você (ex.: título extraído do nome, tamanho da família = `sibsp + parch + 1`).
4. Comparar no mínimo 3 modelos (ex.: logística, Random Forest, gradient boosting) via validação cruzada, em tabela.
5. Submeter ao Kaggle e registrar o score público no notebook.
6. Seção "Post-mortem": o que funcionou, o que não funcionou, qual seria o próximo passo.

### 🧭 Passo a passo

Reserve ~5h no total (divida em 2 ou 3 sessões). Siga na ordem — cada etapa termina com um **checkpoint**; só avance quando ele passar.

**Etapa 1 — Inscrever-se na competição e baixar os dados (20 min)**

1. Entre em [kaggle.com/competitions/titanic](https://www.kaggle.com/competitions/titanic) logado na conta que você usou no Kaggle Learn e clique em **Join Competition** → aceite as regras. (Prefere regressão? O roteiro é o mesmo na House Prices.)
2. Abra a aba **Data** da competição e baixe os 3 arquivos: `train.csv` (com a resposta `Survived`), `test.csv` (sem a resposta — é ele que você vai prever) e `gender_submission.csv` (exemplo do formato de submissão).

✅ **Checkpoint:** os 3 arquivos baixados e você sabe dizer qual deles NÃO tem a coluna `Survived`.

**Etapa 2 — Criar o projeto e explorar (40 min)**

No terminal, dentro do repositório `academia-ia`:

```bash
cd academia-ia && uv init modulo03-kaggle && cd modulo03-kaggle
uv add scikit-learn pandas matplotlib seaborn jupyter
mkdir dados          # mova os 3 CSVs baixados para esta pasta
uv run jupyter lab
```

Crie o notebook `titanic.ipynb` e repita o raio-X do Módulo 1 (`shape`, `info()`, `isna().sum()`) no `train.csv`. Atenção: aqui as colunas vêm com maiúsculas (`Age`, `Sex`, `Pclass`) — diferente do dataset do seaborn usado no lab guiado.

✅ **Checkpoint:** você sabe quantas linhas tem o treino (891) e quais colunas têm nulos (`Age`, `Cabin`, `Embarked`).

**Etapa 3 — Primeira submissão, com modelo bobo de propósito (20 min)**

1. Entenda o formato exigido: um CSV com **exatamente as colunas do `sample_submission`** da competição (`PassengerId,Survived` no Titanic), uma linha para cada linha do `test.csv`, sem coluna de índice. O próprio `gender_submission.csv` já está nesse formato — destrave o processo submetendo-o antes de modelar.
2. Na página da competição, clique em **Submit Predictions**, envie o `gender_submission.csv` e confirme.
3. Anote o score público que aparecer (perto de 0.765) numa célula Markdown do notebook: é o seu baseline a bater.

✅ **Checkpoint:** a aba *Submissions* mostra 1 submissão aceita e o score está registrado no notebook.

**Etapa 4 — Pipeline com pré-processamento (45 min)**

Adapte as células 3 e 4 do lab guiado deste módulo (volte a elas): `ColumnTransformer` com imputação + escala nas numéricas e imputação + one-hot nas categóricas. Duas diferenças em relação ao lab: os nomes de coluna maiúsculos, e **sem split de teste local** — o teste é o `test.csv` do Kaggle; sua avaliação local é a validação cruzada (volte à seção 5).

```python
treino, teste = pd.read_csv("dados/train.csv"), pd.read_csv("dados/test.csv")
X, y = treino[["Pclass", "Sex", "Age", "SibSp", "Parch", "Fare", "Embarked"]], treino["Survived"]
```

✅ **Checkpoint:** `cross_val_score(pipe_lr, X, y, cv=5)` roda sem erro e você imprime média ± desvio.

**Etapa 5 — Criar 2+ features novas (45 min)**

A seção 7 mostrou que o título do nome prevê melhor que a idade crua. Crie as features **nos dois** dataframes, adicione `"TamFamilia"` à lista de numéricas e `"Titulo"` à de categóricas do `ColumnTransformer`, e recrie `X` incluindo as duas colunas novas:

```python
for df in (treino, teste):
    df["Titulo"] = df["Name"].str.extract(r",\s*([^\.]+)\.")
    df["TamFamilia"] = df["SibSp"] + df["Parch"] + 1
```

✅ **Checkpoint:** `treino["Titulo"].value_counts()` mostra Mr, Miss, Mrs, Master no topo e a validação cruzada da Etapa 4 melhora (ou você sabe explicar por que não).

**Etapa 6 — Comparar 3 modelos em tabela (45 min)**

```python
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
pipes = {"Logística": pipe_lr,
         "RandomForest": Pipeline([("pre", pre), ("modelo", RandomForestClassifier(n_estimators=300, random_state=42))]),
         "GradBoosting": Pipeline([("pre", pre), ("modelo", GradientBoostingClassifier(random_state=42))])}
scores = {nome: cross_val_score(p, X, y, cv=5, scoring="accuracy") for nome, p in pipes.items()}
pd.DataFrame({nome: [s.mean(), s.std()] for nome, s in scores.items()}, index=["média", "desvio"]).T
```

✅ **Checkpoint:** tabela com 3 linhas (média ± desvio) no notebook e um vencedor escolhido pela média.

**Etapa 7 — Gerar o arquivo de submissão e submeter (30 min)**

```python
melhor = pipes["RandomForest"]   # troque pelo vencedor da SUA tabela
melhor.fit(X, y)                 # agora com TODO o treino
sub = pd.DataFrame({"PassengerId": teste["PassengerId"], "Survived": melhor.predict(teste[X.columns])})
sub.to_csv("submissao.csv", index=False)
assert len(sub) == 418 and list(sub.columns) == ["PassengerId", "Survived"]
```

Volte à página da competição → **Submit Predictions** → envie `submissao.csv` → anote o score público no notebook, ao lado do baseline.

✅ **Checkpoint:** segundo score registrado no notebook; bateu o baseline da Etapa 3? (Se não bateu, siga mesmo assim — vira material do post-mortem.)

**Etapa 8 — Post-mortem e entrega (30 min)**

1. Escreva a seção Markdown "Post-mortem": o que funcionou, o que não funcionou e o próximo passo — uma frase honesta para cada.
2. Confira que nenhum `fit` acontece fora do Pipeline e que o `test.csv` nunca influenciou decisão de modelagem (volte à seção 8 se ficou em dúvida).
3. Rode *Restart & Run All* (conserte qualquer falha) e entregue: `git add . && git commit -m "Módulo 3: pipeline Titanic + submissão Kaggle" && git push`.

✅ **Checkpoint:** todos os critérios de aceite abaixo marcados.

**🆘 Se travar:** erro do Kaggle na submissão (número de linhas ou coluna errada) → seu CSV precisa espelhar o `sample_submission`: 418 linhas, `PassengerId,Survived`, `index=False` (o `assert` da Etapa 7 pega isso antes do upload); `KeyError: 'age'` → as colunas do Kaggle são maiúsculas (`Age`), diferente do lab com seaborn; validação local bem acima do leaderboard → cheiro de leakage, revise a seção 8; travou 30+ minutos em qualquer etapa → pergunte ao seu assistente de IA colando o erro completo e dizendo em qual etapa está (mas peça a *explicação*, não só a resposta — o objetivo é treinar).

**Critérios de aceite:**

- [ ] Submissão aceita no Kaggle com score público registrado (Titanic: acima de 0.77 é um bom começo)
- [ ] Todo pré-processamento dentro de Pipeline/ColumnTransformer (nenhum `fit` fora)
- [ ] Tabela comparativa dos modelos com média ± desvio da validação cruzada
- [ ] As 2+ features novas descritas com a intuição por trás de cada uma
- [ ] Nenhum uso do conjunto de teste para decisão de modelagem
- [ ] Notebook no repositório `academia-ia` com *Restart & Run All* limpo

**Dicas:** faça a primeira submissão o quanto antes, mesmo com modelo bobo — destrava o processo e estabelece o baseline; ganhos no Titanic vêm mais de features (título!) do que de hiperparâmetros; desconfie se sua validação local ficar muito acima do leaderboard — cheiro de leakage; leia notebooks públicos da competição *depois* da sua primeira tentativa, não antes.

## ✅ Quiz

**1.** Prever o valor de venda de um imóvel a partir de exemplos históricos rotulados é:
A) Clustering B) Regressão supervisionada C) Classificação não-supervisionada D) Aprendizado por reforço

**2.** Seu modelo acerta 99% no treino e 71% no teste. Diagnóstico:
A) Underfitting B) Overfitting C) Data leakage certamente D) Modelo perfeito

**3.** Random Forest reduz overfitting em relação a uma árvore única porque:
A) Usa árvores mais profundas B) Combina muitas árvores treinadas em amostras aleatórias, cancelando erros individuais C) Treina mais rápido D) Não usa features categóricas

**4.** Num problema de fraude com 1% de casos positivos, a métrica mais enganosa é:
A) Recall B) Precisão C) Acurácia D) F1

**5.** Em triagem de câncer, deixar passar um doente é muito pior que um alarme falso. Priorize:
A) Precisão B) Recall C) Acurácia D) MAE

**6.** Normalizar os dados usando média e desvio do dataset **inteiro** antes do split é:
A) Boa prática de eficiência B) Data leakage: estatísticas do teste contaminam o treino C) Obrigatório para árvores D) Indiferente

**7.** O conjunto de teste deve ser usado:
A) Para ajustar hiperparâmetros B) A cada época de treino C) Uma única vez, na avaliação final D) Para balancear classes

**8.** RMSE muito maior que MAE no mesmo modelo indica:
A) Erro de implementação B) Alguns erros muito grandes (outliers) dominando C) Modelo perfeito D) Dados categóricos demais

<details><summary>Ver respostas</summary>

1. **B** — Há rótulo (preço histórico) e a resposta é numérica contínua: regressão supervisionada.
2. **B** — A assinatura do overfitting é o abismo entre treino e teste: o modelo decorou o treino. Leakage (C) é possível, mas não "certamente" — o diagnóstico direto é overfitting.
3. **B** — Cada árvore vê amostras e colunas diferentes; a votação do comitê cancela os erros idiossincráticos de cada uma (variância cai).
4. **C** — Chutar "não é fraude" sempre dá 99% de acurácia e utilidade zero; acurácia ignora o desbalanceamento.
5. **B** — Recall mede quantos positivos reais foram encontrados; falso negativo é o erro caro nesse contexto.
6. **B** — Média e desvio calculados com dados do teste vazam informação para o treino; o Pipeline existe para ajustar transformações só no treino.
7. **C** — Teste tocado mais de uma vez vira validação, e você perde a estimativa honesta de desempenho no mundo real.
8. **B** — O RMSE eleva os erros ao quadrado, então erros grandes pesam desproporcionalmente; a diferença para o MAE denuncia outliers.

</details>

## 🃏 Flashcards

| Frente | Verso |
|--------|-------|
| Supervisionado vs não-supervisionado | Com rótulo (prever resposta conhecida) vs sem rótulo (descobrir estrutura). |
| Regressão logística é... | Um classificador: saída linear + sigmoide = probabilidade entre 0 e 1. |
| Overfitting (sintoma) | Treino ótimo, teste ruim: o modelo decorou em vez de generalizar. |
| Underfitting (sintoma) | Ruim já no treino: modelo simples demais para o padrão. |
| Random Forest vs Gradient Boosting | Comitê de árvores independentes em paralelo vs árvores em sequência corrigindo os erros anteriores. |
| Papel do conjunto de validação | Comparar modelos e ajustar hiperparâmetros — preservando o teste intocado. |
| Validação cruzada (k-fold) | k treinos alternando o fold de validação; reporta média ± desvio. |
| Quando a acurácia engana | Classes desbalanceadas: o chute na classe majoritária já pontua alto. |
| Precisão vs recall | Precisão: dos marcados, quantos eram? Recall: dos reais, quantos achei? |
| Data leakage | Informação indisponível no momento da previsão contamina o treino; antídoto: Pipeline + split antes de tudo. |

## ☑️ Checklist de conclusão

- [ ] Semanas 1-3 do curso do Andrew Ng (ou equivalente do Crash Course) concluídas
- [ ] Certificados de Intro e Intermediate ML do Kaggle Learn obtidos
- [ ] Sei desenhar a matriz de confusão e derivar precisão, recall e F1 dela
- [ ] Sei citar as 3 formas clássicas de data leakage e como o Pipeline previne a segunda
- [ ] Lab do pipeline Titanic executado com validação cruzada e AUC > 0.8
- [ ] Primeira submissão real feita no Kaggle com score registrado
- [ ] Mini-projeto com post-mortem publicado no repositório `academia-ia`
- [ ] Quiz respondido e flashcards do módulo na rotina de repetição espaçada
