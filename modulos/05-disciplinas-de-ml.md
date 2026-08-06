# Módulo 5 — Disciplinas de ML: validação, métricas e leakage

> 🏛️ Período 2 · ⏱️ Carga estimada: 8h · 📋 Pré-requisitos: Módulo 4 (Matemática Essencial)

## 🎯 Objetivos

- Ao final, você será capaz de desenhar o esquema de validação certo para cada problema — holdout, k-fold ou split temporal — e explicar por que os outros dois estariam errados naquele caso.
- Ao final, você será capaz de montar uma matriz de confusão à mão e derivar dela acurácia, precisão, recall e F1 sem consultar fórmula.
- Ao final, você será capaz de escolher a métrica que reflete o custo real do erro no negócio — e argumentar quando acurácia, F1 ou AUC enganam.
- Ao final, você será capaz de auditar um pipeline de ML que você **não** escreveu e encontrar data leakage nas suas formas clássicas (feature do futuro, pré-processamento antes do split, duplicatas, shuffle em série temporal).
- Ao final, você será capaz de **provar** um leakage com números: métrica antes vs. depois da correção, com a explicação do mecanismo.
- Ao final, você será capaz de dirigir uma IA na construção de um pipeline scikit-learn especificando validação, métrica e salvaguardas anti-leakage — e verificar se ela obedeceu.

## 🎛️ Núcleo manual deste módulo

À mão, você faz duas coisas: **montar uma matriz de confusão no papel e calcular todas as métricas dela**, e **desenhar (literalmente, num diagrama) o split correto de um caso temporal**. É aí que a intuição de avaliação se forma. Todo o resto — pipelines, modelos, gráficos — a IA constrói sob a sua direção; seu trabalho é especificar e auditar.

## 🗺️ Por que isso importa

Em 2026, treinar uma regressão logística ou um gradient boosting é uma frase para o seu assistente de IA — ele escreve o pipeline em segundos, e escreve bem. O que a IA **não** faz por você é decidir se aquele resultado pode ir para produção: o split respeitou o tempo? A métrica reflete o custo real do erro? Aquele AUC de 0,99 é gênio ou vazamento? Esse julgamento é exatamente o trabalho do engenheiro que dirige IA — e é a parte que, quando falha, custa caro: modelo com leakage aprovado em teste e desmoronando em produção segue sendo um dos incidentes mais comuns (e mais constrangedores) da área.

Este módulo é a ponte entre a matemática do Módulo 4 e tudo o que vem depois: avaliar um sistema RAG (Módulo 7), medir um agente (Módulo 8) e construir evals (Módulo 10) usam **as mesmas disciplinas** que você treina aqui — conjunto de teste intocado, métrica alinhada ao negócio, desconfiança de resultado bom demais. Você aprende a caçar leakage num pipeline de churn hoje para caçar contaminação num eval de LLM daqui a dois módulos. Treinamos o olhar, não o dedo.

## 📚 Aulas

