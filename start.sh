#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Iniciando o RepoTEC...${NC}"

# Verificar se o Docker está instalado
if ! command -v docker &>/dev/null; then
    echo -e "${RED}Docker não está instalado. Por favor, instale o Docker primeiro.${NC}"
    exit 1
fi

# Verificar se o Docker Compose está instalado
if ! command -v docker-compose &>/dev/null; then
    echo -e "${RED}Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro.${NC}"
    exit 1
fi

# Construir e iniciar os containers
echo -e "${YELLOW}Construindo e iniciando os containers...${NC}"
docker-compose up -d --build

# Verificar se os containers estão rodando
echo -e "${YELLOW}Verificando status dos containers...${NC}"
docker-compose ps

echo -e "${GREEN}RepoTEC está rodando!${NC}"
echo -e "${GREEN}Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}API Swagger: http://localhost:3000/api${NC}"
echo -e "${YELLOW}Para parar os containers, execute: docker-compose down${NC}"
