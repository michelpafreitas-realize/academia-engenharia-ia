# Módulo 6 — Prompt Engineering & APIs de LLM

> 🏛️ Período 3 · ⏱️ Carga estimada: 10h · 📋 Pré-requisitos: Módulo 5 (Transformers & LLMs por Dentro)

## 🎯 Objetivos

- Ao final, você será capaz de escrever prompts profissionais usando estrutura system/user, few-shot, chain-of-thought e delimitadores/tags XML.
- Ao final, você será capaz de obter saída estruturada confiável (JSON validado) de um LLM via structured output.
- Ao final, você será capaz de chamar as APIs da Anthropic e da OpenAI em Python, com streaming, tratamento de erros e retries.
- Ao final, você será capaz de estimar e medir o custo de cada chamada (tokens de input vs. output) e reduzi-lo com prompt caching.
- Ao final, você será capaz de montar uma avaliação sistemática mínima para comparar versões de um prompt.

## 🗺️ Por que isso importa

Esta é, provavelmente, a habilidade de maior retorno imediato de todo o programa. Prompt engineering profissional não é coleção de "truques mágicos" de rede social — é especificação de comportamento: você está escrevendo o contrato entre seu sistema e um modelo probabilístico. Empresas que colocam LLMs em produção vivem disso: um prompt bem estruturado com saída validada é a diferença entre uma feature confiável e um chatbot que quebra o parser do backend uma vez por hora.

E o prompt não vive sozinho: ele viaja dentro de uma chamada de API que custa dinheiro, falha com rate limit, precisa de streaming para não parecer travada e não pode vazar a chave da empresa no GitHub. O engenheiro de IA é julgado por esse pacote completo. Tudo que você aprender aqui será usado diariamente nos módulos de RAG (7) e Agentes, e o hábito de *medir* prompts em vez de opinar sobre eles é o gancho para o Módulo 10 (Avaliação).

## 📚 Aulas

