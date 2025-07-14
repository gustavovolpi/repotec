#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Construindo o frontend...${NC}"

# Entrar no diretório do frontend
cd repotec-app

# Instalar dependências
echo -e "${YELLOW}Instalando dependências do frontend...${NC}"
npm install

# Construir o frontend
echo -e "${YELLOW}Compilando o frontend...${NC}"
npm run build

# Voltar para o diretório raiz
cd ..

echo -e "${GREEN}Frontend construído com sucesso!${NC}"
echo -e "${YELLOW}Iniciando o backend...${NC}"

# Iniciar o backend
docker compose up --build
