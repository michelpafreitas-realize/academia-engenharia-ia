# Módulo 12 — Capstone & Carreira

> 🏛️ Período 4 · ⏱️ Carga estimada: 22h · 📋 Pré-requisitos: Módulo 11 (LLMOps)

## 🎯 Objetivos

- Ao final, você será capaz de atuar como tech lead de um projeto real: escrever a `SPEC.md` completa, dirigir a IA na implementação e verificar o resultado com evals que provam os requisitos com números.
- Ao final, você será capaz de manter um `DECISIONS.md` de nível profissional — cada escolha técnica registrada com alternativa descartada e porquê — e usá-lo como base da sua defesa.
- Ao final, você será capaz de defender oralmente qualquer decisão do seu capstone: na Defesa por LLM do Campus e num vídeo de 5 minutos que vai para o portfólio.
- Ao final, você será capaz de montar um portfólio que reflete a profissão de 2026: specs, evals e defesas gravadas valem mais que código digitado à mão.
- Ao final, você será capaz de se preparar para o que recrutadores testam hoje: encontrar defeitos em sistemas gerados por IA, defender decisões sob pressão e conduzir system design de sistemas com LLMs.
- Ao final, você será capaz de se posicionar nos mercados BR e remoto internacional com LinkedIn, GitHub e rotina de atualização sustentável alinhados a essa realidade.

## 🎛️ Núcleo manual deste módulo

À mão, você escreve a `SPEC.md`, mantém o `DECISIONS.md` e defende cada decisão em voz alta — porque especificar, decidir e explicar são exatamente o que ninguém pode fazer por você; toda a implementação é dirigida com IA.

## 🗺️ Por que isso importa

