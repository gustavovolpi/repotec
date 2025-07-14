# Definição
O sistema RepoTEC é uma plataforma projetada para centralizar e facilitar o acesso a projetos desenvolvidos em instituições de ensino, oferecendo uma variedade de funcionalidades para melhorar a experiência do usuário. 

## Requisitos Funcionais

1. **Cadastro e Autenticação de Usuários:**

    * O sistema deve permitir o cadastro e login de alunos, professores e administradores com credenciais válidas.
    * A autenticação é obrigatória antes de qualquer operação no sistema.

1. **Busca de Projetos:**
    * Os usuários podem buscar projetos por palavras-chave, tags, curso, autor ou data.

1. **Visualização de Projetos:**

    * Detalhes dos projetos, como título, descrição, autor e data de publicação, devem ser exibidos após a busca.

1. **Avaliação e Reputação de Projetos:**

    * Os usuários podem avaliar projetos com notas de 1 a 5 estrelas.
    * O sistema calcula e exibe a reputação dos projetos com base nas avaliações.

1. **Sistema de Favoritos:**

    * Os usuários podem marcar projetos como favoritos para acesso rápido no futuro.

1. **Geração Automática de Currículos:**

    * Os usuários podem gerar currículos automaticamente, inserindo os projetos cadastrados em um template predefinido.
    * Geração de currículos em PDF.

1. **FAQ:**

    * O sistema deve fornecer um  FAQ para tirar dúvidas.

1. **Postagem de Projetos:**

    * Professores e alunos podem postar novos projetos, incluindo descrição, tags e arquivos relacionados.

1. **Gerenciamento de Conteúdo:**

    * Administradores podem editar ou remover projetos e avaliações.


## Requisitos Não Funcionais

### Deselvolvimento do backend:
1. Tecnologias:
    * MySql
    * NestJS: Framework backend modular e escalável.
    * TypeScript: Para tipagem estática e melhor produtividade.
    * Docker e Docker Compose: Para containerização e orquestração do ambiente de desenvolvimento.

2. Funcionalidades Principais:
    * Autenticação JWT.
    * CRUD de projetos, usuários e avaliações.
    * Upload de arquivos (integração com Amazon S3 ou armazenamento local).
    * Geração de currículos em PDF.

### Deselvolvimento do Frontend
1. Tecnologias:
    * React: Biblioteca frontend para construção de interfaces.
    * TypeScript: Para tipagem estática e melhor produtividade.
    * Material-UI: Para componentes prontos e estilização.
    * Templates: Usar templates prontos para Dashboard e Sign-in Side.
2. Templates Prontos:

    * Dashboard:  https://github.com/mui/material-ui/tree/v6.4.6/docs/data/material/getting-started/templates/dashboard
    * Sign-in Side: https://github.com/mui/material-ui/tree/v6.4.6/docs/data/material/getting-started/templates/sign-in-side

2. Funcionalidades Principais:
    * Autenticação JWT (login, cadastro, recuperação de senha).
    * Listagem de projetos com filtros e busca.
    * Página de detalhes do projeto.
    * Upload de arquivos.
    * Geração de currículos.


### **Tabelas do Banco de Dados**
* * *

#### **1\. `usuarios`**
Armazena informações dos usuários (alunos, professores e administradores).

| **Coluna**    | **Tipo** | **Descrição** |
| -------- | ------- | ------- |
|`id`|INT (PK, Auto Increment)|Identificador único do usuário.|
|`nome`|VARCHAR(100)|Nome completo do usuário.|
|`email`|VARCHAR(100)|E-mail do usuário (único).|
|`senha`|VARCHAR(255)|Senha criptografada.|
|`tipo`|ENUM('aluno', 'professor', 'admin')|Tipo de usuário.|
|`data_criacao`|DATETIME|Data de criação do usuário.|

* * *

#### **2\. `projetos`**

Armazena informações sobre os projetos cadastrados.

|**Coluna**|**Tipo**|**Descrição**|
| -------- | -------- | -------- |
|`id`|INT (PK, Auto Increment)|Identificador único do projeto.|
|`titulo`|VARCHAR(200)|Título do projeto.|
|`descricao`|TEXT|Descrição detalhada do projeto.|
|`autor_id`|INT (FK)|ID do usuário que criou o projeto (relacionado com `usuarios.id`).|
|`data_publicacao`|DATETIME|Data de publicação do projeto.|
|`reputacao`|FLOAT|Reputação do projeto (média das avaliações).|

* * *

#### **3\. `arquivos`**

Armazena informações sobre os arquivos associados aos projetos.


|**Coluna**|**Tipo**|**Descrição**|
| -------- | -------- | -------- |
|`id`|INT (PK, Auto Increment)|Identificador único do arquivo.|
|`projeto_id`|INT (FK)|ID do projeto ao qual o arquivo pertence (relacionado com `projetos.id`).
|`nome`|VARCHAR(255)|Nome do arquivo.|
|`caminho`|VARCHAR(255)|Caminho do arquivo no S3.|
|`tamanho`|BIGINT|Tamanho do arquivo em bytes.|
|`data_upload`|DATETIME|Data de upload do arquivo.|

