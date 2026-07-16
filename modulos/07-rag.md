# Módulo 7 — RAG: Retrieval-Augmented Generation

> 🏛️ Período 3 · ⏱️ Carga estimada: 12h · 📋 Pré-requisitos: Módulo 6 (Prompt Engineering & APIs de LLM)

## 🎯 Objetivos

- Ao final, você será capaz de explicar por que RAG existe e quando ele vence long context e fine-tuning (e quando perde).
- Ao final, você será capaz de gerar embeddings de sentença, calcular similaridade de cosseno e projetar uma estratégia de chunking adequada aos documentos.
- Ao final, você será capaz de escolher entre FAISS, Chroma e pgvector com critérios de engenharia, não de moda.
- Ao final, você será capaz de construir um pipeline RAG completo do zero, sem framework, com citação de fontes.
- Ao final, você será capaz de avaliar um sistema RAG com métricas (faithfulness, answer relevancy, context precision) e diagnosticar as falhas comuns.

## 🗺️ Por que isso importa

RAG é, disparado, a arquitetura de LLM mais construída dentro de empresas — e por um motivo simples: o modelo não conhece os documentos internos da companhia, o conhecimento dele congela no corte de treino, e ninguém confia em resposta sem fonte. RAG resolve os três problemas de uma vez: busca os trechos relevantes da base privada, entrega ao modelo como contexto e permite citar de onde veio cada afirmação. "Chatbot que responde sobre nossos documentos" é o pedido número 1 que um engenheiro de IA recebe no primeiro mês de trabalho.

O detalhe que o mercado aprendeu a duras penas: fazer um demo de RAG leva uma tarde; fazer RAG *bom* leva engenharia — chunking bem pensado, retrieval que realmente encontra, avaliação com métricas em vez de impressão. É exatamente essa diferença que este módulo ataca. E construir o pipeline sem framework primeiro (como faremos) é o que garante que, quando você usar LlamaIndex ou LangChain depois, saberá o que cada linha esconde — e onde procurar quando quebrar.

## 📚 Aulas