Você aprendeu o ciclo inteiro — especificar, dirigir, verificar; agora precisa provar que o domina de ponta a ponta, sozinho, num projeto que o mercado reconhece. O termo "AI Engineer" nasceu no ensaio de Swyx ([latent.space/p/ai-engineer](https://www.latent.space/p/ai-engineer)) descrevendo quem constrói produtos sobre modelos de fundação; em 2026 o perfil evoluiu: o engenheiro de IA é **quem especifica, dirige e verifica sistemas construídos por e com IA — e responde pela qualidade do resultado**. O capstone deste módulo é o seu exame de tech lead: a IA escreve o código; você escreve a spec, toma as decisões, prova com evals e responde por tudo.

E o mercado mudou junto. Recrutadores de 2026 não pedem mais "escreva um loop de treino no quadro" — eles entregam um sistema gerado por IA com defeitos plantados e mandam você encontrá-los; abrem seu repositório e perguntam "por que essa decisão?"; conduzem system design de sistemas com LLMs esperando trade-offs verbalizados. Um portfólio de quem *dirige* IA — `SPEC.md`, tabela de evals, `DECISIONS.md` e uma defesa gravada — responde exatamente a esse teste. Este módulo fecha a Academia entregando as duas coisas: o capstone que resiste a esse escrutínio e o mapa de carreira honesto para os mercados brasileiro e remoto.

## 📚 Aulas

| # | Aula | Tipo | Recurso | Duração estimada |
|---|------|------|---------|------------------|
| 1 | "Rise of the AI Engineer" — e como o papel evoluiu até 2026 | 📖 leitura | [latent.space/p/ai-engineer](https://www.latent.space/p/ai-engineer) | 1h |
| 2 | Palestras da AI Engineer Conference (system design real) | 🎥 vídeo | YouTube: canal "AI Engineer" | 2h |
| 3 | Newsletters de alto sinal: Latent Space, Ahead of AI, Interconnects | 📖 leitura | [latent.space](https://www.latent.space) · [magazine.sebastianraschka.com](https://magazine.sebastianraschka.com) · [interconnects.ai](https://interconnects.ai) | 1h |
| 4 | Comunidades: Hugging Face Discord e r/LocalLLaMA | 📖 leitura | [huggingface.co](https://huggingface.co) (Discord) · reddit.com/r/LocalLLaMA | 1h |
| 5 | Sessão de Direção: a SPEC.md do seu capstone | 🎛️ sessão de direção | este módulo, seção Sessão de Direção | 3h |
| 6 | Capstone dirigido com IA (o coração do módulo) | 💻 lab | este módulo, seção Capstone | 11h+ |
| 7 | Defesa: Campus + vídeo de 5 minutos | 📖 leitura | este módulo, seção 12.8 | 1h30 |
| 8 | Carreira 2026: portfólio, entrevistas, mercado | 📖 leitura | este módulo, seções 12.2–12.7 | 1h30 |

## 🧠 Conteúdo essencial

### 12.1 O engenheiro de IA de 2026 — e por que o capstone é dirigido

O ensaio de Swyx (2023) definiu o AI Engineer como quem constrói produtos sobre modelos de fundação, sem treinar do zero. Três anos depois, a definição precisou de um upgrade: com a própria IA escrevendo a maior parte do código, o valor do engenheiro migrou para cima na cadeia — **especificar** o que deve existir, **dirigir** a implementação (por IA ou por gente) e **verificar** que o resultado cumpre o combinado, respondendo pela qualidade. É o papel de tech lead, e é o papel que você exerce neste capstone.

Na prática, isso muda o que o capstone avalia. Não é "você consegue digitar um pipeline de RAG?" — a IA digita em minutos. É: sua `SPEC.md` descreve o sistema sem ambiguidade? Suas decisões de arquitetura têm justificativa registrada? Seus evals provam, com números, que os requisitos foram cumpridos? E — o teste final — você defende tudo isso em voz alta, sem olhar o código? Quem responde sim às quatro perguntas é contratável. Quem só tem código que roda, não.

### 12.2 Honestidade de mercado: o que recrutadores testam em 2026

O processo seletivo se adaptou à realidade em que todo candidato usa IA. As três provas que dominam as entrevistas de engenharia de IA hoje:

| Prova | Como funciona | O que você treinou |
|-------|---------------|--------------------|
| **Caça aos defeitos** | "Aqui está um sistema gerado por IA com 3 defeitos — encontre-os." Bug lógico, vulnerabilidade, caso de borda ignorado. Mede se você *lê e verifica* código que não escreveu. | Módulo 1 (revisão de diffs, modos de falha) e todo mini-projeto desde então |
| **Defesa do projeto** | O entrevistador abre o SEU repositório: "por que RAG e não fine-tuning?", "o que quebra se o volume 10x?", "explique esta função". Mede se você entende o que entregou. | O `DECISIONS.md` de cada módulo + a Defesa por LLM do Campus |
| **System design com LLMs** | "Projete um assistente de suporte sobre a base da empresa." Espera-se: RAG vs fine-tuning justificado, gateway → guardrails → LLM, estratégia de eval, custo/latência (cache, streaming, roteamento), segurança (injection, PII). | Módulos 7–11 — é onde o programa inteiro converge |

O que **saiu** dos processos: teste de digitação de algoritmo no quadro, pegadinhas de sintaxe, "implemente sem IA". Ninguém paga por isso mais. O que **entrou** é exatamente o ciclo especificar → dirigir → verificar sob observação. A boa notícia: você passou a Academia inteira treinando isso.

### 12.3 O portfólio de quem dirige IA

Um recrutador técnico gasta 30–60 segundos por repositório — e em 2026 ele assume que a IA escreveu o código. Código bonito não diferencia mais ninguém; o que faz ele parar é a **evidência de direção**:

- **`SPEC.md` no repositório** — a especificação escrita antes do código. Prova que o sistema nasceu de intenção, não de tentativa e erro. É o primeiro arquivo que um avaliador experiente abre.
- **Tabela de evals com números no README** — "faithfulness 0,91 em 25 casos" vale mais que mil linhas de código. Prova que você mede o que constrói.
- **`DECISIONS.md`** — cada escolha com alternativa descartada e porquê. É o que separa "aceitou o que a IA sugeriu" de "dirigiu a IA com critério". Recrutadores procuram julgamento.
- **Defesa gravada** — um vídeo de 5 minutos defendendo as decisões do projeto, linkado no README. Nenhum candidato médio tem isso; é a prova em primeira pessoa de que você explica o que entrega.
- **Demo no topo do README** — GIF/vídeo do sistema funcionando antes de qualquer parágrafo, e instruções que rodam em 5 minutos (`.env.example`, dependências fixadas).
- **Poucos projetos fortes** — dois capstones completos com specs, evals e defesas batem dez repositórios pela metade.

### 12.4 LinkedIn e marca pessoal, versão 2026

O objetivo continua o mesmo — ser encontrável e legível — mas o vocabulário mudou:

- **Headline**: "Engenheiro de IA" acompanhado dos termos que recrutadores buscam hoje: "RAG", "agentes", "evals", "LLMOps". "Dirijo sistemas construídos com IA" comunica mais que "10 anos de Python".
- **Posts que demonstram direção**: em vez de "fiz um app", poste "a spec que escrevi, o que a IA implementou, o que os evals pegaram". O processo é o diferencial — mostre-o. Um post por projeto já constrói presença.
- **Vídeos de defesa como conteúdo**: o vídeo de 5 minutos do capstone é um post pronto — e demonstra exatamente a habilidade que a entrevista vai testar.

### 12.5 Comunidades e atualização sustentável

Onde o campo respira: **Hugging Face Discord** (ecossistema aberto), **r/LocalLLaMA** (modelos abertos, quantização, benchmarks práticos primeiro), **AI Engineer** (conferência e canal — o melhor system design real em vídeo). Estar nelas dá contexto, contatos e o pulso do que as empresas usam de verdade.

Para não se afogar: **três newsletters de alto sinal bastam** — Latent Space (o pulso do AI Engineer), Ahead of AI (Raschka, fundamentos + fronteira) e Interconnects (Lambert, modelos e mercado). Papers só quando relevantes ao problema na sua frente ou muito citados; deixe a curadoria filtrar. 2–3 horas por semana mantêm você atualizado por anos; tentar ler tudo leva ao burnout em semanas.

### 12.6 Preparação para entrevistas

As três frentes da seção 12.2 pedem três treinos distintos:

- **Caça aos defeitos**: pratique gerando sistemas com IA e pedindo a ela que plante defeitos (sem te contar onde) — depois encontre-os lendo e testando. É o mini-projeto do Módulo 1 transformado em rotina de ginásio.
- **Defesa**: a Defesa por LLM do Campus é seu simulador oficial — refaça-a até responder "por quê?" sobre qualquer parte do capstone sem hesitar. As perguntas clássicas: "por que essa arquitetura?", "como sabe que funciona?", "o que quebra se dobrar o volume?", "o que você faria diferente?".
- **System design em voz alta**: pegue enunciados (assistente de suporte, busca semântica interna, automação com aprovação humana) e verbalize a solução completa — requisitos → RAG vs fine-tuning → arquitetura de produção → evals → custo/latência → segurança. Desenhar caixas em silêncio não treina o que a entrevista mede.

### 12.7 Mercado: Brasil e remoto internacional

- **Mercado BR**: startups de IA, consultorias e empresas de tecnologia contratam o perfil, ainda escasso; salários acima da média de dev. Português para produtos locais é diferencial.
- **Remoto internacional**: a maior alavanca — dólar/euro multiplicam o poder de compra. O passaporte: portfólio em inglês (README, `SPEC.md` e vídeo de defesa bilíngues nos seus dois melhores projetos), GitHub legível, presença nas comunidades internacionais. Inglês técnico é requisito, não diferencial.

A estratégia prática: portfólio bilíngue, comunidades internacionais, candidatura aos dois mercados. A escassez do perfil trabalha a seu favor nos dois — e o portfólio de direção (spec + evals + defesa) é raro em qualquer idioma.

### 12.8 A Defesa: por LLM e em vídeo

A defesa é **obrigatória** e tem duas partes:

1. **Defesa por LLM no Campus** — a entrevista de ~10 minutos com rubrica, sobre o SEU capstone: decisões, trade-offs, evals, o que quebra sob carga. Só se considera aprovado quem responde "por quê?" sobre qualquer parte do que entregou. Se travar numa pergunta, a resposta não é decorar — é voltar ao repositório, entender, atualizar o `DECISIONS.md` e refazer.
2. **Vídeo de 5 minutos** — você, câmera ligada (ou tela + voz), defendendo as decisões do capstone: o problema, a arquitetura escolhida e por quê, o que os evals provam (com os números na tela) e o que faria diferente. Sem ler script palavra a palavra. O vídeo vai **linkado no README** — é peça de portfólio, não burocracia: é a prova pública de que você é quem dirigiu.

Por que isso funciona: num mundo onde a IA escreve o código, a única avaliação à prova de cópia é a que acontece na sua cabeça em tempo real — e é exatamente o que a entrevista real mede.

## 🎛️ Sessão de Direção

A sessão de direção deste módulo é o **kickoff do seu capstone** — a fase de especificar, feita inteira à mão antes de qualquer código:

**O que especificar.** Escreva a `SPEC.md` completa do projeto escolhido (seção Capstone): contexto de negócio em 1 parágrafo, o cenário exato da demo de 2 minutos (quem usa, o que entra, o que sai), requisitos funcionais e técnicos numerados, critérios de aceite mensuráveis (cada um com o número que o prova: "≥ 10 perguntas com citação correta", "faithfulness ≥ 0,85 em 25 casos"), restrições (custo por execução, modelos permitidos, prazo) e o que fica explicitamente FORA da v1.

**Como dirigir.** Antes de implementar, submeta a spec à IA como revisora: "aja como o engenheiro que vai implementar isto — que ambiguidades te fariam adivinhar? que casos de borda não estão cobertos? que critério de aceite não é verificável?". Itere até a spec sobreviver ao interrogatório. Depois peça o plano de implementação em marcos verificáveis e compare com o seu — divergências viram entradas no `DECISIONS.md`.

**O que verificar.** A spec está pronta quando: outra pessoa (ou outra sessão de IA, sem contexto) descreve de volta o sistema corretamente só lendo o arquivo; todo critério de aceite tem um número; e você sabe dizer qual eval prova cada requisito.

**Entregável:** a `SPEC.md` commitada como primeiro commit do repositório + um resumo da sessão (o que a revisão da IA pegou, o que você mudou) no `DECISIONS.md`.

## 🚀 Capstone

**Enunciado:** entregue **um** projeto de portfólio completo (dos quatro abaixo — idealmente dois ao longo do tempo), atuando como tech lead: você especifica, dirige a IA na implementação e verifica com evals. O repositório público final contém `SPEC.md`, `DECISIONS.md`, suite de evals com resultados no README, demo no topo e o link do seu vídeo de defesa.

**Requisitos (universais, valem para qualquer um dos 4 projetos):**

1. `SPEC.md` completa escrita ANTES do código (produto da Sessão de Direção) — primeiro commit do repo.
2. Testes/evals que provam cada requisito da spec, com números reportados em tabela no README.
3. `DECISIONS.md` com toda escolha técnica relevante: decisão, alternativa descartada, porquê — mínimo 8 entradas ao final.
4. Defesa dupla aprovada: Defesa por LLM do Campus + vídeo de 5 minutos linkado no README.
5. Os requisitos específicos do projeto escolhido (abaixo).
6. README com demo (GIF/vídeo) no topo e instruções que rodam em 5 minutos.

### Projeto 1 — Assistente de documentos (RAG completo)

**Contexto de negócio**: uma empresa tem centenas de documentos (manuais, políticas, contratos) e quer que funcionários façam perguntas em linguagem natural e recebam respostas com citação da fonte, sem alucinação.

**Requisitos específicos**:
- Ingestão de documentos próprios (PDFs, markdown) em base vetorial; pipeline de RAG (Módulo 7): chunking, embeddings, retrieval, geração com contexto.
- UI simples (Streamlit/Gradio) com resposta citando arquivo + trecho.
- Guardrail de "não sei" honesto: sem sustentação no contexto, o sistema admite em vez de inventar.

**Critérios de aceite** (além dos universais 1–4 e 6):
- [ ] A spec define e o sistema responde ≥ 10 perguntas reais com citações corretas
- [ ] Suite de evals (Ragas e/ou promptfoo — faithfulness, answer relevancy, context precision) com ≥ 25 casos, resultados na tabela do README
- [ ] Rejeição honesta a perguntas fora da base demonstrada nos evals
- [ ] `DECISIONS.md` cobre no mínimo: chunking, embeddings, modelo e o trade-off RAG vs fine-tuning

**Extensões bônus**: filtro por metadados, re-ranking, histórico de conversa, LLM-juiz validado.

### Projeto 2 — Agente operacional

**Contexto de negócio**: automatizar uma tarefa operacional real que exige agir em vários sistemas — ex.: dado um pedido de suporte, consultar histórico, verificar status e rascunhar resposta, com aprovação humana antes de enviar.

**Requisitos específicos**:
- Agente com 3+ tools reais, pelo menos uma via MCP (Módulo 8); loop com limite de iterações e tratamento de erro por `tool_result`.
- Guardrails: allowlist de tools, validação de saída, humano no loop para qualquer ação irreversível.
- Observabilidade (Módulo 11): trace dos passos, tokens e custo por execução.

**Critérios de aceite** (além dos universais):
- [ ] Completa a tarefa de ponta a ponta com as 3 tools em sequências não roteirizadas — provado por evals de trajetória (a spec define os cenários)
- [ ] Pelo menos uma tool servida via MCP
- [ ] Ação irreversível bloqueada por confirmação humana (demonstrado na demo)
- [ ] Trace de uma execução visível (Langfuse ou logs) com custo por run
- [ ] `DECISIONS.md` cobre no mínimo: loop à mão vs framework, desenho das tools e os guardrails escolhidos

**Extensões bônus**: memória entre sessões, red teaming contra injection indireta, dashboard de custo.

### Projeto 3 — Modelo especialista (fine-tune)

**Contexto de negócio**: uma tarefa estreita e repetitiva onde um modelo pequeno especializado sai mais barato e rápido que um grande genérico — ex.: classificar/estruturar mensagens num formato interno rígido.

**Requisitos específicos**:
- Modelo aberto pequeno fine-tunado (QLoRA/Unsloth, Módulo 9); dataset próprio em JSONL com splits treino/validação/teste e chat template correto.
- Eval de tarefa antes/depois (não confie no loss): métricas do problema em dados de teste.
- Publicação no Hugging Face Hub com model card completa.

**Critérios de aceite** (além dos universais):
- [ ] Dataset revisado manualmente (este é núcleo manual: você rotula/revisa a amostra) com 3 splits separados
- [ ] Tabela antes/depois com métricas da tarefa em dados de teste; fine-tuned supera o base na métrica que a spec definiu como principal
- [ ] Modelo no Hub com model card (base, dados, hiperparâmetros, resultados, limitações)
- [ ] `DECISIONS.md` cobre no mínimo: por que fine-tuning e não RAG/prompt, escolha do base e dos hiperparâmetros

**Extensões bônus**: exportar GGUF e rodar no Ollama, comparar 2 bases, custo/latência vs API do modelo grande.

### Projeto 4 — Produto de IA em produção

**Contexto de negócio**: um produto de IA completo, deployado e acessível por link, com a engenharia de produção que uma empresa exigiria — o que mais impressiona porque prova que você opera IA, não só prototipa.

**Requisitos específicos**:
- Backend FastAPI (gateway do Módulo 11) com streaming e guardrails de entrada/saída; frontend simples; deploy em Railway/Render/Fly (demos podem ir para HF Spaces).
- Observabilidade com Langfuse (prompt, resposta, tokens, custo, latência por request) e custo por usuário/feature (FinOps).
- Eval em CI: a suite roda como gate no pipeline; resiliência com retries, timeout e fallback de modelo em erros retryáveis.

**Critérios de aceite** (além dos universais):
- [ ] Link público funcionando, com streaming
- [ ] Painel Langfuse com traces, tokens e custo por request; custo agregado por usuário/feature acessível
- [ ] Suite de evals rodando no CI como gate (badge ou print)
- [ ] Fallback demonstrado apenas em 429/5xx; Dockerfile e instruções de deploy no README
- [ ] `DECISIONS.md` cobre no mínimo: escolha de modelo/roteamento, arquitetura do gateway e o trade-off custo × latência

**Extensões bônus**: autenticação e cota por usuário, roteamento por complexidade, alertas de custo, teste de carga.

### 🧭 Passo a passo

**Etapa 1 — Escolher e especificar (3h)**

Escolha UM projeto (dois critérios: o módulo que você mais curtiu e a história que quer contar numa entrevista) e execute a Sessão de Direção deste módulo: `SPEC.md` completa, revisada pela IA como implementadora cética, antes de qualquer código. Crie o repositório e faça o primeiro commit só com a spec:

```bash
mkdir capstone && cd capstone && git init
# escreva a SPEC.md (Sessão de Direção) e o esqueleto do DECISIONS.md
git add SPEC.md DECISIONS.md
git commit -m "spec: especificação completa do capstone (antes de qualquer código)"
git push -u origin main
```

✅ **Checkpoint:** repositório criado; `SPEC.md` é o primeiro commit e sobreviveu ao interrogatório da IA (ambiguidades e casos de borda resolvidos).

**Etapa 2 — Evals primeiro (2h)**

Antes da implementação, transforme os critérios de aceite em suite de evals: os casos de teste (≥ 25 no Projeto 1; cenários de trajetória no 2; split de teste no 3; suite de CI no 4) e o script que os roda. Eles vão falhar — perfeito: são o contrato que a implementação precisa cumprir. Registre no `DECISIONS.md` por que escolheu essas métricas.

✅ **Checkpoint:** a suite roda (e falha) contra um stub; cada requisito da spec tem o eval que o prova.

**Etapa 3 — Dirigir a fatia vertical (semana 1)**

Dirija a IA para fazer o caminho feliz rodar de ponta a ponta — feio, mas completo (ex.: 1 PDF → 1 pergunta → 1 resposta com citação). Trabalhe por diffs pequenos que você LÊ antes de aceitar; a cada sessão, atualize o `DECISIONS.md` (10 min: decisão, alternativa, porquê). Nunca "perfeição por camada": sistema completo e tosco melhora; camadas perfeitas e desconexas nunca viram demo. Commite todo avanço.

✅ **Checkpoint:** um único comando executa o cenário da demo de ponta a ponta; primeiros evals passando; ≥ 3 entradas no `DECISIONS.md`.

**Etapa 4 — Fechar os critérios guiado pelos evals (semanas 2–3)**

Trate os critérios de aceite como contrato: dirija a IA um checkbox por vez, sempre medindo — a suite de evals é o placar de cada iteração. Os números (≥ 10 perguntas, 25 casos, antes/depois) são o que prova rigor; não pule evals para "ganhar tempo". Toda semana termina com algo demonstrável e commitado (`git push` no mínimo semanal).

✅ **Checkpoint:** todos os checkboxes específicos do seu projeto marcados; tabela de evals final gerada; ≥ 8 entradas no `DECISIONS.md`.

**Etapa 5 — README de portfólio (meio dia)**

Monte o README na ordem da seção 12.3: demo (GIF/vídeo) no topo, problema em 2 frases, como rodar em 5 minutos (`.env.example`, dependências fixadas), diagrama da arquitetura, tabela de evals com números, seção de decisões (destilada do `DECISIONS.md`) e espaço reservado para o link da defesa.

✅ **Checkpoint:** você (numa pasta limpa) roda o projeto em 5 minutos seguindo só o README.

**Etapa 6 — Defesa dupla (2h)**

Primeiro a Defesa por LLM no Campus: a entrevista sobre o seu capstone, até aprovar — se travar, volte ao repo, entenda, atualize o `DECISIONS.md` e refaça. Depois grave o vídeo de 5 minutos (seção 12.8): problema, arquitetura e porquês, números dos evals na tela, o que faria diferente. Suba (YouTube não listado serve) e linke no README.

✅ **Checkpoint:** Defesa do Campus aprovada e vídeo de 5 min linkado no README.

**Etapa 7 — Publicar e colher feedback (1h)**

Revise `SPEC.md` e `DECISIONS.md` uma última vez (a spec reflete o que foi entregue? toda decisão de peso está registrada?), torne o repositório público, `git push` final, e poste no LinkedIn no formato 12.4: a spec que você escreveu, o que a IA implementou, o que os evals provam — mais o link do vídeo. Compartilhe nas comunidades quando fizer sentido; cada pergunta que chegar é ensaio grátis de entrevista.

✅ **Checkpoint:** repositório público com SPEC.md/DECISIONS.md atualizados, post no ar e ao menos um feedback externo recebido.

> **Regra de ouro:** você pode usar IA para escrever qualquer código. Você não pode entregar nada que não consiga explicar e defender.

## 🧠 Quiz de fixação

**1.** Qual é o papel do aluno no capstone deste módulo?
A) Digitar todo o código sem IA para provar domínio
B) Tech lead: escreve a SPEC.md, dirige a IA na implementação e verifica com evals que provam os requisitos
C) Apenas revisar um projeto pronto fornecido pelo curso
D) Treinar um modelo do zero

**2.** O que recrutadores de 2026 tipicamente testam, segundo o módulo?
A) Escrever um loop de treino no quadro sem consulta
B) Encontrar defeitos plantados num sistema gerado por IA, defender as decisões do próprio projeto e system design com LLMs
C) Velocidade de digitação e sintaxe decorada
D) Certificados acumulados

