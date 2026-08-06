# Módulo 0 — Boas-vindas, Setup & Primeiro Produto

> 🏛️ Período 1 · ⏱️ Carga estimada: 6h · 📋 Pré-requisitos: nenhum — só vontade de aprender

## 🎯 Objetivos

- Ao final, você será capaz de explicar o método da Academia em duas camadas: como se aprende (active recall + repetição espaçada + projetos) e como se trabalha (especificar → dirigir → verificar).
- Ao final, você será capaz de enunciar e aplicar a regra de ouro do programa: *pode usar IA para escrever qualquer código; não pode entregar nada que não consiga explicar e defender.*
- Ao final, você será capaz de descrever o que faz um Engenheiro de IA em 2026 — quem especifica, dirige e verifica sistemas construídos por e com IA — e como ele se diferencia de um cientista de dados e de um ML engineer.
- Ao final, você será capaz de montar um ambiente profissional: Python 3.12+ com uv, VS Code, Colab, Git/GitHub **e uma ferramenta de agentic coding** (Claude Code, Cursor ou Gemini CLI) instalada e funcionando.
- Ao final, você será capaz de criar contas nas plataformas essenciais (GitHub, Hugging Face, Google AI Studio) e guardar chaves de API com segurança.
- Ao final, você terá **entregado seu primeiro produto real**: um utilitário ou página pessoal que você especificou, dirigiu a IA para construir, verificou e publicou no GitHub — com `SPEC.md` e `DECISIONS.md`.

## 🎛️ Núcleo manual deste módulo

À mão, você escreve **a especificação e o registro de decisões** (SPEC.md e DECISIONS.md) — porque pensar antes de pedir é exatamente a habilidade que este programa forma. O código do primeiro produto é dirigido com IA; o setup você executa comando a comando para conhecer sua própria bancada.

## 🗺️ Por que isso importa

Bem-vindo(a). Aqui você trabalha com IA desde o dia 1 — como na profissão real. Em 2026, a execução de código foi em grande parte absorvida pelas ferramentas de agentic coding, e o valor do profissional migrou da execução para a **direção**: especificar bem, conduzir a ferramenta, avaliar o resultado e responder pela qualidade. Por isso o lema da Academia é **Pensar · Dirigir · Verificar · Entregar** — e por isso, ainda neste módulo, você entrega um produto de verdade dirigindo uma IA, em vez de passar semanas digitando sintaxe que nunca mais vai digitar.

Mas há um aviso que protege você, e ele fica dito com todas as letras desde já: **a IA multiplica quem tem critério e afunda quem não tem.** Quem nunca internalizou como as coisas funcionam não percebe quando a IA gera algo sutilmente errado — e supervisão sem critério é só aprovação automática. Este programa existe para construir o critério; a execução a IA já sabe fazer. É por isso que, além da máquina, este módulo configura seu método de estudo (active recall, repetição espaçada, projetos): as duas coisas — bancada e cérebro treinado — vão te acompanhar pela formação inteira. O Módulo 1 (Direção de IA) aprofunda a prática de direção que você estreia aqui.

## 📚 Aulas