* * *

#### **4\. `tags`**

Armazena as tags (palavras-chave) associadas aos projetos.

|**Coluna**|**Tipo**|**Descrição**|
| -------- | -------- | -------- |
|`id`|INT (PK, Auto Increment)|Identificador único da tag.|
|`nome`|VARCHAR(50)|Nome da tag (ex: "Java", "Web", "IA").|

* * *

#### **5\. `projeto_tags`**

Tabela de relacionamento entre projetos e tags (relação muitos-para-muitos).

|**Coluna**|**Tipo**|**Descrição**|
| -------- | -------- | -------- |
|`projeto_id`|INT (FK)|ID do projeto (relacionado com `projetos.id`).|
|`tag_id`|INT (FK)|ID da tag (relacionado com `tags.id`).|

* * *

#### **6\. `avaliacoes`**

Armazena as avaliações dos usuários para os projetos.


|**Coluna**|**Tipo**|**Descrição**|
| -------- | -------- | -------- |
|`id`|INT (PK, Auto Increment)|Identificador único da avaliação.|
|`projeto_id`|INT (FK)|ID do projeto avaliado (relacionado com `projetos.id`).
|`usuario_id`|INT (FK)|ID do usuário que fez a avaliação (relacionado com `usuarios.id`).|
|`nota`|TINYINT|Nota da avaliação (1 a 5).|
`comentario`|TEXT|Comentário opcional da avaliação.|
|`data_avaliacao`|DATETIME|Data da avaliação.|

* * *

#### **7\. `favoritos`**

Armazena os projetos marcados como favoritos pelos usuários.

|**Coluna**|**Tipo**|**Descrição**|
| -------- | -------- | -------- |
|`id`|INT (PK, Auto Increment)|Identificador único do favorito.|
|`usuario_id`|INT (FK)|ID do usuário (relacionado com `usuarios.id`).|
|`projeto_id`|INT (FK)|ID do projeto favoritado (relacionado com `projetos.id`).|
|`data_favorito`|DATETIME|Data em que o projeto foi favoritado.|

* * *

#### **8\. `curriculos`**
**Obs**: avaliar se é necessário 

Armazena os currículos gerados automaticamente pelos usuários.   

|**Coluna**|**Tipo**|**Descrição**|
| -------- | -------- | -------- |
|`id`|INT (PK, Auto Increment)|Identificador único do currículo.|
|`usuario_id`|INT (FK)|ID do usuário (relacionado com `usuarios.id`).|
|`conteudo`|TEXT|Conteúdo do currículo (formato JSON ou HTML).
|`data_geracao`|DATETIME|Data de geração do currículo.

* * *

#### **9\. `faqs`**

Armazena as perguntas frequentes (FAQ) do sistema.

|**Coluna**|**Tipo**|**Descrição**|
| -------- | -------- | -------- |
|`id`|INT (PK, Auto Increment)|Identificador único da FAQ.|
|`pergunta`|TEXT|Texto da pergunta.|
|`resposta`|TEXT|Texto da resposta.

* * *

### **Resumo das Tabelas**

1.  `usuarios` → Informações dos usuários.
    
2.  `projetos` → Informações dos projetos.
    
3.  `arquivos` → Arquivos associados aos projetos.
    
4.  `tags` → Tags (palavras-chave) para projetos.
    
5.  `projeto_tags` → Relacionamento entre projetos e tags.
    
6.  `avaliacoes` → Avaliações dos projetos.
    
7.  `favoritos` → Projetos favoritados pelos usuários.
    
8.  `curriculos` → Currículos gerados automaticamente. (**Obs**: avaliar se é necessário )
    
9.  `faqs` → Perguntas frequentes (FAQ).
    

* * *

### **Diagrama de Relacionamento (ERD)**

Aqui está um resumo visual das relações entre as tabelas:

```bash
usuarios
  |
  |-- projetos (autor\_id)
  |     | 
  |     |-- arquivos (projeto\_id)
  |     |-- projeto\_tags (projeto\_id) -- tags
  |     |-- avaliacoes (projeto\_id)
  |
  |-- favoritos (usuario\_id, projeto\_id)
  |-- curriculos (usuario\_id)
```

* * *

## **Endpoints/Backend**