**3.** Por que o `DECISIONS.md` é exigência central (e não mais uma dica)?
A) Porque deixa o repositório maior
B) Porque é a evidência de julgamento — separa "aceitou o que a IA sugeriu" de "dirigiu com critério" — e vira a base da defesa e das respostas de entrevista
C) Porque substitui os testes
D) Porque o GitHub exige

**4.** Como funciona a defesa obrigatória do capstone?
A) Uma prova escrita de múltipla escolha
B) Defesa por LLM no Campus (entrevista com rubrica sobre o SEU projeto) + vídeo de 5 minutos defendendo as decisões, linkado no README
C) Apenas apresentar o código para um colega
D) Publicar o projeto no LinkedIn

**5.** No portfólio de quem dirige IA, o que vale MAIS aos olhos de um avaliador de 2026?
A) Volume de linhas de código escritas à mão
B) SPEC.md, tabela de evals com números, DECISIONS.md e defesa gravada — a evidência de direção
C) Usar o framework mais recente
D) Dez repositórios, mesmo incompletos

**6.** Por que escrever os evals ANTES de dirigir a implementação (Etapa 2)?
A) Para gastar o orçamento de API
B) Porque eles viram o contrato que a implementação deve cumprir e o placar de cada iteração de direção
C) Porque a IA não consegue escrever evals depois
D) Não há razão; a ordem é indiferente

