# Site de Casamento - Marcelo & Gabriella 💒

Sistema completo para site de casamento com landing page, painel administrativo e integração com Mercado Pago.

## 🚀 Tecnologias

- **Backend**: Node.js + Express + Sequelize + PostgreSQL
- **Frontend LP**: React + Vite + Framer Motion
- **Frontend Admin**: React + Vite + React Router
- **Pagamentos**: Mercado Pago (Pix + Cartão)
- **Chatbot**: Google Gemini AI
- **Deploy**: Docker + Docker Compose

## 📁 Estrutura

```
meg/
├── backend/          # API REST
├── frontend-lp/      # Landing Page
├── frontend-admin/   # Painel Administrativo
├── docker-compose.yml
└── .env
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Variáveis necessárias:
- `DB_*` - Credenciais do PostgreSQL
- `JWT_SECRET` - Chave secreta para tokens
- `MP_ACCESS_TOKEN` - Token do Mercado Pago
- `MP_PUBLIC_KEY` - Chave pública do Mercado Pago
- `GEMINI_API_KEY` - API Key do Google Gemini

### 2. Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers
2. Crie uma aplicação
3. Copie as credenciais para o `.env`
4. Configure o webhook para: `{API_URL}/payments/webhook`

### 3. Google Gemini

1. Acesse: https://ai.google.dev/
2. Crie um projeto e gere uma API Key
3. Adicione no `.env`

## 🐳 Deploy com Docker

### Subir todos os serviços:

```bash
docker-compose up -d --build
```

### Ver logs:

```bash
docker-compose logs -f
```

### Parar serviços:

```bash
docker-compose down
```

## 🌐 Acessos

- **Landing Page**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **API**: http://localhost:3333

### Login Admin

- Email: `admin@casamento.com`
- Senha: `123456`

> ⚠️ Altere a senha após o primeiro login!

## 🎨 Paleta de Cores

| Cor | Hex |
|-----|-----|
| Rosa Claro | `#FFC2D2` |
| Verde Esmeralda | `#026841` |
| Verde Escuro | `#003717` |

## 📱 Funcionalidades

### Landing Page
- ✅ Hero com contador regressivo
- ✅ História dos noivos (timeline)
- ✅ Informações do evento
- ✅ Lista de presentes com pagamento Pix
- ✅ Confirmação de presença
- ✅ Galeria de fotos
- ✅ Mural de recados
- ✅ Chatbot com IA
- ✅ Design responsivo

### Painel Admin
- ✅ Dashboard com estatísticas
- ✅ CRUD de presentes
- ✅ Gestão de categorias
- ✅ Lista de confirmações (exportar CSV)
- ✅ Aprovação de recados
- ✅ Histórico de pagamentos
- ✅ Configuração do chatbot

## 📝 Desenvolvimento Local

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend LP
```bash
cd frontend-lp
npm install
npm run dev
```

### Frontend Admin
```bash
cd frontend-admin
npm install
npm run dev
```

## 🔧 Comandos Úteis

```bash
# Rodar migrations
cd backend && npm run migration:run

# Build de produção
npm run build

# Resetar banco (dev)
docker-compose down -v
docker-compose up -d
```

---

Feito com 💕 para o casamento de Marcelo & Gabriella