| # | Aula | Tipo | Recurso | Duração estimada |
|---|------|------|---------|------------------|
| 1 | Cursos curtos de RAG e embeddings (escolha 1-2) | 🎥 vídeo | [deeplearning.ai/short-courses](https://www.deeplearning.ai/short-courses/) | 2h00 |
| 2 | Sentence-Transformers: docs e conceitos | 📖 leitura | [sbert.net](https://sbert.net) | 1h00 |
| 3 | Chroma: getting started | 💻 lab | [docs.trychroma.com](https://docs.trychroma.com) | 0h45 |
| 4 | FAISS: visão geral e wiki | 📖 leitura | [github.com/facebookresearch/faiss](https://github.com/facebookresearch/faiss) | 0h45 |
| 5 | pgvector: README e casos de uso | 📖 leitura | [github.com/pgvector/pgvector](https://github.com/pgvector/pgvector) | 0h30 |
| 6 | Trilhas de aprendizado sobre busca vetorial | 📖 leitura | [weaviate.io/learn](https://weaviate.io/learn) | 1h00 |
| 7 | Ragas: métricas de avaliação de RAG | 📖 leitura | [github.com/explodinggradients/ragas](https://github.com/explodinggradients/ragas) | 0h45 |
| 8 | Lab guiado: RAG do zero, sem framework | 💻 lab | Seção 💻 abaixo | 3h00 |
| 9 | Depois de entender: como os frameworks fazem | 📖 leitura | [docs.llamaindex.ai](https://docs.llamaindex.ai) · [python.langchain.com](https://python.langchain.com) | 1h00 |

## 🧠 Conteúdo essencial

### 7.1 Por que RAG existe

Um LLM tem dois limites estruturais: (1) **não sabe o que não estava no treino** — seus contratos, seu wiki interno, o chamado de ontem; (2) **o conhecimento congela** no corte de treino. Fine-tuning não conserta isso direito: é caro, precisa ser refeito a cada atualização, e o modelo não aprende fatos de forma confiável — aprende *estilo* e *formato* bem, fatos mal. Pior: resposta de modelo fine-tunado não tem fonte.

RAG (Retrieval-Augmented Generation) ataca pelo outro lado: em vez de colocar o conhecimento *nos pesos*, coloca *no contexto*, na hora da pergunta:

```
pergunta → busca nos documentos → top-k trechos relevantes
        → prompt = instruções + trechos + pergunta → LLM → resposta com citações
```

Três vitórias de uma vez: conhecimento **privado** (seus documentos), **atualizado** (reindexou, atualizou) e **citável** (cada afirmação aponta o trecho de origem — auditável, requisito de compliance em muita empresa).

### 7.2 Embeddings de sentença e similaridade de cosseno

O coração da busca semântica: um modelo de embedding (biblioteca de referência: [sentence-transformers](https://sbert.net)) transforma qualquer texto em um vetor (ex.: 384 ou 1024 dimensões) onde **significados parecidos ficam geometricamente próximos** — mesmo sem palavras em comum. "Como cancelo minha assinatura?" e "quero encerrar meu plano" caem perto uma da outra; busca por palavra-chave clássica não acha essa ponte.

A régua de proximidade é a **similaridade de cosseno**: o cosseno do ângulo entre dois vetores.

```
cos(a, b) = (a · b) / (|a| · |b|)
```

Vale de −1 a 1; para embeddings de texto, na prática de ~0 (nada a ver) a ~1 (mesmíssimo assunto). Exemplo numérico com vetores 2D: `a = [1, 0]`, `b = [0.7, 0.7]` → cos = 0.7/(1×0.99) ≈ 0.71 — bem parecidos; `c = [0, 1]` → cos(a, c) = 0. Detalhe de implementação: normalize os vetores (norma 1) e o cosseno vira um simples produto escalar — mais rápido e é o que as bibliotecas fazem por baixo.

### 7.3 Chunking: a decisão mais subestimada do RAG

Documentos inteiros não servem para busca: um PDF de 40 páginas vira um embedding "média de tudo" que não é bom em nada. A solução é fatiar em **chunks** — e as escolhas aqui definem a qualidade do sistema inteiro:

- **Tamanho**: chunks pequenos (100-200 tokens) são precisos mas sem contexto ("ele" — ele quem?); grandes (1000+) diluem o assunto e inflam o prompt. Ponto de partida sensato: 300-800 tokens, ajustado por avaliação.
- **Overlap**: sobreposição de 10-20% entre chunks vizinhos evita que uma informação seja cortada exatamente na fronteira.
- **Por estrutura** (o upgrade que mais paga): respeite o documento — quebre por seções, títulos, parágrafos; nunca no meio de uma tabela ou bloco de código. Um chunk que corresponde a uma seção inteira do manual quase sempre bate um corte cego de N tokens.

Guarde **metadados** junto de cada chunk (arquivo de origem, seção, página): é o que torna a citação de fontes possível lá na frente.

### 7.4 Vector stores: FAISS, Chroma ou pgvector?

Um vector store indexa milhões de vetores para busca por similaridade em milissegundos. Os três que você precisa conhecer:

| Ferramenta | O que é | Use quando |
|------------|---------|------------|
| [FAISS](https://github.com/facebookresearch/faiss) | Biblioteca de busca vetorial (Meta), em memória | Máxima performance, pesquisa, pipelines batch; você gerencia a persistência |
| [Chroma](https://docs.trychroma.com) | Banco vetorial leve, developer-friendly, embutível | Protótipos, apps pequenos/médios; API simples, persiste em disco sozinho |
| [pgvector](https://github.com/pgvector/pgvector) | Extensão de vetores para PostgreSQL | Sua empresa já roda Postgres: vetores ao lado dos dados relacionais, com backup, transação e permissão que o time já opera |

Regra de bolso honesta: protótipo → Chroma; produção em empresa com Postgres → pgvector; escala/latência extrema ou pesquisa → FAISS (ou um serviço gerenciado). E para poucos milhares de chunks? Uma matriz NumPy com produto escalar resolve — é literalmente o que faremos no lab, e é bom saber que a "mágica" é isso.

### 7.5 Retrieval híbrido e rerankers

Busca vetorial é ótima em semântica e ruim em termos exatos — códigos de produto ("XK-42"), nomes próprios, siglas jurídicas. A **BM25** (busca lexical clássica, por palavra) é o oposto. **Retrieval híbrido** roda as duas e combina os resultados (tipicamente com Reciprocal Rank Fusion), pegando o melhor dos dois mundos — é o padrão de produção em 2026.

Segundo refinamento: o **reranker**. O retrieval inicial é rápido e aproximado; o reranker é um modelo mais pesado (cross-encoder, disponível no próprio sentence-transformers) que recebe pergunta + chunk **juntos** e dá uma nota fina de relevância. Fluxo: recupere 25-50 candidatos barato → rerankeie → mande só os 3-5 melhores ao LLM. Custa alguns ms e costuma ser a melhoria de qualidade mais barata de todo o pipeline.

### 7.6 Citação de fontes

A resposta precisa apontar de onde veio — para o usuário confiar e para você depurar. O padrão simples e eficaz: numere os trechos no prompt e exija a citação no formato da resposta:

```
Responda usando APENAS os trechos abaixo. Cite as fontes como [1], [2].
Se a resposta não estiver nos trechos, diga "não encontrei nos documentos".

[1] (manual.pdf, seção 3) "O reembolso deve ser solicitado em até 7 dias..."
[2] (faq.md) "Cancelamentos após o envio não são elegíveis..."

Pergunta: ...
```

A instrução "se não estiver nos trechos, diga que não encontrou" é a válvula anti-alucinação mais importante do RAG — sem ela, o modelo responde do próprio conhecimento com a maior confiança do mundo.

### 7.7 Avaliação de RAG: Ragas e as três métricas

RAG tem duas partes que falham independentemente (busca e geração), então "olhei e pareceu bom" engana em dobro. O framework [Ragas](https://github.com/explodinggradients/ragas) padronizou as métricas essenciais:

- **Faithfulness** (fidelidade): a resposta está sustentada pelos trechos recuperados, ou o modelo inventou por conta? Mede alucinação.
- **Answer relevancy**: a resposta de fato responde à pergunta feita (em vez de tangenciar)?
- **Context precision**: dos chunks recuperados, quantos eram realmente relevantes? Mede a qualidade da *busca*, isolada da geração.

O diagnóstico vem do cruzamento: context precision baixa → problema de retrieval (chunking, embeddings, híbrido); precision alta mas faithfulness baixa → problema de geração (prompt, modelo ignorando contexto). Monte um conjunto de 20-50 perguntas com respostas esperadas e rode a cada mudança — é o mesmo hábito do Módulo 6, agora com duas engrenagens para vigiar.

### 7.8 RAG vs. long context vs. fine-tuning — e as falhas clássicas

| Critério | RAG | Long context (tudo no prompt) | Fine-tuning |
|----------|-----|-------------------------------|-------------|
| Conhecimento novo/privado | ✅ ótimo | ✅ ok até caber | ⚠️ fraco para fatos |
| Atualização frequente | ✅ reindexa e pronto | ✅ troca o prompt | ❌ retreinar |
| Citação de fontes | ✅ natural | ⚠️ possível, difusa | ❌ não há |
| Custo por consulta | baixo (só top-k no prompt) | alto (paga o corpus a cada chamada) | baixo na inferência, alto no treino |
| Base grande (GB+) | ✅ | ❌ não cabe | ⚠️ não confiável |
| Mudar estilo/formato do modelo | ❌ | ⚠️ via prompt | ✅ o ponto forte |

Decisão rápida: corpus pequeno e estável que cabe no contexto → long context puro pode bastar (com prompt caching para não pagar o corpus toda vez). Base grande, mutável ou auditável → RAG. Precisa mudar o *comportamento* do modelo (tom, formato, domínio de linguagem) → fine-tuning — frequentemente combinado com RAG, nunca substituto dele para fatos.

**As falhas comuns (e onde olhar primeiro):**

1. **Chunk ruim** — tabela cortada ao meio, seção sem título, chunk gigante genérico. Sintoma: o trecho certo até é recuperado, mas vem ilegível. Olhe seus chunks com os olhos; é a primeira depuração, sempre.
2. **Retrieval que não acha** — a resposta existe na base, mas não vem no top-k. Causas típicas: vocabulário do usuário ≠ vocabulário do documento, termos exatos (caso para híbrido/BM25), k pequeno demais, embedding fraco para português.
3. **Resposta que ignora o contexto** — os trechos certos chegaram e o modelo respondeu do próprio conhecimento (ou alucinou). Endureça o prompt ("APENAS os trechos"), exija citações, reduza chunks irrelevantes que diluem os bons.

## 💻 Lab guiado

**Objetivo:** RAG completo do zero — sem framework — sobre documentos seus: chunking + embeddings + busca por cosseno + prompt com contexto + citações. Precisa de `ANTHROPIC_API_KEY` no ambiente (ou adapte a chamada final para outro provedor).

```python
# ── 1. Setup ────────────────────────────────────────────────
# pip install sentence-transformers numpy anthropic
import numpy as np
from sentence_transformers import SentenceTransformer
import anthropic

# Modelo de embedding multilíngue, leve e bom para PT-BR:
emb_model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
client = anthropic.Anthropic()

# ── 2. Documentos (troque pelos SEUS: notas, wiki, manuais) ─
documentos = {
    "politica_reembolso.md": """Reembolsos podem ser solicitados em até 7 dias
após a entrega. Produtos com defeito têm prazo estendido de 30 dias.
O valor é estornado no mesmo método de pagamento em até 10 dias úteis.""",
    "politica_entrega.md": """Entregas são feitas em 2 a 5 dias úteis nas capitais
e 5 a 12 dias úteis no interior. Frete grátis para compras acima de R$ 199.
Não entregamos em caixas postais.""",
    "faq_conta.md": """Para alterar o e-mail cadastrado, acesse Configurações >
Conta. A troca de senha exige confirmação por e-mail. Contas inativas por
mais de 24 meses são arquivadas automaticamente.""",
}

# ── 3. Chunking por estrutura (parágrafos), com metadados ───
def chunkar(docs: dict) -> list[dict]:
    chunks = []
    for nome, texto in docs.items():
        for i, par in enumerate(p.strip() for p in texto.split("\n\n")):
            if par:  # ponytail: split por parágrafo basta aqui; overlap/tokens quando os docs forem maiores
                chunks.append({"fonte": nome, "par": i, "texto": par})
    return chunks

chunks = chunkar(documentos)
print(f"{len(chunks)} chunks criados")

# ── 4. Indexação: embeddings normalizados em uma matriz ─────
textos = [c["texto"] for c in chunks]
X = emb_model.encode(textos, normalize_embeddings=True)  # shape (n, 384)
# Com vetores normalizados, cosseno == produto escalar. Este é o
# "vector store" inteiro: uma matriz NumPy.

# ── 5. Busca por similaridade de cosseno ────────────────────
def buscar(pergunta: str, k: int = 3) -> list[dict]:
    q = emb_model.encode([pergunta], normalize_embeddings=True)[0]
    scores = X @ q                        # cosseno com todos os chunks
    top = np.argsort(scores)[::-1][:k]
    return [{**chunks[i], "score": float(scores[i])} for i in top]

for r in buscar("quanto tempo tenho para pedir meu dinheiro de volta?"):
    print(f"  {r['score']:.3f}  [{r['fonte']}]  {r['texto'][:60]}...")
# Note: a pergunta não contém a palavra 'reembolso' — e o chunk certo vence.

# ── 6. Geração com contexto e citações ──────────────────────
def responder(pergunta: str, k: int = 3) -> str:
    recuperados = buscar(pergunta, k)
    contexto = "\n\n".join(
        f"[{i+1}] ({r['fonte']}) {r['texto']}" for i, r in enumerate(recuperados)
    )
    resp = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=1024,
        system=(
            "Você responde perguntas de clientes usando APENAS os trechos "
            "fornecidos. Cite as fontes no formato [n]. Se a resposta não "
            "estiver nos trechos, diga que não encontrou nos documentos."
        ),
        messages=[{
            "role": "user",
            "content": f"<trechos>\n{contexto}\n</trechos>\n\nPergunta: {pergunta}",
        }],
    )
    return resp.content[0].text

print(responder("Quanto tempo tenho para pedir reembolso de um produto com defeito?"))
# Esperado: '30 dias [1]' apontando para politica_reembolso.md

# ── 7. Teste anti-alucinação ────────────────────────────────
print(responder("Vocês entregam fora do Brasil?"))
# Esperado: 'não encontrei nos documentos' — NÃO uma invenção educada.
```

**Experimentos obrigatórios:** (a) faça 5 perguntas com paráfrases (sem as palavras dos documentos) e anote os scores; (b) quebre de propósito o chunking (um chunk único por documento) e compare a qualidade; (c) remova a instrução "APENAS os trechos" do system e repita o teste anti-alucinação — observe a diferença.

## 🚀 Mini-projeto

**Enunciado:** construa um **assistente de perguntas e respostas sobre uma base de documentos real sua** (apostilas do curso, documentação de um projeto, políticas da empresa, artigos — mínimo 10 documentos ou 50 chunks), com avaliação de qualidade antes/depois de uma melhoria de retrieval.

**Requisitos:**

1. Pipeline sem framework (evolução do lab): chunking por estrutura com overlap, embeddings, busca por cosseno, resposta com citações [n].
2. Persistência do índice (salvar/carregar a matriz e os metadados — `np.save` + JSON basta, ou migre para Chroma e justifique).
3. Conjunto de avaliação com ≥ 15 perguntas: 10 respondíveis (com gabarito de qual documento contém a resposta) e 5 **não respondíveis** pela base.
4. Métricas reportadas: (a) recall de retrieval — o documento certo veio no top-k? (b) taxa de recusa correta nas perguntas não respondíveis; (c) avaliação manual de fidelidade das respostas (a resposta se sustenta nos trechos?).
5. Uma melhoria de retrieval implementada e medida no MESMO conjunto: overlap diferente, k diferente, chunking por seção, ou BM25 híbrido (bônus).
6. Relatório curto: tabela antes/depois e diagnóstico usando o vocabulário da seção 7.8 (foi falha de chunk, de retrieval ou de geração?).

**Critérios de aceite:**

- [ ] Recall de retrieval ≥ 80% no top-3 após a melhoria.
- [ ] Taxa de recusa correta ≥ 4/5 nas perguntas não respondíveis.
- [ ] Toda resposta exibe as citações [n] com o nome do arquivo de origem.
- [ ] Índice persistido: rodar duas vezes não re-embeda tudo.
- [ ] Tabela antes/depois da melhoria, sobre o mesmo conjunto de perguntas.
- [ ] Nenhuma chave de API no código ou no Git (hábito do Módulo 6 valendo aqui).

**Dicas:** escolha documentos que você conhece bem — avaliar fidelidade exige saber a resposta certa; as perguntas não respondíveis são o teste mais revelador do sistema; se o recall estiver baixo, imprima os chunks recuperados antes de culpar o modelo — 8 em 10 vezes o problema é o chunking; para o híbrido bônus, a biblioteca `rank_bm25` é suficiente.

## ✅ Quiz

1. Qual problema o RAG resolve que o fine-tuning resolve mal?
   - A) Mudar o tom de escrita do modelo
   - B) Injetar conhecimento factual privado e atualizado, com fonte citável
   - C) Reduzir a latência de inferência
   - D) Diminuir o tamanho do modelo

2. Similaridade de cosseno entre dois vetores normalizados equivale a:
   - A) Distância euclidiana
   - B) Produto escalar
   - C) Soma dos elementos
   - D) Norma da diferença

3. Qual é o principal risco de chunks grandes demais?
   - A) O índice fica lento
   - B) O embedding vira uma "média de tudo" e a busca perde precisão, além de inflar o prompt
   - C) O modelo de embedding recusa a entrada
   - D) As citações ficam impossíveis

4. Sua empresa já roda PostgreSQL em produção e quer busca vetorial junto dos dados relacionais. A escolha natural é:
   - A) FAISS
   - B) Um arquivo JSON
   - C) pgvector
   - D) Treinar embeddings próprios