**7.** Qual é a estratégia sustentável de atualização recomendada?
A) Ler todos os papers do arXiv diariamente
B) Poucas newsletters de alto sinal (Latent Space, Ahead of AI, Interconnects) e papers só quando relevantes — 2–3h/semana
C) Ignorar novidades
D) Acompanhar todos os influencers de IA

**8.** Qual porta de mercado tende a ser a maior alavanca financeira para o engenheiro de IA brasileiro?
A) Concurso público
B) Remoto internacional em dólar/euro, com portfólio bilíngue (README, SPEC e defesa em inglês nos melhores projetos)
C) Freelance de baixo valor
D) Apenas grandes empresas locais

<details><summary>Ver respostas</summary>

1. **B** — Em 2026 a IA escreve o código; o capstone avalia o que ninguém faz por você: especificar sem ambiguidade, dirigir com critério e provar com evals — respondendo pela qualidade.
2. **B** — Os processos se adaptaram ao mundo em que todos usam IA: caça aos defeitos, defesa do próprio projeto e system design com LLMs medem exatamente o ciclo especificar → dirigir → verificar.
3. **B** — Recrutadores procuram julgamento, não só código que roda. "Por que essa decisão?" é a pergunta certa da entrevista — e quem registrou na hora responde com convicção.
4. **B** — A defesa dupla: LLM-entrevistador com rubrica no Campus + vídeo de 5 min que vai para o portfólio. É a única avaliação à prova de cópia — a que acontece na sua cabeça em tempo real.
5. **B** — Código bonito não diferencia quando a IA escreve para todos; a evidência de direção (spec, números, decisões, defesa) é o que é raro e o que os testes de 2026 verificam.
6. **B** — Evals primeiro transformam os critérios de aceite em contrato executável: cada iteração de direção tem placar, e "parecer bom" deixa de ser o critério.
7. **B** — O volume é inabsorvível; curadoria de alto sinal + papers sob demanda mantém você atualizado por anos sem burnout.
8. **B** — Dólar/euro multiplicam o poder de compra; o passaporte é portfólio bilíngue, GitHub legível e presença nas comunidades internacionais.

