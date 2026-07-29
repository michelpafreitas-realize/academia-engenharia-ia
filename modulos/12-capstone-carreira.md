# Módulo 12 — Capstone & Carreira

> 🏛️ Período 4 · ⏱️ Carga estimada: 20h · 📋 Pré-requisitos: todos os módulos anteriores (1–11)

## 🎯 Objetivos

- Ao final, você será capaz de projetar e entregar um projeto de portfólio completo que integra RAG, evals, agentes, fine-tuning ou LLMOps — no nível que um recrutador reconhece como profissional.
- Ao final, você será capaz de escrever um README que vende o projeto: demo em vídeo/GIF, decisões técnicas documentadas e resultados de eval.
- Ao final, você será capaz de descrever com precisão o papel do Engenheiro de IA e posicionar sua marca pessoal (GitHub, LinkedIn, comunidades).
- Ao final, você será capaz de se manter atualizado de forma sustentável, com um punhado de fontes de alto sinal em vez de afogamento em papers.
- Ao final, você será capaz de se preparar para entrevistas de engenharia de IA, incluindo system design de sistemas LLM e o mercado brasileiro e remoto.

## 🗺️ Por que isso importa

Você aprendeu as peças; agora precisa provar que sabe montá-las. No mercado de IA, **portfólio vale mais que diploma**: um recrutador ou gestor técnico confia mais em três projetos que ele consegue rodar e ler do que em qualquer lista de cursos. O termo "AI Engineer" foi cunhado por Swyx no ensaio "Rise of the AI Engineer" ([latent.space/p/ai-engineer](https://www.latent.space/p/ai-engineer)) exatamente para descrever este perfil emergente: alguém que constrói produtos sobre modelos de fundação, na interseção de engenheiro de software e conhecimento de ML aplicado. É um papel novo, com demanda maior que a oferta — e quem tem portfólio demonstrável larga na frente.

Este módulo é o portão de saída da Academia. Ele consolida o programa em projetos de capstone que você poderá mostrar em entrevistas, e cuida do outro lado da carreira: como se posicionar, onde estar, como se manter atualizado sem se afogar, e como passar nas entrevistas — incluindo o mercado brasileiro e o remoto internacional, onde salários em dólar mudam a vida. O objetivo final não é terminar o curso; é você ser contratado (ou promovido) como engenheiro de IA.

## 📚 Aulas

| # | Aula | Tipo | Recurso | Duração estimada |
|---|------|------|---------|------------------|
| 1 | "Rise of the AI Engineer" (o ensaio que nomeou o papel) | 📖 leitura | [latent.space/p/ai-engineer](https://www.latent.space/p/ai-engineer) | 1h |
| 2 | Newsletter Latent Space (acompanhar o campo) | 📖 leitura | [latent.space](https://www.latent.space) | 30 min |
| 3 | Ahead of AI, de Sebastian Raschka (fundamentos + fronteira) | 📖 leitura | [magazine.sebastianraschka.com](https://magazine.sebastianraschka.com) | 45 min |
| 4 | Interconnects, de Nathan Lambert (análise de modelos e mercado) | 📖 leitura | [interconnects.ai](https://interconnects.ai) | 45 min |
| 5 | Palestras da AI Engineer Conference (system design real) | 🎥 vídeo | YouTube: canal "AI Engineer" | 2h |
| 6 | Comunidades: r/LocalLLaMA e Hugging Face Discord | 📖 leitura | [huggingface.co](https://huggingface.co) (Discord) · reddit.com/r/LocalLLaMA | 1h |
| 7 | Projetos Capstone (o coração do módulo) | 💻 lab | este módulo, seção Projetos Capstone | 12h+ |
| 8 | Carreira: portfólio, marca, entrevistas, mercado | 📖 leitura | este módulo, seção Carreira | 2h |

## 🧠 Conteúdo essencial

### 1. O que é, de fato, um Engenheiro de IA

O ensaio de Swyx marca uma divisão de trabalho: o **ML Engineer/Researcher** treina modelos (matemática, dados, GPUs); o **AI Engineer** constrói *produtos* sobre modelos de fundação já treinados (via API ou abertos). Você não precisa provar teoremas nem treinar do zero — precisa dominar prompt engineering, RAG, tool use/agentes, evals, fine-tuning leve (LoRA) e LLMOps. É exatamente o que a Academia cobriu. A demanda por esse perfil explodiu porque as empresas têm acesso a modelos poderosíssimos e faltam pessoas que saibam transformá-los em produto confiável, avaliado e barato. Você é essa pessoa.

### 2. Portfólio no GitHub que recruta olha

Um recrutador técnico gasta 30–60 segundos por repositório. O que faz ele parar:

- **README que abre com uma demo**: um GIF ou vídeo curto do sistema funcionando, *antes* de qualquer parágrafo. Ver é acreditar. Um `README` que começa com "clone e rode `pip install`" perde a atenção; um que começa com o produto em movimento ganha.
- **Decisões técnicas documentadas**: uma seção "por que escolhi X" (por que RAG e não fine-tuning; por que este modelo; por que este trade-off de custo). É isso que separa "seguiu um tutorial" de "pensa como engenheiro". Recrutadores procuram *julgamento*, não só código que roda.
- **Resultados de eval**: uma tabela de métricas (do Módulo 10) prova que você mede o que constrói. "Precisão 89% em 120 casos" vale mais que mil linhas de código sem prova.
- **Código limpo e rodável**: instruções que funcionam, `.env.example`, dependências fixadas. Se não roda em 5 minutos, não conta.
- **Foco em poucos projetos fortes**: três projetos completos e polidos batem dez pela metade. Qualidade, não quantidade.

### 3. LinkedIn e marca pessoal

Você não precisa virar influencer, mas precisa ser *encontrável* e *legível*:

- **LinkedIn atualizado** com "Engenheiro de IA" na headline e os projetos ligados ao GitHub. Recrutadores buscam por termos — "RAG", "LLM", "fine-tuning" no seu perfil te colocam nos resultados.
- **Construa em público**: poste os projetos da Academia conforme os termina — um print da demo, o que aprendeu, o link do repo. Consistência baixa (um post por projeto) já constrói presença ao longo dos meses.
- **Escreva quando aprender algo**: um post explicando "como fiz eval do meu RAG" demonstra domínio e vira ímã de oportunidades. Ensinar é a melhor prova de que você entende.

O objetivo da marca pessoal não é vaidade — é reduzir o atrito para a próxima oportunidade te achar.

### 4. Comunidades

Onde o campo respira, e onde você aprende mais rápido que em qualquer curso:

- **Hugging Face Discord** — o coração do ecossistema aberto; canais de modelos, datasets, fine-tuning.
- **r/LocalLLaMA** — a comunidade de referência para modelos abertos, quantização e inferência local; notícias e benchmarks práticos primeiro.
- **AI Engineer (conferência e canal no YouTube)** — palestras de quem opera IA em produção de verdade; a melhor fonte de system design real e de tendências do papel.

Estar nessas comunidades te dá contexto, contatos e o pulso do que as empresas realmente usam — muito além do que um currículo transmite.

### 5. Manter-se atualizado sem se afogar

O campo publica mais em uma semana do que dá para ler em um ano. A armadilha do iniciante é tentar ler tudo e paralisar. A disciplina do profissional é **poucas fontes de alto sinal, papers só quando relevantes**:

- **Newsletters curadas** fazem a triagem por você. Três boas bastam:
  - **Latent Space** ([latent.space](https://www.latent.space)) — o pulso do AI Engineer, ferramentas e produtos.
  - **Ahead of AI** ([magazine.sebastianraschka.com](https://magazine.sebastianraschka.com)) — Sebastian Raschka, forte em fundamentos e no que realmente importa da pesquisa.
  - **Interconnects** ([interconnects.ai](https://interconnects.ai)) — Nathan Lambert, análise afiada de modelos, mercado e open-source.
- **Papers só quando relevantes ao seu trabalho ou muito citados**. Você não precisa ler o arXiv inteiro; precisa ler o paper que resolve o problema que está na sua frente. Deixe as newsletters filtrarem o que merece atenção.

A meta é sustentabilidade: 2–3 horas por semana de leitura curada mantém você atualizado por anos, enquanto tentar acompanhar tudo leva ao burnout em semanas.

### 6. Preparação para entrevistas

Entrevistas de engenharia de IA têm três frentes:

- **System design de sistemas LLM** — a peça central. Você recebe um enunciado ("projete um assistente de suporte que responde sobre a base de conhecimento da empresa") e desenha a solução na lousa: RAG vs fine-tuning (e por quê), arquitetura gateway → guardrails → LLM (Módulo 11), estratégia de eval (Módulo 10), custo e latência (streaming, cache, roteamento), resiliência e segurança (injection, PII). É onde todo o programa converge. Pratique verbalizando trade-offs, não só desenhando caixas.
- **Perguntas conceituais típicas**: RAG vs fine-tuning (quando cada um); como você avalia um sistema de IA; o que é prompt injection e como mitigar; como controla custo; o que é LoRA. Se você fez os módulos, já sabe responder — pratique *dizer em voz alta*, conciso.
- **Discussão do portfólio**: prepare-se para defender cada decisão dos seus projetos capstone. "Por que RAG aqui?", "como sabe que funciona?", "e se o volume 10x?". Seu portfólio é o roteiro da entrevista — domine-o.

### 7. Mercado: Brasil e remoto

O mercado de IA tem duas portas para o engenheiro brasileiro:

- **Mercado BR**: empresas de tecnologia, consultorias e o crescente número de startups de IA contratam esse perfil, ainda escasso no país. Salários acima da média de dev pela raridade da especialização. Domínio de português para produtos locais é diferencial.
- **Remoto internacional**: a maior alavanca. Empresas dos EUA e Europa contratam remoto e pagam em dólar/euro, o que multiplica o poder de compra. O portfólio em inglês, o GitHub legível e a presença nas comunidades internacionais (seção 4) são o passaporte. O inglês técnico é requisito, não diferencial.

A estratégia prática: construa o portfólio bilíngue (README em inglês), esteja nas comunidades internacionais, e candidate-se aos dois mercados. A escassez do perfil trabalha a seu favor nos dois.

## 🏗️ Projetos Capstone

Escolha **pelo menos dois** para o portfólio (idealmente todos os quatro ao longo do tempo). Cada um deve virar um repositório público com README completo. Estes são os projetos que você mostra numa entrevista.

### 🧭 Como tirar um capstone do papel — passo a passo

O que separa quem publica um capstone de quem fica na intenção não é talento — é roteiro. O passo a passo abaixo serve para **qualquer** um dos quatro projetos; siga na ordem, e só avance quando o **checkpoint** passar.

**Etapa 1 — Escolher UM projeto (30 min)**

Dois critérios, nessa ordem: qual módulo você mais curtiu fazer (RAG → Projeto 1; agentes → Projeto 2; fine-tuning → Projeto 3; LLMOps → Projeto 4) e qual história você quer contar numa entrevista. Escolha **um** e escreva o nome dele; os outros ficam para depois — dois capstones pela metade valem menos que um inteiro.

✅ **Checkpoint:** você escreveu qual projeto vai fazer e consegue dizer em uma frase por que esse.

**Etapa 2 — Escopar o MVP em 1 parágrafo (30 min)**

Escreva UM parágrafo descrevendo o que o sistema faz na **demo de 2 minutos**: quem usa, o que entra, o que sai. Exemplo (Projeto 1): "O usuário sobe 3 PDFs, faz uma pergunta em linguagem natural e recebe a resposta com o trecho da fonte citado; para uma pergunta fora da base, o sistema admite que não sabe." Regra de ouro: **tudo que não estiver nesse parágrafo fica fora da v1** — inclusive as extensões bônus.

✅ **Checkpoint:** o parágrafo está salvo (crie o repositório agora e cole-o no topo do README rascunho).

**Etapa 3 — Quebrar em marcos semanais (30 min)**

Planeje 3–4 semanas, cada uma com um entregável *verificável*, não "avançar em X":

- **Semana 1** — o caminho feliz roda de ponta a ponta na sua máquina (Etapa 4).
- **Semana 2** — os requisitos técnicos do seu projeto implementados (evals, guardrails, observabilidade — conforme a lista dele).
- **Semana 3** — todos os critérios de aceite marcados.
- **Semana 4** — README, demo em GIF/vídeo e publicação (Etapas 7 e 8).

Adapte livremente, mas mantenha a regra: **toda semana termina com algo demonstrável e commitado**.

✅ **Checkpoint:** você tem 3–4 marcos escritos, cada um com um entregável verificável.

**Etapa 4 — Fatia vertical: o caminho feliz primeiro (semana 1)**

Faça o fluxo principal funcionar de ponta a ponta o quanto antes — **feio, mas completo**. No Projeto 1, por exemplo: 1 PDF → 1 pergunta → 1 resposta com citação, mesmo com chunking ingênuo e sem UI. Nunca "perfeição por camada" (uma semana polindo a ingestão antes de existir uma resposta): um sistema completo e tosco melhora aos poucos; camadas perfeitas e desconexas nunca viram demo.

✅ **Checkpoint:** um único comando (ou script) executa o cenário do seu parágrafo de MVP de ponta a ponta, sem intervenção manual no meio.

**Etapa 5 — Diário de decisões (10 min por sessão, contínuo)**

Crie um `DECISIONS.md` no repositório e, a cada escolha técnica, anote três linhas: **decisão** (o que escolhi), **alternativa descartada** e **porquê**. Ex.: "Chunking por parágrafo; descartei tamanho fixo; os docs têm seções curtas e o retrieval melhorou nos meus casos de teste." É esse arquivo que vira a seção "por que escolhi X" do README e as respostas prontas da entrevista ("por que RAG aqui?").

✅ **Checkpoint:** o `DECISIONS.md` existe e tem ao menos 3 entradas ao final da semana 2.

**Etapa 6 — Fechar os critérios de aceite (semanas 2–3)**

Volte à lista de critérios de aceite do seu projeto e trate-a como contrato: implemente o que falta, um checkbox por vez, sempre commitando. Os critérios com números (ex.: "≥ 10 perguntas", "mínimo 25 casos") são os que provam rigor — não pule os evals para "ganhar tempo": a tabela de métricas é exatamente o que o recrutador procura.

✅ **Checkpoint:** todos os checkboxes dos critérios de aceite do seu projeto marcados.

**Etapa 7 — README que recruta olha (meio dia)**

Monte o README na ordem que a seção "Portfólio no GitHub" deste módulo manda: **demo (GIF/vídeo curto) no topo**, o problema em 2 frases, como rodar em 5 minutos (`.env.example`, dependências fixadas), diagrama da arquitetura, tabela de resultados com números e a seção de decisões (copie do `DECISIONS.md`).

✅ **Checkpoint:** alguém (ou você, numa máquina ou pasta limpa) roda o projeto em 5 minutos seguindo só o README.

**Etapa 8 — Publicar e coletar feedback (1h)**

Torne o repositório público e poste no LinkedIn (print da demo + o que aprendeu + link, como manda a seção de marca pessoal). Compartilhe também nas comunidades do módulo — Hugging Face Discord e r/LocalLLaMA, quando fizer sentido — e responda os comentários: cada pergunta que aparecer é um ensaio grátis de entrevista.

✅ **Checkpoint:** repositório público, post no ar e ao menos um feedback externo recebido.

**🆘 Se travar:** as três armadilhas que matam capstones são **escopo crescendo** ("só mais uma feature" — releia o parágrafo do MVP: se não está lá, não entra na v1), **semanas sem commit** (o marco estava grande demais — corte-o pela metade e entregue a metade que roda) e **polir antes de funcionar** (UI bonita sem backend, chunking "perfeito" sem resposta — volte à fatia vertical da Etapa 4). E a regra de sempre: travou 30+ minutos num erro → pergunte ao seu assistente de IA colando o erro completo e dizendo em qual etapa está — mas peça a *explicação*, não só a resposta; o objetivo é você saber defender cada linha na entrevista.

### Projeto 1 — Assistente de documentos (RAG completo)

**Contexto de negócio**: uma empresa tem centenas de documentos (manuais, políticas, contratos) e quer que funcionários façam perguntas em linguagem natural e recebam respostas *com citação da fonte*, sem alucinação.

**Requisitos funcionais**:
- Ingestão de documentos próprios (PDFs, markdown) em uma base vetorial.
- Perguntas em linguagem natural com respostas fundamentadas e **citação da fonte** (arquivo + trecho).
- UI simples em Streamlit ou Gradio (campo de pergunta, resposta com citações).

**Requisitos técnicos**:
- Pipeline de RAG (Módulo 7): chunking, embeddings, retrieval, geração com contexto.
- Suite de evals (Módulo 10) com **Ragas** (faithfulness, answer relevancy, context precision) e/ou **promptfoo** — mínimo 25 casos.
- Guardrail contra "não sei" honesto: se o contexto não sustenta a resposta, o sistema admite em vez de inventar.

**Critérios de aceite**:
- [ ] Responde ≥ 10 perguntas reais sobre os docs com citações corretas
- [ ] Métricas de Ragas/promptfoo reportadas numa tabela no README
- [ ] Demonstra rejeição honesta a perguntas fora da base
- [ ] UI rodável em 5 minutos com instruções

**Extensões bônus**: filtro por metadados (data, tipo de doc), re-ranking dos chunks, histórico de conversa, avaliação de faithfulness por LLM-juiz validado.

**No README**: GIF da UI respondendo com citação; diagrama do pipeline; tabela de métricas; seção "por que estas escolhas de chunking/embeddings/modelo".

### Projeto 2 — Agente operacional

**Contexto de negócio**: automatizar uma tarefa operacional real que exige *agir* em vários sistemas — ex.: um agente que, dado um pedido de suporte, consulta o histórico do cliente, verifica o status de um serviço e rascunha uma resposta, pedindo aprovação humana antes de enviar.

**Requisitos funcionais**:
- Agente com **3+ tools reais**, sendo **pelo menos uma via MCP** (Módulo 8).
- Guardrails: allowlist de tools, validação de saída.
- **Humano no loop** para qualquer ação irreversível (enviar e-mail, alterar dados).

**Requisitos técnicos**:
- Loop de agente (à mão ou framework justificado no README) com limite de iterações e tratamento de erro por `tool_result`.
- Uma tool conectada via MCP server (pronto ou seu).
- Observabilidade (Módulo 11): trace dos passos do agente, tokens e custo por execução.

**Critérios de aceite**:
- [ ] Completa a tarefa de ponta a ponta usando as 3 tools em sequências não roteirizadas
- [ ] Pelo menos uma tool é servida via MCP
- [ ] Ação irreversível bloqueada por confirmação humana (demonstrado)
- [ ] Trace de uma execução visível (Langfuse ou logs), com custo por run

**Extensões bônus**: memória entre sessões, red teaming contra injection indireta nas tools de leitura, dashboard de custo por execução.

**No README**: vídeo curto do agente resolvendo um caso; lista das tools e qual é MCP; diagrama do loop; seção de segurança (guardrails aplicados).

### Projeto 3 — Modelo especialista (fine-tune)

**Contexto de negócio**: uma tarefa estreita e repetitiva onde um modelo pequeno especializado sai mais barato e rápido que um grande genérico — ex.: classificar/estruturar mensagens de clientes num formato interno rígido.

**Requisitos funcionais**:
- Um modelo aberto pequeno fine-tunado (QLoRA/Unsloth, Módulo 9) para a tarefa.
- Comparação clara base vs fine-tuned na *mesma* tarefa.

**Requisitos técnicos**:
- Dataset próprio em JSONL com splits treino/validação/teste, chat template correto.
- QLoRA via Unsloth/PEFT no Colab grátis.
- **Eval de tarefa antes/depois** (não confie no loss): métricas do problema nos dados de teste.
- Publicação do modelo no **Hugging Face Hub** com model card completa.

**Critérios de aceite**:
- [ ] Dataset revisado manualmente com 3 splits separados
- [ ] Tabela antes/depois com métricas da tarefa em dados de teste
- [ ] Fine-tuned supera o base em ao menos uma métrica relevante
- [ ] Modelo publicado no Hub com model card (base, dados, hiperparâmetros, resultados, limitações)

**Extensões bônus**: exportar para GGUF e rodar no Ollama, comparar 2 tamanhos de base, medir custo/latência do especialista vs API do modelo grande.

**No README**: tabela antes/depois em destaque; link do modelo no Hub; seção "quando usar (e quando NÃO usar) este modelo"; justificativa de por que fine-tuning e não RAG/prompt aqui.

### Projeto 4 — Produto de IA em produção

**Contexto de negócio**: um produto de IA completo, deployado e acessível por link, com a engenharia de produção que uma empresa exigiria — o projeto que mais impressiona porque prova que você opera IA, não só prototipa.

**Requisitos funcionais**:
- App completo com frontend simples + backend, deployado (link público).
- Streaming das respostas.

**Requisitos técnicos**:
- Backend FastAPI (gateway do Módulo 11) com streaming, guardrails de entrada/saída.
- **Observabilidade com Langfuse**: prompt, resposta, tokens, custo, latência por request; trace de cadeias.
- **Custo por usuário**: atribuição de gasto por usuário/feature (FinOps).
- **Eval em CI**: a suite de evals (Módulo 10) roda como gate no pipeline.
- Resiliência: retries, timeout, fallback de modelo em erros retryáveis.
- Deploy em Railway/Render/Fly (app) — demos podem ir para HF Spaces.

**Critérios de aceite**:
- [ ] Link público funcionando, com streaming
- [ ] Painel Langfuse com traces, tokens e custo por request
- [ ] Custo agregado por usuário/feature acessível
- [ ] Suite de evals rodando no CI como gate (badge ou print)
- [ ] Fallback demonstrado apenas em 429/5xx
- [ ] Dockerfile e instruções de deploy no README

**Extensões bônus**: autenticação e cota por usuário, roteamento de modelo por complexidade, alertas de custo, teste de carga.

**No README**: GIF do produto no ar; link público; diagrama da arquitetura de produção; print do painel de custo; badge do CI com eval gate.

## 💼 Carreira de Engenheiro de IA

*(Esta seção consolida a orientação de carreira — leia junto com as subseções 1–7 do Conteúdo essencial acima, que a detalham.)*

Um roteiro de ação para os próximos meses, transformando o que você aprendeu em oportunidade:

**Passo 1 — Publique dois capstones.** Escolha dois projetos acima, termine-os com README de nível profissional (demo em vídeo/GIF no topo, decisões documentadas, resultados de eval) e torne-os públicos no GitHub. Estes são seus cartões de visita.

**Passo 2 — Monte a vitrine.** Atualize o LinkedIn com "Engenheiro de IA" na headline e links para os repos. Faça um post por projeto conforme publica: print da demo, o que aprendeu, link. Construir em público, mesmo em ritmo baixo, cria presença.

**Passo 3 — Entre nas comunidades.** Hugging Face Discord, r/LocalLLaMA e o canal AI Engineer no YouTube. Acompanhe, participe, absorva o pulso do campo. É onde você aprende o que as empresas usam de verdade e onde contatos aparecem.

**Passo 4 — Instale a rotina de atualização sustentável.** Assine Latent Space, Ahead of AI e Interconnects. Reserve 2–3h por semana. Papers só quando relevantes. Sem afogamento.

**Passo 5 — Prepare-se para entrevistas.** Pratique system design de sistema LLM em voz alta (RAG vs fine-tuning, arquitetura de produção, eval, custo, segurança — tudo converge aqui). Ensaie as perguntas conceituais típicas. Saiba defender cada decisão dos seus capstones.

**Passo 6 — Ataque os dois mercados.** Candidate-se no Brasil (perfil escasso, salário acima da média de dev) e no remoto internacional (dólar/euro, portfólio em inglês, comunidades internacionais). A escassez do perfil trabalha a seu favor.

A verdade libertadora: você não precisa saber *tudo*. Precisa saber construir, avaliar, colocar em produção e explicar suas escolhas. A Academia te deu isso. O resto é executar o roteiro acima.

## ✅ Quiz

**1.** Segundo "Rise of the AI Engineer", o que distingue o AI Engineer do ML Engineer/Researcher?
A) O AI Engineer treina modelos maiores
B) O AI Engineer constrói produtos sobre modelos de fundação já treinados, sem precisar treinar do zero
C) Não há diferença
D) O AI Engineer só trabalha com modelos abertos

**2.** O que um recrutador técnico mais valoriza num README de portfólio?
A) O maior número possível de projetos
B) Uma demo (GIF/vídeo) no topo, decisões técnicas documentadas e resultados de eval
C) A quantidade de linhas de código
D) O uso do framework mais recente

**3.** Por que resultados de eval no README importam tanto?
A) Deixam o README mais longo
B) Provam que você mede o que constrói — sinal de engenheiro, não de quem só seguiu tutorial
C) São exigência do GitHub
D) Melhoram o SEO do repositório

**4.** Qual é a estratégia sustentável para se manter atualizado?
A) Ler todos os papers do arXiv diariamente
B) Poucas newsletters de alto sinal (Latent Space, Ahead of AI, Interconnects) e papers só quando relevantes
C) Ignorar novidades e focar só no que já sabe
D) Acompanhar todos os influencers de IA

