# Módulo 0 — Boas-vindas & Setup

> 🏛️ Período 1 · ⏱️ Carga estimada: 4h · 📋 Pré-requisitos: nenhum — só vontade de aprender

## 🎯 Objetivos

- Ao final, você será capaz de explicar como a Academia funciona e por que o método (active recall + repetição espaçada + projetos) acelera seu aprendizado.
- Ao final, você será capaz de descrever o que faz um Engenheiro de IA em 2026 e como ele se diferencia de um cientista de dados e de um ML engineer.
- Ao final, você será capaz de instalar e configurar um ambiente profissional: Python 3.12+, uv, VS Code e Jupyter.
- Ao final, você será capaz de rodar notebooks no Google Colab e versionar seu trabalho com Git e GitHub.
- Ao final, você será capaz de criar contas nas plataformas essenciais (Hugging Face, Google AI Studio) e obter sua primeira chave de API gratuita.

## 🗺️ Por que isso importa

Todo engenheiro de IA que você admira já passou pela fase de "instalar Python e torcer para funcionar". A diferença entre quem avança rápido e quem trava por semanas está quase sempre no ambiente: quem tem um setup confiável gasta energia aprendendo IA; quem não tem, gasta energia brigando com erros de instalação. Nas empresas, essa mesma habilidade aparece no primeiro dia de trabalho — você recebe um repositório, precisa reproduzir o ambiente do time e rodar o projeto sem quebrar nada. Esse módulo instala exatamente esse reflexo profissional desde o início.

Além disso, aprender a aprender é a habilidade com maior retorno da sua carreira. A área de IA muda a cada seis meses: o framework da moda de hoje pode não existir em 2028. O que não muda é a capacidade de absorver conteúdo novo com eficiência. Por isso, antes de qualquer linha de código de machine learning, vamos configurar duas coisas: sua máquina e seu método de estudo. As duas vão te acompanhar por toda a formação — e por toda a carreira.

## 📚 Aulas