| # | Aula | Tipo | Recurso | Duração estimada |
|---|------|------|---------|------------------|
| 1 | The Rise of the AI Engineer (swyx) — o texto que nomeou a profissão | 📖 leitura | [latent.space/p/ai-engineer](https://www.latent.space/p/ai-engineer) | 30 min |
| 2 | Instalando o uv — gerenciador moderno de Python | 📖 leitura | [docs.astral.sh/uv](https://docs.astral.sh/uv) | 20 min |
| 3 | Primeiros passos no Google Colab (notebook de boas-vindas) | 💻 lab | [colab.research.google.com](https://colab.research.google.com) | 30 min |
| 4 | Git e GitHub: criar conta e primeiro repositório | 💻 lab | [github.com](https://github.com) · [git-scm.com](https://git-scm.com) | 40 min |
| 5 | Contas: Hugging Face + Google AI Studio (chave de API grátis) | 💻 lab | [huggingface.co](https://huggingface.co) · [aistudio.google.com](https://aistudio.google.com) | 30 min |
| 6 | Instalar sua ferramenta de agentic coding (Claude Code, Cursor ou Gemini CLI) | 💻 lab | [docs.anthropic.com/en/docs/claude-code](https://docs.anthropic.com/en/docs/claude-code) · [github.com/google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli) | 40 min |
| 7 | Sessão de Direção: seu primeiro produto dirigindo a IA | 🎛️ sessão de direção | este guia, seção "Sessão de Direção" | 60 min |
| 8 | Tutorial oficial do Python em pt-BR (capítulos 1 e 2, para aquecer) | 📖 leitura | [docs.python.org/pt-br/3/tutorial](https://docs.python.org/pt-br/3/tutorial/) | 40 min |

## 🧠 Conteúdo essencial

### 0.1 Como a Academia funciona — e a regra de ouro

Cada módulo combina seis formatos, de propósito:

1. **Vídeo e leitura** — primeiro contato com o conceito. A vídeo-aula narrada (com legendas) e o guia completo estão na própria página do Campus.
2. **Lab guiado** — você executa junto e **explica cada célula**. "Digite cada célula" morreu; "explique cada célula" nasceu.
3. **🎛️ Sessão de Direção** — a prática nova da casa: você *especifica* o que quer, *dirige* a IA na construção e *verifica* o resultado.
4. **Quiz** — força você a *lembrar*, não só reconhecer. Cada tentativa sorteia 5 perguntas do banco; **3+ acertos** concluem o item.
5. **Flashcards** — revisão em doses pequenas; a aba Revisão avisa o que vence a cada dia.
6. **Mini-projeto** — a prova real. **Nenhum módulo está concluído sem o mini-projeto entregue.**

E sobre usar IA? A regra de ouro do programa resolve a tensão inteira:

> **Você pode usar IA para escrever qualquer código. Você não pode entregar nada que não consiga explicar e defender.**

Nada aqui proíbe IA — proibir seria te ensinar a trabalhar de um jeito que nenhum engenheiro de IA competente trabalha mais. O que o programa cobra, em toda entrega, é compreensão: ao final de cada projeto você passa pela **Defesa** no Campus, uma entrevista curta conduzida por um LLM sobre *o seu próprio projeto* — "por que essa decisão?", "o que quebra se X dobrar?". Se você dirigiu com critério, a defesa é tranquila; se só aprovou o que a IA cuspiu, ela te pega.

### 0.2 O método de trabalho: especificar → dirigir → verificar

Assim como active recall é o método de *estudo* da casa, este ciclo é o método de *trabalho* — o esqueleto de toda atividade prática do programa:

| Fase | O que você faz | O que ela treina |
|------|----------------|------------------|
| **Especificar** | Escrever o que quer: objetivo, restrições, critérios de aceite, exemplos | Pensar antes de pedir; transformar intenção vaga em requisito verificável |
| **Dirigir** | Conduzir a IA na implementação: dar contexto, iterar, corrigir o rumo | Orquestrar ferramentas; gerir contexto; reconhecer quando a IA desviou |
| **Verificar** | Ler o resultado, testar, medir; aceitar ou devolver | Critério — a habilidade que separa quem supervisiona de quem só aprova |

Dois artefatos acompanham esse ciclo em **todo** projeto da Academia, e nascem já neste módulo:

- **`SPEC.md`** — a especificação escrita **antes** do código. Se você não consegue escrever o que quer, a IA também não consegue adivinhar.
- **`DECISIONS.md`** — o diário de decisões e trade-offs: o que você escolheu, o que rejeitou da IA e por quê, o que ficou de fora. É a sua munição para a Defesa — e o hábito que todo time sênior tem.

### 0.3 O método de estudo: a ciência por trás

Três descobertas da ciência cognitiva sustentam o desenho da Academia:

- **Active recall**: o cérebro fixa o que ele se esforça para *puxar da memória*. Reler parece produtivo, mas é passivo. Errar no quiz é *bom* — o erro seguido da correção grava mais forte que o acerto fácil.
- **Spaced repetition**: revisar em intervalos crescentes (1, 3, 7, 14 e 30 dias) combate a curva do esquecimento. O Campus agenda os flashcards sozinho; 10 minutos por dia bastam.
- **Projetos > consumo passivo**: conhecimento que nunca virou entrega evapora. E é o que você mostra em entrevista: recrutador não pergunta quantos vídeos você assistiu — pergunta o que você já construiu *e se você sabe defender as decisões*.

Uma analogia atualizada: assistir aula é ver alguém dirigir. Quiz é o simulado do Detran. Projeto é pegar o carro e ir até a padaria. E a Defesa é o instrutor do lado perguntando "por que você fez essa conversão em segunda?" — só quem dirigiu de verdade responde.

### 0.4 O que é um Engenheiro de IA em 2026

O termo "AI Engineer" nasceu no ensaio *The Rise of the AI Engineer*, do swyx (2023). Em 2026, o perfil evoluiu:

> **O engenheiro de IA de 2026 é quem especifica, dirige e verifica sistemas construídos por e com IA — e responde pela qualidade do resultado.**

| Papel | Foco principal | Pergunta típica |
|-------|----------------|-----------------|
| Cientista de dados | Extrair conhecimento de dados; estatística, experimentos | "O que os dados dizem sobre o negócio?" |
| ML engineer | Treinar e servir modelos próprios; infra, pipelines, MLOps | "Como treino e escalo este modelo?" |
| **Engenheiro de IA** | Especificar, dirigir e verificar produtos sobre modelos de fundação; APIs, agentes, RAG, evals | "Como transformo este modelo em um produto confiável — e como *provo* que ele funciona?" |

A execução de código está sendo absorvida pelas ferramentas de agentic coding; o que o mercado paga é o julgamento em volta delas. É exatamente essa combinação que a Academia forma: o Período 1 te coloca construindo com IA desde a primeira semana; o Período 2 constrói os fundamentos que geram critério; os seguintes sobem para sistemas com LLMs, qualidade e produção.

### 0.5 Python 3.12+ e uv: seu ambiente base

Python é a língua franca da IA. Em vez de instalar pacotes "no braço" com pip, usaremos o **uv** ([docs.astral.sh/uv](https://docs.astral.sh/uv)) — gerenciador escrito em Rust, absurdamente rápido, que instala versões do Python, cria ambientes virtuais e gerencia dependências por projeto.

Conceito-chave: **ambiente virtual** é uma "caixinha" isolada de pacotes por projeto. O projeto A pode usar NumPy 1.26 e o projeto B, NumPy 2.x, sem briga. Sem isso, mais cedo ou mais tarde você quebra a instalação global — todo veterano tem essa cicatriz.

```bash
# Instala o uv (Linux/macOS/WSL)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Instala um Python moderno e cria um projeto
uv python install 3.12
uv init meu-primeiro-projeto
cd meu-primeiro-projeto
uv add numpy        # adiciona dependência (cria o .venv automaticamente)
uv run python -c "import numpy; print(numpy.__version__)"
```

### 0.6 Sua ferramenta de agentic coding

Esta é a novidade que define a bancada de 2026: uma ferramenta que lê seu projeto, escreve e edita arquivos, roda comandos e itera — sob a sua direção. Escolha **uma** para começar (dá para trocar depois; os conceitos são os mesmos):

| Ferramenta | O que é | Custo para começar |
|------------|---------|--------------------|
| **Gemini CLI** ([github.com/google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)) | Agente no terminal, da Google | **Gratuito** com conta Google — a opção recomendada para começar sem gastar |
| **Claude Code** ([docs.anthropic.com/en/docs/claude-code](https://docs.anthropic.com/en/docs/claude-code)) | Agente no terminal, da Anthropic; referência da categoria | Pago (assinatura ou API pré-paga) |
| **Cursor** ([cursor.com](https://cursor.com)) | Editor completo (fork do VS Code) com agente embutido | Tem plano gratuito limitado |

Se orçamento zero é a restrição, vá de **Gemini CLI** — ele usa a mesma conta Google do AI Studio. O importante não é a marca: é aprender a **dirigir**. Regras de bancada desde o dia 1:

1. **Nunca aceite um diff que você não leu.** A ferramenta propõe; você decide.
2. **Contexto é combustível**: quanto melhor você descreve o projeto e o objetivo, melhor o resultado.
3. **Peça explicação, não só código**: "explique o que essa função faz e por quê" é um comando tão importante quanto "implemente X".

### 0.7 Editor, notebooks, Git e contas

- **VS Code** ([code.visualstudio.com](https://code.visualstudio.com)): o editor padrão da indústria. Extensões *Python* e *Jupyter*.
- **Google Colab** ([colab.research.google.com](https://colab.research.google.com)): Jupyter na nuvem, grátis, com GPU. Se sua máquina for modesta, o Colab garante que você nunca fica bloqueado. Regra prática: **notebook para explorar, script para entregar**.
- **Git e GitHub**: cada `commit` é uma fotografia do projeto; o GitHub é onde seu portfólio nasce. O ciclo mínimo que você usará mil vezes:

```bash
git init                          # inicia o repositório
git add .                         # marca os arquivos para a fotografia
git commit -m "primeiro commit"   # tira a fotografia
git remote add origin <url-do-seu-repo>
git push -u origin main           # envia para o GitHub
```

**Todo projeto da Academia vive num repositório Git desde o primeiro dia.**

Contas para criar hoje: **GitHub** (portfólio), **Hugging Face** ([huggingface.co](https://huggingface.co) — o "GitHub dos modelos") e **Google AI Studio** ([aistudio.google.com](https://aistudio.google.com) — chave de API **gratuita** para os modelos Gemini; é também a chave que a Defesa do Campus usa). Anthropic e OpenAI são pré-pagas — deixe para quando um módulo pedir.

Regra de segurança inegociável: **chave de API é senha**. Nunca no código, nunca no GitHub. Variável de ambiente ou `.env` fora do versionamento (`.env` no `.gitignore`). Chave commitada = chave vazada = revogue.

### 0.8 Higiene de estudo: Pomodoro e plano semanal

- **Pomodoro**: 25 min de foco total + 5 de pausa; a cada 4 ciclos, pausa longa. Divida a carga do módulo em pomodoros e vire previsível.
- **Plano semanal**: blocos fixos no calendário (ex.: 3 sessões de 1h30). Constância vence intensidade: 8h/semana durante meses supera maratonas seguidas de abandono.
- **No app da Academia**: marque as aulas, faça o quiz ao final do módulo (3+ de 5 aprova) e revise os flashcards quando a aba Revisão indicar.
- **No celular e sem internet**: o Campus instala como app e funciona offline — só os vídeos pedem rede. Uma vez por semana, gere o link da aba **Sincronizar** e mande para você mesmo: backup e soma de progresso entre aparelhos.

## 💻 Lab guiado

Objetivo: montar a bancada completa — uv, projeto de verificação e ferramenta agentic. Tempo: ~60 min. Execute cada comando e **explique para si mesmo o que ele fez** antes de seguir.

**Passo 1 — Instale o uv e o Python 3.12** (terminal; no Windows, PowerShell ou WSL):

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv python install 3.12
uv --version   # deve imprimir a versão do uv
```

**Passo 2 — Crie o projeto de verificação:**

```bash
uv init academia-lab && cd academia-lab
uv add numpy pandas matplotlib jupyter
```

**Passo 3 — Crie o arquivo `check_setup.py`** e rode com `uv run python check_setup.py`:

```python
"""Verifica se o ambiente da Academia está pronto."""
import sys

def checar_ambiente() -> None:
    # Python 3.12 ou superior
    assert sys.version_info >= (3, 12), f"Python muito antigo: {sys.version}"
    print(f"[ok] Python {sys.version.split()[0]}")

    # Bibliotecas essenciais instaladas
    import numpy, pandas, matplotlib
    print(f"[ok] NumPy {numpy.__version__}")
    print(f"[ok] Pandas {pandas.__version__}")
    print(f"[ok] Matplotlib {matplotlib.__version__}")

    # Um cálculo de verdade, para provar que tudo funciona
    notas = numpy.array([7.5, 8.0, 9.2, 6.8])
    print(f"[ok] Média de teste: {notas.mean():.2f} (esperado 7.88)")
    assert abs(notas.mean() - 7.875) < 0.01
    print("\nAmbiente pronto. Bem-vindo(a) à Academia!")

if __name__ == "__main__":
    checar_ambiente()
```

**Passo 4 — Prove o Colab**: em [colab.research.google.com](https://colab.research.google.com), crie um notebook e execute:

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
plt.plot(x, np.sin(x))
plt.title("Meu primeiro gráfico na Academia")
plt.show()
```

**Passo 5 — Instale sua ferramenta agentic** (escolha da seção 0.6). Para a opção gratuita:

```bash
# Gemini CLI (precisa de Node.js 20+; instale de https://nodejs.org se faltar)
npm install -g @google/gemini-cli
gemini   # na primeira execução, faça login com sua conta Google
```

(Claude Code: siga [docs.anthropic.com/en/docs/claude-code](https://docs.anthropic.com/en/docs/claude-code); Cursor: baixe de [cursor.com](https://cursor.com).)

**Passo 6 — Primeira conversa dirigida.** Dentro da pasta `academia-lab`, abra a ferramenta e peça: *"Leia o check_setup.py deste projeto e me explique, linha a linha, o que ele verifica e por quê."* Depois peça: *"Adicione uma verificação de que o jupyter está instalado, no mesmo estilo do arquivo."* **Leia o diff proposto antes de aceitar.** Rode `uv run python check_setup.py` de novo.

**Experimentos obrigatórios:**

1. Peça à ferramenta uma mudança **sem** contexto ("melhora esse script") e depois **com** contexto e critério ("adicione verificação do jupyter seguindo o padrão [ok] das demais"). Compare os resultados — essa diferença é o Módulo 1 inteiro em miniatura.
2. Provoque um erro (renomeie `numpy` para `nunpy` no import), rode, cole o erro na ferramenta e peça **hipóteses de causa antes da correção**. Entenda; só então aceite o conserto.

## 🎛️ Sessão de Direção

Sua estreia no ciclo completo — é a preparação direta do mini-projeto. Tempo: ~60 min.

**Especificar (20 min, à mão — este é o núcleo manual).** Escolha um produto pequeno e *seu*: um utilitário de linha de comando ou uma página pessoal simples. Exemplos de bom tamanho: conversor de moedas com taxa fixa, calculadora de pomodoros para seu plano semanal, gerador de senha, página pessoal estática com seus links, um "sorteador de flashcards" em terminal. Escreva o `SPEC.md`:

```markdown
# SPEC — [nome do produto]

## Objetivo
Uma frase: o que ele faz e para quem.

## Requisitos
1. [comportamento verificável — "dado X, mostra Y"]
2. ...
3. ...

## Restrições
- Python puro (ou HTML/CSS puro, se for página); sem dependências além de [...]
- Roda com um único comando: [comando]

## Critérios de aceite
- [ ] [como você vai VERIFICAR cada requisito, um a um]
## Fora de escopo
- [o que ele deliberadamente NÃO faz]
```

**Dirigir (25 min).** Abra a ferramenta agentic na pasta do projeto e cole a spec: *"Implemente exatamente esta especificação. Se algo estiver ambíguo, pergunte antes de implementar."* Itere: leia cada proposta, devolva o que não atende à spec, responda às perguntas da ferramenta.

**Verificar (15 min).** Percorra seus critérios de aceite um a um, executando o produto. Peça à ferramenta: *"Explique a função X"* para qualquer trecho que você não entenderia numa Defesa. Registre no `DECISIONS.md` ao menos: 1 decisão que você tomou, 1 coisa que a IA propôs e você rejeitou (e por quê), 1 coisa que você aprendeu.

**Entregável da sessão:** `SPEC.md` + `DECISIONS.md` + um resumo de 5 linhas da sessão (quantas iterações, o que a IA errou, o que você devolveu) — ele entra no `DECISIONS.md`.

## 🚀 Mini-projeto

**Enunciado:** entregue seu **primeiro produto real** — o utilitário ou página pessoal que você especificou na Sessão de Direção — construído dirigindo sua ferramenta de agentic coding e publicado no GitHub. E monte o "Quartel-general": o repositório `academia-ia`, diário de bordo da formação inteira.

**Requisitos:**

1. `SPEC.md` escrito **antes** do código (critério universal a), no repositório do produto.
2. O produto funciona: todos os critérios de aceite da spec passam, e o repositório diz como executar e verificar cada um (critério universal b — neste módulo, a verificação manual documentada basta; testes automatizados chegam nos próximos).
3. `DECISIONS.md` com as decisões, o que você rejeitou da IA e o resumo da sessão de direção (critério universal c).
4. Defesa: você consegue explicar qualquer linha do que entregou — e passa na Defesa do módulo no Campus (critério universal d).
5. Repositório público `academia-ia` com README (quem você é, por quê, plano semanal com dias e horários) e links dos seus perfis (GitHub, Hugging Face — nunca as chaves!).
6. Contas criadas: GitHub, Hugging Face e Google AI Studio; ferramenta agentic instalada.

### 🧭 Passo a passo

Reserve ~2h30 (pode dividir em sessões). Cada etapa termina num checkpoint; só avance quando ele passar.

**Etapa 1 — Criar as três contas (20 min)**

1. GitHub: [github.com](https://github.com) → **Sign up**; escolha um nome de usuário profissional — ele vira a URL do seu portfólio.
2. Hugging Face: [huggingface.co](https://huggingface.co) → **Sign Up** e confirme o e-mail.
3. Google AI Studio: [aistudio.google.com](https://aistudio.google.com) → **Get API key** → **Create API key**. Guarde num gerenciador de senhas, **fora** de qualquer pasta com Git — chave de API é senha.

✅ **Checkpoint:** login funcionando nas três plataformas e a chave do AI Studio guardada fora de qualquer repositório.

**Etapa 2 — Quartel-general `academia-ia` (30 min)**

1. Em [github.com/new](https://github.com/new), crie o repositório público `academia-ia` com **Add a README file**.
2. Clone, abra no VS Code e escreva o README:

```bash
git clone https://github.com/SEU-USUARIO/academia-ia.git
cd academia-ia
```

```markdown
# Academia de Engenharia de IA — diário de bordo

Sou [nome], [o que faço hoje], estudando IA porque [sua razão real].

## Plano semanal de estudos
| Dia | Horário | O quê |
|-----|---------|-------|
| Ter | 19h30–21h | Aulas + lab do módulo atual |
| Sáb | 9h–10h30 | Mini-projeto + quiz + flashcards |

## Meus perfis
- GitHub: https://github.com/SEU-USUARIO
- Hugging Face: https://huggingface.co/SEU-USUARIO
```

```bash
git add README.md
git commit -m "README: apresentação e plano semanal de estudos"
git push
```

✅ **Checkpoint:** o README aparece no GitHub com dias e horários concretos (não "quando der").

**Etapa 3 — Especificar o primeiro produto (25 min, à mão)**

Crie o repositório do produto (ex.: `meu-primeiro-produto`, público) e escreva o `SPEC.md` da Sessão de Direção — objetivo, requisitos verificáveis, restrições, critérios de aceite, fora de escopo. Commite a spec **antes de existir qualquer código**:

```bash
git add SPEC.md
git commit -m "SPEC: especificação escrita antes do código"
```

✅ **Checkpoint:** o histórico do Git mostra a spec como primeiro commit — a prova de que você pensou antes de pedir.

**Etapa 4 — Dirigir a construção (40 min)**

Abra a ferramenta agentic na pasta do produto, cole a spec e dirija: peça a implementação, leia cada diff antes de aceitar, devolva o que não atende. Anote no `DECISIONS.md`, em tempo real, o que decidir ou rejeitar. Commits pequenos a cada avanço que funciona.

✅ **Checkpoint:** o produto executa e você leu (e entendeu) todo o código que aceitou.

**Etapa 5 — Verificar e registrar (20 min)**

Percorra os critérios de aceite da spec um a um, executando. Algum falhou? Volte a dirigir até passar. Finalize o `DECISIONS.md`: decisões, rejeições, o resumo de 5 linhas da sessão e o que você aprendeu.

✅ **Checkpoint:** todos os critérios de aceite marcados como verificados, e o DECISIONS.md conta a história real da construção.

**Etapa 6 — Publicar e revisar (15 min)**

Rode `git status` e confira: nenhum `.env`, nenhuma chave, nada de `.venv`. Então entregue:

```bash
git add .
git commit -m "Primeiro produto: implementação dirigida + DECISIONS.md"
git push
```

Atualize também o `academia-ia`: adicione ao README o link do repositório do produto ("Módulo 0 — primeiro produto: [link]") e faça commit + push.

✅ **Checkpoint:** os dois repositórios públicos no ar; o do produto mostra SPEC.md, DECISIONS.md, o código e pelo menos 3 commits — o primeiro deles é a spec.

**Critérios de aceite:**

- [ ] `SPEC.md` commitado antes de qualquer código (o histórico do Git prova)
- [ ] Produto executa e todos os critérios de aceite da spec passam na verificação
- [ ] `DECISIONS.md` com decisões, rejeições e resumo da sessão de direção
- [ ] Passei na Defesa do módulo no Campus — sei explicar qualquer linha entregue
- [ ] `academia-ia` publicado com plano semanal concreto e link do produto
- [ ] Nenhuma chave de API ou `.env` visível em nenhum repositório

*Regra de ouro, sempre: você pode usar IA para escrever qualquer código; você não pode entregar nada que não consiga explicar e defender.*

## 🧠 Quiz de fixação

**1.** Qual é a regra de ouro da Academia sobre uso de IA?
A) IA é proibida nos mini-projetos B) IA só pode ser usada depois do Módulo 6 C) Pode usar IA para qualquer código, mas nada pode ser entregue sem que você saiba explicar e defender D) IA só serve para corrigir erros

**2.** Qual é a ordem correta do ciclo de trabalho da casa?
A) Dirigir → especificar → verificar B) Especificar → dirigir → verificar C) Verificar → dirigir → especificar D) Codificar → testar → documentar

**3.** Qual técnica de estudo consiste em tentar lembrar o conteúdo sem consultar o material?
A) Repetição espaçada B) Active recall C) Leitura dinâmica D) Resumo passivo

**4.** O que caracteriza o engenheiro de IA de 2026, segundo o programa?
A) Digita mais rápido que a IA B) Treina modelos de fundação do zero C) Especifica, dirige e verifica sistemas construídos por e com IA — e responde pela qualidade D) Não precisa entender de código

**5.** Para que serve o `SPEC.md` escrito antes do código?
A) Documentar o código depois de pronto B) Transformar intenção vaga em requisitos verificáveis, para você e para a IA C) Substituir o README D) Guardar as chaves de API

**6.** O que vai no `DECISIONS.md`?
A) A lista de bugs abertos B) O log bruto do terminal C) Decisões, trade-offs e o que você rejeitou da IA (e por quê) D) As dependências do projeto

**7.** Qual regra de bancada vale ao usar uma ferramenta de agentic coding?
A) Aceitar os diffs rapidamente para não perder o ritmo B) Nunca aceitar um diff que você não leu C) Pedir o código sem contexto, para não enviesar D) Usar sempre duas ferramentas ao mesmo tempo