| # | Aula | Tipo | Recurso | Duração estimada |
|---|------|------|---------|------------------|
| 1 | Prompt Engineering Interactive Tutorial (Anthropic) | 💻 lab | [github.com/anthropics/courses](https://github.com/anthropics/courses) | 3h00 |
| 2 | Guia de prompting (técnicas com exemplos) | 📖 leitura | [promptingguide.ai](https://www.promptingguide.ai) | 1h30 |
| 3 | ChatGPT Prompt Engineering for Developers | 🎥 vídeo | [deeplearning.ai/short-courses](https://www.deeplearning.ai/short-courses/) | 1h30 |
| 4 | Documentação da API da Anthropic | 📖 leitura | [docs.claude.com](https://docs.claude.com) | 1h00 |
| 5 | Documentação da API da OpenAI + Cookbook | 📖 leitura | [platform.openai.com/docs](https://platform.openai.com/docs) · [cookbook.openai.com](https://cookbook.openai.com) | 1h00 |
| 6 | Praticando de graça no Google AI Studio | 💻 lab | [aistudio.google.com](https://aistudio.google.com) | 0h30 |
| 7 | Lab guiado: classificador com structured output e custo medido | 💻 lab | Seção 💻 abaixo | 1h30 |

## 🧠 Conteúdo essencial

### 6.1 Anatomia de um prompt profissional: system vs. user

As APIs de chat separam papéis. O **system prompt** define quem o modelo é, as regras e o formato — é o "manual do funcionário", escrito por você, desenvolvedor. O **user** carrega o dado da vez. Misturar tudo em uma string única funciona em demo e apodrece em produção.

```
system: Você é um classificador de tickets de suporte de uma fintech.
        Responda APENAS com uma das categorias: cobranca, acesso, bug, outro.
user:   Não consigo entrar na minha conta desde ontem.
```

Regras práticas: instruções estáveis e persona → system; dados variáveis → user; nunca concatene input do usuário dentro do system (além de bagunçar, facilita prompt injection).

### 6.2 As técnicas que realmente importam

- **Few-shot**: mostre 2-5 exemplos de entrada → saída antes do caso real. É a técnica com melhor custo-benefício que existe: modelos imitam padrões muito melhor do que seguem descrições abstratas. Exemplos > adjetivos.
- **Chain-of-thought (CoT)**: para tarefas com raciocínio (matemática, lógica, decisões com critérios), peça o raciocínio antes da resposta ("pense passo a passo antes de responder; depois dê a resposta final"). Nota de 2026: os modelos de raciocínio atuais já fazem isso internamente — o CoT explícito importa mais em modelos simples e em tarefas onde você quer *auditar* o raciocínio.
- **Delimitadores e tags XML**: envolva cada bloco de conteúdo em marcadores claros: `<documento>...</documento>`, `<exemplos>...</exemplos>`. O modelo para de confundir instrução com dado, e você consegue extrair a resposta com um parser bobo. Tags XML são particularmente bem interpretadas pelos modelos Claude.
- **Prefill (nota histórica)**: começar a resposta do assistente por ele (ex.: enviar `{` como início da resposta para forçar JSON) foi uma técnica popular. Nos modelos Claude atuais (família 4.6+) o prefill de última mensagem foi **removido da API** (retorna erro 400) porque o structured output resolve o mesmo problema com garantia. Conheça o conceito; use a ferramenta moderna.
- **Pedir o formato de saída explicitamente**: sempre. "Responda em JSON com as chaves X e Y", "responda com uma única palavra". Modelo sem formato pedido devolve prosa simpática que ninguém consegue parsear.

### 6.3 Structured output: JSON garantido, não JSON prometido

Pedir JSON no prompt dá certo 95% das vezes — e os 5% derrubam seu pipeline às 3 da manhã. **Structured output** resolve na raiz: você passa um schema e a API *restringe a geração* para que a saída seja válida contra ele. No SDK da Anthropic, o caminho recomendado é `client.messages.parse()` com um modelo Pydantic (você recebe um objeto Python validado, não uma string); a OpenAI tem o equivalente com `response_format`/parse no SDK dela. Use structured output sempre que a resposta alimentar código; deixe texto livre só para texto destinado a humanos.

### 6.4 Chamando as APIs de verdade

Instale os SDKs oficiais (`pip install anthropic openai`) e **nunca** coloque a chave no código — exporte `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` no ambiente e deixe o SDK encontrá-las:

```python
import anthropic

client = anthropic.Anthropic()  # lê ANTHROPIC_API_KEY do ambiente

resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    system="Você é um assistente conciso. Responda em português.",
    messages=[{"role": "user", "content": "O que é um token?"}],
)
print(resp.content[0].text)
print(resp.usage.input_tokens, resp.usage.output_tokens)  # a conta chega aqui
```

O SDK da OpenAI segue o mesmo espírito com `client.chat.completions.create(model=..., messages=[...])`. Para praticar sem cartão de crédito, o [Google AI Studio](https://aistudio.google.com) oferece um free tier generoso — ótimo para exercícios; os conceitos (roles, tokens, streaming) são idênticos.

### 6.5 Streaming: ninguém espera 20 segundos olhando um spinner

Respostas longas devem ser transmitidas token a token para o usuário. Nos SDKs isso é um gerenciador de contexto:

```python
with client.messages.stream(
    model="claude-opus-4-8",
    max_tokens=2048,
    messages=[{"role": "user", "content": "Explique embeddings em 3 parágrafos."}],
) as stream:
    for texto in stream.text_stream:
        print(texto, end="", flush=True)
    final = stream.get_final_message()   # objeto completo, com usage
```

Regra prática: chat com humano na ponta → sempre streaming; pipeline batch → pode ser síncrono. Streaming também protege contra timeouts HTTP em respostas longas.

### 6.6 Tokens, custo e prompt caching

Você paga por token, e **output custa ~5× mais que input** (na Anthropic: Claude Opus 4.8 sai a US$ 5,00/milhão de tokens de input e US$ 25,00/milhão de output; Haiku 4.5, o modelo econômico, US$ 1,00/US$ 5,00). Três consequências de engenharia:

1. **Meça antes**: `client.messages.count_tokens(...)` diz quantos tokens seu prompt tem sem gastar nada. Não use estimadores de outros provedores (tiktoken é da OpenAI e erra para Claude).
2. **Controle o output**: é a parte cara. Peça respostas curtas, use `max_tokens` como teto e structured output (que naturalmente limita a prosa).
3. **Prompt caching**: se o começo do prompt se repete entre chamadas (system prompt grande, documentos fixos, exemplos few-shot), marque-o com `cache_control={"type": "ephemeral"}`. Leituras do cache custam ~10% do preço normal. Atenção: cache é casamento de **prefixo exato** — qualquer byte diferente no início (um timestamp, por exemplo) invalida tudo. Conteúdo estável primeiro, conteúdo variável no final.

Custo por chamada = `input_tokens × preço_input + output_tokens × preço_output`. Faça essa conta virar hábito — o lab abaixo automatiza.

### 6.7 Erros, retries e a regra número 1 de segurança

Chamadas de API falham: `429` (rate limit), `500/529` (servidor sobrecarregado), erros de rede. Os SDKs oficiais já fazem retry automático com backoff exponencial para esses casos (configurável via `max_retries`). Sua parte é capturar as exceções tipadas — da mais específica para a mais genérica — e nunca fazer retry de erro 4xx de validação (repetir um request inválido só queima cota):

```python
try:
    resp = client.messages.create(...)
except anthropic.RateLimitError:
    ...  # espere e tente de novo (o SDK já tentou 2x)
except anthropic.APIStatusError as e:
    ...  # logue e.status_code e e.message
except anthropic.APIConnectionError:
    ...  # problema de rede
```

**Segurança básica, inegociável:** chave de API nunca vai para o código, nem para o Git. Use variáveis de ambiente ou secret manager; adicione `.env` ao `.gitignore`; se uma chave vazar, revogue imediatamente (bots varrem o GitHub em minutos). Chave vazada = fatura de milhares de dólares no seu nome.

### 6.8 Avaliando prompts como engenheiro (gancho para o Módulo 10)

"Esse prompt parece melhor" não é engenharia. O fluxo mínimo profissional:

1. Monte um **conjunto de teste**: 20-50 exemplos reais com a resposta esperada (gabarito).
2. Rode cada versão do prompt sobre o conjunto inteiro.
3. Meça: acurácia/F1 para classificação; validade do JSON para extração; custo e latência sempre.
4. Só promova a versão que vence **nos números**.

Duas versões de prompt podem parecer iguais no olho e diferir 15 pontos de acurácia no conjunto de teste. No Módulo 10 isso vira disciplina completa (LLM-as-judge, regressão de prompts, datasets de avaliação); por ora, o hábito basta: **nunca troque um prompt em produção sem rodar o conjunto de teste antes**.

## 💻 Lab guiado

**Objetivo:** construir um classificador de sentimento com extração estruturada via API da Anthropic, medindo o custo real de cada chamada. Precisa de `ANTHROPIC_API_KEY` exportada no ambiente (ou adapte para o SDK do provedor que você tiver; a estrutura é a mesma).

```python
# ── 1. Setup ────────────────────────────────────────────────
# pip install anthropic pydantic
# export ANTHROPIC_API_KEY="sua-chave"   (no shell, NUNCA no código)
import anthropic
from pydantic import BaseModel
from typing import Literal

client = anthropic.Anthropic()
MODEL = "claude-opus-4-8"
PRECO_INPUT = 5.00 / 1_000_000    # US$ por token de input (Opus 4.8)
PRECO_OUTPUT = 25.00 / 1_000_000  # US$ por token de output

# ── 2. Schema da saída: o contrato com o modelo ─────────────
class AnaliseSentimento(BaseModel):
    sentimento: Literal["positivo", "negativo", "neutro"]
    confianca: float          # 0.0 a 1.0
    aspecto: str              # sobre O QUE é o sentimento (ex.: "entrega")
    resumo: str               # 1 frase

SYSTEM = """Você analisa avaliações de clientes de e-commerce em português.
Classifique o sentimento, identifique o aspecto principal e resuma em 1 frase.
Seja conservador na confiança: use < 0.7 quando o texto for ambíguo."""

# ── 3. Função de classificação com structured output ────────
def classificar(avaliacao: str) -> tuple[AnaliseSentimento, float]:
    resp = client.messages.parse(
        model=MODEL,
        max_tokens=1024,
        system=SYSTEM,
        messages=[{
            "role": "user",
            "content": f"<avaliacao>\n{avaliacao}\n</avaliacao>",
        }],
        output_format=AnaliseSentimento,   # Pydantic vira schema; saída validada
    )
    custo = (resp.usage.input_tokens * PRECO_INPUT
             + resp.usage.output_tokens * PRECO_OUTPUT)
    return resp.parsed_output, custo

# ── 4. Rodando sobre um mini-dataset ────────────────────────
avaliacoes = [
    "Chegou em 2 dias, embalagem impecável. Recomendo demais!",
    "O produto é ok, mas o atendimento pós-venda foi horrível.",
    "Ainda estou testando, por enquanto sem opinião formada.",
    "Veio quebrado e ninguém responde meus e-mails. Nunca mais.",
    "Preço justo, qualidade acima do esperado para o valor.",
]

custo_total = 0.0
for texto in avaliacoes:
    analise, custo = classificar(texto)
    custo_total += custo
    print(f"[{analise.sentimento:8}] conf={analise.confianca:.2f} "
          f"aspecto={analise.aspecto!r} custo=US${custo:.5f}")
    print(f"           {analise.resumo}")

print(f"\nCusto total das {len(avaliacoes)} chamadas: US${custo_total:.5f}")
print(f"Custo projetado para 100 mil avaliações: US${custo_total/len(avaliacoes)*100_000:.2f}")

# ── 5. Contando tokens ANTES de gastar ──────────────────────
contagem = client.messages.count_tokens(
    model=MODEL,
    system=SYSTEM,
    messages=[{"role": "user", "content": f"<avaliacao>\n{avaliacoes[0]}\n</avaliacao>"}],
)
print(f"\nTokens de input da 1ª chamada (medidos sem custo): {contagem.input_tokens}")
```

**Experimentos obrigatórios:** (a) quebre o schema de propósito (mude `Literal` para valores que o texto não permite) e observe o comportamento; (b) adicione 3 exemplos few-shot no system e verifique se a `confianca` fica mais bem calibrada; (c) calcule quanto custaria o mesmo pipeline com os preços de um modelo econômico (ex.: US$ 1,00/US$ 5,00 por milhão) e discuta o trade-off qualidade × custo.

## 🚀 Mini-projeto

**Enunciado:** construa um **extrator estruturado de dados de currículos** (ou de anúncios de vagas, à sua escolha): recebe texto livre e devolve JSON validado com nome, cargo/título, skills (lista), anos de experiência e senioridade estimada — com avaliação sistemática de duas versões do prompt.

**Requisitos:**

1. Schema Pydantic com pelo menos 5 campos, incluindo uma lista e um `Literal` (ex.: senioridade: junior/pleno/senior).
2. Uso de structured output (nada de `json.loads` em texto livre torcendo para dar certo).
3. Conjunto de teste com ≥ 15 exemplos e gabarito (pode gerar os textos sinteticamente, mas o gabarito é seu).
4. Duas versões de prompt (ex.: v1 sem few-shot, v2 com 3 exemplos) avaliadas sobre o MESMO conjunto.
5. Relatório: acurácia por campo, custo médio por chamada e custo projetado para 10 mil documentos, para cada versão.
6. Tratamento de erros com as exceções tipadas do SDK e streaming em pelo menos um caminho interativo do código.

### 🧭 Passo a passo

Reserve ~4h30 no total (pode dividir em 2 ou 3 sessões). Siga na ordem — cada etapa termina com um **checkpoint**; só avance quando ele passar.

**Etapa 1 — Preparar o projeto e a chave (20 min)**

1. Crie a pasta `modulo06-extrator` no seu repositório e instale as dependências: `pip install anthropic pydantic`.
2. Gere sua chave no console do provedor (para a Anthropic: [console.anthropic.com](https://console.anthropic.com) → *API Keys*) e exporte no shell — **nunca** no código nem no Git (seção 6.7): `export ANTHROPIC_API_KEY="sua-chave"`. Se usar arquivo `.env`, adicione-o ao `.gitignore` AGORA, antes do primeiro commit.
3. Confirme a conexão sem gastar nada, com `count_tokens` (seção 6.6): `python -c "import anthropic; c = anthropic.Anthropic(); print(c.messages.count_tokens(model='claude-opus-4-8', messages=[{'role': 'user', 'content': 'oi'}]).input_tokens)"`

✅ **Checkpoint:** o comando imprime um número de tokens, sem erro de autenticação.

**Etapa 2 — Escrever o schema Pydantic (20 min)**

Crie `extrator.py` começando pelo contrato, igual ao passo 2 do lab guiado (a seção 6.3 explica o porquê):

```python
from pydantic import BaseModel
from typing import Literal

class Curriculo(BaseModel):
    nome: str
    cargo: str
    skills: list[str]
    anos_experiencia: int
    senioridade: Literal["junior", "pleno", "senior"]
```

✅ **Checkpoint:** `Curriculo(nome="Ana", cargo="Dev", skills=["python"], anos_experiencia=3, senioridade="pleno")` roda; trocar para `senioridade="chefe"` levanta `ValidationError`.

**Etapa 3 — Gerar os 15 textos e montar o gabarito (45 min)**

1. Use o próprio LLM para os textos: peça (no chat ou via API) "escreva 15 mini-currículos fictícios em português, variados em área e senioridade, 4-6 linhas cada". Salve como lista de strings em `dados/curriculos.json`.
2. O **gabarito é seu**: leia cada texto e preencha à mão `dados/gabarito.json` — lista de 15 objetos com exatamente os campos do schema. Cuidado com a grafia do `Literal` ("senior" sem acento, igual ao schema).

✅ **Checkpoint:** um script de 5 linhas com `json.load` valida os 15 itens com `Curriculo(**item)` sem erro.

**Etapa 4 — Função de extração com structured output (30 min)**

Adapte a `classificar()` do lab guiado (passo 3), reaproveitando o setup dele (`client`, `MODEL`, preços): mesmo esqueleto, trocando o schema e a tag XML (seção 6.2):

```python
def extrair(texto: str, system: str) -> tuple[Curriculo, float]:
    resp = client.messages.parse(
        model=MODEL, max_tokens=1024, system=system,
        messages=[{"role": "user", "content": f"<curriculo>\n{texto}\n</curriculo>"}],
        output_format=Curriculo,
    )
    custo = resp.usage.input_tokens * PRECO_INPUT + resp.usage.output_tokens * PRECO_OUTPUT
    return resp.parsed_output, custo
```

✅ **Checkpoint:** `extrair(curriculos[0], "Extraia os dados do currículo.")` devolve um objeto `Curriculo` validado, impresso no terminal.

**Etapa 5 — Escrever as duas versões do prompt (30 min)**

1. `SYSTEM_V1`: o mais ingênuo possível, 2-3 linhas descrevendo a tarefa. Resista a melhorá-lo — a graça é *medir* a diferença.
2. `SYSTEM_V2`: o mesmo texto + 3 exemplos few-shot entrada → saída dentro de `<exemplos>` (seção 6.2). Use 3 currículos que **não** estão no conjunto de teste.
3. Meça cada versão com `count_tokens` antes do lote (é critério de aceite) e anote os números.

✅ **Checkpoint:** as duas constantes existem no código e você sabe quantos tokens de input cada versão custa.

**Etapa 6 — Avaliar as duas versões no MESMO conjunto (45 min)**

Crie `avaliar.py`: para cada versão, rode `extrair()` nos 15 textos, compare campo a campo com o gabarito (para `skills`, compare como conjuntos: `set(previsto) == set(esperado)`) e acumule acertos por campo e custo. Envolva a chamada nas exceções tipadas da seção 6.7:

```python
try:
    previsto, custo = extrair(texto, system)
except anthropic.RateLimitError:
    time.sleep(30); continue      # e registre o caso pulado
# trate também APIStatusError e APIConnectionError, como na seção 6.7
```

✅ **Checkpoint:** o script percorre os 15 exemplos nas duas versões sem morrer no meio e imprime acertos por campo e custo total.

**Etapa 7 — Relatório v1 × v2 (30 min)**

Monte `relatorio.md` com uma tabela: uma linha por campo, colunas acurácia v1 / acurácia v2; abaixo, custo médio por chamada de cada versão e custo projetado para 10 mil documentos (`custo_medio × 10_000`, seção 6.6). Feche com um parágrafo dizendo qual versão venceu e **pelos números** de quais campos.

✅ **Checkpoint:** a tabela responde "qual versão vai para produção?" sem precisar de opinião.

**Etapa 8 — Streaming, README e entrega (30 min)**

1. Adicione um caminho interativo: um modo em que você cola um currículo no terminal e vê um resumo do candidato ser transmitido token a token com `client.messages.stream` (copie a estrutura da seção 6.5), antes ou depois da extração estruturada.
2. Escreva o README curto (instalar, variáveis de ambiente, como rodar), confira que nenhuma chave vazou (`git log -p | grep -i "sk-"` deve voltar vazio) e faça commit e push.

✅ **Checkpoint:** todos os critérios de aceite abaixo marcados.

**🆘 Se travar:** `ValidationError` do Pydantic no gabarito ou na avaliação → quase sempre é grafia fora do `Literal` ("sênior"/"Senior" em vez de "senior") ou campo faltando no JSON — alinhe gabarito e schema letra a letra; erro de autenticação ("could not resolve authentication method" / 401) → a chave não está no ambiente **deste** shell: confira com `echo $ANTHROPIC_API_KEY` e re-exporte; 429 ou orçamento estourando → teste com 3 exemplos antes do lote completo, reduza `max_tokens` e, se precisar, rode a avaliação no free tier do Google AI Studio deixando só a rodada final na API paga (dica do módulo). Travou 30+ minutos em qualquer etapa → pergunte ao seu assistente de IA colando o erro completo e dizendo em qual etapa está (mas peça a *explicação*, não só a resposta — o objetivo é treinar).

**Critérios de aceite:**

- [ ] 100% das saídas validam contra o schema (é o ponto do structured output).
- [ ] Tabela comparativa v1 × v2 com acurácia por campo e custo.
- [ ] A versão vencedora foi escolhida pelos números, e o relatório justifica.
- [ ] Nenhuma chave de API aparece no código ou no repositório (confira o histórico do Git!).
- [ ] `count_tokens` usado para estimar custo antes das execuções em lote.
- [ ] README curto explicando como rodar (variáveis de ambiente incluídas).

**Dicas:** para o gabarito, planilha simples resolve; comece pelo prompt v1 mais ingênuo possível — a graça é *medir* a melhora do few-shot, não assumir; se o orçamento apertar, rode a avaliação no free tier do Google AI Studio e apenas as execuções finais na API paga.

## ✅ Quiz

1. O que deve ir no system prompt?
   - A) Os dados variáveis de cada requisição
   - B) Persona, regras e formato estáveis, definidos pelo desenvolvedor
   - C) O histórico completo da conversa
   - D) A chave de API

2. Qual é a maneira mais confiável de obter JSON válido de um LLM?
   - A) Pedir "por favor, retorne JSON válido" em maiúsculas
   - B) Structured output com schema (a API restringe a geração)
   - C) Aumentar a temperatura
   - D) Usar regex para consertar a saída

3. Few-shot prompting consiste em:
   - A) Reduzir o número de tokens do prompt
   - B) Incluir exemplos de entrada → saída antes do caso real
   - C) Fazer várias chamadas e votar na resposta
   - D) Treinar o modelo com poucos dados

