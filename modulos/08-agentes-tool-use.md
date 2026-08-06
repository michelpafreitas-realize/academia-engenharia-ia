# Módulo 8 — Agentes, Tool Use, MCP & Orquestração

> 🏛️ Período 3 · ⏱️ Carga estimada: 16h · 📋 Pré-requisitos: Módulo 7 (RAG)

## 🎯 Objetivos

- Ao final, você será capaz de explicar o que é um agente de IA (um LLM em loop com ferramentas e feedback do ambiente) e decidir, com os critérios de "Building effective agents", quando usar workflow e quando usar agente.
- Ao final, você será capaz de ler um loop de tool use linha a linha e explicar cada decisão do código: schema, `stop_reason`, `tool_result`, limite de iterações e tratamento de erro.
- Ao final, você será capaz de reconhecer os padrões multi-agente (orquestrador-executores, paralelismo, verificador adversarial) e identificar quando cada um se paga — e quando é exagero.
- Ao final, você será capaz de explicar o MCP (servers, clients, o problema M×N) e o computer use em visão geral, situando cada um na arquitetura de um sistema agêntico.
- Ao final, você será capaz de dissecar uma ferramenta de agentic coding (Claude Code, Cursor) como agente: qual é o loop, quais são as tools, como o contexto é gerido — conectando com a ferramenta que você usa desde o Módulo 0.
- Ao final, você será capaz de especificar, dirigir a construção e verificar (com traces e evals) um agente real, e defender com números a escolha entre agente e workflow.

## 🎛️ Núcleo manual deste módulo

O núcleo manual aqui é **ler e explicar o loop de tool use linha a linha** — o lab traz o loop completo e você o executa, instrumenta e narra cada linha em voz alta, porque é essa compreensão que permite depurar qualquer agente de qualquer framework. Todo o resto — construir o agente do mini-projeto, o workflow equivalente, os scripts de medição — você dirige com IA.

## 🗺️ Por que isso importa

Agentes são hoje a fronteira mais quente da engenharia de IA em empresas. O chatbot que só responde perguntas virou commodity; o que as empresas pagam caro para construir são sistemas que *fazem* coisas: consultam o CRM, abrem tickets, executam SQL, cruzam planilhas e devolvem uma ação concluída. E há uma segunda razão, mais pessoal: **você trabalha dentro de um agente desde o Módulo 0**. Claude Code, Cursor e afins são exatamente o que este módulo ensina — um LLM em loop com ferramentas de arquivo, bash e busca. Entender o mecanismo transforma a sua ferramenta de trabalho de caixa-preta em sistema que você sabe dirigir, depurar e imitar.

O filtro de senioridade do módulo é o critério, não o código. A Anthropic, em "Building effective agents", resume a lição que times de produção aprenderam apanhando: **a maioria dos problemas não precisa de agente** — precisa de um workflow mais simples, mais barato e mais previsível. O engenheiro de 2026 é reconhecido por escolher o padrão mais simples que resolve e subir a escada (prompt único → workflow → agente → multi-agente) apenas com evidência — e por *provar* a escolha com números de custo, latência e taxa de acerto, que é exatamente o que o mini-projeto deste módulo exige. Isso conecta direto com o Módulo 10 (evals) e o Módulo 11 (LLMOps).

## 📚 Aulas

