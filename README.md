# 🗺️ Mapa Interativo de Cases de Sucesso - Sebrae / Interactive Success Cases Map

![Version](https://img.shields.io/badge/Vers%C3%A3o-v1.0-blue.svg)
![Status](https://img.shields.io/badge/Status-Conclu%C3%ADdo-brightgreen.svg)

---

### 🌐 Select Language / Selecione o Idioma

> **[ 🇧🇷 Português ](#-português)** &nbsp;&nbsp;|&nbsp;&nbsp; **[ 🇺🇸 English ](#-english)**

---

<a name="-português"></a>
## 🇧🇷 Português

Uma plataforma web geográfica e interativa desenvolvida para mapear, catalogar e exibir visualmente **Cases de Sucesso de Empreendedorismo** nos municípios do estado.

### 🌟 Principais Funcionalidades

- 🗺️ **Mapa Geográfico Interativo**: Visualização detalhada dos municípios utilizando a biblioteca **Leaflet.js**, com marcações e destaques dinâmicos.
- 🏢 **Filtro por Município e Categoria**: Busca e navegação facilitada pelos cases cadastrados em cada cidade.
- 💾 **Integração Supabase (PostgreSQL & Storage)**: Armazenamento em nuvem em tempo real de informações dos cases, contatos e arquivos de imagem.
- 📱 **Interface Responsiva & Modern Design**: Design limpo com branding oficial do Sebrae, otimizado para navegadores desktop e dispositivos móveis.
- 🚀 **Pronto para Deploy na Nuvem**: Servidor leve em Python (`server.py`) pré-configurado para execução em ambiente local ou servidores como Render/Heroku.

### 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5 Semântico, CSS3 Moderno (Variables, Flexbox, Grid), JavaScript (ES6+).
- **Mapas & Geolocalização**: Leaflet.js, GeoJSON de Municípios.
- **Backend & Banco de Dados**: Supabase (PostgreSQL / Realtime / Storage API).
- **Servidor de Desenvolvimento**: Python 3 (`http.server` customizado com suporte a env vars e proxy SSL).

### 🚀 Como Executar o Projeto Localmente

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/anuskacristall/mapa-cases-sucesso.git
   cd mapa-cases-sucesso
   ```

2. **Configurar as Credenciais do Banco:**
   Renomeie o arquivo `config.example.js` para `config.js`:
   ```bash
   cp config.example.js config.js
   ```
   Edite o `config.js` com as suas chaves do Supabase:
   ```javascript
   window.SEBRAE_CONFIG = {
     SUPABASE_URL: "https://seu-projeto.supabase.co",
     SUPABASE_KEY: "sua-chave-anon-publica"
   };
   ```

3. **Iniciar o Servidor Local:**
   ```bash
   python server.py
   ```
   Acesse a aplicação em `http://localhost:8000` no seu navegador!

---

<a name="-english"></a>
## 🇺🇸 English

An interactive geographic web platform built to map, catalog, and visually display **Entrepreneurship Success Cases** across state municipalities.

### 🌟 Key Features

- 🗺️ **Interactive Geographic Map**: Detailed visualization of municipalities using **Leaflet.js** with dynamic map markers and highlights.
- 🏢 **City & Category Filter**: Effortless searching and filtering through registered cases by town or business sector.
- 💾 **Supabase Integration (PostgreSQL & Storage)**: Cloud real-time storage for entrepreneur success stories, contacts, and media files.
- 📱 **Responsive & Modern UI**: Clean user interface reflecting official Sebrae branding, optimized for desktop and mobile screens.
- 🚀 **Cloud-Ready Deployment**: Lightweight Python server (`server.py`) pre-configured for local testing or cloud platforms like Render/Heroku.

### 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 Modern (Custom Variables, Flexbox, Grid), JavaScript ES6+.
- **Maps & Geolocation**: Leaflet.js, Municipalities GeoJSON.
- **Backend & Database**: Supabase (PostgreSQL / Realtime / Storage API).
- **Development Server**: Python 3 custom HTTP server.

### 🚀 How to Run Locally

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/anuskacristall/mapa-cases-sucesso.git
   cd mapa-cases-sucesso
   ```

2. **Configure Database Credentials:**
   Copy `config.example.js` to `config.js`:
   ```bash
   cp config.example.js config.js
   ```
   Update `config.js` with your Supabase credentials:
   ```javascript
   window.SEBRAE_CONFIG = {
     SUPABASE_URL: "https://your-project.supabase.co",
     SUPABASE_KEY: "your-anon-public-key"
   };
   ```

3. **Start the Server:**
   ```bash
   python server.py
   ```
   Open `http://localhost:8000` in your web browser!

---

*Desenvolvido para catalogar e promover histórias de sucesso de empreendedores. / Developed to showcase entrepreneur success stories.*