### 1. Autenticação e Gerenciamento de Usuários
#### 1.1. Cadastro de Usuário
* Endpoint: POST /api/auth/registro
* Descrição: Cria um novo usuário (aluno, professor ou administrador).
* Corpo da Requisição:
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123",
  "tipo": "aluno"
}
```

#### 1.2. Login de Usuário
* Endpoint: POST /api/auth/login
* Descrição: Autentica o usuário e retorna um token de acesso.
* Corpo da Requisição:
```json
{
  "email": "joao@example.com",
  "senha": "senha123"
}
```

#### 1.3. Obter Informações do Usuário
* Endpoint: GET /api/usuarios/{id}
* Descrição: Retorna as informações de um usuário específico.
* Cabeçalho: Authorization: Bearer <token>

#### 1.4. Atualizar Usuário
* Endpoint: PUT /api/usuarios/{id}
* Descrição: Atualiza as informações de um usuário.
* Cabeçalho: Authorization: Bearer <token>
* Corpo da Requisição:
```json
{
  "nome": "João Silva",
  "email": "joao.novo@example.com"
}
```

#### 1.5. Excluir Usuário
* Endpoint: DELETE /api/usuarios/{id}
* Descrição: Exclui um usuário do sistema.
* Cabeçalho: Authorization: Bearer <token>

### 2. Gerenciamento de Projetos
#### 2.1. Criar Projeto
* Endpoint: POST /api/projetos
* Descrição: Cria um novo projeto.
* Cabeçalho: Authorization: Bearer <token>
* Corpo da Requisição:
```json
{
  "titulo": "Projeto de IA",
  "descricao": "Um projeto sobre inteligência artificial.",
  "tags": ["IA", "Python"]
}
```

#### 2.2. Listar Projetos
* Endpoint: GET /api/projetos
* Descrição: Retorna uma lista de projetos, com opções de filtro (tags, autor, data, etc.).
* Parâmetros de Consulta:
    * tag: Filtra por tag.
    * autor: Filtra por autor.
    * data: Filtra por data de publicação.

#### 2.3. Obter Detalhes de um Projeto
* Endpoint: GET /api/projetos/{id}
* Descrição: Retorna os detalhes de um projeto específico.

#### 2.4. Atualizar Projeto
* Endpoint: PUT /api/projetos/{id}
* Descrição: Atualiza as informações de um projeto.
* Cabeçalho: Authorization: Bearer <token>
* Corpo da Requisição:
```json
{
  "titulo": "Projeto de IA Atualizado",
  "descricao": "Descrição atualizada."
}
```

#### 2.5. Excluir Projeto
* Endpoint: DELETE /api/projetos/{id}
* Descrição: Exclui um projeto.
Cabeçalho: Authorization: Bearer <token>

### 3. Gerenciamento de Arquivos
#### 3.1. Upload de Arquivos
* Endpoint: POST /api/projetos/{id}/arquivos
* Descrição: Faz upload de arquivos para um projeto.
* Cabeçalho: Authorization: Bearer <token>
* Formato: multipart/form-data

#### 3.2. Listar Arquivos de um Projeto
* Endpoint: GET /api/projetos/{id}/arquivos
* Descrição: Retorna a lista de arquivos associados a um projeto.

#### 3.3. Download de Arquivo
* Endpoint: GET /api/arquivos/{id}
* Descrição: Faz o download de um arquivo específico.

#### 3.4. Excluir Arquivo
* Endpoint: DELETE /api/arquivos/{id}
* Descrição: Exclui um arquivo.
* Cabeçalho: Authorization: Bearer <token>

### 4. Avaliações e Reputação
#### 4.1. Avaliar Projeto
* Endpoint: POST /api/projetos/{id}/avaliacoes
* Descrição: Adiciona uma avaliação a um projeto.
* Cabeçalho: Authorization: Bearer <token>
* Corpo da Requisição:
```json
{
  "nota": 5,
  "comentario": "Excelente projeto!"
}
```

#### 4.2. Listar Avaliações de um Projeto
* Endpoint: GET /api/projetos/{id}/avaliacoes
* Descrição: Retorna as avaliações de um projeto.

### 5. Favoritos
#### 5.1. Adicionar Projeto aos Favoritos
* Endpoint: POST /api/favoritos
* Descrição: Adiciona um projeto à lista de favoritos do usuário.
* Cabeçalho: Authorization: Bearer <token>
* Corpo da Requisição:
```json
{
  "projeto_id": 1
}
```

#### 5.2. Listar Favoritos do Usuário
* Endpoint: GET /api/favoritos
* Descrição: Retorna a lista de projetos favoritos do usuário.
* Cabeçalho: Authorization: Bearer <token>

#### 5.3. Remover Projeto dos Favoritos
* Endpoint: DELETE /api/favoritos/{id}
* Descrição: Remove um projeto da lista de favoritos.
* Cabeçalho: Authorization: Bearer <token>

### 6. Currículos
#### 6.1. Gerar Currículo
* Endpoint: POST /api/curriculos
* Descrição: Gera um currículo automaticamente com base nos projetos do usuário.
* Cabeçalho: Authorization: Bearer <token>

### 7. FAQ
#### 7.1. Listar Perguntas Frequentes
* Endpoint: GET /api/faqs
* Descrição: Retorna a lista de perguntas frequentes.
 