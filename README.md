# BrainCodeSchool - Front-end

Aplicação web do BrainCodeSchool, uma plataforma acadêmica para publicação, consulta e discussão de conteúdos educacionais. O frontend foi desenvolvido com React, TypeScript, Vite e styled-components, consumindo a API REST NestJS do backend.

Este documento descreve a configuração do ambiente, a arquitetura da aplicação, os principais fluxos de uso e as decisões técnicas adotadas pela equipe.

## Sumário

- [Visão geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Configuração inicial](#configuração-inicial)
- [Execução com Docker](#execução-com-docker)
- [Execução local](#execução-local)
- [Arquitetura do frontend](#arquitetura-do-frontend)
- [Estrutura de diretórios](#estrutura-de-diretórios)
- [Rotas da aplicação](#rotas-da-aplicação)
- [Integração com a API](#integração-com-a-api)
- [Guia de uso](#guia-de-uso)
- [Scripts disponíveis](#scripts-disponíveis)
- [Relato de experiências e desafios](#relato-de-experiências-e-desafios)

## Visão geral

O frontend oferece uma interface para:

- autenticação de usuários;
- consulta e busca de postagens;
- criação, edição e exclusão de postagens por docentes;
- leitura detalhada de uma postagem;
- criação de comentários por usuários autenticados;
- edição de comentários pelo próprio autor;
- exclusão de comentários pelo próprio autor ou por um docente.

O navegador acessa a API pela URL configurada em `VITE_API_URL`. Quando a aplicação é executada com Docker Compose, o frontend é compilado com `http://localhost:3000` como endereço público do backend.

## Tecnologias

| Categoria               | Tecnologia              |
| ----------------------- | ----------------------- |
| Linguagem               | TypeScript              |
| Interface               | React 19                |
| Build e desenvolvimento | Vite                    |
| Roteamento              | React Router            |
| Estilização             | styled-components e CSS |
| Comunicação HTTP        | Axios                   |
| Ícones                  | lucide-react            |
| Servidor de produção    | Nginx                   |
| Containerização         | Docker e Docker Compose |
| Qualidade               | TypeScript e Oxlint     |

## Pré-requisitos

Para desenvolvimento local:

- Node.js 20 ou superior;
- npm;
- backend em execução, normalmente em `http://localhost:3000`.

Para execução containerizada:

- Docker Desktop iniciado;
- Docker Compose disponível no comando `docker compose`.

## Configuração inicial

Na raiz do monorepo, copie o arquivo de exemplo para criar o ambiente local:

```powershell
Copy-Item .env.example .env
```

No arquivo `.env`, confira principalmente:

```dotenv
VITE_API_URL=http://localhost:3000
FRONTEND_PORT=8080
BACKEND_PORT=3000
```

O valor de `VITE_API_URL` é incorporado ao bundle durante o build do Vite. Ele deve ser uma URL acessível pelo navegador, e não o hostname interno `backend` do Docker Compose.

## Execução com Docker

Execute os comandos na raiz do monorepo, onde está o `docker-compose.yml`:

```powershell
Copy-Item .env.example .env
docker compose up --build
```

Serviços publicados:

| Serviço     | Endereço                         |
| ----------- | -------------------------------- |
| Frontend    | `http://localhost:8080`          |
| Backend     | `http://localhost:3000`          |
| Swagger     | `http://localhost:3000/api-docs` |
| Healthcheck | `http://localhost:3000/health`   |
| PostgreSQL  | `localhost:5432`                 |

Para executar em segundo plano:

```powershell
docker compose up -d --build
docker compose ps
```

Para interromper os serviços:

```powershell
docker compose down
```

O banco utiliza o volume `postgres-data`, preservando os dados entre reinicializações normais dos containers.

## Execução local

Instale as dependências do frontend:

```powershell
Set-Location .\front-end
npm install
npm run dev
```

O Vite disponibiliza a aplicação em uma URL semelhante a `http://localhost:5173`.

Nesse modo, o backend deve estar disponível separadamente. Para executar a API localmente, consulte o README de [back-end](../back-end/README.md).

Para gerar o bundle de produção:

```powershell
npm run build
npm run preview
```

## Arquitetura do frontend

O frontend segue uma organização por responsabilidades:

```text
Browser
	|
	v
React Router
	|
	+--> Pages ------> API Axios ------> NestJS REST API
	|
	+--> Contexts ----> Estado de autenticação e notificações
	|
	+--> Components --> Elementos reutilizáveis de interface
	|
	+--> Styles ------> Tema, estilos globais e componentes estilizados
```

### Entrada da aplicação

`src/main.tsx` monta a aplicação React e os providers globais. `src/App.tsx` configura o `BrowserRouter`, o tema visual, o contexto de autenticação, as notificações e as rotas.

### Páginas

As páginas representam fluxos completos da aplicação:

- `Login`: autenticação e tratamento de erros de credenciais;
- `Home`: busca, listagem e acesso às postagens;
- `PostDetails`: leitura, listagem e gerenciamento de comentários;
- `Admin`: gerenciamento das publicações para docentes;
- `PostForm`: criação e edição de postagens.

### Contextos

- `AuthContext`: armazena o token JWT, interpreta o usuário autenticado e controla login/logout;
- `ToastContext`: exibe notificações de sucesso e erro para as ações do usuário.

### Comunicação com a API

`src/api.ts` centraliza a instância Axios. O interceptor de requisições adiciona o token salvo em `localStorage` no header:

```http
Authorization: Bearer <token>
```

Quando a API retorna `401`, o interceptor remove o token e dispara o evento `auth:expired`, fazendo a sessão voltar ao estado não autenticado.

### Proteção de rotas

`PrivateRoute` exige um usuário autenticado para acessar posts e comentários. `TeacherRoute` restringe a área administrativa ao papel `professor`.

As permissões da interface são apenas uma camada de experiência. A autorização definitiva é realizada pelo backend:

- usuário autenticado pode comentar;
- autor pode editar o próprio comentário;
- autor pode excluir o próprio comentário;
- docente pode excluir qualquer comentário;
- somente docente pode criar, editar ou excluir postagens.

## Estrutura de diretórios

```text
front-end/
├── public/                  # Arquivos públicos estáticos
├── src/
│   ├── assets/              # Recursos importados pela aplicação
│   ├── components/          # Layout, modal, cards, skeleton e guards
│   ├── contexts/            # Autenticação e notificações
│   ├── pages/               # Telas e fluxos principais
│   ├── api.ts               # Cliente Axios e interceptors
│   ├── App.tsx              # Providers e roteamento
│   ├── styles.ts            # Estilos globais e componentes estilizados
│   ├── theme.ts             # Tokens visuais do tema
│   └── types.ts             # Contratos TypeScript do frontend
├── Dockerfile               # Build Vite e imagem final Nginx
├── nginx.conf               # SPA fallback para o React Router
├── index.html               # Documento HTML de entrada
├── package.json             # Scripts e dependências
├── tsconfig*.json           # Configurações TypeScript
└── vite.config.ts           # Configuração do Vite
```

## Rotas da aplicação

| Rota              | Acesso      | Finalidade                      |
| ----------------- | ----------- | ------------------------------- |
| `/`               | Público     | Tela de login                   |
| `/login`          | Público     | Tela de login                   |
| `/posts`          | Autenticado | Lista e busca postagens         |
| `/posts/:id`      | Autenticado | Detalhes e comentários          |
| `/post/:id`       | Autenticado | Alias para detalhes da postagem |
| `/admin`          | Docente     | Painel de publicações           |
| `/admin/create`   | Docente     | Criação de postagem             |
| `/admin/edit/:id` | Docente     | Edição de postagem              |

## Integração com a API

O frontend consome principalmente os seguintes endpoints:

```text
POST   /auth/login
GET    /posts
GET    /posts/search?q=termo
GET    /posts/:id
POST   /posts
PUT    /posts/:id
DELETE /posts/:id
GET    /posts/:postId/comments
POST   /posts/:postId/comments
PUT    /comments/:id
DELETE /comments/:id
```

O contrato completo está disponível no Swagger do backend em `http://localhost:3000/api-docs`.

## Guia de uso

### Usuário autenticado

1. Acesse `http://localhost:8080`.
2. Informe usuário e senha na tela de login.
3. Explore as publicações pela tela inicial.
4. Use o campo de busca para filtrar por título ou assunto.
5. Abra uma publicação para ler o conteúdo completo.
6. Escreva um comentário e selecione **Enviar comentário**.
7. O comentário será publicado imediatamente após a confirmação da API.
8. Para comentários próprios, use os controles de edição ou exclusão.

### Docente

Além dos fluxos de usuário autenticado, o docente pode:

1. Acessar a área **Docente** no menu;
2. criar uma nova postagem;
3. editar ou excluir publicações próprias;
4. excluir comentários de qualquer usuário.

O backend continua sendo responsável por validar cada permissão, mesmo que os controles não sejam exibidos na interface para usuários sem acesso.

### Usuários de desenvolvimento

Quando o banco é inicializado com o seed configurado no backend, os usuários de desenvolvimento são:

| Usuário     | Senha      | Papel   |
| ----------- | ---------- | ------- |
| `professor` | `senha123` | Docente |
| `aluno`     | `senha123` | Aluno   |

Essas credenciais são destinadas apenas ao ambiente local.

## Scripts disponíveis

Execute os scripts a partir de `front-end/`:

```bash
npm run dev       # Servidor Vite em modo desenvolvimento
npm run build     # TypeScript e build de produção
npm run preview   # Serve o bundle de produção localmente
npm run lint      # Verifica o código com Oxlint
```

## Relato de experiências e desafios

Um dos principais desafios foi manter uma experiência simples no frontend enquanto a aplicação evoluía de uma tela de protótipo para um fluxo integrado com autenticação, persistência e autorização. A separação entre páginas, componentes e contextos ajudou a evitar que regras de navegação e sessão ficassem espalhadas pela interface.

Outro ponto importante foi a integração com o JWT. O token precisa ser enviado automaticamente em todas as requisições protegidas, mas nunca deve ser tratado como fonte definitiva de autorização no cliente. Por isso, o frontend usa o token para controlar a experiência e o backend revalida as permissões antes de executar cada operação.

A funcionalidade de comentários também exigiu cuidado. Inicialmente, o formulário apenas simulava o envio e informava uma suposta moderação. O fluxo foi ajustado para persistir o comentário na API e atualizar a lista imediatamente, pois não existe etapa de aprovação no domínio atual. A interface também passou a exibir ações diferentes conforme o autor do comentário e o papel docente.

Na containerização, a diferença entre hostnames internos e públicos foi uma fonte de atenção: o backend acessa o PostgreSQL pelo serviço `db`, enquanto o navegador acessa a API por `localhost`. O `VITE_API_URL` precisa apontar para o endereço público, pois ele é usado pelo código executado no browser.

Por fim, o uso de build multi-stage com Vite e Nginx reduziu a imagem final e permitiu servir os arquivos estáticos com uma configuração adequada para SPA, incluindo o fallback de rotas do React Router.

## Observações de manutenção

- Não coloque segredos reais no repositório; use `.env` local e mantenha apenas `.env.example` versionado.
- Em produção, mantenha `DB_SYNCHRONIZE=false` e utilize migrations do TypeORM.
- Altere o segredo JWT de desenvolvimento antes de qualquer implantação.
- Ao adicionar novas rotas protegidas, atualize `App.tsx`, os guards de rota e a documentação da API.
# blog-escolar-fiap