| # | Aula | Tipo | Recurso | Duração estimada |
|---|------|------|---------|------------------|
| 1 | The Rise of the AI Engineer (swyx) — o texto que nomeou a profissão | 📖 leitura | [latent.space/p/ai-engineer](https://www.latent.space/p/ai-engineer) | 30 min |
| 2 | Instalando o uv — gerenciador moderno de Python | 📖 leitura | [docs.astral.sh/uv](https://docs.astral.sh/uv) | 20 min |
| 3 | Vídeos introdutórios do VS Code | 🎥 vídeo | [code.visualstudio.com](https://code.visualstudio.com) | 30 min |
| 4 | Primeiros passos no Google Colab (notebook de boas-vindas) | 💻 lab | [colab.research.google.com](https://colab.research.google.com) | 30 min |
| 5 | Git e GitHub: criar conta e primeiro repositório | 💻 lab | [github.com](https://github.com) · [git-scm.com](https://git-scm.com) | 40 min |
| 6 | Criar conta no Hugging Face e explorar o Hub | 💻 lab | [huggingface.co](https://huggingface.co) | 20 min |
| 7 | Google AI Studio: sua primeira chave de API (grátis) | 💻 lab | [aistudio.google.com](https://aistudio.google.com) | 20 min |
| 8 | Tutorial oficial do Python em pt-BR (capítulos 1 e 2, para aquecer) | 📖 leitura | [docs.python.org/pt-br/3/tutorial](https://docs.python.org/pt-br/3/tutorial/) | 40 min |

## 🧠 Conteúdo essencial

### 1. Como a Academia funciona

Cada módulo da Academia combina cinco formatos, de propósito:

1. **Vídeo e leitura** — para o primeiro contato com o conceito.
2. **Lab guiado** — você digita e executa o código junto; ninguém aprende IA só assistindo.
3. **Quiz** — força você a *lembrar* do conteúdo, não só reconhecê-lo.
4. **Flashcards** — revisão em doses pequenas ao longo das semanas.
5. **Mini-projeto** — a prova real: construir algo do zero, sem gabarito.

A regra de ouro: **nenhum módulo está concluído sem o mini-projeto entregue**. Assistir 10 horas de vídeo dá sensação de progresso; entregar um projeto dá progresso de verdade.

### 2. A ciência por trás do método

Três descobertas da ciência cognitiva sustentam o desenho da Academia:

- **Active recall (recuperação ativa)**: o cérebro fixa melhor aquilo que ele se esforça para *puxar da memória*. Reler um texto parece produtivo, mas é passivo. Fechar o texto e tentar explicar com suas palavras — isso consolida. Os quizzes existem para isso: errar no quiz é *bom*, porque o erro seguido da correção grava mais forte que o acerto fácil.
- **Spaced repetition (repetição espaçada)**: revisar um conceito em intervalos crescentes (1 dia, 3 dias, 1 semana, 1 mês) combate a curva do esquecimento. Os flashcards de cada módulo devem ser revisados nesse ritmo — 10 minutos por dia bastam.
- **Projetos > consumo passivo**: conhecimento que nunca virou código evapora. Cada mini-projeto força você a integrar tudo que viu no módulo em algo que funciona. É também o que você mostra em entrevistas: recrutador não pergunta "quantos vídeos você assistiu", pergunta "o que você já construiu".

Uma analogia: assistir aula é como ver alguém dirigir. Quiz é o simulado do Detran. Projeto é pegar o carro e ir até a padaria. Só a terceira te torna motorista.

### 3. O que é um Engenheiro de IA em 2026

O termo "AI Engineer" ganhou nome próprio no ensaio *The Rise of the AI Engineer*, do swyx (2023), e virou a profissão que mais cresce na área. A distinção prática:

| Papel | Foco principal | Pergunta típica |
|-------|----------------|-----------------|
| Cientista de dados | Extrair conhecimento de dados; estatística, experimentos, relatórios | "O que os dados dizem sobre o negócio?" |
| ML engineer | Treinar e servir modelos próprios em produção; infra, pipelines, MLOps | "Como treino e escalo este modelo?" |
| **Engenheiro de IA** | Construir **produtos** sobre modelos (próprios ou de terceiros, como LLMs); APIs, agentes, RAG, avaliação | "Como transformo este modelo em um produto confiável?" |

Em 2026, a maior parte do valor em IA nas empresas vem de **aplicar** modelos de fundação (LLMs, modelos de visão, embeddings) a problemas reais — atendimento, busca, automação, análise de documentos. O engenheiro de IA domina o suficiente de ML para não ser enganado pelo modelo, e o suficiente de engenharia de software para colocar o sistema em produção. É exatamente essa combinação que a Academia forma: os Períodos 1 e 2 constroem a base (Python, matemática, ML clássico) e os seguintes sobem para deep learning, LLMs e sistemas de produção.

### 4. Python 3.12+ e uv: seu ambiente base

Python é a língua franca da IA. Em vez de instalar pacotes "no braço" com pip e sofrer com conflitos, usaremos o **uv** ([docs.astral.sh/uv](https://docs.astral.sh/uv)) — um gerenciador escrito em Rust, absurdamente rápido, que cuida de: instalar versões do Python, criar ambientes virtuais e gerenciar dependências por projeto.

Conceito-chave: **ambiente virtual** é uma "caixinha" isolada de pacotes por projeto. O projeto A pode usar NumPy 1.26 e o projeto B, NumPy 2.x, sem briga. Sem isso, mais cedo ou mais tarde você quebra a instalação global do sistema — todo veterano tem essa cicatriz.

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

### 5. Editor e notebooks: VS Code, Jupyter e Colab

- **VS Code** ([code.visualstudio.com](https://code.visualstudio.com)) é o editor padrão da indústria. Instale as extensões *Python* e *Jupyter* da Microsoft.
- **Jupyter Notebook** mistura código, resultado e texto no mesmo documento — perfeito para explorar dados. Nos módulos seguintes você viverá dentro dele.
- **Google Colab** ([colab.research.google.com](https://colab.research.google.com)) é um Jupyter na nuvem, grátis, com GPU. Se sua máquina for modesta, o Colab é seu melhor amigo: zero instalação, roda no navegador.

Regra prática que você verá no Módulo 1: **notebook para explorar, script para entregar**.

### 6. Git e GitHub em 10 minutos

Git é o "controle de versões" do código: cada `commit` é uma fotografia do projeto que você pode revisitar. GitHub ([github.com](https://github.com)) é onde essas fotografias ficam na nuvem — e onde seu portfólio nasce. O ciclo mínimo que você usará mil vezes:

```bash
git init                          # inicia o repositório
git add .                         # marca os arquivos para a fotografia
git commit -m "primeiro commit"   # tira a fotografia
git remote add origin <url-do-seu-repo>
git push -u origin main           # envia para o GitHub
```

Não precisa dominar branches e merges agora — precisa criar o hábito: **todo projeto da Academia vive num repositório Git desde o primeiro dia**.

### 7. Contas e chaves de API

Crie hoje, mesmo que só use daqui a alguns módulos:

- **Hugging Face** ([huggingface.co](https://huggingface.co)) — o "GitHub dos modelos": milhares de modelos, datasets e demos abertos. Conta gratuita.
- **Google AI Studio** ([aistudio.google.com](https://aistudio.google.com)) — chave de API **gratuita** para os modelos Gemini. É por aqui que você fará suas primeiras chamadas a um LLM sem gastar um centavo.
- **Anthropic e OpenAI** — plataformas pagas (pré-pago, alguns dólares bastam para estudar). Deixe para quando o módulo de LLMs pedir.

Regra de segurança inegociável: **chave de API é senha**. Nunca cole no código, nunca suba para o GitHub. Guarde em variável de ambiente ou arquivo `.env` fora do versionamento (adicione `.env` ao `.gitignore`).

### 8. Higiene de estudo: Pomodoro e plano semanal

- **Pomodoro**: 25 minutos de foco total (celular longe) + 5 de pausa; a cada 4 ciclos, pausa longa. A carga de cada módulo já é estimada em horas — divida em pomodoros e vire previsível.
- **Plano semanal**: reserve blocos fixos no calendário (ex.: 3 sessões de 1h30 por semana). Constância vence intensidade: 8h por semana durante meses supera maratonas de fim de semana seguidas de abandono.
- **No app da Academia**: marque as aulas concluídas, faça o quiz ao final do módulo (não durante — deixe o cérebro esquecer um pouco primeiro) e revise os flashcards nos intervalos de 1, 3, 7 e 30 dias.

## 💻 Lab guiado

Objetivo: montar o ambiente completo e rodar seu primeiro notebook. Tempo: ~45 min.

**Passo 1 — Instale o uv e o Python 3.12** (terminal; no Windows, use o PowerShell ou o WSL):

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv python install 3.12
uv --version   # deve imprimir a versão do uv
```

**Passo 2 — Crie o projeto da Academia:**

```bash
uv init academia-lab && cd academia-lab
uv add numpy pandas matplotlib jupyter
```

**Passo 3 — Crie o arquivo `check_setup.py`** com o conteúdo abaixo e rode com `uv run python check_setup.py`:

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

**Passo 4 — Rode o Jupyter localmente** (`uv run jupyter notebook`), crie um notebook novo e execute numa célula:

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
plt.plot(x, np.sin(x))
plt.title("Meu primeiro gráfico na Academia")
plt.show()
```

**Passo 5 — Repita o Passo 4 no Colab** ([colab.research.google.com](https://colab.research.google.com)): crie um notebook, cole o mesmo código e execute. No Colab, NumPy e Matplotlib já vêm instalados — perceba a diferença de experiência.

**Passo 6 — Versione:** crie um repositório `academia-lab` no GitHub, faça o `git init`, `add`, `commit` e `push` do projeto (sem a pasta `.venv` — o `uv init` já gera um `.gitignore` adequado).

## 🚀 Mini-projeto

**Enunciado:** monte seu "Quartel-general de estudos": um repositório público no GitHub chamado `academia-ia` que servirá de diário de bordo da formação inteira.

**Requisitos:**

1. `README.md` com: quem você é, por que está estudando IA, e seu plano semanal de estudos (dias e horários).
2. O script `check_setup.py` do lab, rodando sem erros.
3. Um notebook `modulo00.ipynb` com o gráfico do lab e um parágrafo (em Markdown, no próprio notebook) explicando com suas palavras a diferença entre engenheiro de IA, cientista de dados e ML engineer.
4. Contas criadas: GitHub, Hugging Face e Google AI Studio (adicione ao README os links dos seus perfis públicos — nunca as chaves!).

**Critérios de aceite:**

- [ ] Repositório público no GitHub com pelo menos 2 commits de mensagens descritivas
- [ ] `check_setup.py` executa sem erros com `uv run python check_setup.py`
- [ ] Notebook abre e executa de ponta a ponta no Colab
- [ ] README contém o plano semanal com dias e horários concretos
- [ ] Nenhuma chave de API ou arquivo `.env` visível no repositório

**Dicas:** escreva o README como se fosse para o "você de daqui a 6 meses"; commits pequenos e frequentes valem mais que um commit gigante; se travar na instalação, o Colab garante que você nunca fica bloqueado.

## ✅ Quiz

**1.** Qual técnica de estudo consiste em tentar lembrar o conteúdo sem consultar o material?
A) Repetição espaçada B) Active recall C) Leitura dinâmica D) Resumo passivo

**2.** Qual a principal diferença do engenheiro de IA para o ML engineer clássico?
A) Engenheiro de IA não programa B) Foca em construir produtos sobre modelos existentes, como LLMs C) Só trabalha com estatística D) Não usa Python

**3.** Para que serve um ambiente virtual em Python?
A) Acelerar o processador B) Isolar as dependências de cada projeto C) Criar máquinas virtuais D) Substituir o Git

**4.** Qual ferramenta usamos na Academia para gerenciar Python e dependências?
A) conda B) pip puro C) uv D) npm

**5.** Qual plataforma oferece chave de API de LLM gratuita para estudo?
A) OpenAI B) Anthropic C) Google AI Studio D) AWS

**6.** O que é um commit no Git?
A) Uma cópia de segurança na nuvem B) Uma fotografia versionada do estado do projeto C) Um envio de e-mail D) Uma branch nova