**8.** Onde uma chave de API deve ficar?
A) No código, para facilitar B) Num comentário do notebook C) Em variável de ambiente ou `.env` fora do Git D) No README do repositório

<details><summary>Ver respostas</summary>

1. **C** — A regra libera a execução e cobra a compreensão: nada de proibir ferramenta, tudo de exigir critério. A Defesa no Campus é o que fecha essa porta.
2. **B** — Especificar (pensar antes de pedir) → dirigir (conduzir a IA) → verificar (testar, ler, medir). É o esqueleto de toda atividade prática do programa.
3. **B** — Active recall é recuperar da memória; reler é passivo e fixa pouco. Repetição espaçada (A) é sobre *quando* revisar, não *como*.
4. **C** — A execução foi absorvida pelas ferramentas; o valor está na direção com julgamento — e em responder pela qualidade do resultado.
5. **B** — Se você não consegue escrever o que quer, a IA não consegue adivinhar. A spec antes do código é critério universal de todo projeto da Academia.
6. **C** — É o diário de decisões: o que escolheu, o que rejeitou e por quê. É sua munição para a Defesa e um hábito de time sênior.
7. **B** — A ferramenta propõe; você decide. Aceitar sem ler é supervisão sem critério — aprovação automática.
8. **C** — Chave é senha: variável de ambiente ou `.env` no `.gitignore`. Qualquer chave commitada deve ser considerada vazada e revogada.

