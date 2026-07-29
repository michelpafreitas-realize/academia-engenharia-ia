# Módulo 8 — Agentes de IA & Tool Use

> 🏛️ Período 3 · ⏱️ Carga estimada: 12h · 📋 Pré-requisitos: Módulo 6 (Fundamentos de APIs de LLM e Prompt Engineering)

## 🎯 Objetivos

- Ao final, você será capaz de explicar o que é um agente de IA (um LLM em loop com ferramentas e feedback do ambiente) e diferenciá-lo de um workflow determinístico.
- Ao final, você será capaz de implementar function calling / tool use do zero: definir o schema da ferramenta, interpretar o pedido do modelo, executar a função e devolver o resultado.
- Ao final, você será capaz de escrever o loop de agente completo em Python puro, sem frameworks, em cerca de 60 linhas.
- Ao final, você será capaz de decidir quando usar MCP (Model Context Protocol), multi-agente ou framework — e quando isso é exagero.
- Ao final, você será capaz de estimar e controlar custos de agentes (tokens acumulados a cada iteração do loop).

## 🗺️ Por que isso importa

Agentes são hoje a fronteira mais quente da engenharia de IA em empresas. O chatbot que só responde perguntas virou commodity; o que as empresas estão pagando caro para construir são sistemas que *fazem* coisas: consultam o CRM, abrem tickets, executam consultas SQL, cruzam planilhas e devolvem uma ação concluída — não só um texto. Quem entende o mecanismo por baixo (o loop de tool use) consegue depurar, estimar custo e projetar guardrails. Quem só sabe chamar `framework.run()` fica travado no primeiro comportamento inesperado — e agentes têm *muitos* comportamentos inesperados.

Há também um filtro de senioridade embutido aqui. A Anthropic, no artigo "Building effective agents", resume a lição que times de produção aprenderam apanhando: **a maioria dos problemas não precisa de agente** — precisa de um workflow simples, mais barato e mais previsível. O engenheiro de IA profissional é reconhecido exatamente por essa capacidade de escolher o padrão mais simples que resolve, e de subir a escada de complexidade (prompt único → workflow → agente → multi-agente) apenas quando a evidência pede. Este módulo ensina o mecanismo e o critério.

## 📚 Aulas