5. Retrieval híbrido combina:
   - A) Dois LLMs diferentes
   - B) Busca vetorial (semântica) com BM25 (lexical/palavra exata)
   - C) Chunks grandes e pequenos
   - D) Duas temperaturas de geração

6. Um reranker (cross-encoder) serve para:
   - A) Gerar a resposta final
   - B) Reordenar com nota fina os candidatos do retrieval, enviando só os melhores ao LLM
   - C) Comprimir os embeddings
   - D) Traduzir a pergunta

7. No Ragas, context precision baixa com faithfulness alta indica:
   - A) Problema na geração
   - B) Problema no retrieval: os chunks recuperados são pouco relevantes
   - C) Que o sistema está perfeito
   - D) Que faltam perguntas no conjunto de teste

8. O corpus tem 200 MB de documentos que mudam toda semana e as respostas precisam citar fontes. A arquitetura indicada é:
   - A) Fine-tuning mensal
   - B) Long context com o corpus inteiro no prompt
   - C) RAG
   - D) Treinar um modelo do zero

<details><summary>Ver respostas</summary>

1. **B** — fine-tuning aprende estilo bem e fatos mal, não atualiza barato e não cita fonte; RAG faz os três.
2. **B** — cos = (a·b)/(|a||b|); com |a| = |b| = 1, sobra o produto escalar. Por isso normalizamos no índice.
3. **B** — chunk gigante dilui o assunto no embedding e ainda desperdiça tokens caros no prompt.
4. **C** — pgvector coloca vetores dentro do Postgres que o time já opera: backup, transação e permissão de graça.
5. **B** — vetorial acha paráfrases; BM25 acha códigos e termos exatos; a fusão (ex.: RRF) pega os dois.
6. **B** — fluxo padrão: recuperar 25-50 barato, rerankear com cross-encoder, mandar top-3/5 ao modelo.
7. **B** — precision mede a busca; se ela vai mal enquanto a resposta se mantém fiel, a engrenagem doente é o retrieval.
8. **C** — grande demais para o contexto, mutável demais para fine-tuning, e a citação é nativa do RAG.