| # | Aula | Tipo | Recurso | Duração estimada |
|---|------|------|---------|------------------|
| 1 | Building effective agents (o artigo que define o campo) | 📖 leitura | [anthropic.com/engineering/building-effective-agents](https://www.anthropic.com/engineering/building-effective-agents) | 45 min |
| 2 | Curso de tool use da Anthropic (notebooks práticos) | 💻 lab | [github.com/anthropics/courses](https://github.com/anthropics/courses) | 2h |
| 3 | AI Agents Course da Hugging Face (unidades 1 e 2, grátis) | 🎥 vídeo + 📖 leitura | [huggingface.co/learn](https://huggingface.co/learn) | 2h |
| 4 | Introdução ao MCP: o que são servers e clients | 📖 leitura | [modelcontextprotocol.io](https://modelcontextprotocol.io) | 1h |
| 5 | Computer use e agentic coding na documentação da Anthropic | 📖 leitura | [platform.claude.com/docs](https://platform.claude.com/docs) | 1h |
| 6 | LangGraph Academy: orquestração de agentes com grafos | 🎥 vídeo + 💻 lab | [academy.langchain.com](https://academy.langchain.com) | 2h |
| 7 | Lab guiado: o loop de agente lido linha a linha | 💻 lab | este módulo, seção Lab guiado | 2h |
| 8 | Sessão de Direção: especificar e dirigir um agente com framework | 🎛️ sessão de direção | este módulo, seção Sessão de Direção | 2h |
| 9 | Mini-projeto: agente vs. workflow, com medição | 💻 lab | este módulo, seção Mini-projeto | 3h |

## 🧠 Conteúdo essencial

### 8.1 O que é um agente, afinal?

A definição mais útil é operacional: **agente = LLM rodando em loop, com acesso a ferramentas, decidindo sozinho o próximo passo com base no feedback do ambiente**. Compare:

- **Chamada única**: você manda um prompt, recebe um texto. Fim.
- **Workflow**: *você* escreve o fluxo em código ("primeiro classifica, depois extrai, depois formata"). O LLM executa etapas, mas quem decide a ordem é o seu `if/else`.
- **Agente**: o *modelo* decide a ordem. Ele olha o objetivo, escolhe uma ferramenta, vê o resultado, decide o próximo passo — e repete até concluir ou desistir.

Uma analogia: o workflow é uma linha de montagem (cada estação faz uma coisa, na ordem fixa); o agente é um estagiário competente com acesso ao computador da empresa. A linha de montagem é previsível e barata. O estagiário resolve problemas que ninguém previu — mas pode dar voltas, custar caro e fazer besteira. Você escolhe conforme o problema — e este módulo termina com você *medindo* essa escolha.

### 8.2 Tool use passo a passo

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

### 8.3 O loop de agente, lido linha a linha

Todo agente, de qualquer framework, se reduz a este esqueleto — e o seu trabalho aqui é *entendê-lo*, não datilografá-lo (o lab traz a versão completa para você executar e narrar):

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

É isso. LangGraph, CrewAI, o Claude Agent SDK e afins adicionam conveniências (estado, retries, tracing) em volta *deste* loop. Quem consegue explicar cada linha nunca mais trata framework como caixa-preta — e é essa explicação, não a digitação, que a Defesa do módulo vai cobrar. Duas proteções obrigatórias em produção: um **limite de iterações** (agente pode entrar em círculos) e **erro devolvido como `tool_result` com `is_error: true`** — o modelo lê a mensagem de erro e tenta outro caminho, em vez de o seu programa explodir.

O vocabulário histórico: **ReAct** (*Reasoning + Acting*, Yao et al., 2022) é o padrão mental do loop — o modelo alterna Thought (raciocina), Action (chama ferramenta) e Observation (lê o resultado). Nos primórdios isso era induzido via prompt e parseado com regex; hoje o tool use nativo estrutura o "Action" e modelos com raciocínio embutido cumprem o "Thought". Quando alguém diz "agente ReAct", entenda: LLM em loop de pensar → agir → observar.

### 8.4 Workflows vs. agentes: a espinha dorsal da decisão

O artigo "Building effective agents" da Anthropic propõe a taxonomia que virou referência da indústria — memorize-a, porque ela é a espinha deste módulo:

| Padrão | O que é | Quando usar |
|--------|---------|-------------|
| Prompt chaining | Saída de uma chamada vira entrada da próxima | Tarefa decomponível em etapas fixas |
| Routing | Um classificador direciona para prompts especializados | Tipos de entrada distintos e conhecidos |
| Parallelization | Várias chamadas simultâneas, resultados agregados | Subtarefas independentes; votação |
| Orchestrator-workers | Um LLM decompõe e delega para workers | Subtarefas imprevisíveis em número |
| Evaluator-optimizer | Um LLM gera, outro critica, itera | Qualidade com critério claro de avaliação |
| **Agente** | LLM em loop autônomo com tools | Tarefa aberta, nº de passos imprevisível |

Os cinco primeiros são **workflows**: o caminho está no seu código, o custo é previsível, o comportamento é testável passo a passo. A regra de ouro do artigo: *comece pelo padrão mais simples que resolve e só suba de nível com evidência*. Antes de construir um agente, cheque quatro critérios: (1) a tarefa é complexa demais para roteirizar? (2) o valor justifica latência e custo maiores? (3) o modelo é viável nesse tipo de tarefa? (4) o custo de um erro é recuperável — dá para revisar, testar, reverter? Um "não" em qualquer um = fique no workflow.

O que este módulo acrescenta à leitura: **essa decisão é mensurável**. Um workflow determinístico e um agente que resolvem a mesma tarefa podem ser comparados em três eixos — custo (tokens), latência (segundos) e taxa de acerto (evals) — e é essa comparação medida que o mini-projeto exige. "Achismo arquitetural" morre quando você tem os três números na mesa.

### 8.5 MCP: o padrão de conexão da indústria

O problema clássico: cada ferramenta (Slack, GitHub, Postgres...) precisava de integração própria para cada app de IA — um problema M×N. O **MCP (Model Context Protocol)**, protocolo aberto criado pela Anthropic e adotado amplamente pela indústria ([modelcontextprotocol.io](https://modelcontextprotocol.io)), transforma isso em M+N, como o USB fez com periféricos:

- **MCP server**: um programa que *expõe* capacidades — tools (ações), resources (dados) e prompts — num formato padrão. Ex.: um server de Postgres expõe `query_database`.
- **MCP client**: o app de IA (Claude Code, um agente seu, uma IDE) que se conecta a servers e apresenta as tools deles ao modelo.

Do ponto de vista do LLM, uma tool vinda de MCP é indistinguível de uma tool sua: mesmo schema, mesmo fluxo `tool_use` → `tool_result`. A diferença é de arquitetura: quem escreve o server (geralmente o dono do serviço) o escreve **uma vez**, e qualquer client compatível o usa. Para o engenheiro de IA, isso significa: antes de escrever integração, procure um MCP server pronto; e quando expuser um sistema interno para agentes, exponha como MCP server, não como API proprietária.

### 8.6 Padrões multi-agente: orquestrador, paralelismo e verificador adversarial

Quando um agente só não basta, três padrões cobrem quase tudo que a indústria usa em produção:

**Orquestrador-executores** (orchestrator-workers): um agente coordenador decompõe a tarefa e delega a subagentes, cada um com contexto e ferramentas próprios. O benefício real é **isolamento de contexto** — um subagente que lê 50 arquivos devolve só a conclusão, sem entupir a janela do orquestrador. O orquestrador paga o preço da coordenação: cada delegação re-estabelece contexto, e ele precisa ler os relatórios de volta.

**Paralelismo**: subtarefas genuinamente independentes rodam ao mesmo tempo (vários subagentes investigando módulos diferentes de um repositório, várias fontes sendo pesquisadas). O ganho é de latência de parede, não de tokens — você paga todos os subagentes, mas espera só pelo mais lento. Só se paga quando as subtarefas *não dependem* umas das outras; paralelizar uma tarefa sequencial só adiciona custo de coordenação.

**Verificador adversarial** (writer-verifier): um agente produz, outro — com contexto limpo e instrução de criticar — verifica contra a especificação. O contexto fresco é o segredo: o verificador não carrega os vieses da sessão que produziu o trabalho, então enxerga o que o produtor não enxerga (é o mesmo princípio do "Code Review Reverso" do Módulo 1, agora automatizado). Times de produção relatam que um verificador separado supera autocrítica na mesma sessão.

Sinais de exagero (o caso comum): "agente pesquisador + agente escritor + agente revisor" para algo que um prompt encadeado resolve. Cada agente extra multiplica tokens, latência e modos de falha. Comece com um agente só; suba para multi-agente quando houver paralelismo real, contexto que estoura a janela, ou verificação que exige contexto limpo.

**Memória** completa o quadro: a janela de contexto é a memória de curto prazo e acaba. Estratégias em ordem de complexidade: (a) *truncar/janelar* o histórico; (b) *sumarizar* turnos antigos (compaction); (c) *memória externa* — o agente escreve notas em arquivos e as consulta em sessões futuras (é assim que o `CLAUDE.md` do Claude Code funciona); (d) memória por busca semântica, reaproveitando o RAG do Módulo 7. Regra prática: (a) e (b) resolvem sessões longas; (c) resolve persistência entre sessões; (d) só quando o volume de notas cresce demais.

### 8.7 Computer use: o agente que enxerga a tela

**Computer use** é tool use levado ao limite: em vez de ferramentas específicas (`buscar_cliente`, `query_database`), o agente recebe três ferramentas genéricas — *tirar screenshot*, *mover/clicar o mouse*, *digitar no teclado* — e opera qualquer software feito para humanos. O loop é o mesmo da seção 8.3: o modelo pede um screenshot (`tool_use`), você captura e devolve a imagem (`tool_result`), ele decide onde clicar, você executa o clique, e assim por diante.

Por que importa: é a ponte para os sistemas *sem* API — ERPs legados, sites de terceiros, aplicações desktop. Por que é visão geral e não prática neste módulo: computer use ainda é mais lento, mais caro (cada screenshot custa milhares de tokens de imagem) e menos confiável que tools dedicadas. O critério de engenharia é claro: **se existe API ou MCP server, use-os; computer use é o último recurso**, para quando a única interface disponível é a tela. Saiba que existe, saiba o mecanismo, e reconheça quando alguém está usando um martelo de screenshot para um problema que tem API.

### 8.8 Estudo de caso: Claude Code e Cursor dissecados como agentes

Aqui o módulo fecha o círculo com o seu dia a dia. A ferramenta com que você constrói desde o Módulo 0 **é um agente do tipo que este módulo ensina** — e agora você tem o vocabulário para dissecá-la:

- **O loop**: quando você pede "corrija o bug do login", o Claude Code roda exatamente o esqueleto da seção 8.3 — o modelo decide o próximo passo, chama uma tool, lê o resultado, repete. O que você vê como "a IA trabalhando" é `stop_reason: "tool_use"` acontecendo dezenas de vezes.
- **As tools**: leitura e escrita de arquivos, edição por substituição de trecho, bash, busca por padrão (grep/glob), busca na web. Repare no design: a edição é uma tool dedicada (que pode validar "o arquivo mudou desde a última leitura?") em vez de tudo passar por bash — tools dedicadas dão ao harness pontos de controle que um comando opaco não dá. É o mesmo raciocínio que você usará ao desenhar as tools do seu agente.
- **O contexto**: o `CLAUDE.md` é memória externa (seção 8.6, estratégia c); a compactação automática quando a conversa cresce é sumarização (estratégia b); os subagentes que o Claude Code dispara para buscas amplas são orquestrador-executores com isolamento de contexto (seção 8.6). Cursor faz escolhas análogas com indexação do repositório.
- **Os guardrails**: pedido de permissão antes de comandos perigosos é humano-no-loop; o limite de iterações e o orçamento de contexto são as mesmas proteções do lab.

A lição de engenharia: essas ferramentas parecem mágica, mas são o conteúdo deste módulo montado com capricho — loop + tools bem desenhadas + gestão de contexto + guardrails. Quando o seu agente do mini-projeto se comportar mal, pergunte-se "como o Claude Code resolve isso?" e a resposta quase sempre estará em uma dessas quatro caixas. E na direção inversa: quando o Claude Code fizer algo inesperado, você agora sabe *onde* olhar.

### 8.9 Frameworks, SDKs e custos

**Frameworks** — quando usar cada coisa:

- **Código puro**: até ~3 tools e um loop simples. Máximo controle e transparência; melhor opção para entender e para a maioria dos MVPs.
- **Claude Agent SDK / OpenAI Agents SDK**: SDKs oficiais com loop, handoffs e guardrails prontos; o Claude Agent SDK traz o harness do Claude Code (tools de arquivo, bash, subagentes) como biblioteca — você programa o agente da seção 8.8.
- **LangGraph** ([academy.langchain.com](https://academy.langchain.com)): quando o fluxo é um grafo com estado, ciclos e checkpoints (retomar execução, human-in-the-loop persistente).
- **CrewAI**: abstração de "equipes" de agentes com papéis; prototipagem rápida de multi-agente.

O critério: framework compra conveniência ao preço de opacidade. A regra deste módulo não é "proibido framework" — é **"proibido caixa-preta"**: use o framework que quiser, desde que você consiga apontar onde está o loop da seção 8.3 dentro dele e ler os traces do que ele fez. A Sessão de Direção treina exatamente isso.

**Custos**: agentes queimam tokens em ritmo quadrático-ish. A cada iteração você reenvia o histórico inteiro, que só cresce (cada `tool_result` entra no contexto de todas as iterações seguintes). Um agente de 10 passos com resultados de 2k tokens cada custa muito mais que 10 chamadas isoladas. Mitigações essenciais: **prompt caching** (o prefixo estável — system + tools + histórico antigo — é lido do cache a ~10% do preço), **limite de iterações**, **tool results enxutos** (devolva os 5 resultados relevantes, não o dump de 200), modelo menor para subtarefas simples (Haiku 4.5 a US$1/5 por milhão vs. Opus 4.8 a US$5/25), e log de `usage` por request para saber onde o dinheiro vai (isso vira disciplina no Módulo 11).

## 💻 Lab guiado

Objetivo: **executar, instrumentar e explicar linha a linha** um agente em Python puro com 2 tools (calculadora e busca em arquivo). O código vem pronto — o exercício é a leitura ativa: você roda, observa o loop girar e narra cada linha como se estivesse ensinando alguém. Roda local ou no Colab.

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

**Passo 3 — `agente.py`** (completo e executável; peça ao seu assistente para digitá-lo, mas leia cada bloco antes de rodar):

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

**Passo 5 — A leitura linha a linha (o núcleo manual).** Abra `rodar_agente` e, sem consultar nada, explique em voz alta (ou escreva num `EXPLICACAO.md`): por que o `append` da resposta do assistente vem *antes* do teste de `stop_reason`? O que aconteceria se você esquecesse de devolver um `tool_result`? Por que os resultados vão numa mensagem de *usuário*? Onde exatamente o custo cresce a cada volta? Depois confira as suas respostas com o seu assistente de IA — peça para ele criticar a explicação, não para explicá-la por você primeiro.

**Experimentos obrigatórios** (faça pelo menos dois):
1. Piore de propósito a description da calculadora para "faz contas" e observe o modelo passar a calcular de cabeça ou usar mal a tool.
2. Pergunte algo que exige as duas tools em sequência diferente ("Qual cliente tem o contrato que vence primeiro e quanto ele paga por ano?").
3. Imprima `resp.usage` a cada iteração e some `input_tokens`: veja o custo crescer a cada volta do loop.
4. Comente o `messages.append` do `tool_result` e rode: leia o erro da API e explique-o com o vocabulário da seção 8.2.

## 🎛️ Sessão de Direção

A prática de direção deste módulo: **especificar e dirigir a construção de um agente usando um framework ou SDK à sua escolha** (Claude Agent SDK, LangGraph, CrewAI ou o tool runner do SDK da Anthropic), verificando o resultado com traces.

1. **Especifique** (20 min): escreva uma `SPEC.md` de um agente pequeno mas real — ex.: "agente que responde perguntas sobre os arquivos de um diretório" ou "agente que tria issues do meu repositório". A spec deve conter: objetivo, as 2–3 tools com nome/parâmetros/comportamento, critérios de aceite verificáveis ("responde X dado Y"), limite de iterações e orçamento de tokens por execução.
2. **Dirija** (50 min): entregue a spec ao seu assistente de IA e conduza a implementação com o framework escolhido. Não aceite a primeira versão: peça para o assistente apontar onde, dentro do framework, está o loop da seção 8.3 (a chamada ao modelo, o despacho de tools, a condição de parada) e anote no log da sessão.
3. **Verifique** (50 min): rode o agente em 5 casos da sua spec e inspecione os **traces** — a sequência de tool calls e resultados que o framework registra (verbose/debug do framework, ou os prints que você pedir para adicionar). Para cada caso, responda: o agente chamou as tools esperadas? Em quantas iterações? Quantos tokens? Algum caso em que ele deu voltas? Corrija a description de uma tool com base no que viu e meça de novo.

**Entregável**: a `SPEC.md` + um `SESSAO.md` com o log/resumo da sessão (o que você pediu, o que corrigiu, os traces dos 5 casos e a resposta à pergunta "onde está o loop dentro do framework?"). Esse material entra no repositório do mini-projeto.

## 🚀 Mini-projeto

**Enunciado**: construa o **"Analista de CSV — duas arquiteturas"**: um agente com tools que responde perguntas de negócio sobre um CSV real **e** um workflow determinístico que responde às mesmas perguntas — e compare os dois com números.

**Requisitos**:
1. **Especificação antes do código**: `SPEC.md` no repositório com objetivo, as tools, o conjunto de 10 perguntas-teste com respostas esperadas (o seu gabarito de eval) e os critérios de aceite — escrita ANTES de qualquer implementação.
2. **Agente** com mínimo 3 tools: `listar_colunas()` (nomes + tipos), `estatisticas(coluna)` (média, min, max, soma via pandas) e `filtrar(coluna, valor)` (linhas correspondentes, limitado a 20). Loop com limite de iterações e erro via `tool_result` com `is_error: true`. Você pode escrever o loop, dirigir a IA para escrevê-lo ou usar framework — desde que consiga explicar cada parte.
3. **Workflow determinístico equivalente**: um pipeline em código (ex.: classificar a pergunta em tipo → extrair coluna/valor com uma chamada de LLM → executar a função pandas certa → formatar) que responde ao mesmo conjunto de perguntas sem loop autônomo.
4. **Comparação medida**: um script `comparar.py` que roda as 10 perguntas do gabarito nas duas arquiteturas e imprime uma tabela com, por arquitetura: taxa de acerto (respostas que batem com o gabarito), tokens totais (via `usage`), custo estimado em US$ e latência média por pergunta.
5. **`DECISIONS.md`** registrando as decisões e trade-offs — incluindo o veredito: *para esta tarefa, qual arquitetura você usaria em produção e por quê*, defendido com os números do item 4 e os quatro critérios da seção 8.4.
6. **Defesa**: ser capaz de responder "por quê?" sobre qualquer linha entregue — inclusive as escritas pela IA. O Campus tem a Defesa por LLM; passe nela antes de dar o módulo por concluído.

### 🧭 Passo a passo

Reserve ~3h (pode dividir em 3 sessões). Cada etapa termina com um checkpoint; só avance quando ele passar.

**Etapa 1 — SPEC primeiro (25 min)**

1. Crie a pasta do projeto e salve um CSV real como `dados.csv` (vendas exportadas de uma planilha sua servem; precisa de ao menos 1 coluna numérica e 1 categórica). Rode `pip install anthropic pandas`.
2. Escreva a `SPEC.md`: objetivo, as 3 tools (nome, parâmetros, o que devolvem), e o **gabarito**: 10 perguntas sobre o SEU CSV com a resposta correta de cada uma (calcule as respostas manualmente ou com pandas direto — este gabarito é o seu eval, e evals ruins produzem conclusões ruins, como o Módulo 7 já mostrou).

✅ **Checkpoint:** `SPEC.md` existe com as 10 perguntas + respostas esperadas, e `python -c "import pandas as pd; print(pd.read_csv('dados.csv').shape)"` imprime as dimensões do CSV.

**Etapa 2 — O agente (45 min)**

Dirija a construção de `agente_csv.py`: as 3 funções pandas (toda tool devolve **string** — o modelo lê texto, não DataFrame), os 3 schemas com descriptions prescritivas ("Chame `listar_colunas` SEMPRE antes de qualquer outra tool"), e o loop com `MAX_ITERACOES` e `is_error`. O lab é o seu mapa: você já leu cada linha do loop, então revise o que a IA gerar com esse olhar.

```python
import pandas as pd
df = pd.read_csv("dados.csv")

def listar_colunas() -> str:
    return "\n".join(f"{c}: {t}" for c, t in df.dtypes.astype(str).items())

def estatisticas(coluna: str) -> str:
    s = df[coluna]  # KeyError vira tool_result com is_error no loop
    return f"média={s.mean():.2f} min={s.min()} max={s.max()} soma={s.sum():.2f}"

def filtrar(coluna: str, valor: str) -> str:
    achados = df[df[coluna].astype(str) == str(valor)].head(20)
    return achados.to_string() if len(achados) else "Nenhuma linha encontrada."
```

✅ **Checkpoint:** o agente responde corretamente a 3 perguntas do gabarito, o log mostra as tools sendo chamadas, e uma pergunta com coluna inexistente NÃO derruba o programa (o modelo lê o erro e se corrige).

**Etapa 3 — O workflow equivalente (45 min)**

Dirija a construção de `workflow_csv.py`: mesmo CSV, mesmas funções pandas, mas o caminho decidido pelo SEU código. Desenho sugerido (adapte na spec): uma única chamada de LLM que classifica a pergunta e extrai `{operacao, coluna, valor}` como JSON; um `if/elif` que executa a função pandas certa; uma chamada final opcional para formatar a resposta em linguagem natural. Sem loop, sem `stop_reason`, número de chamadas fixo e conhecido.

✅ **Checkpoint:** o workflow responde às mesmas 3 perguntas da Etapa 2, com número de chamadas de API fixo (imprima quantas foram).

**Etapa 4 — A comparação medida (35 min)**

Dirija a escrita de `comparar.py`: para cada uma das 10 perguntas do gabarito, rode as duas arquiteturas medindo tokens (`resp.usage.input_tokens + output_tokens` acumulados), latência (`time.perf_counter()`) e acerto (a resposta contém o valor esperado do gabarito — comparação simples de substring/número serve). Imprima a tabela final e o custo estimado (preços de referência: Opus 4.8 US$5/25 por milhão de tokens de entrada/saída; se usar Haiku 4.5, US$1/5).

✅ **Checkpoint:** `python comparar.py` imprime a tabela com taxa de acerto, tokens, custo e latência das duas arquiteturas nas 10 perguntas.

**Etapa 5 — Veredito, DECISIONS e publicação (30 min)**

1. Escreva o `DECISIONS.md`: as decisões de desenho de cada arquitetura, o que os números mostraram, e o veredito defendido (qual você usaria em produção *para esta tarefa* e o que faria a balança pender para o outro lado — ex.: perguntas mais abertas favorecem o agente; volume alto e perguntas previsíveis favorecem o workflow).
2. Atualize a `SPEC.md` se o escopo mudou no caminho (spec é documento vivo, mas a versão original fica no histórico do git).
3. `README.md` curto: como instalar, como rodar cada arquitetura e o `comparar.py`, com a tabela final colada.
4. Publique — confira antes que nenhuma chave de API vai junto (`git status`, `.env` no `.gitignore`):

```bash
git add .
git commit -m "Módulo 8: agente vs workflow no analista de CSV, com comparação medida"
git push
```

5. Faça a **Defesa** do módulo no Campus: espere perguntas como "por que o agente errou a pergunta 7 e o workflow não?" e "o que dobra primeiro se o CSV crescer 100×: o custo do agente ou o do workflow?".

✅ **Checkpoint:** projeto no GitHub com SPEC.md, DECISIONS.md, as duas implementações, `comparar.py` e a tabela no README — e Defesa aprovada no Campus.

**Critérios de aceite**:
- [ ] `SPEC.md` escrita antes do código, com gabarito de 10 perguntas
- [ ] Agente com 3+ tools, limite de iterações e erros via `is_error` (não derruba o programa)
- [ ] Workflow determinístico respondendo ao mesmo gabarito, com número fixo de chamadas
- [ ] `comparar.py` imprime taxa de acerto, tokens, custo e latência das duas arquiteturas
- [ ] `DECISIONS.md` com veredito defendido pelos números e pelos 4 critérios de "Building effective agents"
- [ ] Passei na Defesa do módulo no Campus
- [ ] Projeto no GitHub, sem nenhuma chave de API no código

> **Regra de ouro:** você pode usar IA para escrever qualquer código. Você não pode entregar nada que não consiga explicar e defender.

## 🧠 Quiz de fixação

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

**3.** Você precisa decidir entre um workflow e um agente para triagem de e-mails com 6 categorias conhecidas. Pelo critério de "Building effective agents":
A) Agente, porque e-mails são imprevisíveis
B) Workflow (routing), porque os tipos de entrada são distintos e conhecidos
C) Multi-agente, um por categoria
D) Computer use, para ler os e-mails na tela

**4.** Qual é o benefício REAL que justifica o padrão orquestrador-executores?
A) Mais agentes conversando produzem respostas mais inteligentes
B) Isolamento de contexto: o subagente lê 50 arquivos e devolve só a conclusão
C) Dispensa guardrails, porque os agentes se supervisionam
D) Reduz o custo total em tokens

**5.** No padrão verificador adversarial, por que o verificador roda com contexto limpo?
A) Para economizar tokens
B) Para não carregar os vieses da sessão que produziu o trabalho — ele critica contra a spec, não contra o histórico
C) Porque a API não permite compartilhar contexto
D) Para que ele possa usar um modelo mais barato

