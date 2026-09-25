# 📘 Documentação Completa do Projeto
## Mapa Interativo de Cases de Sucesso — Sebrae Minas Gerais

---

### Sumário
1. [Visão Geral e Objetivos](#1-visão-geral-e-objetivos)
2. [Arquitetura do Sistema](#2-arquitetura-do-sistema)
3. [Índice de Desenvolvimento e Regras de Negócio](#3-índice-de-desenvolvimento-e-regras-de-negócio)
   - [3.1 Os 13 Critérios de Educação Empreendedora (91 Pontos)](#31-os-13-critérios-de-educação-empreendedora-91-pontos)
   - [3.2 Faixas de Classificação](#32-faixas-de-classificação)
   - [3.3 Instrumentos Aplicados e Destaque](#33-instrumentos-aplicados-e-destaque)
   - [3.4 Regra Hierárquica Município-Case](#34-regra-hierárquica-município-case)
4. [Módulos da Aplicação](#4-módulos-da-aplicação)
   - [4.1 Portal Público (`index.html`)](#41-portal-público-indexhtml)
   - [4.2 Painel Administrativo (`admin.html`)](#42-painel-administrativo-adminhtml)
5. [Segurança e Resiliência](#5-segurança-e-resiliência)
6. [Dicionário de Dados e Estrutura do Banco](#6-dicionário-de-dados-e-estrutura-do-banco)
7. [Endpoints da API Backend (`server.py`)](#7-endpoints-da-api-backend-serverpy)
8. [Suíte de Testes Automatizados](#8-suíte-de-testes-automatizados)
9. [Instalação, Configuração e Deploy](#9-instalação-configuração-e-deploy)

---

## 1. Visão Geral e Objetivos

O **Mapa Interativo de Cases de Sucesso** é uma plataforma geoespacial e de inteligência analítica desenvolvida para o **Sebrae Minas Gerais**. O sistema mapeia, cataloga e avalia iniciativas de **Educação Empreendedora** em todo o estado de Minas Gerais, conectando:
* **Municípios e Gestores Públicos**: Avaliação diagnóstica do ecossistema educacional empreendedor através de 13 indicadores oficiais ponderados.
* **Professores e Educadores**: Registro de práticas pedagógicas e projetos transformadores desenvolvidos em sala de aula.
* **Estudantes Empreendedores**: Divulgação de miniempresas, projetos escolares sustentáveis e soluções inovadoras criadas por jovens estudantes.
* **Analistas e Lideranças do Sebrae**: Monitoramento regional com filtros avançados, validação hierárquica e tomada de decisão orientada a dados.

---

## 2. Arquitetura do Sistema

A solução foi projetada como uma **Single Page Application (SPA) moderna e leve**, sem sobrecarga de frameworks pesados, garantindo performance instantânea, fácil manutenção e compatibilidade total:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CAMADA CLIENTE (BROWSER)                      │
│                                                                        │
│   ┌──────────────────────────┐         ┌───────────────────────────┐   │
│   │    Portal Público        │         │    Painel Administrativo  │   │
│   │   (index.html / app.js)  │         │   (admin.html / admin.js) │   │
│   │  Leaflet.js + GeoJSON    │         │ Multiselect, Modais, CRUD │   │
│   └─────────────┬────────────┘         └─────────────┬─────────────┘   │
└─────────────────┼────────────────────────────────────┼─────────────────┘
                  │ HTTP / REST                        │ JWT Bearer Auth
                  ▼                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        CAMADA DE SERVIÇO (BACKEND)                     │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │  server.py (Python 3 ThreadingHTTPServer)                      │   │
│   │  - Validador Regex de Recursos (Anti-SQLi / Anti-PathTraversal)│   │
│   │  - Autenticação e Emissão de Sessão JWT (HMAC-SHA256)          │   │
│   │  - Rate Limiter por IP (Anti-Força Bruta e Anti-Spam)          │   │
│   │  - Sanitizador HTML/XSS e Validador de Strings em Branco       │   │
│   │  - Motor de Cálculo do Índice de Desenvolvimento (91 pts)      │   │
│   │  - Controle de Bloqueio Hierárquico Município -> Case          │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
└────────────────────────────────────┼───────────────────────────────────┘
                                     │
                  ┌──────────────────┴──────────────────┐
                  ▼                                     ▼
       ┌─────────────────────┐               ┌────────────────────┐
       │     Supabase        │               │   data_store.json  │
       │ PostgreSQL Remoto   │               │ Persistência Local │
       │ (Produção / Nuvem)  │               │ & Fallback Resil.  │
       └─────────────────────┘               └────────────────────┘
```

---

## 3. Índice de Desenvolvimento e Regras de Negócio

### 3.1 Os 13 Critérios de Educação Empreendedora (91 Pontos)

O Índice de Desenvolvimento do Município é calculado a partir de **13 critérios oficiais**, ordenados por relevância estratégica decrescente com pesos de **13 a 1**, totalizando **91 pontos**:

| Ordem | Peso | Identificador Técnico | Critério Oficial |
| :---: | :---: | :--- | :--- |
| **1º** | **13 pts** | `educacao_70_porcento` | Possui Educação Empreendedora em mais de 70% do município |
| **2º** | **12 pts** | `parceria_secretaria_educacao` | Parceria com Secretaria Municipal de Educação |
| **3º** | **11 pts** | `jepp_municipio` | JEPP (Jovens Empreendedores Primeiros Passos) no município |
| **4º** | **10 pts** | `produto_despertar` | Produto Despertar implantado |
| **5º** | **9 pts** | `parceria_superintendencia` | Parceria com Superintendência Regional de Ensino |
| **6º** | **8 pts** | `parceria_ies` | Parceria com Instituição de Ensino Superior (IES) |
| **7º** | **7 pts** | `rede_aqui_tem_sebrae` | Ponto de atendimento / Rede Aqui Tem Sebrae |
| **8º** | **6 pts** | `convenio_parceria` | Convênio / Termo de parceria ativo com o Sebrae |
| **9º** | **5 pts** | `comite_gestor` | Comitê Gestor municipal instituído |
| **10º** | **4 pts** | `empresa_simulada` | Programa Empresa Simulada implantado |
| **11º** | **3 pts** | `escola_sebrae` | Sistema de Ensino Escola do Sebrae (Cursos Técnicos) |
| **12º** | **2 pts** | `cooperativa_credito` | Parceria com Cooperativa de Crédito |
| **13º** | **1 pt** | `lei_educacao_empreendedora` | Lei municipal de Educação Empreendedora aprovada |
| **TOTAL** | **91 pts** | — | **Soma máxima de pontuação** |

> **Nota sobre o JEPP:** Em conformidade com as diretrizes do Sebrae, o critério do JEPP pontua 11 pontos com qualquer resposta afirmativa (`"Sim"`, `"Total"`, `"Parcial"`, `true` ou `1`).

### 3.2 Faixas de Classificação

A pontuação bruta (0 a 91) determina a classificação oficial do município:

* **Em Desenvolvimento**: de **0 a 63 pontos** ($0\% \text{ a } 69,2\%$).
* **Desenvolvido**: de **64 a 91 pontos** ($70,3\% \text{ a } 100\%$).

### 3.3 Instrumentos Aplicados e Destaque

Além dos 13 critérios estruturais, avaliam-se os instrumentos pedagógicos e formativos mobilizados no município:

| Instrumento | Código | Pontuação |
| :--- | :--- | :---: |
| **Curso** | `curso` | **10 pts** |
| **Oficina** | `oficina` | **10 pts** |
| **Encontro Mediado** | `encontro_mediado` | **10 pts** |
| **Material Didático** | `material_didatico` | **10 pts** |
| **Palestra** | `palestra` | **5 pts** |

* **Regra de Destaque de Instrumentos**: O município ou case conquista o selo **⭐ Destaque** quando a soma de seus instrumentos atinge **$\ge 25$ pontos** (por exemplo: *1 Curso [10] + 1 Oficina [10] + 1 Palestra [5] = 25 pontos*).
* **Auto-derivação Inteligente**: Se o cadastro não declarar explicitamente os instrumentos, o sistema deriva automaticamente a partir dos indicadores atendidos (ex.: JEPP gera Material Didático e Oficina; Empresa Simulada gera Curso; Parcerias geram Encontro Mediado).

### 3.4 Regra Hierárquica Município-Case

Para garantir a integridade dos dados expostos publicamente:
* **Um case não pode ser aprovado se o seu município estiver com status `rejected` (Rejeitado)**.
* No painel do administrador, o botão de aprovação desse case é automaticamente desabilitado, exibindo a etiqueta de bloqueio `"Bloqueado: Aprove o município primeiro"`.

---

## 4. Módulos da Aplicação

### 4.1 Portal Público (`index.html`)

O portal público destina-se a cidadãos, educadores e gestores:
* **Mapa de Minas Gerais (Leaflet.js)**: Carrega polígonos GeoJSON de mesorregiões e municípios mineiros, com cores e marcadores interativos.
* **Barra de Busca e Filtros Rápidos**: Busca textual por nome do projeto, escola, cidade ou responsável, além de filtros por Regional Sebrae e Modalidade (Estudante Empreendedor / Professor).
* **Modal de Detalhes do Case**: Exibe o case enriquecido com resumo, autor, fotos, contatos e o selo do Índice de Desenvolvimento do Município pai (sem expor a pontuação interna do questionário ao público geral, focando no impacto pedagógico).
* **Modal de Municípios de Referência**: Vitrine com os municípios avaliados como destaque no estado.
* **Formulários Públicos com Proteção Anti-Perda**:
  * *Submissão de Case*: Permite a qualquer educador ou aluno submeter seu projeto (gera protocolo `#XXXXX` e status `pending`).
  * *Solicitação de Município*: Permite a secretarias e prefeituras solicitarem a inclusão/atualização de sua cidade.
  * *Proteção*: Ambos os formulários possuem bloqueio contra fechamento acidental ao clicar fora ou ao teclar Enter.

### 4.2 Painel Administrativo (`admin.html`)

O ambiente restrito aos analistas e administradores do Sebrae:
* **Autenticação Segura**: Modal de login que emite token JWT com persistência em sessão e timeout automático.
* **Aba 1: Municípios Solicitados**:
  * **Filtros Avançados Acumulativos (Multiselect com Checkboxes)**:
    1. *Regional Sebrae* (seleção múltipla de regionais).
    2. *Classificação do Índice* (Desenvolvido / Em Desenvolvimento).
    3. *Instrumento Aplicado* (filtra municípios que aplicam Curso, Oficina, Palestra, Material Didático, Encontro Mediado ou Destaque $\ge 25$ pts).
    4. *Indicador Atendido (Exigir 'Sim')*: Permite filtrar municípios que cumprem um ou mais indicadores específicos selecionados.
    5. *Indicadores que Quero Ver*: Permite customizar dinamicamente quais colunas/tags de indicadores aparecem na tabela, com presets rápidos (*Todos*, *Apenas Sim*, *Top 5*, *Parcerias* e *Limpar*).
  * **Tabela Responsiva**:
    * Protocolo sequencial `#XXXXX`.
    * Município com badge de pontuação e tier (`87 pts • Desenvolvido`).
    * Contatos do gestor responsável.
    * Indicadores exibidos em tags compactas (`✓` verde / `✗` vermelho).
    * Instrumentos aplicados com badge de Destaque.
    * Coluna de ações centralizada e protegida contra overflow horizontal (`Editar`, `Excluir`, `Detalhes`, `Aprovar`, `Rejeitar`).
* **Aba 2: Cases Submetidos**:
  * Tabela completa de cases, modalidade, dados do professor/aluno, status de aprovação e validação da regra hierárquica.
* **Memória de Cálculo Consolidada**: Modal de detalhes detalhando item a item cada um dos 13 critérios, peso de cada um, pontos obtidos e fórmula de fechamento.

---

## 5. Segurança e Resiliência

O sistema adota padrões rigorosos de segurança aplicados no backend e no frontend:

```markdown
┌───────────────────────────────┬─────────────────────────────────────────────────────────────┐
│ Vetor de Proteção             │ Mecanismo Implementado                                      │
├───────────────────────────────┼─────────────────────────────────────────────────────────────┤
│ Injeção de Código e SQLi      │ Validação estrita por Regex (`^[a-zA-Z0-9_\-#]+$`)          │
│ Força Bruta / Ataque a Senhas │ Rate Limiter em memória por IP (lockout após 5 erros)       │
│ Falsificação de Sessão        │ Assinatura HMAC-SHA256 em JWT com validação de expiração    │
│ Controle de Acesso            │ Autorização RBAC (permissões de admin vs user)              │
│ Cross-Site Scripting (XSS)    │ Sanitização de tags HTML, strip de javascript: e escapes    │
│ Submissões Fantasmas          │ Validador de strings em branco (rejeita espaços vazios)     │
│ Submissões Repetidas / Flood  │ Bloqueio de duplicatas imediatas por hash de payload + IP   │
│ Perda Acidental de Dados      │ Bloqueio de backdrop-close e enter-submit em formulários    │
│ Resiliência de Armazenamento  │ Fallback automático entre Supabase e data_store.json        │
└───────────────────────────────┴─────────────────────────────────────────────────────────────┘
```

---

## 6. Dicionário de Dados e Estrutura do Banco

Os registros no arquivo `data_store.json` e no Supabase seguem a seguinte modelagem canônica:

### Objeto: Município (`municipalities`)

```json
{
  "id": "mun-belo-horizonte",
  "request_code": "#M-10010",
  "nome": "Belo Horizonte",
  "regional": "Centro",
  "mr": "MR Grande Belo Horizonte",
  "responsavel_nome": "Amanda Souza",
  "responsavel_email": "amanda.souza@sebraemg.com.br",
  "responsavel_telefone": "(31) 98765-4321",
  "status": "approved",
  "created_at": "2026-09-01T10:00:00.000Z",

  "municipio_ee_70": "sim",
  "parceria_secretaria_educacao": true,
  "secretaria_educacao_possui": true,
  "status_jepp": "Sim",
  "produto_despertar": true,
  "despertar_possui": true,
  "parceria_superintendencia": true,
  "ies_possui": true,
  "rede_aqui_tem_sebrae": true,
  "aqui_tem_sebrae_possui": true,
  "convenio_sebrae": true,
  "comite_possui": true,
  "empresa_simulada": false,
  "escola_sebrae": true,
  "cooperativa_possui": true,
  "lei_possui": true,

  "instrumentos_aplicados": ["curso", "encontro_mediado", "material_didatico", "oficina"],
  "pontuacao_instrumentos": 40,
  "destaque_instrumentos": true,

  "indice_pontuacao": 87,
  "indice_percentual": 95.6,
  "indice_classificacao": "Desenvolvido",
  "indice_classificacao_key": "desenvolvido",
  "indice_desenvolvimento": {
    "pontuacao": 87,
    "pontuacao_maxima": 91,
    "percentual": 95.6,
    "classificacao": "Desenvolvido",
    "classificacao_key": "desenvolvido",
    "criterios": [ ... 13 critérios detalhados ... ],
    "instrumentos_aplicados": [ ... ],
    "pontuacao_instrumentos": 40,
    "destaque_instrumentos": true
  }
}
```

---

## 7. Endpoints da API Backend (`server.py`)

| Método | Endpoint | Permissão | Descrição |
| :---: | :--- | :---: | :--- |
| `GET` | `/api/cases` | Público | Lista todos os cases aprovados com índice calculado |
| `POST` | `/api/cases` | Público / Admin | Submete um novo case de estudante ou professor |
| `PATCH` | `/api/cases/{id}` | **Admin** | Atualiza dados e indicadores de um case |
| `DELETE` | `/api/cases/{id}` | **Admin** | Remove um case do sistema |
| `POST` | `/api/cases/{id}/approve` | **Admin** | Aprova o case (valida regra hierárquica do município) |
| `POST` | `/api/cases/{id}/reject` | **Admin** | Rejeita o case com motivo |
| `GET` | `/api/municipalities` | Público | Lista os municípios cadastrados e seus índices |
| `POST` | `/api/municipalities` | Público / Admin | Solicita ou cadastra um novo município |
| `PATCH` | `/api/municipalities/{id}`| **Admin** | Edita indicadores de um município e recalcula score |
| `DELETE` | `/api/municipalities/{id}`| **Admin** | Remove um município do banco |
| `POST` | `/api/municipalities/{id}/approve` | **Admin** | Aprova a inclusão do município |
| `POST` | `/api/municipalities/{id}/reject` | **Admin** | Rejeita a solicitação do município |
| `POST` | `/api/admin/login` | Público | Autentica administrador e gera token JWT |
| `POST` | `/api/auth/login` | Público | Autentica usuário comum |

---

## 8. Suíte de Testes Automatizados

O projeto conta com **23 testes automatizados** que cobrem ponta a ponta todas as regras de negócio, contratos de segurança e integridade de interface.

Para executar todos os testes:
```bash
python -m unittest discover -v -s tests -p "test_*.py"
```

### Detalhamento dos Módulos de Teste:

1. **`tests/test_indice_desenvolvimento.py`**:
   - `test_criteria_order_weights_and_sum`: Valida a ordem exata dos 13 critérios, pesos de 13 a 1 e soma total 91.
   - `test_score_cutoffs_and_tiers`: Valida as linhas de corte (63 pts para Em Desenvolvimento, 64 pts para Desenvolvido).
   - `test_instrumentos_score_and_destaque`: Valida o peso da Palestra (5 pts), demais (10 pts) e destaque ($\ge 25$ pts).
   - `test_jepp_flexibility`: Valida aceitação de Sim, Total, Parcial, 1 e true.
   - `test_frontend_files_contain_dev_index`: Valida coerência de arquivos frontend.
2. **`tests/test_security.py`**:
   - `test_is_valid_resource_id_blocks_sql_injection`: Valida proteção anti-SQLi.
   - `test_brute_force_rate_limiter`: Valida bloqueio após 5 tentativas de login.
   - `test_jwt_generation_verification_and_tamper`: Valida token, assinatura e expiração.
   - `test_login_authentication_and_lockout`: Valida fluxo de autenticação e retorno 429.
   - `test_protected_endpoints_auth_and_authorization`: Valida 401/403 em endpoints admin.
   - `test_space_string_validation_and_sanitization`: Valida prevenção de strings em branco e XSS.
   - `test_prevent_duplicate_form_submissions`: Valida proteção anti-flood.
3. **`tests/test_approval_flow.py`**:
   - `test_approve_case_blocked_if_parent_municipality_rejected`: Garante a regra hierárquica.
   - `test_approve_case_only_updates_status`: Valida integridade de propriedades após aprovação.
4. **`tests/test_case_code.py`**:
   - `test_get_next_code_is_sequential`: Valida numeração de protocolos `#10000`, `#20000`...
5. **`tests/test_lint.py`**:
   - `test_javascript_syntax_integrity`: Checagem sintática de arquivos JS.
   - `test_python_syntax_and_compilation`: Checagem sintática de arquivos Python.
   - `test_html_files_integrity`: Validação estrutural de HTMLs.
   - `test_form_protection_against_accidental_close`: Valida prevenção de fechamento acidental.
   - `test_new_form_fields_and_indicators_integrity`: Validação de novos campos nos formulários.
   - `test_details_modal_indicators_and_enriched_seed_cases`: Validação dos modais.

---

## 9. Instalação, Configuração e Deploy

### 9.1 Requisitos
* Python 3.10 ou superior.
* Navegador moderno (Chrome, Edge, Firefox, Safari).

### 9.2 Execução Local

1. **Clonar o Repositório**:
   ```bash
   git clone https://github.com/anuskacristall/casesdesucesso.git
   cd casesdesucesso
   ```

2. **Configuração de Variáveis de Ambiente**:
   Crie ou edite o arquivo `.env` na raiz do projeto:
   ```env
   PORT=8001
   JWT_SECRET=sebrae-mg-secure-secret-key-2026-CasesDeSucesso!
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_KEY=sua-chave-secreta-supabase
   ```
   No frontend, copie `config.example.js` para `config.js` com a URL e chave anônima pública.

3. **Iniciar o Servidor**:
   ```bash
   python server.py
   ```
   * Portal Público: `http://localhost:8001/`
   * Painel Administrativo: `http://localhost:8001/admin.html`

### 9.3 Deploy em Produção (Docker / Render / Railway / VM)
* O arquivo `server.py` implementa `ThreadingHTTPServer`, respondendo diretamente à variável de ambiente `PORT` configurada pela plataforma de nuvem (default 8001).
* Não necessita de dependências externas (`pip install` desnecessário para o servidor base), utilizando a biblioteca padrão do Python 3 com alta eficiência e baixo consumo de memória.

---
*Documentação técnica oficial consolidada para o Sebrae Minas Gerais.*