| # | Aula | Tipo | Recurso | Duração estimada |
|---|------|------|---------|------------------|
| 1 | Building effective agents (o artigo que define o campo) | 📖 leitura | [anthropic.com/engineering/building-effective-agents](https://www.anthropic.com/engineering/building-effective-agents) | 45 min |
| 2 | Curso de tool use da Anthropic (notebooks práticos) | 💻 lab | [github.com/anthropics/courses](https://github.com/anthropics/courses) | 2h |
| 3 | AI Agents Course da Hugging Face (unidades 1 e 2, grátis) | 🎥 vídeo + 📖 leitura | [huggingface.co/learn](https://huggingface.co/learn) | 2h |
| 4 | Introdução ao MCP: o que são servers e clients | 📖 leitura | [modelcontextprotocol.io](https://modelcontextprotocol.io) | 1h |
| 5 | LangGraph Academy: orquestração de agentes com grafos | 🎥 vídeo + 💻 lab | [academy.langchain.com](https://academy.langchain.com) | 2h |
| 6 | Receitas de agentes e tool use no OpenAI Cookbook | 📖 leitura | [cookbook.openai.com](https://cookbook.openai.com) | 1h |
| 7 | Lab guiado: agente em Python puro com 2 tools | 💻 lab | este módulo, seção Lab guiado | 2h |
| 8 | Mini-projeto: agente de análise de CSV | 💻 lab | este módulo, seção Mini-projeto | 1h30 |

## 🧠 Conteúdo essencial

### 1. O que é um agente, afinal?

A definição mais útil é operacional: **agente = LLM rodando em loop, com acesso a ferramentas, decidindo sozinho o próximo passo com base no feedback do ambiente**. Compare:

- **Chamada única**: você manda um prompt, recebe um texto. Fim.
- **Workflow**: *você* escreve o fluxo em código ("primeiro classifica, depois extrai, depois formata"). O LLM executa etapas, mas quem decide a ordem é o seu `if/else`.
- **Agente**: o *modelo* decide a ordem. Ele olha o objetivo, escolhe uma ferramenta, vê o resultado, decide o próximo passo — e repete até concluir ou desistir.

Uma analogia: o workflow é uma linha de montagem (cada estação faz uma coisa, na ordem fixa); o agente é um estagiário competente com acesso ao computador da empresa. A linha de montagem é previsível e barata. O estagiário resolve problemas que ninguém previu — mas pode dar voltas, custar caro e fazer besteira. Você escolhe conforme o problema.

### 2. Tool use passo a passo

O mecanismo de function calling (na API da Anthropic, "tool use") tem sempre 4 passos, em qualquer provedor:

1. **Você declara as ferramentas** no request, cada uma com nome, descrição e um JSON Schema dos parâmetros:

```json
{
  "name": "calculadora",
  "description": "Avalia uma expressão aritmética. Use para qualquer conta.",
  "input_schema": {
    "type": "object",
    "properties": {
      "expressao": {"type": "string", "description": "Ex.: '2 * (3 + 4)'"}
    },
    "required": ["expressao"]
  }
}
```

2. **O modelo não executa nada.** Se decidir usar a ferramenta, ele responde com um bloco `tool_use` contendo `name`, um `id` e o `input` preenchido — e o `stop_reason` da resposta vem como `"tool_use"`. Isso é um *pedido*, não uma execução.
3. **Você executa a função** no seu código, com o input que o modelo pediu.
4. **Você devolve o resultado** num novo turno de usuário, como bloco `tool_result` amarrado ao `id` do pedido. O modelo lê o resultado e continua — respondendo ao usuário ou pedindo outra ferramenta.

Detalhe que derruba iniciantes: a API é *stateless*. A cada rodada você reenvia a conversa inteira, incluindo a resposta do assistente com o bloco `tool_use` e o seu `tool_result`. Se o modelo pedir várias ferramentas de uma vez (chamadas paralelas), devolva **todos** os `tool_result` em uma única mensagem de usuário.

A qualidade da `description` é o fator nº 1 de acerto. O modelo decide *quando* chamar a tool lendo a descrição — seja prescritivo: "Use esta ferramenta sempre que a pergunta envolver preços atuais" funciona melhor que "busca preços".

### 3. O loop de agente à mão

Todo agente, de qualquer framework, se reduz a este esqueleto (o lab traz a versão completa):

```python
messages = [{"role": "user", "content": objetivo}]
while True:
    resposta = client.messages.create(model=MODELO, tools=TOOLS,
                                      max_tokens=4096, messages=messages)
    messages.append({"role": "assistant", "content": resposta.content})
    if resposta.stop_reason != "tool_use":
        break  # o modelo terminou: não quer mais ferramentas
    resultados = []
    for bloco in resposta.content:
        if bloco.type == "tool_use":
            saida = executar_tool(bloco.name, bloco.input)  # seu código
            resultados.append({"type": "tool_result",
                               "tool_use_id": bloco.id, "content": saida})
    messages.append({"role": "user", "content": resultados})
```

É isso. LangGraph, CrewAI e afins adicionam conveniências (estado, retries, tracing) em volta *deste* loop. Sabendo escrevê-lo à mão, você nunca mais trata framework como caixa-preta. Duas proteções obrigatórias em produção: um **limite de iterações** (agente pode entrar em círculos) e **erro devolvido como `tool_result` com `is_error: true`** — o modelo lê a mensagem de erro e tenta outro caminho, em vez de o seu programa explodir.

### 4. O padrão ReAct

ReAct (*Reasoning + Acting*, do paper de Yao et al., 2022) é o padrão mental do loop: o modelo alterna **Thought** (raciocina sobre o que sabe e o que falta), **Action** (chama uma ferramenta) e **Observation** (lê o resultado), repetindo até ter a resposta. Nos primórdios, isso era induzido via prompt ("pense passo a passo, depois escreva Action: ..."), e o texto era parseado com regex. Hoje o tool use nativo das APIs cumpre o papel do "Action" de forma estruturada, e modelos com raciocínio embutido cumprem o "Thought" — mas o vocabulário ReAct continua onipresente em papers, docs e entrevistas. Quando alguém diz "agente ReAct", entenda: LLM em loop de pensar → agir → observar.

### 5. Workflows vs agentes: prefira o mais simples

O artigo "Building effective agents" da Anthropic propõe uma taxonomia que virou referência da indústria:

| Padrão | O que é | Quando usar |
|--------|---------|-------------|
| Prompt chaining | Saída de uma chamada vira entrada da próxima | Tarefa decomponível em etapas fixas |
| Routing | Um classificador direciona para prompts especializados | Tipos de entrada distintos e conhecidos |
| Parallelization | Várias chamadas simultâneas, resultados agregados | Subtarefas independentes; votação |
| Orchestrator-workers | Um LLM decompõe e delega para workers | Subtarefas imprevisíveis em número |
| Evaluator-optimizer | Um LLM gera, outro critica, itera | Qualidade com critério claro de avaliação |
| **Agente** | LLM em loop autônomo com tools | Tarefa aberta, nº de passos imprevisível |

Os cinco primeiros são **workflows**: o caminho está no seu código. A regra de ouro do artigo: *comece pelo padrão mais simples que resolve e só suba de nível com evidência*. Agentes trocam previsibilidade e custo por flexibilidade. Antes de construir um, cheque quatro critérios: a tarefa é complexa demais para roteirizar? O valor justifica latência e custo maiores? O modelo é viável nesse tipo de tarefa? O custo de um erro é recuperável (dá para revisar, testar, reverter)? Um "não" em qualquer um = fique no workflow.

### 6. MCP: o padrão de conexão da indústria

O problema clássico: cada ferramenta (Slack, GitHub, Postgres...) precisava de integração própria para cada app de IA — um problema M×N. O **MCP (Model Context Protocol)**, protocolo aberto criado pela Anthropic e adotado amplamente pela indústria ([modelcontextprotocol.io](https://modelcontextprotocol.io)), transforma isso em M+N, como o USB fez com periféricos:

- **MCP server**: um programa que *expõe* capacidades — tools (ações), resources (dados) e prompts — num formato padrão. Ex.: um server de Postgres expõe `query_database`.
- **MCP client**: o app de IA (Claude Code, um agente seu, uma IDE) que se conecta a servers e apresenta as tools deles ao modelo.

Do ponto de vista do LLM, uma tool vinda de MCP é indistinguível de uma tool sua: mesmo schema, mesmo fluxo `tool_use` → `tool_result`. A diferença é de arquitetura: quem escreve o server (geralmente o dono do serviço) o escreve **uma vez**, e qualquer client compatível o usa. Para o engenheiro de IA, isso significa: antes de escrever integração, procure um MCP server pronto; e quando expuser um sistema interno para agentes, exponha como MCP server, não como API proprietária.

### 7. Multi-agente, memória — e quando é exagero

**Multi-agente** (padrão orquestrador + trabalhadores): um agente coordenador decompõe a tarefa e delega a subagentes, cada um com contexto e ferramentas próprios. O benefício real é **isolamento de contexto** — um subagente que lê 50 arquivos devolve só a conclusão, sem entupir a janela do orquestrador. Sinais de que vale a pena: subtarefas realmente independentes/paralelizáveis, ou contexto que estoura a janela. Sinais de exagero (o caso comum): "agente pesquisador + agente escritor + agente revisor" para algo que um prompt encadeado resolve. Cada agente extra multiplica tokens, latência e modos de falha. Comece com um agente só.

**Memória**: a janela de contexto é a memória de curto prazo e acaba. Estratégias em ordem de complexidade: (a) *truncar/janelar* o histórico; (b) *sumarizar* turnos antigos (compaction); (c) *memória externa* — o agente escreve notas em arquivos ou banco e as consulta em sessões futuras (é assim que o `CLAUDE.md` do Claude Code funciona); (d) memória por busca semântica, reaproveitando o RAG do Módulo 7. Regra prática: (a) e (b) resolvem sessões longas; (c) resolve persistência entre sessões; (d) só quando o volume de notas cresce demais.

### 8. Frameworks e custos

**Frameworks** — quando usar cada coisa:

- **Código puro**: até ~3 tools e um loop simples. Você já sabe fazer (seção 3). Máximo controle e transparência; melhor opção para aprender e para a maioria dos MVPs.
- **LangGraph** ([academy.langchain.com](https://academy.langchain.com)): quando o fluxo é um grafo com estado, ciclos e checkpoints (retomar execução, human-in-the-loop persistente).
- **OpenAI Agents SDK / Claude Agent SDK**: SDKs oficiais com loop, handoffs e guardrails prontos; o Claude Agent SDK traz o harness do Claude Code (tools de arquivo, bash, subagentes) como biblioteca.
- **CrewAI**: abstração de "equipes" de agentes com papéis; prototipagem rápida de multi-agente.

O critério ponytail: framework compra conveniência ao preço de opacidade. Se você não consegue explicar o que o framework faz por baixo, ainda não é hora de usá-lo.

**Custos**: agentes queimam tokens em ritmo quadrático-ish. A cada iteração você reenvia o histórico inteiro, que só cresce (cada `tool_result` entra no contexto de todas as iterações seguintes). Um agente de 10 passos com resultados de 2k tokens cada custa muito mais que 10 chamadas isoladas. Mitigações essenciais: **prompt caching** (o prefixo estável — system + tools + histórico antigo — é lido do cache a ~10% do preço), **limite de iterações**, **tool results enxutos** (devolva os 5 resultados relevantes, não o dump de 200), modelo menor para subtarefas simples, e log de `usage` por request para saber onde o dinheiro vai (isso vira disciplina no Módulo 11).

## 💻 Lab guiado

Objetivo: um agente em Python puro com **2 tools** (calculadora e busca em arquivo), loop de tool use escrito à mão. Roda local ou no Colab.

**Passo 1 — Setup**

```bash
pip install anthropic
export ANTHROPIC_API_KEY="sua-chave"   # console.claude.com
```

**Passo 2 — Crie `notas.txt`** (a "base de conhecimento" da tool de busca):

```
Cliente Alfa: contrato de R$ 4.500/mês, vence em 12/09.
Cliente Beta: contrato de R$ 12.000/mês, vence em 30/11.
Cliente Gama: contrato de R$ 7.250/mês, vence em 05/10.
Política de reajuste: 8% ao ano para contratos acima de R$ 10.000.
```

**Passo 3 — `agente.py`** (completo e executável):

```python
"""Agente minimalista: LLM em loop com 2 tools, sem framework."""
import re
import anthropic

client = anthropic.Anthropic()  # lê ANTHROPIC_API_KEY do ambiente
MODELO = "claude-opus-4-8"
MAX_ITERACOES = 8  # trava de segurança: agente não roda para sempre

TOOLS = [
    {
        "name": "calculadora",
        "description": "Avalia uma expressão aritmética em Python "
                       "(ex.: '4500 * 12 * 1.08'). Use para QUALQUER conta; "
                       "nunca calcule de cabeça.",
        "input_schema": {
            "type": "object",
            "properties": {"expressao": {"type": "string"}},
            "required": ["expressao"],
        },
    },
    {
        "name": "busca_arquivo",
        "description": "Busca um termo no arquivo notas.txt e retorna as "
                       "linhas que o contêm. Use para consultar dados de "
                       "clientes e políticas.",
        "input_schema": {
            "type": "object",
            "properties": {"termo": {"type": "string"}},
            "required": ["termo"],
        },
    },
]

def calculadora(expressao: str) -> str:
    # Allowlist de caracteres: só aritmética. eval() cru seria injeção de código.
    if not re.fullmatch(r"[0-9+\-*/(). %]+", expressao):
        return "Erro: expressão contém caracteres não permitidos."
    try:
        return str(eval(expressao, {"__builtins__": {}}, {}))
    except Exception as e:
        return f"Erro ao calcular: {e}"

def busca_arquivo(termo: str) -> str:
    with open("notas.txt", encoding="utf-8") as f:
        achados = [l.strip() for l in f if termo.lower() in l.lower()]
    return "\n".join(achados) or f"Nada encontrado para '{termo}'."

def executar_tool(nome: str, entrada: dict) -> str:
    if nome == "calculadora":
        return calculadora(entrada["expressao"])
    if nome == "busca_arquivo":
        return busca_arquivo(entrada["termo"])
    return f"Tool desconhecida: {nome}"

def rodar_agente(objetivo: str) -> str:
    messages = [{"role": "user", "content": objetivo}]
    for i in range(MAX_ITERACOES):
        resp = client.messages.create(
            model=MODELO, max_tokens=4096, tools=TOOLS, messages=messages
        )
        # ecoa a resposta do assistente no histórico (inclui blocos tool_use)
        messages.append({"role": "assistant", "content": resp.content})

        if resp.stop_reason != "tool_use":  # terminou: resposta final
            return next(b.text for b in resp.content if b.type == "text")

        resultados = []
        for bloco in resp.content:
            if bloco.type == "tool_use":
                print(f"[{i}] tool: {bloco.name}({bloco.input})")
                saida = executar_tool(bloco.name, bloco.input)
                print(f"    -> {saida[:80]}")
                resultados.append({"type": "tool_result",
                                   "tool_use_id": bloco.id, "content": saida})
        messages.append({"role": "user", "content": resultados})
    return "Limite de iterações atingido sem resposta final."

if __name__ == "__main__":
    pergunta = ("Qual é o valor anual do contrato do Cliente Beta com o "
                "reajuste aplicável segundo a nossa política?")
    print("\nRESPOSTA FINAL:\n", rodar_agente(pergunta))
```

**Passo 4 — Execute e observe.** Você deve ver o agente encadear sozinho: `busca_arquivo("Beta")` → `busca_arquivo("reajuste")` → `calculadora("12000 * 12 * 1.08")` → resposta final (R$ 155.520). Ninguém programou essa ordem — o modelo decidiu. Isso é o agente.

**Passo 5 — Experimentos** (faça pelo menos dois):
1. Piore de propósito a description da calculadora para "faz contas" e observe o modelo passar a calcular de cabeça ou usar mal a tool.
2. Pergunte algo que exige as duas tools em sequência diferente ("Qual cliente tem o contrato que vence primeiro e quanto ele paga por ano?").
3. Imprima `resp.usage` a cada iteração e some `input_tokens`: veja o custo crescer a cada volta do loop.

## 🚀 Mini-projeto

**Enunciado**: construa o **"Analista de CSV"** — um agente que responde perguntas de negócio sobre um arquivo CSV (use um dataset real, ex.: vendas exportadas de uma planilha sua) usando o loop escrito à mão do lab.

**Requisitos**:
- Mínimo 3 tools: `listar_colunas()` (nomes + tipos), `estatisticas(coluna)` (média, min, max, soma via pandas) e `filtrar(coluna, valor)` (linhas correspondentes, limitado a 20).
- Loop de tool use escrito à mão (proibido framework), com limite de iterações e tratamento de erro via `tool_result` com `is_error: true`.
- Interface de linha de comando: o usuário digita perguntas em loop (`while True: input()`), com histórico mantido entre perguntas.
- Log de cada chamada de tool (nome + input + primeiros 100 chars da saída) e do total de tokens da sessão ao final.

### 🧭 Passo a passo

Reserve ~1h30 no total (pode dividir em 2 sessões). Siga na ordem — cada etapa termina com um **checkpoint**; só avance quando ele passar.

**Etapa 1 — Preparar o projeto e o CSV (10 min)**

1. Crie a pasta do projeto, copie o `agente.py` do lab para ela como `analista.py` (você vai evoluí-lo, não começar do zero) e rode `pip install anthropic pandas` (a `ANTHROPIC_API_KEY` do lab continua valendo).
2. Salve um CSV real na pasta como `dados.csv` — vendas exportadas de uma planilha sua servem; precisa de ao menos 1 coluna numérica e 1 categórica.

✅ **Checkpoint:** `python -c "import pandas as pd; print(pd.read_csv('dados.csv').shape)"` imprime as dimensões do seu CSV.

**Etapa 2 — As 3 funções pandas, ainda sem LLM (25 min)**

Em `analista.py`, apague `calculadora` e `busca_arquivo` e escreva as 3 funções dos Requisitos. Toda tool devolve **string** — o modelo lê texto, não DataFrame:

```python
import pandas as pd
df = pd.read_csv("dados.csv")

def listar_colunas() -> str:
    return "\n".join(f"{c}: {t}" for c, t in df.dtypes.astype(str).items())

def estatisticas(coluna: str) -> str:
    s = df[coluna]  # KeyError se a coluna não existir — a Etapa 4 trata isso
    return f"média={s.mean():.2f} min={s.min()} max={s.max()} soma={s.sum():.2f}"

def filtrar(coluna: str, valor: str) -> str:
    achados = df[df[coluna].astype(str) == str(valor)].head(20)
    return achados.to_string() if len(achados) else "Nenhuma linha encontrada."
```

Antes de envolver o modelo, teste cada uma com uma chamada direta no fim do arquivo: `print(listar_colunas())`, `print(estatisticas("valor"))`, `print(filtrar("cidade", "Fortaleza"))` — trocando pelos nomes de colunas do SEU CSV.

✅ **Checkpoint:** `python analista.py` imprime as 3 saídas corretas, sem nenhuma chamada de API.

**Etapa 3 — Schemas das tools e loop do lab (20 min)**

Troque a lista `TOOLS` do lab por 3 schemas (mesmo formato JSON da seção 2) e seja prescritivo nas descriptions — é o fator nº 1 de acerto:

- `listar_colunas`: "Lista nomes e tipos das colunas do CSV. Chame SEMPRE antes de qualquer outra tool, para saber quais colunas existem." Sem parâmetros: `"properties": {}` e `"required": []`.
- `estatisticas`: parâmetro `coluna` (string); "média, min, max e soma de uma coluna numérica".
- `filtrar`: parâmetros `coluna` e `valor` (strings); "retorna até 20 linhas onde coluna == valor".

Atualize `executar_tool` para despachar pelos 3 nomes novos (mesmo `if nome == ...` do lab), apague os prints de teste da Etapa 2 e troque a pergunta do `__main__` por uma sobre o seu CSV. `rodar_agente`, `MODELO` e `MAX_ITERACOES` ficam exatamente como no lab (a seção 3 explica cada linha do loop).

✅ **Checkpoint:** `python analista.py` mostra no log o modelo chamando `listar_colunas` e depois `estatisticas`, e a resposta final bate com o número que você viu na Etapa 2.

**Etapa 4 — Erro vira `tool_result` com `is_error` (15 min)**

Hoje uma coluna errada derruba o programa com `KeyError`. Dentro do loop de `rodar_agente`, envolva a execução e sinalize o erro para o modelo:

```python
try:
    saida = executar_tool(bloco.name, bloco.input)
    erro = False
except Exception as e:
    saida, erro = f"Erro: {e}", True
resultados.append({"type": "tool_result", "tool_use_id": bloco.id,
                   "content": saida, "is_error": erro})
```

✅ **Checkpoint:** pergunte por uma coluna que não existe; o programa NÃO quebra — o log mostra o erro devolvido e o modelo chamando `listar_colunas` para se corrigir.

**Etapa 5 — CLI com histórico entre perguntas (15 min)**

Mude a assinatura para `rodar_agente(messages)` (apague a linha que criava `messages` lá dentro — o resto do loop fica igual) e substitua o `__main__` por:

```python
messages = []
while True:
    pergunta = input("\nPergunta (ou 'sair'): ").strip()
    if pergunta.lower() == "sair":
        break
    messages.append({"role": "user", "content": pergunta})
    print(rodar_agente(messages))
```

✅ **Checkpoint:** pergunte "qual coluna tem os valores de venda?" e depois "e qual a média dela?" — a segunda resposta usa o contexto da primeira.

**Etapa 6 — Log das tools e total de tokens (10 min)**

O lab já imprime cada chamada de tool; ajuste o print da saída para `saida[:100]`. Para os tokens, crie `total_tokens = 0` no topo do arquivo e, após cada `client.messages.create(...)`, some `total_tokens += resp.usage.input_tokens + resp.usage.output_tokens` (declare `global total_tokens` na função). Ao sair da CLI (`break`), imprima `f"Total de tokens da sessão: {total_tokens}"`.

✅ **Checkpoint:** ao digitar "sair", o total de tokens aparece — e cresce a cada pergunta extra (a seção 8 explica por quê).

**Etapa 7 — Bater os critérios de aceite + README (15 min)**

1. Faça 5 perguntas distintas, incluindo uma que exija 2+ tools encadeadas ("qual a média de valor das linhas da cidade X?"), e teste o limite de iterações com uma pergunta impossível ("qual será a venda de 2030?").
2. Escreva um `README.md` curto: como instalar, como rodar, e uma sessão de exemplo colada do terminal.

✅ **Checkpoint:** todos os critérios de aceite abaixo marcados.

**🆘 Se travar:** o modelo chama tool com coluna inexistente → esperado; confirme que o erro volta com `is_error: true` e reforce na description de `listar_colunas` que ela vem PRIMEIRO; o agente repete a mesma tool em círculo até estourar `MAX_ITERACOES` → a saída da tool não está respondendo o que ele precisa (imprima-a inteira e leia como se você fosse o modelo); a API dá erro logo após um `tool_use` → você esqueceu de devolver o `tool_result` correspondente (todo pedido de tool exige resposta no turno seguinte de usuário); travou 30+ minutos em qualquer etapa → pergunte ao seu assistente de IA colando o erro completo e a etapa em que está — e peça a *explicação*, não só a resposta.

**Critérios de aceite**:
- [ ] Responde corretamente a pelo menos 5 perguntas distintas sobre o CSV, incluindo uma que exija 2+ tools encadeadas
- [ ] Erro de tool (ex.: coluna inexistente) não derruba o programa — o agente recebe o erro e se corrige
- [ ] Limite de iterações funciona (teste com uma pergunta impossível)
- [ ] Tokens totais da sessão impressos ao final
- [ ] README com instruções de execução e um exemplo de sessão colado

**Dicas**: comece copiando o lab e trocando as tools. Devolva os resultados de tool como texto compacto (o modelo lê texto, não DataFrames). Se o agente "alucinar" colunas, melhore a description de `listar_colunas` dizendo para chamá-la *antes* de qualquer outra tool.

## ✅ Quiz

**1.** O que melhor define um agente de IA, na prática?
A) Qualquer sistema que usa um LLM
B) Um LLM em loop que escolhe ferramentas com base no feedback do ambiente
C) Um pipeline de prompts encadeados em ordem fixa
D) Um chatbot com memória de conversas

**2.** No fluxo de tool use, quem executa a função quando o modelo emite um bloco `tool_use`?
A) O provedor do modelo, no servidor
B) O próprio modelo, em sandbox
C) O seu código, que depois devolve um `tool_result`
D) Ninguém — o bloco é apenas ilustrativo

**3.** O modelo pediu 3 tools em uma única resposta. Como devolver os resultados?
A) Três mensagens de usuário, uma por resultado
B) Uma única mensagem de usuário com os três blocos `tool_result`
C) Uma mensagem de assistente com os resultados
D) Reenviar o prompt original com os resultados no system

