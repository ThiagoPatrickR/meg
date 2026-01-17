#!/bin/bash
set -e

echo "🚀 Build and Push - Docker Images"
echo "=================================="
echo ""

# Solicitar versão
read -p "📋 Digite a versão (ex: v1.0.1): " VERSION
if [ -z "$VERSION" ]; then
    VERSION="v1.0.1"
    echo "   Usando versão padrão: $VERSION"
fi
echo ""
echo "🔨 Iniciando build de todas as imagens..."
echo ""

# Backend
echo "📦 Building Backend..."
docker build -t thiagopatrickr/meg:backend -t thiagopatrickr/meg:backend-$VERSION ./backend
echo "⬆️ Pushing Backend..."
docker push thiagopatrickr/meg:backend
docker push thiagopatrickr/meg:backend-$VERSION
echo "✅ Backend concluído!"
echo ""

# Frontend LP
echo "📦 Building Frontend LP..."
docker build -t thiagopatrickr/meg:frontend-lp -t thiagopatrickr/meg:frontend-lp-$VERSION ./frontend-lp
echo "⬆️ Pushing Frontend LP..."
docker push thiagopatrickr/meg:frontend-lp
docker push thiagopatrickr/meg:frontend-lp-$VERSION
echo "✅ Frontend LP concluído!"
echo ""

# Frontend Admin
echo "📦 Building Frontend Admin..."
docker build -t thiagopatrickr/meg:frontend-admin -t thiagopatrickr/meg:frontend-admin-$VERSION ./frontend-admin
echo "⬆️ Pushing Frontend Admin..."
docker push thiagopatrickr/meg:frontend-admin
docker push thiagopatrickr/meg:frontend-admin-$VERSION
echo "✅ Frontend Admin concluído!"
echo ""

echo "✅ Todas as imagens foram construídas e enviadas com sucesso!"
echo "📋 Versão: $VERSION"
echo "📦 Tags criadas:"
echo "   - backend, backend-$VERSION"
echo "   - frontend-lp, frontend-lp-$VERSION"
echo "   - frontend-admin, frontend-admin-$VERSION"
