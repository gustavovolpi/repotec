FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências primeiro
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o resto dos arquivos
COPY . .

# Limpar diretório dist se existir
RUN rm -rf dist

# Executar o build com mais informações
RUN echo "=== Executando build ===" && \
    npm run build && \
    echo "=== Conteúdo do diretório atual ===" && \
    pwd && \
    ls -la && \
    echo "=== Conteúdo do dist ===" && \
    ls -la dist && \
    echo "=== Verificando arquivo main.js ===" && \
    find . -name "main.js"

# Garantir que o arquivo main.js existe e está no lugar correto
RUN if [ ! -f "dist/main.js" ]; then \
        echo "ERRO: dist/main.js não foi criado!" && \
        exit 1; \
    fi && \
    echo "=== Conteúdo do arquivo main.js ===" && \
    cat dist/main.js

# Criar diretório para o frontend e garantir permissões
RUN mkdir -p /app/dist-frontend && \
    chown -R node:node /app/dist-frontend

EXPOSE 3000

# Usar um script de inicialização
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"] 