4. Por que tokens de output merecem mais atenção que os de input no custo?
   - A) Porque são mais numerosos
   - B) Porque custam por unidade em torno de 5× mais que os de input
   - C) Porque não podem ser cacheados
   - D) Porque incluem o system prompt

5. Prompt caching economiza quando:
   - A) O final do prompt se repete entre chamadas
   - B) O prefixo do prompt é idêntico byte a byte entre chamadas
   - C) A temperatura é zero
   - D) O modelo é pequeno

6. Recebeu HTTP 429 da API. O que significa e o que fazer?
   - A) Chave inválida; gerar outra
   - B) Rate limit; aguardar e tentar novamente com backoff (os SDKs já fazem)
   - C) Erro de schema; corrigir o JSON
   - D) Modelo aposentado; trocar o ID

7. Qual prática de segurança é obrigatória com chaves de API?
   - A) Guardar em variável de ambiente/secret manager, fora do código e do Git
   - B) Codificar em base64 dentro do código
   - C) Compartilhar por e-mail com o time
   - D) Colocar num arquivo config.json versionado

8. Como decidir entre duas versões de um prompt de forma profissional?
   - A) Escolher a mais curta (custa menos)
   - B) Rodar ambas sobre um conjunto de teste com gabarito e comparar métricas
   - C) Perguntar ao próprio LLM qual é melhor
   - D) Testar uma vez cada e ir no feeling