</details>

## 🃏 Flashcards

| Frente | Verso |
|--------|-------|
| Engenheiro de IA (definição 2026) | Quem especifica, dirige e verifica sistemas construídos por e com IA — e responde pela qualidade |
| As 3 provas de entrevista em 2026 | Caça aos defeitos em código gerado por IA; defesa das decisões do próprio projeto; system design com LLMs |
| Evidência de direção no portfólio | SPEC.md + tabela de evals com números + DECISIONS.md + defesa gravada |
| DECISIONS.md | Cada escolha: decisão, alternativa descartada, porquê — mínimo 8 entradas; base da defesa |
| Defesa dupla do capstone | Defesa por LLM no Campus (rubrica) + vídeo de 5 min linkado no README |
| Por que evals antes do código | Viram o contrato executável dos requisitos e o placar de cada iteração de direção |
| Fatia vertical | Caminho feliz de ponta a ponta primeiro, feio mas completo — nunca perfeição por camada |
| Três newsletters de alto sinal | Latent Space, Ahead of AI (Raschka), Interconnects (Lambert) |
| Maior alavanca de mercado (BR) | Remoto internacional em dólar/euro, com portfólio bilíngue |
| Os 4 capstones | RAG com citações, agente operacional, modelo especialista (fine-tune), produto em produção |