**4.** Segundo o artigo "Building effective agents", qual é a recomendação central?
A) Sempre usar multi-agente para tarefas sérias
B) Usar o padrão mais simples que resolve; agente só quando flexibilidade justifica custo
C) Evitar workflows, que são tecnologia ultrapassada
D) Usar frameworks para garantir previsibilidade

**5.** O que o MCP padroniza?
A) O formato dos pesos de modelos abertos
B) A conexão entre apps de IA (clients) e capacidades externas (servers) — tools, resources e prompts
C) O protocolo de streaming de tokens
D) A avaliação de agentes em benchmarks

**6.** No padrão ReAct, a sequência de um ciclo é:
A) Action → Thought → Observation
B) Thought → Action → Observation
C) Observation → Reward → Action
D) Plan → Execute → Commit

**7.** Por que agentes tendem a custar caro em tokens?
A) Porque tools são cobradas em dobro
B) Porque cada iteração reenvia o histórico inteiro, que cresce a cada tool result
C) Porque o modelo de agente é mais caro por token
D) Porque agentes exigem contexto de 1M de tokens

**8.** Qual sinal indica que multi-agente é provavelmente exagero?
A) Subtarefas independentes que podem rodar em paralelo
B) Contexto que estoura a janela de um agente só
C) Uma tarefa linear que um prompt encadeado resolve, dividida em "papéis" por estética
D) Necessidade de isolar o contexto de uma pesquisa longa