| # | Aula | Tipo | Recurso | Duração estimada |
|---|------|------|---------|------------------|
| 1 | Vídeo do módulo: as disciplinas que valem para toda a IA | 🎥 vídeo | Campus Virtual | 40 min |
| 2 | Matriz de confusão, precisão/recall e ROC-AUC no StatQuest | 🎥 vídeo | [youtube.com/@statquest](https://www.youtube.com/@statquest) | 1h |
| 3 | Google ML Crash Course — módulo de classificação (interativo) | 📖 leitura | [developers.google.com/machine-learning/crash-course](https://developers.google.com/machine-learning/crash-course) | 1h |
| 4 | Data Leakage (Kaggle Learn, Intermediate ML) | 📖 leitura | [kaggle.com/learn](https://www.kaggle.com/learn/intermediate-machine-learning) | 40 min |
| 5 | Guia do scikit-learn: cross-validation e Pipeline | 📖 leitura | [scikit-learn.org](https://scikit-learn.org/stable/modules/cross_validation.html) | 40 min |
| 6 | Lab guiado: a caça ao leakage plantado | 💻 lab | este módulo (abaixo) | 1h30 |
| 7 | Sessão de Direção: especificar validação e auditar o pipeline | 🎛️ sessão de direção | este módulo (abaixo) | 1h |

## 🧠 Conteúdo essencial

### 5.1 O que sobrou do ML clássico — e por que é exatamente isto

Modelos viraram commodity: regressão logística, Random Forest e XGBoost são uma instrução bem escrita para a IA. O que **não** virou commodity é o conjunto de disciplinas que decide se um modelo presta: como separar dados, como medir, como desconfiar. Este módulo é 100% sobre elas. Você ainda vai ver os modelos passarem pela tela — mas quem os digita é a IA; quem responde por eles é você.

Duas ideias de base que carregam tudo: **supervisionado** = os dados do passado vêm com a resposta certa (o rótulo), e o modelo aprende a mapeamento entrada→resposta; e **generalizar** = o objetivo nunca é acertar o passado, é acertar o dado novo. Todo o resto do módulo é engenharia para estimar honestamente essa capacidade de generalizar.

### 5.2 Validação: holdout, k-fold e o caso temporal

A regra sagrada: **o modelo só pode ser avaliado em dados que nunca viu** — e o conjunto de teste é tocado **uma única vez**, no final. Quem ajusta o modelo olhando o teste transforma o teste em validação e fica sem estimativa honesta nenhuma.

| Esquema | Como funciona | Quando usar | Quando está ERRADO |
|---------|---------------|-------------|--------------------|
| Holdout | Um corte único: ~70% treino, ~15% validação, ~15% teste (com `stratify` para preservar proporção de classes) | Muitos dados, avaliação rápida | Poucos dados (estimativa instável, refém da sorte do corte) |
| k-fold | k=5 pedaços; treina 5 vezes, cada vez validando num pedaço diferente; reporta média ± desvio | Poucos dados; comparar modelos com estabilidade | Dados com estrutura temporal ou de grupo (mistura passado e futuro, ou o mesmo cliente nos dois lados) |
| Temporal | Treina no passado, valida no futuro: corte por DATA, nunca por sorteio (`TimeSeriesSplit` ou corte manual) | Qualquer problema onde a previsão acontece "amanhã": churn, demanda, fraude, preço | Nunca está errado quando há tempo envolvido — o erro é NÃO usá-lo |

O caso temporal merece o desenho (é o seu núcleo manual): se os dados têm datas e você sorteia linhas aleatoriamente para o treino, o modelo **treina com o futuro e é avaliado no passado** — em produção esse futuro não existe, e a métrica que você reportou era ficção. O diagrama correto é uma linha do tempo com um corte vertical: tudo à esquerda treina, tudo à direita avalia. Variante honesta para escolher hiperparâmetros: janelas deslizantes (treina jan–jun, valida jul; treina jan–jul, valida ago; ...).

Regra de bolso: pergunte **"no momento em que o modelo fizer a previsão de verdade, o que ele saberá?"** — e faça a validação imitar exatamente essa cena.

### 5.3 Métricas: tudo nasce da matriz de confusão

Para classificação binária, quatro números contam a história inteira:

| | Previsto positivo | Previsto negativo |
|---|---|---|
| **Real positivo** | VP (verdadeiro positivo) | FN (falso negativo — deixei escapar) |
| **Real negativo** | FP (falso positivo — alarme falso) | VN (verdadeiro negativo) |

Dessa tabela derivam-se todas as métricas — e é por isso que montá-la à mão é o núcleo manual: quem deriva uma vez nunca mais confunde precisão com recall.

- **Acurácia** = (VP+VN)/total — % de acertos. **Engana** em classes desbalanceadas: fraude em 1% dos casos → chutar "não é fraude" dá 99% de acurácia e utilidade zero.
- **Precisão** = VP/(VP+FP) — dos que marquei positivos, quantos eram? Ignora os que deixei escapar.
- **Recall** = VP/(VP+FN) — dos positivos reais, quantos achei? Ignora alarmes falsos: marcar tudo como positivo dá recall 100%.
- **F1** = média harmônica de precisão e recall. Esconde qual dos dois está ruim — e assume que os dois erros custam igual, o que quase nunca é verdade.
- **ROC-AUC** — qualidade do *ranking* de probabilidades em todos os cortes possíveis. Boa para comparar modelos; não diz nada sobre o threshold que você vai usar em produção, e pode parecer ótima com classes muito desbalanceadas.

A escolha da métrica é **decisão de negócio, não de estatística** — é o custo assimétrico do erro que decide. Triagem de câncer: falso negativo custa uma vida → recall manda. Filtro de spam: falso positivo (e-mail legítimo sumido) irrita o cliente → precisão manda. Bloqueio antifraude: cada FP é um cliente legítimo barrado no caixa; cada FN é dinheiro perdido — aqui vale colocar R$ em cada célula da matriz e escolher o threshold que minimiza o custo total. Quando a IA sugerir "usei F1", a sua pergunta de engenheiro é: *"os dois erros custam o mesmo neste negócio?"*

Para regressão: **MAE** é na unidade do problema e robusto a outliers; **RMSE** pune erros grandes desproporcionalmente. RMSE muito maior que MAE denuncia outliers dominando o erro.

### 5.4 Data leakage: o inimigo nº 1 (e agora ele se esconde em código que você não escreveu)

**Data leakage** é quando informação que não existiria no momento da previsão contamina o treino. O modelo fica ótimo no papel e inútil em produção. As formas clássicas:

1. **Feature do futuro / derivada do alvo**: prever cancelamento usando `desconto_de_retencao` — coluna que só existe *porque* o cliente cancelou. Escancarado assim é raro; disfarçado (um `status` atualizado depois do evento, uma média que inclui o próprio alvo) é comuníssimo.
2. **Pré-processamento antes do split**: normalizar/imputar usando estatísticas do dataset **inteiro** — média e desvio do teste vazaram para o treino.
3. **Duplicatas (ou quase-duplicatas) atravessando o split**: o mesmo cliente no treino e no teste — o modelo "decora" e o teste vira ilusão.
4. **Shuffle em dados temporais**: o caso da seção 5.2 — sorteio aleatório coloca o futuro no treino.

Sintoma clássico: **resultado bom demais**. 99% num problema difícil = desconfie primeiro do leakage, não do seu gênio. Segundo sintoma: validação local muito acima do desempenho real (leaderboard, produção).

O antídoto estrutural é o **Pipeline** do scikit-learn: encadeando pré-processamento + modelo num único objeto, o `fit` das transformações acontece só no treino de cada fold, automaticamente. Pipeline não é organização — é **dispositivo de segurança**. A IA sabe disso e geralmente usa; o seu trabalho é conferir que *tudo que aprende com dados* está dentro dele.

### 5.5 Auditoria: o checklist de caça

Você vai passar a carreira lendo pipelines que não escreveu — gerados por IA, herdados de colegas. O ritual de auditoria, nesta ordem:

1. **Alvo primeiro**: como o rótulo foi construído? Em que momento ele passa a existir na vida real?
2. **Cada feature contra o relógio**: para cada coluna, pergunte "isso existiria no momento da previsão?" Nomes suspeitos: qualquer coisa `pos_`, `_final`, `total_`, `status_`.
3. **Procure `fit` fora do Pipeline**: qualquer `scaler.fit(X)`, `imputer.fit(df)` antes do `train_test_split` é a forma 2.
4. **Split contra a estrutura dos dados**: há datas? Então `shuffle` é crime. Há clientes repetidos? Então o split tem que ser por grupo (`GroupKFold`).
5. **Cheque duplicatas**: `df.duplicated().sum()` e quase-duplicatas nas colunas-chave.
6. **Desconfie do placar**: métrica espetacular = prove que é real removendo o suspeito e medindo de novo.

Provar um leakage não é apontar — é **medir**: métrica com o problema, métrica sem, e a explicação do mecanismo. Esse formato (alegação + número + mecanismo) é o mesmo que você usará em evals de LLM no Módulo 10.

## 💻 Lab guiado

**A caça ao leakage plantado.** Abaixo está um pipeline "entregue pela IA" para prever churn. Ele roda, imprime um AUC de encher os olhos — e contém **dois leakages plantados**. Sua missão: rodar, caçar com o checklist da seção 5.5, corrigir e provar a diferença com números. Roda no Colab ou localmente (`uv add scikit-learn pandas numpy`).

```python
# Célula 1 — Dataset sintético de churn (faz o papel de "dados que a empresa entregou")
import numpy as np
import pandas as pd

rng = np.random.default_rng(42)
n = 4000
df = pd.DataFrame({
    "meses_de_casa":  rng.integers(1, 37, n),
    "uso_mensal_gb":  rng.gamma(2.0, 10.0, n).round(1),
    "reclamacoes":    rng.poisson(1.2, n),
})
# probabilidade real de churn depende de reclamações e pouco uso
logit = -2.0 + 0.9 * df["reclamacoes"] - 0.03 * df["uso_mensal_gb"]
df["churn"] = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)

# ⚠️ coluna registrada DEPOIS do evento: só quem cancelou recebeu oferta de retenção
df["desconto_retencao"] = np.where(
    df["churn"] == 1, rng.uniform(0.20, 0.50, n), rng.uniform(0.0, 0.08, n)
).round(2)
print(df.head(), "\ntaxa de churn:", df["churn"].mean().round(3))
```

```python
# Célula 2 — O pipeline "que a IA entregou" (contém 2 leakages plantados — encontre-os)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score, classification_report

features = ["meses_de_casa", "uso_mensal_gb", "reclamacoes", "desconto_retencao"]
X, y = df[features], df["churn"]

scaler = StandardScaler()
X_norm = scaler.fit_transform(X)          # normaliza ANTES do split

X_tr, X_te, y_tr, y_te = train_test_split(X_norm, y, test_size=0.2,
                                          random_state=0, stratify=y)
modelo = LogisticRegression(max_iter=1000).fit(X_tr, y_tr)
probs = modelo.predict_proba(X_te)[:, 1]
print("AUC:", roc_auc_score(y_te, probs).round(3))   # ≈ 0.97 — bom DEMAIS
print(classification_report(y_te, modelo.predict(X_te), digits=3))
```

```python
# Célula 3 — SUA correção (escreva antes de olhar a discussão abaixo)
# 1) passe cada feature pelo teste do relógio: o que existe no momento da previsão?
# 2) procure fit fora de Pipeline
# 3) reconstrua: Pipeline(StandardScaler → LogisticRegression), split ANTES de tudo,
#    sem a(s) coluna(s) vazada(s) — e compare o AUC com a Célula 2
from sklearn.pipeline import Pipeline

limpas = ["meses_de_casa", "uso_mensal_gb", "reclamacoes"]
X_tr, X_te, y_tr, y_te = train_test_split(df[limpas], y, test_size=0.2,
                                          random_state=0, stratify=y)
pipe = Pipeline([("escala", StandardScaler()),
                 ("modelo", LogisticRegression(max_iter=1000))])
pipe.fit(X_tr, y_tr)
auc_honesta = roc_auc_score(y_te, pipe.predict_proba(X_te)[:, 1])
print("AUC honesta:", auc_honesta.round(3))   # bem menor — e VERDADEIRA
```

Os dois plantios: **(1)** `desconto_retencao` é feature derivada do alvo — ela é consequência do churn, não causa; no momento da previsão real, essa coluna não existe. É ela que infla o AUC. **(2)** `scaler.fit_transform(X)` antes do split — estatísticas do teste vazaram para o treino (forma 2 da seção 5.4). Neste dataset o efeito numérico do (2) é pequeno; ele está plantado porque o hábito de deixá-lo passar é que é caro — em datasets pequenos ou com outliers a distorção aparece.

**Experimentos obrigatórios:**

1. Registre a tabela: AUC com tudo vazado, AUC só removendo `desconto_retencao`, AUC com Pipeline completo. Qual leakage dominava?
2. Prova do mecanismo: imprima o coeficiente de cada feature no modelo vazado (`modelo.coef_`). Quem carrega o modelo nas costas?
3. Adicione uma coluna `cadastro` de datas (ex.: `pd.date_range` bagunçado) e refaça o split por corte temporal (treino = 80% mais antigo). O AUC muda? Escreva por que isso é o cenário honesto para churn.
4. Dirija sua IA: peça "adicione ao dataset uma feature vazada mais sutil que desconto_retencao" e depois encontre-a com o checklist — sem olhar o código dela antes de tentar.

## 🎛️ Sessão de Direção

A prática de direção deste módulo é o ciclo completo sobre um problema de validação temporal:

1. **Especifique** (20 min, antes de qualquer código): escreva uma spec curta para um pipeline de previsão de churn com dados datados. Ela DEVE fixar: o esquema de validação (corte temporal, com justificativa), a métrica principal e por quê (qual erro custa mais neste negócio?), o threshold ou como será escolhido, e as salvaguardas anti-leakage exigidas (todo `fit` dentro de Pipeline, teste do relógio por feature, teste tocado uma vez).
2. **Dirija** (25 min): entregue a spec à sua IA (Claude, Gemini...) e peça o pipeline. Quando ela devolver, não aceite em bloco: questione escolhas ("por que k-fold e não corte temporal?", "por que F1?") e itere até o código cumprir a spec.
3. **Verifique** (15 min): rode o checklist da seção 5.5 linha a linha sobre o código final. Encontre pelo menos uma decisão da IA que você mudaria — ou prove que não há.

**Entregável:** a spec, o log (ou resumo) da conversa com os pontos em que você corrigiu a IA, e o veredito da auditoria. Vai junto no repositório do mini-projeto.

## 🚀 Mini-projeto

**Enunciado:** você recebeu de "outra equipe" um dataset e um pipeline com resultado espetacular — e a missão de auditar antes do deploy. O dataset tem **armadilhas deliberadamente plantadas** (pelo menos duas; o gerador abaixo planta três + um baseline defeituoso). Entrega: o pipeline corrigido + um **relatório de auditoria** provando cada armadilha com números.

**Requisitos:**

1. `SPEC.md` escrito ANTES do código: o que a auditoria vai verificar, qual métrica vale e por quê, qual esquema de validação é o correto para dados datados de churn (critério universal a).
2. Rodar o baseline defeituoso e registrar as métricas infladas (o "antes").
3. Encontrar **todas** as armadilhas usando o checklist da seção 5.5 — são pelo menos 3 no dataset/baseline gerado.
4. Para cada armadilha: alegação + prova numérica (métrica com vs. sem) + explicação do mecanismo em 2–3 frases. Isso é o relatório (critério universal b: números que provam).
5. Pipeline corrigido: todo pré-processamento dentro de `Pipeline`, split temporal, métrica justificada pelo custo do erro, e um `assert` de sanidade no final.
6. `DECISIONS.md` com as decisões e trade-offs (critério universal c) — inclua a spec e o log da Sessão de Direção.
7. Defesa: saber responder "por quê?" sobre qualquer linha entregue — e passar na Defesa do módulo no Campus (critério universal d).

### 🧭 Passo a passo

Reserve ~4h. Cada etapa termina com um checkpoint; só avance quando ele passar.

**Etapa 1 — Criar o projeto e escrever o SPEC.md (30 min)**

```bash
cd academia-ia && uv init modulo05-auditoria && cd modulo05-auditoria
uv add scikit-learn pandas numpy jupyter
git add . && git commit -m "Módulo 5: esqueleto do projeto de auditoria"
```

Escreva o `SPEC.md` antes de olhar qualquer dado: objetivo da auditoria, checklist que será aplicado (seção 5.5), métrica escolhida com justificativa de custo de erro, esquema de validação correto para churn datado e por quê.

✅ **Checkpoint:** `SPEC.md` no repositório respondendo: qual métrica, qual validação, e o que caracteriza "prova" de uma armadilha.

**Etapa 2 — Gerar o dataset armadilhado e rodar o baseline (30 min)**

Salve como `gerar_dados.py` e rode com `uv run python gerar_dados.py`:

```python
# gerar_dados.py — dataset de churn com armadilhas plantadas (não espie as respostas; audite)
import numpy as np, pandas as pd
rng = np.random.default_rng(7)
n = 5000
df = pd.DataFrame({
    "data_ref":      pd.to_datetime("2025-01-01") + pd.to_timedelta(rng.integers(0, 540, n), "D"),
    "meses_de_casa": rng.integers(1, 48, n),
    "uso_mensal_gb": rng.gamma(2.0, 9.0, n).round(1),
    "reclamacoes":   rng.poisson(1.0, n),
    "plano":         rng.choice(["basico", "padrao", "premium"], n, p=[0.5, 0.35, 0.15]),
})
logit = -2.2 + 0.85 * df["reclamacoes"] - 0.025 * df["uso_mensal_gb"] - 0.01 * df["meses_de_casa"]
df["churn"] = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)
# armadilha A: registrada DEPOIS do evento (ligações de despedida/cobrança)
df["chamadas_pos_evento"] = np.where(df["churn"] == 1, rng.poisson(3.0, n), rng.poisson(0.2, n))
# armadilha B: ~8% de duplicatas espalhadas (mesmo cliente duas vezes)
df = pd.concat([df, df.sample(frac=0.08, random_state=7)]).sample(frac=1, random_state=7).reset_index(drop=True)
df.to_csv("dados_churn.csv", index=False)
print(df.shape, "| churn:", df["churn"].mean().round(3))
```

Baseline "da outra equipe" (num notebook `auditoria.ipynb`): use TODAS as colunas numéricas como features (incluindo `chamadas_pos_evento`), normalize com `StandardScaler` **antes** do `train_test_split` (armadilha C), split aleatório ignorando `data_ref` (armadilha D) e um `RandomForestClassifier`. Registre AUC e o classification report — o "antes".

✅ **Checkpoint:** baseline rodando com métrica suspeita de tão boa, registrada numa célula Markdown.

**Etapa 3 — A caça: aplicar o checklist (1h)**

Percorra o checklist da seção 5.5 item a item, anotando o veredito de cada um no notebook. Dirija sua IA como parceira de auditoria (cole o código do baseline e peça hipóteses), mas **cada armadilha só conta se VOCÊ escrever o mecanismo com suas palavras**.

✅ **Checkpoint:** lista das armadilhas encontradas (mínimo 3: feature pós-evento, duplicatas atravessando o split, normalização antes do split; a 4ª é o shuffle temporal).

**Etapa 4 — A prova: números para cada armadilha (1h)**

Para cada armadilha, um experimento controlado mudando **uma coisa de cada vez**: ex. AUC com `chamadas_pos_evento` vs. sem; acurácia com duplicatas vs. após `drop_duplicates` antes do split; métrica com split aleatório vs. corte temporal por `data_ref`. Monte a tabela-resumo: armadilha → métrica antes → depois → mecanismo.

✅ **Checkpoint:** tabela com ≥3 linhas, cada uma com números reais dos seus experimentos.

**Etapa 5 — O pipeline corrigido (45 min)**

Reconstrua honesto: `drop_duplicates` primeiro, corte temporal (treino = 80% mais antigo por `data_ref`), features que passam no teste do relógio, todo pré-processamento dentro de `Pipeline`/`ColumnTransformer` (one-hot em `plano`), métrica do SPEC. Termine com um assert de sanidade — por exemplo:

```python
assert "chamadas_pos_evento" not in features_finais
assert X_treino["data_ref"].max() < X_teste["data_ref"].min(), "treino invadiu o futuro"
```

✅ **Checkpoint:** pipeline corrigido rodando de ponta a ponta com *Restart & Run All* limpo; métrica final menor que a do baseline — e você sabe explicar por que isso é uma vitória.

**Etapa 6 — Relatório, DECISIONS.md, defesa e entrega (45 min)**

1. Seção final "Relatório de auditoria" no notebook: veredito, tabela de provas, recomendação (aprovaria o deploy? com quais ressalvas?).
2. `DECISIONS.md`: decisões, trade-offs, spec e log da Sessão de Direção.
3. Faça a Defesa do módulo no Campus (o entrevistador vai perguntar "por quê?" sobre o SEU código).
4. Publique: `git add . && git commit -m "Módulo 5: auditoria de leakage + pipeline corrigido" && git push`.

✅ **Checkpoint:** repositório no GitHub com notebook, SPEC.md e DECISIONS.md; defesa feita.

**Critérios de aceite:**

- [ ] SPEC.md escrito antes do código, com métrica e validação justificadas
- [ ] Todas as armadilhas (≥3) documentadas com alegação + número + mecanismo
- [ ] Pipeline corrigido: split temporal, `fit` só dentro de Pipeline, asserts de sanidade
- [ ] DECISIONS.md com trade-offs + material da Sessão de Direção
- [ ] Defesa do módulo aprovada no Campus
- [ ] *Restart & Run All* limpo e projeto publicado no GitHub

> **Regra de ouro:** você pode usar IA para escrever qualquer código. Você não pode entregar nada que não consiga explicar e defender.

## 🧠 Quiz de fixação

**1.** Sua validação local dá AUC 0,99 num problema notoriamente difícil. A primeira hipótese profissional é:
A) O modelo é excepcional B) Data leakage — informação do futuro/alvo contaminou o treino C) O dataset é fácil D) A métrica está mal calculada