**6.** O que o MCP padroniza?
A) O formato dos pesos de modelos abertos
B) A conexão entre apps de IA (clients) e capacidades externas (servers) — tools, resources e prompts
C) O protocolo de streaming de tokens
D) A avaliação de agentes em benchmarks

**7.** Quando computer use é a escolha certa?
A) Sempre que houver uma interface gráfica disponível
B) Quando o sistema-alvo não tem API nem MCP server — a tela é a única interface
C) Quando você quer economizar tokens
D) Quando a tarefa exige respostas rápidas

**8.** O Claude Code, visto como agente, usa uma tool dedicada de edição de arquivos em vez de fazer tudo via bash. Por quê?
A) Bash não consegue editar arquivos
B) Tools dedicadas dão ao harness pontos de controle — validar que o arquivo não mudou, pedir permissão, auditar — que um comando opaco não dá
C) Porque a API cobra menos por tools dedicadas
D) Para impedir o modelo de usar o terminal

<details><summary>Ver respostas</summary>

1. **B** — A definição operacional: LLM + loop + tools + feedback do ambiente, com o modelo decidindo o próximo passo. (A) é genérico; (C) descreve workflow; (D) descreve um chatbot.
2. **C** — O bloco `tool_use` é um *pedido*: a execução acontece no seu código, e você devolve o resultado via `tool_result`. (Tools executadas no servidor existem, mas são a exceção.)
3. **B** — Tipos de entrada distintos e conhecidos é o caso de manual do padrão routing: mais barato, previsível e testável. Agente aqui falha o teste do "padrão mais simples que resolve".
4. **B** — Multi-agente se paga com isolamento de contexto ou paralelismo real. Ele *aumenta* o custo em tokens (D está errada) e exige mais guardrails, não menos.
5. **B** — O contexto fresco é o segredo: sem os vieses da sessão produtora, o verificador enxerga o que o produtor não enxerga — mesmo princípio da revisão por pares.
6. **B** — MCP transforma o problema de integração M×N em M+N: servers expõem capacidades uma vez; qualquer client compatível as consome. O "USB" dos apps de IA.
7. **B** — Computer use é o último recurso, para sistemas sem API: mais lento, mais caro (screenshots custam milhares de tokens) e menos confiável que tools dedicadas.
8. **B** — Design de tools é design de pontos de controle: uma tool dedicada tem argumentos tipados que o harness pode validar, gatear e auditar; um comando bash é uma string opaca.