<details><summary>Ver respostas</summary>

**1-B.** A definição operacional: LLM + loop + tools + feedback do ambiente, com o modelo decidindo o próximo passo. (A) é genérico demais; (C) descreve workflow; (D) descreve um chatbot.

**2-C.** O bloco `tool_use` é um *pedido*: a execução acontece no seu código, e você devolve o resultado via `tool_result`. (Tools executadas no servidor do provedor existem, mas são a exceção, não o mecanismo geral.)

**3-B.** Todos os `tool_result` vão em **uma única** mensagem de usuário. Separar em várias mensagens quebra o padrão esperado pela API e ensina o modelo a parar de paralelizar.

**4-B.** A tese do artigo: comece simples (prompt → workflow) e adote agente apenas quando a tarefa aberta justificar o custo em previsibilidade, latência e tokens.

**5-B.** MCP transforma o problema de integração M×N em M+N: servers expõem capacidades uma vez; qualquer client compatível as consome. Analogia padrão: o USB dos apps de IA.

**6-B.** Thought (raciocinar) → Action (agir/ferramenta) → Observation (ler resultado), repetindo até concluir. O tool use nativo estruturou o "Action" que antes era parseado de texto.

**7-B.** A API é stateless: cada iteração reenvia todo o histórico, e cada `tool_result` engorda o contexto de todas as iterações seguintes. Prompt caching e tool results enxutos são as mitigações.

