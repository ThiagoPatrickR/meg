#!/bin/bash

# Script para parar todos os serviços de desenvolvimento
# Usage: ./stop-dev.sh

echo "🛑 Parando serviços de desenvolvimento..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Mata processos rodando nas portas de desenvolvimento
echo -e "${RED}Parando Backend (porta 3333)...${NC}"
lsof -ti:3333 | xargs -r kill -9 2>/dev/null

echo -e "${RED}Parando Frontend Admin (porta 5173)...${NC}"
lsof -ti:5173 | xargs -r kill -9 2>/dev/null

echo -e "${RED}Parando Frontend LP (porta 5174)...${NC}"
lsof -ti:5174 | xargs -r kill -9 2>/dev/null

# Mata processos ts-node-dev e vite remanescentes
pkill -f "ts-node-dev.*server.ts" 2>/dev/null
pkill -f "vite" 2>/dev/null

echo ""
echo -e "${GREEN}✅ Todos os serviços foram parados!${NC}"