</details>

## 🃏 Flashcards

| Frente | Verso |
|--------|-------|
| Definição operacional de agente | LLM em loop com ferramentas, decidindo o próximo passo pelo feedback do ambiente |
| Os 4 passos do tool use | Declarar schema → modelo emite `tool_use` → você executa → devolve `tool_result` |
| Workflow vs agente | Workflow: caminho definido no seu código. Agente: o modelo decide o caminho |
| Regra de ouro de "Building effective agents" | Prefira o padrão mais simples que resolve; suba de complexidade só com evidência |
| MCP em uma frase | Protocolo aberto que padroniza como apps de IA (clients) consomem tools/dados de servers — o "USB" da IA |
| Orquestrador-executores | Coordenador decompõe e delega; benefício real é isolamento de contexto |
| Verificador adversarial | Segundo agente com contexto limpo critica o trabalho contra a spec — supera autocrítica |
| Computer use em uma frase | Tool use com screenshot + mouse + teclado; último recurso para sistemas sem API |
| Claude Code visto como agente | Loop de tool use + tools de arquivo/bash/busca + CLAUDE.md como memória + compactação de contexto |
| Por que agente queima tokens | Histórico inteiro reenviado a cada iteração; cada tool result engorda todas as seguintes |
| Duas proteções obrigatórias no loop | Limite de iterações e erros devolvidos como `tool_result` com `is_error: true` |
| Como comparar agente vs workflow | Mesmo gabarito de perguntas, três números: taxa de acerto, custo em tokens, latência |

