# Documentação da API - RepoTEC

## Autenticação

Todas as rotas (exceto login e registro) requerem o header de autenticação: 

http
Authorization: Bearer {token}

### Endpoints de Autenticação

#### Login

http
POST /auth/login

json
{
    "email": "string",
    "senha": "string"
}
