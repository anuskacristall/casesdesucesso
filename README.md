# 🗺️ Mapa Interativo de Cases de Sucesso - Sebrae

Uma plataforma web geográfica e interativa desenvolvida para mapear, catalogar e exibir visualmente **Cases de Sucesso de Empreendedorismo** nos municípios do estado.

---

## 🌟 Principais Funcionalidades

- 🗺️ **Mapa Geográfico Interativo**: Visualização detalhada dos municípios utilizando a biblioteca **Leaflet.js**, com marcações e destaques dinâmicos.
- 🏢 **Filtro por Município e Categoria**: Busca e navegação facilitada pelos cases cadastrados em cada cidade.
- 💾 **Integração Supabase (PostgreSQL & Storage)**: Armazenamento em nuvem em tempo real de informações dos cases, contatos e arquivos de imagem.
- 📱 **Interface Responsiva & Modern Design**: Design limpo com branding oficial do Sebrae, otimizado para navegadores desktop e dispositivos móveis.
- 🚀 **Pronto para Deploy na Nuvem**: Servidor leve em Python (`server.py`) pré-configurado para execução em ambiente local ou servidores como Render/Heroku.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5 Semântico, CSS3 Moderno (Variables, Flexbox, Grid), JavaScript (ES6+ Assegurado).
- **Mapas & Geolocalização**: Leaflet.js, GeoJSON de Municípios.
- **Backend & Banco de Dados**: Supabase (PostgreSQL / Realtime / Storage API).
- **Servidor de Desenvolvimento**: Python 3 (`http.server` customizado com suporte a env vars e proxy SSL).

---

## 🚀 Como Executar o Projeto Localmente

### 1. Clonar o Repositório
```bash
git clone https://github.com/SEU-USUARIO/mapa-cases-sucesso.git
cd mapa-cases-sucesso
```

### 2. Configurar as Credenciais do Banco
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

### 3. Iniciar o Servidor Local
Executando com Python:
```bash
python server.py
```
Acesse a aplicação em `http://localhost:8000` no seu navegador!

---

## 🔒 Segurança e Boas Práticas

Este repositório segue os padrões de segurança em desenvolvimento web:
- O arquivo `config.js` contendo as credenciais locais está incluído no `.gitignore`.
- O repositório utiliza o modelo `config.example.js` para instruir a configuração de novas instâncias com segurança.

---

## ✒️ Licença e Uso

Projeto desenvolvido para catalogar e promover histórias de sucesso de empreendedores atendidos pelo Sebrae.
