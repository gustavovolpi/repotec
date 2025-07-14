#!/bin/sh

# Criar diretório de uploads se não existir
echo "Criando diretório de uploads..."
mkdir -p /app/uploads

# Executar as migrações
echo "Executando migrações..."
npm run migration:run

# Verificar se o arquivo main.js existe
if [ ! -f "dist/main.js" ]; then
    echo "ERRO: dist/main.js não foi criado!"
    exit 1
fi

# Iniciar o servidor
echo "Iniciando o servidor..."
exec node dist/main.js
