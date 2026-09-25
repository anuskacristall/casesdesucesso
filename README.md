# 🗺️ Mapa Interativo de Cases de Sucesso — Sebrae Minas Gerais

![Versão](https://img.shields.io/badge/Vers%C3%A3o-v2.0-blue.svg)
![Status](https://img.shields.io/badge/Status-Conclu%C3%ADdo-brightgreen.svg)
![Testes](https://img.shields.io/badge/Testes-23%2F23%20Passing-brightgreen.svg)
![Índice](https://img.shields.io/badge/%C3%8Dndice%20Oficial-13%20Crit%C3%A9rios%20(91%20pts)-orange.svg)
![Segurança](https://img.shields.io/badge/Seguran%C3%A7a-JWT%20%7C%20Rate%20Limit%20%7C%20Anti--SQLi-blueviolet.svg)

Plataforma analítica e geoespacial desenvolvida para o **Sebrae Minas Gerais** com o objetivo de mapear, catalogar, avaliar e promover iniciativas e práticas transformadoras de **Educação Empreendedora** em todo o estado.

> 📖 **Para a especificação técnica completa, consulte a [DOCUMENTACAO.md](DOCUMENTACAO.md).**

---

## 🌟 Principais Funcionalidades

### 1. 🗺️ Portal Público (`index.html`)
* **Mapa Geográfico Interativo (Leaflet.js)** com marcação de municípios e mesorregiões de Minas Gerais.
* **Busca e Filtros Rápidos** por regional, modalidade (*Estudante Empreendedor* ou *Professor*) e texto livre.
* **Vitrine de Municípios de Referência** e visualização de cases enriquecidos com fotos, contatos e dados pedagógicos.
* **Formulários de Submissão** protegidos contra perda acidental de dados ao teclar Enter ou clicar fora do modal.

### 2. 📊 Índice de Desenvolvimento Municipal (13 Critérios • 91 Pontos)
Avaliação diagnóstica ponderada da Educação Empreendedora municipal com pesos estratégicos de **13 a 1**:
* **Classificação Oficial**:
  * 🌿 **Desenvolvido**: $\ge 64$ pontos ($70,3\%$ a $100\%$).
  * 🌾 **Em Desenvolvimento**: $\le 63$ pontos ($0\%$ a $69,2\%$).
* **Instrumentos Aplicados**:
  * *Curso* (+10), *Oficina* (+10), *Encontro Mediado* (+10), *Material Didático* (+10) e *Palestra* (+5).
  * **⭐ Selo de Destaque**: Concedido a municípios e cases com **$\ge 25$ pontos** em instrumentos aplicados.

### 3. 🛡️ Painel Administrativo de Gestão (`admin.html`)
* **Autenticação Segura JWT** com controle de acesso baseado em papéis (RBAC).
* **Filtros Avançados Acumulativos (Multiselect)**:
  * Seleção múltipla por Regionais Sebrae.
  * Filtro por Classificação do Índice (*Desenvolvido* / *Em Desenvolvimento*).
  * Filtro por Instrumento Aplicado (*Curso*, *Oficina*, *Palestra*, etc.).
  * Exigência de atendimento a indicadores específicos (*Exigir 'Sim'*).
  * Personalização dinâmica dos indicadores visíveis em tabela com presets rápidos (*Todos*, *Apenas Sim*, *Top 5*, *Parcerias*).
* **Fluxo de Aprovação com Regra Hierárquica**: Bloqueio inteligente que impede a aprovação de cases caso o município pai esteja com status rejeitado.
* **Memória de Cálculo Consolidada**: Visualização detalhada de todos os critérios, pesos e justificativas do score.

### 4. 🔒 Segurança de Nível Corporativo
* Rate Limiting por IP e proteção anti-força bruta (bloqueio temporário após 5 falhas consecutivas).
* Prevenção estrita contra SQL Injection e Path Traversal via Regex.
* Sanitização contra ataques XSS e validação de strings em branco.
* Prevenção de envios duplicados e redundantes por hash temporário.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend**: HTML5 Semântico, CSS3 Moderno (CSS Custom Properties, Grid, Flexbox), JavaScript ES6+ (SPA Vanilla pura).
* **Mapas & Geoserviços**: Leaflet.js, Polígonos GeoJSON de Minas Gerais.
* **Backend**: Python 3 (`ThreadingHTTPServer` integrado, zero dependências externas obrigatórias).
* **Armazenamento e Nuvem**: Supabase (PostgreSQL / Realtime / Storage API) com fallback resiliente para `data_store.json`.
* **Segurança**: HMAC-SHA256 para geração e verificação de JWT.

---

## 🚀 Como Executar Localmente

### 1. Clonar o Repositório
```bash
git clone https://github.com/anuskacristall/casesdesucesso.git
cd casesdesucesso
```

### 2. Configurar Variáveis de Ambiente
Crie ou edite o arquivo `.env` na raiz:
```env
PORT=8001
JWT_SECRET=sebrae-mg-secure-secret-key-2026-CasesDeSucesso!
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-secreta
```

No frontend, copie `config.example.js` para `config.js` com a URL e chave anônima pública.

### 3. Iniciar o Servidor
```bash
python server.py
```
Acesse a aplicação no navegador:
* **Portal Público**: [http://localhost:8001/](http://localhost:8001/)
* **Painel Administrativo**: [http://localhost:8001/admin.html](http://localhost:8001/admin.html)

---

## 🧪 Execução dos Testes Automatizados

O projeto conta com **23 testes unitários e de integração** validando segurança, cálculos, persistência e regras de negócio:

```bash
python -m unittest discover -v -s tests -p "test_*.py"
```

Resultado esperado:
```text
Ran 23 tests in 0.230s
OK
```

---

## 📁 Estrutura do Repositório

```text
├── admin.html               # Painel Administrativo de Gestão
├── admin.js                 # Controlador e regras do Admin (Filtros, CRUD, Memória)
├── index.html               # Portal Público com Mapa Interativo
├── app.js                   # Controlador do Portal Público (Leaflet, Modais, Buscas)
├── style.css                # Estilos globais e branding oficial Sebrae
├── server.py                # Servidor HTTP, API REST, JWT, Rate Limiting e Cálculo
├── data_store.json          # Banco de dados local persistente (18 municípios + cases)
├── config.js                # Chaves públicas de integração Supabase
├── DOCUMENTACAO.md          # 📘 Documentação técnica completa e aprofundada
├── tests/                   # Suíte de testes automatizados (23 testes)
│   ├── test_approval_flow.py
│   ├── test_case_code.py
│   ├── test_indice_desenvolvimento.py
│   ├── test_lint.py
│   └── test_security.py
└── data/                    # GeoJSONs dos municípios e mesorregiões de MG
```

---
*Sebrae Minas Gerais — Educação Empreendedora.*