<details><summary>Ver respostas</summary>

1. **B** — system é o contrato estável escrito pelo desenvolvedor; dados da vez vão no user.
2. **B** — structured output restringe a geração ao schema; prompt "pedindo" JSON falha na cauda dos casos.
3. **B** — exemplos concretos ensinam o padrão melhor que qualquer descrição; é a técnica de melhor custo-benefício.
4. **B** — na tabela de preços, output ≈ 5× input (ex.: US$ 5 vs. US$ 25 por milhão no Opus 4.8); controlar o tamanho da resposta é a alavanca de custo.
5. **B** — cache é casamento de prefixo exato: um byte diferente no início invalida tudo dali para frente.
6. **B** — 429 é excesso de requisições; retry com backoff exponencial (automático nos SDKs oficiais).
7. **A** — chave no código/Git vaza e vira fatura; ambiente ou secret manager, sempre.
8. **B** — avaliação sistemática sobre conjunto de teste; "parece melhor" não é métrica. É o gancho do Módulo 10.

</details>

## 🃏 Flashcards

| Frente | Verso |
|--------|-------|
| System vs. user prompt | System = regras e persona estáveis (do dev); user = dados variáveis da requisição |
| Few-shot | 2-5 exemplos entrada→saída no prompt; modelos imitam padrões melhor que seguem descrições |
| Chain-of-thought | Pedir raciocínio antes da resposta; útil em tarefas de lógica e para auditar o caminho |
| Tags XML no prompt | Delimitam dado vs. instrução (`<doc>...</doc>`); reduzem confusão e facilitam parsing |
| Structured output | Schema (ex.: Pydantic) que restringe a geração; JSON garantido, não prometido |
| Streaming | Receber a resposta token a token; obrigatório em interfaces com humanos |
| Custo de uma chamada | input_tokens × preço_in + output_tokens × preço_out (output ≈ 5× mais caro) |
| Prompt caching | Prefixo repetido marcado para cache; leitura custa ~10% — mas exige prefixo idêntico |
| HTTP 429 | Rate limit — retry com backoff exponencial; nunca retry em 4xx de validação |
| Regra nº 1 de segurança | Chave de API em variável de ambiente/secret manager; jamais no código ou no Git |

## ☑️ Checklist de conclusão

- [ ] Completei o Prompt Engineering Interactive Tutorial da Anthropic
- [ ] Sei estruturar um prompt com system/user, few-shot e tags XML sem consultar nada
- [ ] Rodei o lab do classificador e fiz os 3 experimentos obrigatórios
- [ ] Fiz pelo menos uma chamada com streaming e uma com prompt caching
- [ ] Minha chave de API está em variável de ambiente e o `.gitignore` cobre `.env`
- [ ] Entreguei o mini-projeto com avaliação v1 × v2 baseada em números
- [ ] Sei calcular de cabeça o custo aproximado de uma chamada dado o preço por milhão
- [ ] Acertei pelo menos 6 de 8 no quiz