**8-C.** Multi-agente se justifica por paralelismo real ou isolamento de contexto (A, B, D são justificativas válidas). Dividir uma tarefa linear em "personagens" só multiplica custo e modos de falha.

</details>

## 🃏 Flashcards

| Frente | Verso |
|--------|-------|
| Definição operacional de agente | LLM em loop com ferramentas, decidindo o próximo passo pelo feedback do ambiente |
| Os 4 passos do tool use | Declarar schema → modelo emite `tool_use` → você executa → devolve `tool_result` |
| O que indica `stop_reason: "tool_use"` | O modelo quer que você execute uma ferramenta e devolva o resultado |
| Workflow vs agente | Workflow: caminho definido no seu código. Agente: o modelo decide o caminho |
| Regra de ouro de "Building effective agents" | Prefira o padrão mais simples que resolve; suba de complexidade só com evidência |
| MCP em uma frase | Protocolo aberto que padroniza como apps de IA (clients) consomem tools/dados de servers — o "USB" da IA |
| Padrão ReAct | Ciclo Thought → Action → Observation repetido até a resposta final |
| Por que agente queima tokens | Histórico inteiro reenviado a cada iteração; cada tool result engorda todas as seguintes |
| Duas proteções obrigatórias no loop | Limite de iterações e erros devolvidos como `tool_result` com `is_error: true` |
| Quando usar framework de agentes | Quando precisar de estado/checkpoints/tracing prontos — e você souber explicar o que ele faz por baixo |

## ☑️ Checklist de conclusão

- [ ] Li "Building effective agents" e sei citar os 5 padrões de workflow + quando um agente se justifica
- [ ] Escrevi o loop de agente à mão e ele rodou com as 2 tools do lab
- [ ] Provoquei e tratei um erro de tool sem derrubar o programa
- [ ] Medi o custo em tokens de uma sessão de agente, iteração por iteração
- [ ] Sei explicar MCP (servers, clients e o problema M×N) em 2 minutos, sem consultar nada
- [ ] Entreguei o mini-projeto "Analista de CSV" com todos os critérios de aceite
- [ ] Sei defender, com argumentos, quando NÃO usar agente nem multi-agente