**2.** VP=40, FP=10, FN=20, VN=930. A precisão e o recall são:
A) 0,80 e 0,67 B) 0,67 e 0,80 C) 0,97 e 0,80 D) 0,80 e 0,97

**3.** Para prever churn do próximo mês com dados datados, o split correto é:
A) Aleatório com stratify B) k-fold com shuffle C) Corte temporal: treina no passado, avalia no futuro D) Duplicar os dados recentes

**4.** Normalizar com média e desvio do dataset **inteiro** antes do split é:
A) Boa prática de eficiência B) Leakage: estatísticas do teste contaminam o treino C) Obrigatório para árvores D) Indiferente

**5.** Num problema com 1% de positivos, a métrica mais enganosa é:
A) Recall B) Precisão C) Acurácia D) F1

**6.** A feature `desconto_retencao` (oferta dada a quem cancelou) infla o modelo de churn porque:
A) É categórica B) É consequência do alvo — não existe no momento da previsão real C) Tem outliers D) Está em escala diferente

**7.** O conjunto de teste deve ser usado:
A) Para ajustar hiperparâmetros B) A cada iteração C) Uma única vez, na avaliação final D) Para balancear classes

**8.** A IA entregou um pipeline com F1 como métrica para bloqueio antifraude. Sua primeira pergunta de engenheiro é:
A) "Qual biblioteca você usou?" B) "Os dois tipos de erro custam o mesmo neste negócio?" C) "Quantas árvores tem o modelo?" D) "O dataset está balanceado?"