**7.** Por que "projetos > consumo passivo"?
A) Vídeos são sempre ruins B) Construir força a integração ativa do conhecimento e gera portfólio C) Projetos são mais rápidos que vídeos D) Recrutadores odeiam cursos

**8.** Onde uma chave de API deve ficar?
A) No código, para facilitar B) Num comentário do notebook C) Em variável de ambiente ou `.env` fora do Git D) No README do repositório

<details><summary>Ver respostas</summary>

1. **B** — Active recall é recuperar da memória; reler é passivo e fixa pouco. Repetição espaçada (A) é sobre *quando* revisar, não *como*.
2. **B** — O engenheiro de IA constrói produtos sobre modelos (próprios ou de fundação); o ML engineer foca em treinar e servir modelos próprios.
3. **B** — Cada projeto ganha sua "caixinha" de pacotes, evitando conflitos de versões entre projetos e com o sistema.
4. **C** — uv instala versões do Python, cria venvs e gerencia dependências, com velocidade muito superior ao fluxo pip tradicional.
5. **C** — O Google AI Studio (aistudio.google.com) dá acesso gratuito aos modelos Gemini; Anthropic e OpenAI são pré-pagas.
6. **B** — Commit registra uma versão do projeto com mensagem; o envio à nuvem é o `push`.
7. **B** — Construir exige integrar os conceitos de forma ativa (o que consolida o aprendizado) e produz evidência concreta para entrevistas.
8. **C** — Chave é senha: variável de ambiente ou `.env` listado no `.gitignore`. Qualquer chave commitada deve ser considerada vazada e revogada.