**5.** No system design de uma entrevista de IA, o que se espera que você discuta?
A) Só o modelo a escolher
B) Trade-offs: RAG vs fine-tuning, arquitetura de produção, eval, custo/latência, resiliência e segurança
C) Apenas o custo por token
D) O algoritmo de treino do transformer

**6.** Qual porta de mercado tende a ser a maior alavanca financeira para o engenheiro de IA brasileiro?
A) Concurso público
B) Remoto internacional, pagando em dólar/euro, com portfólio em inglês
C) Freelance de baixo valor
D) Apenas grandes empresas locais

**7.** No Projeto Capstone 1 (Assistente de documentos), qual guardrail é essencial?
A) Bloquear todas as perguntas fora do horário comercial
B) Admitir honestamente quando o contexto recuperado não sustenta a resposta, em vez de alucinar
C) Limitar a resposta a 10 palavras
D) Exigir login para cada pergunta

**8.** No Projeto Capstone 4 (Produto em produção), o que conecta o trabalho ao Módulo 10?
A) O uso de streaming
B) A suite de evals rodando como gate no CI
C) O Dockerfile
D) O painel de custo do Langfuse

<details><summary>Ver respostas</summary>

**1-B.** O AI Engineer constrói produtos sobre modelos de fundação já treinados (via API ou abertos), dominando prompt/RAG/agentes/evals/fine-tuning leve/LLMOps — sem precisar treinar do zero, que é o território do ML Engineer/Researcher.

