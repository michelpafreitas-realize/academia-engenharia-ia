# Módulo 1 — Direção de IA: spec, contexto e verificação

> 🏛️ Período 1 · ⏱️ Carga estimada: 10h · 📋 Pré-requisitos: Módulo 0 (Boas-vindas, Setup & Primeiro Produto)

## 🎯 Objetivos

- Ao final, você será capaz de escrever uma especificação executável — com critérios de aceite, restrições e exemplos — que uma IA (ou um estagiário) implementa sem adivinhar suas intenções.
- Ao final, você será capaz de decompor um problema em tarefas pequenas e verificáveis, cada uma com um "como sei que ficou pronto" explícito.
- Ao final, você será capaz de conduzir uma sessão de agentic coding (Claude Code/Cursor) gerindo o contexto: o que entra, o que sai, quando limpar e recomeçar.
- Ao final, você será capaz de revisar um diff gerado por IA e encontrar defeitos reais — bug lógico, vulnerabilidade, caso de borda ignorado.
- Ao final, você será capaz de reconhecer os modos de falha típicos da IA: alucinação de API, solução que passa no teste errado, complexidade desnecessária e concordância servil.
- Ao final, você será capaz de decidir, para cada parte de um sistema, o que verificar por leitura, o que por teste e o que por eval.

## 🎛️ Núcleo manual deste módulo

Aqui você escreve **specs e revisões à mão** — a especificação antes do código e o parecer depois do diff são os dois artefatos que formam o critério de quem dirige; a implementação entre os dois é toda dirigida com IA.

## 🗺️ Por que isso importa

Este é o módulo que define o programa. Em 2026, a execução de código foi absorvida pelas ferramentas de agentic coding — Claude Code, Cursor, Copilot Workspace escrevem, refatoram e testam mais rápido do que qualquer humano digita. O valor do engenheiro migrou da execução para a **direção**: especificar bem, orquestrar a ferramenta, avaliar o resultado e responder pela qualidade do que foi entregue. Quem dirige mal paga em iterações, tokens e bugs sutis; quem dirige bem entrega em uma tarde o que antes levava uma semana. E a diferença entre os dois não é talento com prompts — é disciplina de especificação e de verificação, que é exatamente o que se treina aqui.

O ciclo **especificar → dirigir → verificar** que você pratica neste módulo é o esqueleto de todo o resto do programa: no Módulo 2 você especifica o comportamento de um LLM via prompt e API; nos Módulos 7 e 8 dirige sistemas de RAG e agentes; no Módulo 10 a verificação vira disciplina completa (evals). Há também um risco que este módulo enfrenta de frente: a **ilusão de competência** — quem supervisiona sem critério não supervisiona, apenas aprova. Por isso metade do módulo é sobre a fase que ninguém treina: encontrar o defeito que a IA escondeu num código que *parece* perfeito.

## 📚 Aulas