## ☑️ Checklist de conclusão

- [ ] Escrevi a `SPEC.md` completa ANTES de qualquer código (primeiro commit do repo) e ela sobreviveu à revisão cética da IA
- [ ] A suite de evals prova cada requisito da spec, com números na tabela do README
- [ ] Meu `DECISIONS.md` tem ≥ 8 entradas (decisão, alternativa descartada, porquê)
- [ ] Passei na Defesa do módulo no Campus, respondendo "por quê?" sobre qualquer parte do capstone
- [ ] Gravei o vídeo de 5 minutos defendendo as decisões e linkei no README
- [ ] Publiquei ao menos 1 capstone completo (ideal: 2 ao longo do tempo) com demo no topo e instruções que rodam em 5 minutos
- [ ] LinkedIn atualizado à realidade 2026 (headline + post mostrando spec → direção → evals) e GitHub ligado
- [ ] Consigo conduzir um system design de sistema LLM em voz alta e encontrar defeitos em código gerado por IA
- [ ] Tenho rotina sustentável de atualização (newsletters curadas, 2–3h/semana) e estou em ≥ 2 comunidades
- [ ] Estou me candidatando aos mercados BR e remoto internacional com portfólio bilíngue
- [ ] Quiz de fixação: acertei 6/8 ou mais

**🆘 Se travar:** trabalhar com seu assistente de IA É o método — no capstone, você é o tech lead e a IA é a equipe: cole o erro, peça hipóteses, entenda a causa antes de aceitar a correção; toda sessão termina com o `DECISIONS.md` atualizado. As três armadilhas que matam capstones continuam as mesmas: escopo crescendo (releia a `SPEC.md` — o que não está lá não entra na v1), semanas sem commit (o marco estava grande — corte pela metade e entregue a metade que roda) e polir antes de funcionar (volte à fatia vertical). Travou de verdade (30+ min sem entender nem com IA)? Anote a dúvida no seu `DECISIONS.md` e leve para a comunidade — cada pergunta respondida é ensaio grátis para a defesa.