## ☑️ Checklist de conclusão

- [ ] Li "Building effective agents" e sei citar os 5 padrões de workflow + os 4 critérios para adotar agente
- [ ] Executei o lab e expliquei o loop de tool use linha a linha (núcleo manual) sem consultar nada
- [ ] Sei descrever os 3 padrões multi-agente e o sinal de exagero de cada um
- [ ] Sei explicar MCP (servers, clients, M×N → M+N) e computer use (mecanismo + quando é último recurso) em 2 minutos
- [ ] Dissequei o Claude Code/Cursor como agente: apontei o loop, as tools e a gestão de contexto
- [ ] Fiz a Sessão de Direção: SPEC.md + agente construído com framework/SDK + traces verificados
- [ ] Escrevi a SPEC.md do mini-projeto ANTES do código, com gabarito de 10 perguntas
- [ ] Entreguei agente + workflow + `comparar.py` com a tabela de acerto/custo/latência
- [ ] Registrei decisões e veredito no DECISIONS.md, defendido pelos números
- [ ] Passei na Defesa do módulo no Campus
- [ ] Acertei 6/8+ no quiz

**🆘 Se travar:** trabalhar com seu assistente de IA É o método — cole o trace inteiro do agente (a sequência de tool calls e resultados), peça hipóteses sobre por que ele deu voltas ou errou, e entenda a causa antes de aceitar a correção. Os três travamentos clássicos: o agente repete a mesma tool em círculo → a saída da tool não responde o que ele precisa (leia-a como se você fosse o modelo); a API dá erro logo após um `tool_use` → faltou devolver o `tool_result` correspondente; o agente ignora uma tool → reescreva a description de forma prescritiva. Travou de verdade (30+ min sem entender nem com IA)? Anote a dúvida no seu DECISIONS.md e leve para a comunidade.
