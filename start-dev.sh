#!/bin/bash

# Script para iniciar todos os serviços de desenvolvimento
# Usage: ./start-dev.sh

echo "🚀 Iniciando serviços de desenvolvimento..."

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Diretório base do projeto
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Função para matar processos nas portas
cleanup() {
    echo ""
    echo "🛑 Parando serviços..."
    kill $BACKEND_PID $ADMIN_PID $LP_PID 2>/dev/null
    exit 0
}

# Captura Ctrl+C para limpar processos
trap cleanup SIGINT SIGTERM

# Inicia o Backend
echo -e "${BLUE}📦 Iniciando Backend (porta 3333)...${NC}"
cd "$BASE_DIR/backend"
npm run dev &
BACKEND_PID=$!

# Aguarda o backend iniciar
sleep 3

# Inicia o Frontend Admin
echo -e "${BLUE}🔧 Iniciando Frontend Admin (porta 5173)...${NC}"
cd "$BASE_DIR/frontend-admin"
npm run dev &
ADMIN_PID=$!

# Inicia o Frontend LP (Landing Page)
echo -e "${BLUE}💒 Iniciando Frontend LP (porta 5174)...${NC}"
cd "$BASE_DIR/frontend-lp"
npm run dev -- --port 5174 &
LP_PID=$!

echo ""
echo -e "${GREEN}✅ Todos os serviços iniciados!${NC}"
echo ""
echo "📍 URLs disponíveis:"
echo "   Backend API:    http://localhost:3333/api"
echo "   Health Check:   http://localhost:3333/health"
echo "   Admin Panel:    http://localhost:5173"
echo "   Landing Page:   http://localhost:5174"
echo ""
echo "Pressione Ctrl+C para parar todos os serviços"

# Mantém o script rodando e espera os processos filhos
wait