</details>

## 🃏 Flashcards

| Frente | Verso |
|--------|-------|
| O que é active recall? | Estudar tentando *lembrar* o conteúdo sem olhar o material; consolida muito mais que reler. |
| O que é spaced repetition? | Revisar em intervalos crescentes (1, 3, 7, 30 dias) para vencer a curva do esquecimento. |
| Engenheiro de IA vs cientista de dados | Engenheiro de IA constrói produtos sobre modelos; cientista de dados extrai conhecimento de dados para decisões. |
| De onde vem o termo "AI Engineer"? | Do ensaio "The Rise of the AI Engineer", de swyx (2023). |
| O que faz o uv? | Gerencia versões do Python, ambientes virtuais e dependências — rápido e por projeto. |
| Para que serve um ambiente virtual? | Isolar as dependências de cada projeto, evitando conflitos de versões. |
| Notebook vs script | Notebook para explorar e comunicar; script para automatizar e entregar. |
| Ciclo mínimo do Git | `git add` → `git commit -m "msg"` → `git push`. |
| O que é o Hugging Face? | O "GitHub dos modelos": hub aberto de modelos, datasets e demos de IA. |
| Regra de ouro para chaves de API | Nunca no código nem no Git; sempre em variável de ambiente ou `.env` ignorado. |

## ☑️ Checklist de conclusão

- [ ] Li o ensaio "The Rise of the AI Engineer" e sei explicar os três papéis (cientista de dados, ML engineer, engenheiro de IA)
- [ ] uv instalado e `uv run python --version` mostrando 3.12+
- [ ] VS Code com extensões Python e Jupyter funcionando
- [ ] Notebook executado localmente **e** no Google Colab
- [ ] Contas criadas: GitHub, Hugging Face e Google AI Studio
- [ ] Repositório `academia-ia` publicado com o mini-projeto completo
- [ ] Plano semanal de estudos escrito no README
- [ ] Quiz respondido e flashcards agendados para revisão (1, 3, 7, 30 dias)