</details>

## 🃏 Flashcards

| Frente | Verso |
|--------|-------|
| Regra de ouro da Academia | Pode usar IA para escrever qualquer código; não pode entregar nada que não consiga explicar e defender. |
| Ciclo de trabalho da casa | Especificar → dirigir → verificar — pensar antes de pedir, conduzir a IA, e testar/ler/medir o resultado. |
| Lema da Academia | Pensar · Dirigir · Verificar · Entregar. |
| SPEC.md | Especificação escrita ANTES do código: objetivo, requisitos verificáveis, restrições e critérios de aceite. |
| DECISIONS.md | Diário de decisões e trade-offs: o que você escolheu, o que rejeitou da IA e por quê. |
| O que é active recall? | Estudar tentando *lembrar* sem olhar o material; consolida muito mais que reler. |
| O que é spaced repetition? | Revisar em intervalos crescentes (1, 3, 7, 14, 30 dias) para vencer a curva do esquecimento. |
| Engenheiro de IA em 2026 | Quem especifica, dirige e verifica sistemas construídos por e com IA — e responde pela qualidade. |
| Ferramenta de agentic coding | Agente que lê o projeto, edita arquivos e roda comandos sob sua direção (Claude Code, Cursor, Gemini CLI). |
| Regra nº 1 da bancada agentic | Nunca aceite um diff que você não leu. |
| Ciclo mínimo do Git | `git add` → `git commit -m "msg"` → `git push`. |
| Regra de ouro para chaves de API | Nunca no código nem no Git; variável de ambiente ou `.env` ignorado. Commitou = vazou = revogue. |