<details><summary>Ver respostas</summary>

1. **B** — Resultado bom demais é o sintoma clássico; desconfie do leakage antes de desconfiar do próprio gênio.
2. **A** — Precisão = 40/(40+10) = 0,80; recall = 40/(40+20) ≈ 0,67. Se derivou da matriz sem fórmula, o núcleo manual cumpriu o papel.
3. **C** — Sorteio aleatório coloca o futuro no treino; em produção esse futuro não existe. A validação deve imitar a cena real da previsão.
4. **B** — Média e desvio calculados com dados do teste vazam para o treino; o Pipeline existe para ajustar transformações só no treino de cada fold.
5. **C** — Chutar a classe majoritária já dá 99% de acurácia e utilidade zero.
6. **B** — Ela é efeito do churn, não causa: feature derivada do alvo, a forma 1 de leakage. O teste do relógio a elimina.
7. **C** — Teste tocado mais de uma vez vira validação, e você perde a estimativa honesta.
8. **B** — F1 assume custos simétricos; escolher métrica é decisão de negócio sobre qual erro custa mais. As outras perguntas são detalhes.

</details>

## 🃏 Flashcards

| Frente | Verso |
|--------|-------|
| Matriz de confusão | VP, FP, FN, VN — a tabela de onde todas as métricas de classificação derivam. |
| Precisão vs. recall | Precisão: dos marcados, quantos eram? Recall: dos reais, quantos achei? |
| Quando a acurácia engana | Classes desbalanceadas: chutar a majoritária já pontua alto. |
| Por que F1 pode enganar | Assume que falso positivo e falso negativo custam o mesmo — quase nunca é verdade. |
| Split temporal | Treina no passado, avalia no futuro, corte por data — obrigatório quando a previsão acontece "amanhã". |
| Validação cruzada (k-fold) | k treinos alternando o fold de validação; reporta média ± desvio; não usar com estrutura temporal. |
| Data leakage (definição) | Informação indisponível no momento da previsão contamina o treino; métricas infladas e falsas. |
| Teste do relógio | Para cada feature: "isso existiria no momento da previsão?" — elimina features derivadas do alvo. |
| Papel de segurança do Pipeline | Garante que todo `fit` de pré-processamento aconteça só no treino de cada fold. |
| Prova de um leakage | Alegação + métrica com vs. sem + mecanismo explicado — apontar sem medir não é auditoria. |

## ☑️ Checklist de conclusão

- [ ] Matriz de confusão montada à mão com todas as métricas derivadas (núcleo manual)
- [ ] Diagrama do split temporal desenhado e explicado (núcleo manual)
- [ ] Lab guiado: os 2 leakages plantados encontrados, corrigidos e provados com números
- [ ] Sessão de Direção: spec + log da sessão + veredito da auditoria no repositório
- [ ] Mini-projeto: SPEC.md antes do código, ≥3 armadilhas provadas, pipeline corrigido publicado
- [ ] DECISIONS.md registrando decisões e trade-offs
- [ ] Defesa do módulo aprovada no Campus
- [ ] Quiz com 6/8+ e flashcards na rotina de repetição espaçada

**🆘 Se travar:** trabalhar com seu assistente de IA É o método deste módulo — cole o código suspeito, peça hipóteses de leakage, exija o mecanismo antes de aceitar a correção. A regra: a IA pode apontar, mas a prova numérica e a explicação são suas. Travou de verdade (30+ min sem entender nem com IA)? Anote a dúvida no seu DECISIONS.md e leve para a comunidade.