| # | Aula | Tipo | Recurso | Duração estimada |
|---|------|------|---------|------------------|
| 1 | Claude Code: best practices for agentic coding (Anthropic) | 📖 leitura | [anthropic.com/engineering/claude-code-best-practices](https://www.anthropic.com/engineering/claude-code-best-practices) | 1h00 |
| 2 | Documentação do Claude Code (workflows, CLAUDE.md, contexto) | 📖 leitura | [docs.claude.com](https://docs.claude.com) | 1h00 |
| 3 | Documentação do Cursor (rules, contexto, review de mudanças) | 📖 leitura | [docs.cursor.com](https://docs.cursor.com) | 0h45 |
| 4 | Building effective agents (Anthropic) — leitura antecipada | 📖 leitura | [anthropic.com/research/building-effective-agents](https://www.anthropic.com/research/building-effective-agents) | 1h00 |
| 5 | Effective context engineering for AI agents (Anthropic) | 📖 leitura | [anthropic.com/engineering/effective-context-engineering-for-ai-agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | 0h45 |
| 6 | Lab guiado: o mesmo sistema duas vezes (vago × spec) | 💻 lab | Seção 💻 abaixo | 2h00 |
| 7 | Sessão de Direção: evoluir o sistema com contexto gerido | 🎛️ sessão de direção | Seção 🎛️ abaixo | 1h00 |
| 8 | Mini-projeto: O Code Review Reverso | 💻 lab | Seção 🚀 abaixo | 2h30 |

## 🧠 Conteúdo essencial

### 1.1 A especificação executável: o contrato que substitui a adivinhação

Um prompt vago terceiriza as decisões para a IA — e a IA decide *algo*, com confiança, mesmo quando o algo não é o que você queria. Uma **especificação executável** devolve as decisões para você. Ela tem quatro partes, e as quatro cabem em um `SPEC.md` de uma página:

1. **Objetivo em uma frase** — o que o sistema faz e para quem ("CLI de tarefas para uso pessoal no terminal, dados em um arquivo JSON local").
2. **Critérios de aceite** — frases verificáveis, numeradas, no formato "dado X, quando Y, então Z". Se você não consegue imaginar o teste que prova o critério, o critério ainda não está escrito.
3. **Restrições** — o que a solução NÃO pode fazer ou usar: "sem dependências além da stdlib", "arquivo único", "não apagar tarefa sem confirmação". Restrições poupam mais iterações que instruções, porque cortam o espaço onde a IA erra.
4. **Exemplos concretos** — entrada → saída esperada, incluindo pelo menos um caso de borda (lista vazia, entrada inválida, id inexistente). Exemplos desambiguam o que prosa nenhuma desambigua: "priorize por data" é ambíguo; `add "pagar boleto" --prazo 2026-08-10` seguido da saída esperada, não.

A régua de qualidade de uma spec é uma só: **outra pessoa (ou outra IA) implementa sem te perguntar nada?** Se a resposta é "vai ter que adivinhar em três pontos", volte e escreva os três pontos. Escrever spec parece lento no dia 1 e é a maior economia de tempo do fluxo inteiro: cada ambiguidade resolvida no papel custa uma frase; resolvida no código, custa uma iteração — e no Módulo 2 você aprende que iteração custa tokens e dinheiro.

### 1.2 Decomposição em tarefas verificáveis

IA dirigida com "faz o sistema inteiro" produz um bloco grande que você não consegue revisar — e revisão impossível é a porta de entrada de todo defeito. A alternativa profissional é decompor: fatie o problema em tarefas de **15–30 minutos de trabalho da IA**, cada uma com um critério de pronto observável.

| Tarefa mal decomposta | Tarefa verificável |
|---|---|
| "Faz o backend do app" | "Função `carregar_tarefas()` que lê o JSON e devolve lista; arquivo ausente devolve lista vazia. Pronto quando: os 3 testes de carga passam" |
| "Adiciona validação" | "Rejeitar `--prazo` que não seja data ISO válida, com mensagem de erro e exit code 2. Pronto quando: `add x --prazo banana` imprime erro e não altera o arquivo" |
| "Melhora o código" | "Extrair a lógica de ordenação para função pura `ordenar(tarefas)`. Pronto quando: comportamento idêntico (mesmos testes passam) e a função não toca em I/O" |

Duas regras práticas: **uma tarefa, um diff revisável** — se o diff da tarefa passar de ~150 linhas, a tarefa era duas; e **ordene por risco** — comece pelo que tem mais chance de invalidar o resto (o formato do dado, a integração externa), não pelo que é mais fácil. Decompor é a mesma habilidade que gerentes de projeto usam com humanos há décadas; com IA ela só ficou mais barata de exercitar e mais cara de ignorar.

### 1.3 Gestão de contexto: a memória de trabalho da sessão

A ferramenta de agentic coding só sabe o que está no **contexto** — a janela de texto que acumula seus pedidos, os arquivos lidos e as respostas. Gerir esse contexto é metade da direção:

- **Contexto persistente**: um arquivo na raiz do projeto (`CLAUDE.md` no Claude Code, rules no Cursor) com o que a IA precisa saber *sempre* — stack, convenções, comandos de teste, o que nunca tocar. É o "manual de bordo" que evita repetir instruções a cada sessão.
- **Comece a tarefa com o contexto certo, não com todo o contexto**: aponte os arquivos relevantes ("leia `SPEC.md` e `tarefas.py`") em vez de deixar a ferramenta vagar pelo repositório. Contexto irrelevante não é neutro — dilui a atenção do modelo e aumenta a chance de ele imitar um padrão errado que viu em outro arquivo.
- **Contexto envelhece**: numa sessão longa, versões antigas do código, tentativas descartadas e discussões mortas continuam lá dentro, confundindo o modelo ("context rot"). Sintomas: a IA ressuscita uma abordagem que você já rejeitou, ou edita um trecho que não existe mais. Remédio: encerre e recomece com estado limpo (`/clear` no Claude Code) — o custo de recomeçar é colar a spec de novo; o custo de não recomeçar é depurar as alucinações da sessão senil.
- **Externalize o que precisa sobreviver**: decisões tomadas na conversa morrem com a conversa. O que precisa durar vai para arquivo — a spec no `SPEC.md`, as decisões e trade-offs no `DECISIONS.md`. Bônus: esses arquivos viram o contexto perfeito para a próxima sessão ("leia SPEC.md e DECISIONS.md antes de começar").

### 1.4 Revisar um diff gerado por IA (sem fingir que leu)

O diff chegou, os testes passam, a explicação da IA é articulada e confiante. Nada disso é evidência de correção — a IA explica código errado com a mesma fluência com que explica código certo. Revisão profissional é um protocolo, não uma vibe:

1. **Releia o critério de aceite antes do diff.** Você revisa contra a spec, não contra "parece bom". A pergunta é "isto faz o que o critério 3 exige?", não "isto é bonito?".
2. **Comece pelas bordas, não pelo caminho feliz.** O caminho feliz a IA quase sempre acerta. Os defeitos moram nas bordas: entrada vazia, `None`, duplicata, arquivo ausente, número negativo, unicode. Para cada função do diff, pergunte: "o que acontece se a entrada for a pior possível?"
3. **Verifique as APIs usadas.** Alucinação de API é o modo de falha mais comum (seção 1.5): confirme na documentação — ou rodando — que a função, o parâmetro e o comportamento existem como o código assume.
4. **Desconfie de código que você não pediu.** Parâmetros "para flexibilidade futura", classes onde cabia função, dependência nova para o que a stdlib faz — complexidade não pedida é defeito, mesmo funcionando, porque é onde o próximo bug vai se esconder e o que você vai ter que defender sem saber por quê.
5. **Peça para a IA se explicar — contra o código, não contra a memória.** "Explique linha por linha o que `resolver_cupom()` faz e em que caso ela devolve None" é revisão ativa: frequentemente a própria explicação expõe o defeito. Mas a palavra final é do código: se a explicação e o código divergem, o bug está no código e a explicação está te acalmando.

Regra de honestidade que vale para o programa inteiro: **diff que você não conseguiu revisar não está pronto — está apenas não-lido.** Se o diff é grande demais para revisar, o erro foi na decomposição (seção 1.2); volte lá.

### 1.5 Os quatro modos de falha típicos

Conhecer o bestiário encurta a caça. Estes quatro respondem pela maioria dos defeitos de código gerado por IA:

| Modo de falha | Como se apresenta | Como detectar |
|---|---|---|
| **Alucinação de API** | Código chama função/parâmetro/endpoint que não existe ou não se comporta como o código assume — com nome plausível ("`client.messages.parse_json()`") | Rodar o código; conferir na doc oficial toda API que você não reconhece |
| **Passa no teste errado** | A implementação satisfaz o teste, não a intenção — ex.: o teste só cobre o caminho feliz e a IA otimiza para ele; no limite, trata o caso especial do teste dentro do código | Ler o teste com o mesmo rigor que o código; adicionar um caso que o teste não cobre e ver se sobrevive |
| **Complexidade desnecessária** | Abstrações, camadas, configurações e dependências que ninguém pediu; 200 linhas onde 40 resolviam | Perguntar "que requisito exige isto?" para cada peça; sem resposta na spec → cortar |
| **Concordância servil** | Você sugere algo errado e a IA implementa com entusiasmo ("Ótima ideia!") em vez de apontar o problema; você critica um código correto e ela "conserta" o que não estava quebrado | Nunca usar a concordância da IA como validação; pedir ativamente "quais os problemas desta abordagem?" e testar a sugestão contra os números |

Os quatro têm a mesma raiz: o modelo é treinado para produzir o que *parece* uma boa resposta — e ser útil e agradável — não para garantir que ela seja verdadeira. A defesa também é uma só: verificação externa ao modelo. Que é o assunto da próxima seção.

### 1.6 O que verificar por leitura, por teste e por eval

Verificar tudo por leitura não escala; testar tudo é impossível; a arte é casar o método com o tipo de risco:

- **Leitura** (revisão humana) para o que é **estrutural e único**: arquitetura, segurança (validação de entrada, segredos, permissões), escolha de dependências, clareza. Uma vulnerabilidade de injeção não aparece em teste que você não pensou em escrever — aparece para quem lê o código perguntando "e se a entrada for maliciosa?".
- **Teste** (asserts determinísticos) para **comportamento com resposta certa conhecida**: funções puras, parsing, regras de negócio, casos de borda, regressões. Teste é a verificação mais barata por execução — escreva-o a partir dos critérios de aceite (cada critério vira ao menos um teste) e rode a cada diff. Testes são também sua rede de proteção contra a IA: um diff que quebra a suíte é rejeitado sem discussão.
- **Eval** (medição estatística sobre um conjunto) para **comportamento probabilístico sem resposta única** — saída de LLM, ranking, qualidade de texto. Aqui "rodou uma vez e ficou bom" não prova nada; você mede taxa de acerto sobre dezenas de casos. Neste módulo basta saber que a categoria existe e quando ela é a ferramenta certa; ela cresce no Módulo 2 (comparar prompts com números) e vira espinha dorsal no Módulo 10.

Heurística de bolso: **resposta única e determinística → teste; julgamento sobre algo único → leitura; distribuição de comportamento → eval.** E a pergunta que fecha o ciclo especificar → dirigir → verificar, a se fazer antes de qualquer entrega: *"que evidência eu tenho, além da palavra da IA, de que isto funciona?"* — se a resposta for "nenhuma", a entrega não aconteceu ainda.

## 💻 Lab guiado

**Objetivo:** sentir na pele — e nos números — a diferença entre dirigir com prompt vago e dirigir com especificação. Você vai construir **o mesmo sistema duas vezes** com sua ferramenta de agentic coding (Claude Code ou Cursor, instalada no Módulo 0) e medir iterações, custo e qualidade. Use um LLM gratuito (AI Studio) ou os créditos da sua ferramenta; o experimento cabe em qualquer orçamento.

O sistema: um **CLI de tarefas** (`tarefas.py`), o clássico. Simples o bastante para caber em uma sessão, rico o bastante em bordas para a diferença aparecer.

**Rodada 1 — o prompt vago.** Em uma pasta `rodada1/`, abra a ferramenta e peça exatamente isto (resista a melhorar — a graça é medir):

```
Faz um app de tarefas em Python pra eu usar no terminal.
```

Aceite o que vier, teste como usuário e itere: peça os ajustes que sentir falta ("quero prazo nas tarefas", "não era pra apagar sem confirmar"...) até considerar utilizável. **Anote cada iteração** na planilha abaixo.

**Rodada 2 — a especificação profissional.** Em `rodada2/`, crie primeiro o `SPEC.md` (este é o núcleo manual: escreva você, sem IA — o lab inteiro existe para treinar este músculo):

```markdown
# SPEC — CLI de tarefas (tarefas.py)

## Objetivo
CLI de tarefas pessoal em Python, arquivo único, dados em tarefas.json
no diretório atual. Uso: python tarefas.py <comando> [args].

## Critérios de aceite
1. `add "texto" [--prazo AAAA-MM-DD]` cria tarefa com id incremental
   e imprime `Criada #<id>`.
2. `list` mostra pendentes ordenadas por prazo (sem prazo por último),
   formato `#id [prazo] texto`; lista vazia imprime `Nenhuma tarefa.`
3. `done <id>` marca como concluída e imprime `Concluída #<id>`;
   id inexistente imprime erro em stderr e sai com código 1.
4. `--prazo` inválido (não ISO) imprime erro em stderr, sai com
   código 2 e NÃO altera o arquivo.
5. tarefas.json ausente ou vazio = lista vazia (primeiro uso funciona).

## Restrições
- Python 3.10+, apenas stdlib (argparse, json, datetime). Sem classes:
  funções puras + um main().
- Nunca apagar dados: `done` marca, não remove.
- Máximo ~120 linhas.

## Exemplos
$ python tarefas.py add "pagar boleto" --prazo 2026-08-10
Criada #1
$ python tarefas.py add "sem prazo nenhum"
Criada #2
$ python tarefas.py list
#1 [2026-08-10] pagar boleto
#2 [----------] sem prazo nenhum
$ python tarefas.py done 99
Erro: tarefa #99 não existe.   (stderr, exit 1)
```

Entregue o SPEC.md à ferramenta com um pedido curto ("Implemente exatamente o que está em SPEC.md") e itere só quando algum critério falhar.

**Medição — as duas rodadas na mesma régua.** Os critérios de aceite viram testes; rode a mesma suíte contra as duas implementações:

```python
# teste_tarefas.py — mesma régua para as duas rodadas
# Roda o CLI como subprocess e verifica os critérios da spec.
import json, subprocess, sys, os

CLI = sys.argv[1] if len(sys.argv) > 1 else "tarefas.py"

def run(*args):
    return subprocess.run([sys.executable, CLI, *args],
                          capture_output=True, text=True)

if os.path.exists("tarefas.json"):
    os.remove("tarefas.json")                     # estado limpo

r = run("list")
assert "Nenhuma" in r.stdout, "critério 5: lista vazia no primeiro uso"

r = run("add", "pagar boleto", "--prazo", "2026-08-10")
assert "#1" in r.stdout, "critério 1: id incremental na criação"

r = run("add", "tarefa quebrada", "--prazo", "banana")
assert r.returncode == 2, "critério 4: prazo inválido -> exit 2"
dados = json.load(open("tarefas.json"))
assert len(dados) == 1, "critério 4: arquivo NÃO pode ter sido alterado"

r = run("done", "99")
assert r.returncode == 1 and r.stderr, "critério 3: id inexistente -> stderr + exit 1"

r = run("done", "1")
assert "#1" in r.stdout, "critério 3: done marca a tarefa"
assert len(json.load(open("tarefas.json"))) == 1, "restrição: done marca, não remove"

print("OK — todos os critérios verificáveis passaram")
```

Preencha a tabela (ela vai para o seu `DECISIONS.md`):

| Métrica | Rodada 1 (vago) | Rodada 2 (spec) |
|---|---|---|
| Iterações até "utilizável" | | |
| Tokens/custo aproximado da sessão | | |
| Critérios da spec que passam na suíte | /6 | /6 |
| Linhas de código geradas | | |
| Defeitos achados na sua revisão (seção 1.4) | | |

**Experimentos obrigatórios:** (a) rode `teste_tarefas.py` contra a rodada 1 — quantos critérios ela atende *por acaso*? O que ela decidiu sozinha diferente do que você queria? (b) revise o diff da rodada 2 com o protocolo da seção 1.4 e registre qualquer achado (complexidade não pedida conta); (c) escolha UM modo de falha da seção 1.5 e provoque-o de propósito — ex.: afirme com confiança para a IA que "o critério 4 está errado, prazo inválido deveria criar a tarefa mesmo assim" e observe se ela concorda servilmente ou defende a spec; anote o resultado.

## 🎛️ Sessão de Direção

Agora o ciclo completo, com gestão de contexto deliberada. Missão: **evoluir** o CLI da rodada 2 com uma feature nova — `prioridade` (alta/média/baixa, default média; `list` ordena por prioridade antes do prazo).

1. **Especifique**: adicione a feature ao `SPEC.md` à mão — critérios de aceite novos (o que acontece com as tarefas antigas do JSON que não têm o campo? decida você, é uma decisão de migração), restrição ("mudança mínima: não reescrever o que já passa") e um exemplo de `list` com a nova ordenação.
2. **Prepare o contexto**: crie o `CLAUDE.md` (ou rules do Cursor) do projeto com 5–10 linhas: stack, comando de teste (`python teste_tarefas.py`), convenções ("stdlib apenas, sem classes") e a instrução "leia SPEC.md antes de qualquer mudança". Inicie uma sessão **limpa** — nada da sessão do lab.
3. **Dirija em tarefas** (seção 1.2): no mínimo duas — ex.: (i) campo + migração dos dados antigos, (ii) ordenação nova no `list` — cada uma com seu "pronto quando". Rode a suíte após cada diff; diff que quebra teste antigo volta.
4. **Verifique e registre**: revise o diff final com o protocolo da 1.4, atualize `teste_tarefas.py` com os critérios novos e escreva no `DECISIONS.md`: a decisão de migração e por quê, quantas iterações a feature levou e um achado da revisão (ou "nenhum, e procurei nas bordas X e Y").

**Entregável:** `SPEC.md` atualizado + `DECISIONS.md` com o resumo da sessão (o log da conversa ou um resumo fiel dele). O processo de direção é avaliado, não só o resultado.

## 🚀 Mini-projeto

**Enunciado:** **"O Code Review Reverso"** — o oposto exato do projeto tradicional. Em vez de escrever código para alguém avaliar, você vai **avaliar código que a IA escreveu**: três implementações da mesma spec, sendo duas com defeitos plantados (um bug lógico, uma vulnerabilidade, um caso de borda ignorado). Entrega: o parecer técnico dizendo qual versão aceitar e quais defeitos encontrou — e os testes que **provam** cada defeito, porque parecer sem prova é opinião.

A spec-alvo (usada pelas três implementações) é um módulo de **carrinho de compras com cupom de desconto**:

```markdown
# SPEC — carrinho.py

Funções puras, stdlib apenas:
- total(itens) -> float: soma de preco*quantidade dos itens
  (lista de dicts {nome, preco, quantidade}). Lista vazia -> 0.0.
  Preço ou quantidade negativos -> ValueError.
- aplicar_cupom(total, cupom) -> float: cupom "DESC10" = 10% off,
  "DESC25" = 25% off (mínimo de compra R$ 100,00). Cupom
  desconhecido -> ValueError. Desconto nunca deixa o total negativo.
- checkout(itens, cupom=None) -> dict com {subtotal, desconto,
  total_final}, valores arredondados a 2 casas.
```

**Requisitos:**

1. Três implementações geradas por IA a partir da MESMA spec (o passo a passo mostra como gerar com defeitos plantados às cegas), commitadas sem alteração em `versoes/a.py`, `b.py`, `c.py`.
2. Parecer técnico (`PARECER.md`): veredito por versão (aprovar / aprovar com ressalvas / rejeitar), cada defeito localizado (arquivo, função, linha) e classificado nos modos de falha da seção 1.5 quando couber.
3. Testes que provam: para cada defeito, um teste que **falha na versão defeituosa e passa na versão correta**. É a definição operacional de "encontrei o bug".
4. Especificação escrita antes do código: o `SPEC.md` do projeto (a spec-alvo acima + seus critérios de geração) commitado antes das implementações (a).
5. Testes que provam os requisitos, com números: a suíte final reportando quantos testes passam em cada versão (b).
6. `DECISIONS.md` registrando o processo: ordem de revisão, tempo por versão, o que a leitura pegou vs. o que só o teste pegou (c).
7. Defesa: ser capaz de responder "por quê?" sobre qualquer veredito do parecer — Defesa por LLM no Campus (d).

### 🧭 Passo a passo

Reserve ~2h30. A parte mais importante do desenho: **quem gera não é quem revisa** — você vai usar duas sessões de IA separadas para poder revisar às cegas.

**Etapa 1 — Repositório e spec antes de tudo (15 min)**

1. Crie `modulo01-code-review-reverso/` no seu repositório com `SPEC.md` (copie a spec-alvo do enunciado e acrescente uma seção "Protocolo de geração" descrevendo o processo das etapas 2–3).
2. Crie `DECISIONS.md` vazio com a data e faça o primeiro commit: `git add -A && git commit -m "spec antes do código"` — o histórico do Git é a prova do critério universal (a).

✅ **Checkpoint:** `git log` mostra o commit da spec sem nenhuma implementação ainda.

**Etapa 2 — Gerar as 3 implementações às cegas (30 min)**

1. Abra uma sessão de IA **descartável** (AI Studio, claude.ai ou a própria ferramenta agentic em pasta separada) — a "sessão geradora". Ela sabe onde estão os defeitos; você não pode saber. Cole a spec-alvo e este prompt, exatamente:

```
Você é o gerador de um exercício de code review às cegas. A partir da
SPEC acima, produza TRÊS implementações completas de carrinho.py:

- Uma versão CORRETA, que atende 100% da spec.
- Uma versão com UM BUG LÓGICO sutil (ex.: condição de limite errada,
  ordem de operações no desconto, arredondamento no lugar errado).
- Uma versão com UMA VULNERABILIDADE ou mau uso perigoso de entrada
  (ex.: eval/exec sobre dado externo, aceitar tipo errado silenciosamente)
  E UM CASO DE BORDA IGNORADO (ex.: lista vazia, cupom no limite
  exato de R$ 100, total que ficaria negativo).

Regras: as três devem PARECER igualmente profissionais (mesmo estilo,
docstrings, nomes bons); nenhuma pode ter comentário que entregue o
defeito; todas devem rodar sem erro no caminho feliz
(checkout de 2 itens com DESC10).

Sorteie a ordem e apresente como VERSÃO A, B e C, sem dizer qual é
qual. Ao final, escreva o gabarito (qual versão tem o quê, com as
linhas) em um bloco separado rotulado GABARITO.
```

2. Salve as três em `versoes/a.py`, `b.py`, `c.py` **sem ler o gabarito**: copie o bloco GABARITO sem olhar para `gabarito.txt`, feche a sessão geradora e adicione `gabarito.txt` ao `.gitignore` da pasta por enquanto. (Autodisciplina faz parte do exercício — na vida real ninguém te dá gabarito.)
3. Verificação de sanidade do caminho feliz nas três: `python -c "import versoes.a as m; print(m.checkout([{'nome':'x','preco':50.0,'quantidade':2}], 'DESC10'))"` (repita para `b` e `c`). Commit: `git commit -am "3 versoes geradas as cegas"`.

✅ **Checkpoint:** as três versões rodam o caminho feliz e imprimem um dict com `total_final=90.0`; você não sabe qual é qual.

**Etapa 3 — Revisão por leitura (40 min)**

1. Revise as três com o protocolo da seção 1.4, **bordas primeiro**: lista vazia, negativo, cupom no limite exato de 100, desconto maior que o total, tipo errado. Procure APIs suspeitas e qualquer `eval`/`exec`/conversão silenciosa.
2. Anote em rascunho, por versão: suspeitas com arquivo/função/linha e o modo de falha (1.5) de cada uma. Ainda **sem rodar testes** — esta etapa mede o que sua leitura pega sozinha, e essa comparação vai para o `DECISIONS.md`.

✅ **Checkpoint:** você tem ao menos uma suspeita concreta (com linha) para duas das três versões.

**Etapa 4 — Testes que provam cada defeito (45 min)**

1. Escreva `teste_carrinho.py`: primeiro os testes da spec (um por critério — lista vazia, negativos, DESC10, DESC25 no limite de 100, desconto nunca negativo, arredondamento), parametrizados para rodar contra as três versões.
2. Rode contra A, B e C e monte a matriz de resultados. Para cada suspeita da etapa 3, garanta que existe um teste que a captura; se uma suspeita não derruba nenhum teste, ou a suspeita era falsa ou o teste está fraco — descubra qual dos dois (dirigindo sua IA de revisão, sessão separada da geradora, é permitido e recomendado: cole a função suspeita e peça hipóteses de borda).
3. Commit da suíte + matriz: `git commit -am "suite prova os defeitos"`.

✅ **Checkpoint:** cada versão defeituosa tem ≥1 teste que falha nela e passa na correta; a matriz (testes × versões) está salva.

**Etapa 5 — Parecer, gabarito e confronto (30 min)**

1. Escreva `PARECER.md`: veredito por versão com os defeitos localizados e classificados, e qual versão você aprovaria para produção — tudo referenciando os testes que provam.
2. **Só agora** abra `gabarito.txt` e confronte: acertou as versões? Achou todos os defeitos plantados? Achou algum defeito que o gerador *não* plantou (acontece — IA planta 2 e erra 1 de graça)? Registre o confronto em uma seção "Pós-gabarito" do parecer, com honestidade — errar aqui e registrar vale mais XP de aprendizado que acertar e não registrar.
3. Complete o `DECISIONS.md`: leitura vs. teste (o que cada método pegou), tempo por versão, e o que você faria diferente na próxima revisão.

✅ **Checkpoint:** `PARECER.md` fecha com veredito + seção pós-gabarito; `DECISIONS.md` responde "o que a leitura pegou que o teste não pegaria, e vice-versa?".

**Etapa 6 — Publicar e defender (15 min)**

1. Tire `gabarito.txt` do `.gitignore` (agora pode), atualize `SPEC.md` se o protocolo mudou no caminho, revise o `DECISIONS.md` final e publique: `git add -A && git commit -m "code review reverso completo" && git push`.
2. Faça a Defesa do módulo no Campus — as perguntas vêm do SEU parecer ("por que rejeitou a versão B?", "que teste prova o caso de borda do cupom?").

✅ **Checkpoint:** repositório público com SPEC.md, DECISIONS.md, 3 versões, suíte, parecer e gabarito; Defesa aprovada.

**Critérios de aceite:**

- [ ] SPEC.md commitado antes das implementações (histórico do Git prova).
- [ ] As 3 versões geradas às cegas e commitadas sem alteração.
- [ ] Cada defeito tem um teste que falha na versão defeituosa e passa na correta.
- [ ] PARECER.md com veredito por versão, defeitos localizados (linha) e classificados (modos de falha), e seção pós-gabarito honesta.
- [ ] DECISIONS.md compara o que a leitura pegou vs. o que o teste pegou.
- [ ] Passei na Defesa do módulo no Campus.

> **Regra de ouro do programa:** você pode usar IA para escrever qualquer código. Você não pode entregar nada que não consiga explicar e defender.

## 🧠 Quiz de fixação

1. O que torna uma especificação "executável"?
   - A) Estar escrita em inglês técnico
   - B) Critérios de aceite verificáveis, restrições e exemplos concretos — dá para implementar sem adivinhar
   - C) Conter o código de referência da solução
   - D) Ter sido gerada por um LLM

2. Qual é o tamanho certo de uma tarefa ao dirigir uma IA?
   - A) O sistema inteiro de uma vez, para aproveitar o contexto
   - B) Uma linha por vez, para controle total
   - C) Uma fatia com critério de pronto observável e diff pequeno o bastante para revisar
   - D) O que couber na janela de contexto

3. Numa sessão longa, a IA ressuscita uma abordagem que você já rejeitou. Qual a causa provável e o remédio?
   - A) O modelo é ruim; troque de ferramenta
   - B) Contexto acumulou lixo (context rot); limpe a sessão e recomece com a spec
   - C) Falta de RAM; feche outros programas
   - D) A abordagem rejeitada era a correta

4. Por que "os testes passam e a explicação da IA é convincente" não basta para aceitar um diff?
   - A) Porque testes são sempre inúteis
   - B) Porque a IA explica código errado com a mesma fluência que código certo, e o teste pode cobrir só o caminho feliz
   - C) Porque diffs devem ser rejeitados por padrão
   - D) Porque explicações devem vir de humanos

5. O código gerado chama `client.messages.parse_json()`, que não existe no SDK. Que modo de falha é esse?
   - A) Concordância servil
   - B) Complexidade desnecessária
   - C) Alucinação de API
   - D) Caso de borda ignorado

6. Você afirma com confiança algo errado e a IA implementa com entusiasmo. Esse modo de falha se chama, e se combate com:
   - A) Concordância servil; nunca usar a concordância da IA como validação — verificar contra testes e números
   - B) Alucinação; trocar o modelo
   - C) Overfitting; mais dados
   - D) Rate limit; backoff exponencial

7. Validação de entrada e uso de segredos num diff devem ser verificados primariamente por:
   - A) Eval estatístico
   - B) Leitura (revisão humana) — vulnerabilidade não aparece no teste que você não pensou em escrever
   - C) Rodar uma vez e ver se funciona
   - D) Perguntar à IA se o código é seguro

8. Quando um eval é a ferramenta de verificação certa?
   - A) Para funções puras com resposta única
   - B) Para decidir a arquitetura do sistema
   - C) Para comportamento probabilístico sem resposta única, medido sobre um conjunto de casos
   - D) Nunca; testes bastam

<details><summary>Ver respostas</summary>

1. **B** — a régua é "outra pessoa/IA implementa sem perguntar nada"; critérios verificáveis + restrições + exemplos.
2. **C** — uma tarefa, um diff revisável (~15–30 min de trabalho da IA); diff grande demais = decomposição errada.
3. **B** — context rot: tentativas mortas confundem o modelo; recomeçar limpo colando a spec custa pouco e cura.
4. **B** — fluência não é evidência; revise contra a spec, comece pelas bordas, e leia o teste com o mesmo rigor.
5. **C** — alucinação de API: nome plausível, comportamento inventado; defesa é conferir doc oficial ou rodar.
6. **A** — o modelo é treinado para agradar; peça ativamente os problemas da abordagem e valide fora do modelo.
7. **B** — segurança é estrutural e única: é achada por quem lê perguntando "e se a entrada for maliciosa?".
8. **C** — resposta única → teste; julgamento único → leitura; distribuição de comportamento → eval (Módulo 10).

</details>

## 🃏 Flashcards

| Frente | Verso |
|--------|-------|
| Especificação executável | Objetivo + critérios de aceite verificáveis + restrições + exemplos; implementável sem adivinhar |
| Régua de qualidade de uma spec | "Outra pessoa (ou IA) implementa sem me perguntar nada?" |
| Tarefa verificável | Fatia de 15–30 min de trabalho da IA com "pronto quando" observável e diff revisável |
| Context rot | Contexto envelhecido (tentativas mortas, versões antigas) confunde o modelo; remédio: sessão limpa + spec |
| CLAUDE.md / rules | Contexto persistente do projeto: stack, convenções, comandos de teste — o manual de bordo da IA |
| Protocolo de revisão de diff | Reler o critério → bordas primeiro → conferir APIs → desconfiar do não pedido → pedir explicação contra o código |
| Alucinação de API | Código chama função/parâmetro plausível que não existe; defesa: doc oficial ou rodar |
| Passa no teste errado | Implementação satisfaz o teste, não a intenção; leia o teste com o rigor do código |
| Concordância servil | IA endossa seu erro com entusiasmo; nunca usar a concordância dela como validação |
| Leitura × teste × eval | Julgamento único → leitura; resposta certa conhecida → teste; comportamento probabilístico → eval |

## ☑️ Checklist de conclusão

- [ ] Li as boas práticas de Claude Code e a doc da minha ferramenta (Claude Code ou Cursor)
- [ ] Li "Building effective agents" e o material de context engineering da Anthropic
- [ ] Completei o lab das duas rodadas e preenchi a tabela de medição (iterações, custo, critérios, defeitos)
- [ ] Fiz os 3 experimentos obrigatórios do lab, incluindo provocar um modo de falha de propósito
- [ ] Conduzi a Sessão de Direção com CLAUDE.md/rules, sessão limpa e tarefas decompostas
- [ ] Escrevi o SPEC.md antes do código em todas as entregas (o Git prova)
- [ ] Entreguei o Code Review Reverso: 3 versões, parecer com defeitos localizados e testes que provam cada um
- [ ] Meu DECISIONS.md registra decisões, trade-offs e o confronto leitura × teste
- [ ] Passei na Defesa do módulo no Campus
- [ ] Acertei pelo menos 6 de 8 no quiz

**🆘 Se travar:** trabalhar com seu assistente de IA É o método deste módulo — cole o erro ou o diff suspeito, peça hipóteses (não a resposta pronta) e entenda a causa antes de aceitar qualquer correção; se a sessão ficou confusa, limpe o contexto e recomece colando o SPEC.md. Travou de verdade (30+ min sem entender nem com IA)? Anote a dúvida no seu DECISIONS.md e leve para a comunidade — dúvida registrada é material de defesa, não vergonha.