**2-B.** Recrutadores gastam segundos por repo: uma demo no topo prende a atenção, decisões documentadas mostram julgamento e resultados de eval provam rigor. Poucos projetos fortes batem muitos fracos.

**3-B.** Métricas de eval provam que você mede o que constrói — a marca do engenheiro. "Precisão 89% em 120 casos" separa quem pensa como profissional de quem só copiou um tutorial.

**4-B.** Poucas fontes curadas (Latent Space, Ahead of AI, Interconnects) fazem a triagem; papers só quando relevantes ao seu trabalho. Tentar ler tudo leva ao burnout; a curadoria mantém você atualizado por anos.

**5-B.** System design de IA é onde o programa inteiro converge: escolher RAG ou fine-tuning e justificar, desenhar gateway/guardrails/LLM, definir a estratégia de eval, tratar custo/latência, resiliência e segurança — verbalizando trade-offs.

**6-B.** O remoto internacional paga em moeda forte e multiplica o poder de compra; o passaporte é o portfólio em inglês, GitHub legível e presença nas comunidades internacionais. A escassez do perfil trabalha a favor.

**7-B.** Rejeição honesta ("não encontrei isso na base") em vez de alucinar é o guardrail que torna um RAG confiável. Um assistente que inventa fonte é pior que um que admite não saber.