## ☑️ Checklist de conclusão

- [ ] Li o ensaio "The Rise of the AI Engineer" e sei explicar os três papéis — e o que mudou no perfil de 2026
- [ ] Sei enunciar a regra de ouro e as três fases do ciclo especificar → dirigir → verificar
- [ ] uv instalado e `uv run python --version` mostrando 3.12+; `check_setup.py` todo `[ok]`
- [ ] Ferramenta de agentic coding instalada e primeira conversa dirigida feita (lab, Passo 6)
- [ ] Contas criadas: GitHub, Hugging Face e Google AI Studio (chave guardada fora do Git)
- [ ] `SPEC.md` do primeiro produto commitado antes do código
- [ ] Primeiro produto publicado no GitHub, com todos os critérios de aceite verificados
- [ ] `DECISIONS.md` escrito — decisões, rejeições e resumo da sessão de direção
- [ ] Passei na Defesa do módulo no Campus
- [ ] Quiz aprovado (3+ de 5) e primeira sessão de flashcards feita; plano semanal no README do `academia-ia`

**🆘 Se travar:** trabalhar com seu assistente de IA É o método — cole o erro completo, diga em qual etapa está, peça *hipóteses de causa* e entenda antes de aceitar a correção. Atalhos comuns: `uv: command not found` → feche e reabra o terminal (ou refaça o Passo 1 do lab); `ModuleNotFoundError` → use `uv run python ...` dentro da pasta do projeto; `git push` recusado → siga a autenticação que o GitHub abre no navegador. Travou de verdade (30+ min sem entender nem com IA)? Anote a dúvida no seu DECISIONS.md e leve para a comunidade.