</details>

## 🃏 Flashcards

| Frente | Verso |
|--------|-------|
| RAG em uma frase | Buscar trechos relevantes da base privada e entregá-los ao LLM como contexto, com citação |
| Os 3 ganhos do RAG | Conhecimento privado + atualizado + citável |
| Similaridade de cosseno | cos(a,b) = a·b/(\|a\|\|b\|); com vetores normalizados, vira produto escalar |
| Chunking: ponto de partida | 300-800 tokens, overlap 10-20%, respeitando a estrutura do documento |
| FAISS vs Chroma vs pgvector | FAISS = performance/pesquisa; Chroma = protótipo simples; pgvector = empresa que já tem Postgres |
| Retrieval híbrido | Vetorial (semântica) + BM25 (termos exatos), combinados por fusão de rankings |
| Reranker | Cross-encoder que reordena os candidatos com nota fina; recupere muitos, envie poucos |
| Faithfulness (Ragas) | A resposta se sustenta nos trechos recuperados? Mede alucinação |
| Context precision (Ragas) | Fração dos chunks recuperados que era relevante; mede a busca isolada da geração |
| Válvula anti-alucinação | "Responda APENAS com os trechos; se não estiver neles, diga que não encontrou" |

## ☑️ Checklist de conclusão

- [ ] Sei explicar em 1 minuto por que RAG existe e quando perde para long context ou fine-tuning
- [ ] Calculei similaridade de cosseno à mão em um exemplo pequeno
- [ ] Rodei o lab completo, incluindo o teste anti-alucinação e os 3 experimentos
- [ ] Sei justificar a escolha entre FAISS, Chroma e pgvector para 3 cenários diferentes
- [ ] Entendi o papel do retrieval híbrido e do reranker no pipeline de produção
- [ ] Entreguei o mini-projeto com avaliação antes/depois e diagnóstico de falhas
- [ ] Li a documentação de um framework (LlamaIndex ou LangChain) reconhecendo cada peça que construí à mão
- [ ] Acertei pelo menos 6 de 8 no quiz