**8-B.** A suite de evals do Módulo 10 rodando como gate no CI é o elo direto: prompts e mudanças só sobem se a qualidade se mantém. É o que fecha o ciclo entre avaliação e operação.

</details>

## 🃏 Flashcards

| Frente | Verso |
|--------|-------|
| AI Engineer (definição de Swyx) | Constrói produtos sobre modelos de fundação treinados; não precisa treinar do zero |
| O que abre um README de portfólio | Uma demo (GIF/vídeo) do sistema funcionando, antes de qualquer texto |
| O que separa "tutorial" de "engenheiro" no portfólio | Decisões técnicas documentadas + resultados de eval |
| Regra de quantidade de projetos | Poucos projetos fortes e polidos > muitos pela metade |
| Três newsletters de alto sinal | Latent Space, Ahead of AI (Raschka), Interconnects (Lambert) |
| Papers: quando ler | Só quando relevantes ao seu trabalho ou muito citados; deixe as newsletters filtrarem |
| Peça central da entrevista de IA | System design de sistema LLM (RAG vs fine-tune, arquitetura, eval, custo, segurança) |
| Comunidades essenciais | Hugging Face Discord, r/LocalLLaMA, AI Engineer (YouTube) |
| Maior alavanca de mercado (BR) | Remoto internacional em dólar/euro, com portfólio em inglês |
| Os 4 capstones | RAG com citações, agente operacional, modelo especialista (fine-tune), produto em produção |

## ☑️ Checklist de conclusão ("estou pronto?")

- [ ] Publiquei ao menos 2 projetos capstone completos, públicos no GitHub, com README de nível profissional (demo, decisões, evals)
- [ ] Sei explicar o papel de Engenheiro de IA e como me diferencio de um ML Engineer
- [ ] Meu LinkedIn está atualizado e ligado aos repositórios; fiz ao menos um post por projeto
- [ ] Estou em pelo menos duas comunidades ativas do campo
- [ ] Tenho uma rotina sustentável de atualização (newsletters curadas, 2–3h/semana)
- [ ] Consigo conduzir um system design de sistema LLM em voz alta, discutindo trade-offs
- [ ] Sei defender cada decisão técnica dos meus capstones sob pressão
- [ ] Tenho um portfólio bilíngue e estou me candidatando aos mercados BR e remoto internacional
