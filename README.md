<div align="center">

# 🚀 Sistema de Gestão de Estoque - Frontend

Interface web responsiva para gerenciamento de estoque, desenvolvida com **React**, **Vite** e **Material UI**.

O projeto faz parte de uma aplicação full stack integrada a uma API REST em **Java Spring Boot**, permitindo autenticação de usuários, controle de produtos, categorias, movimentações de estoque e visualização de indicadores em dashboard.

<br>

![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge\&logo=react)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge\&logo=vite)
![Material UI](https://img.shields.io/badge/Material_UI-Design-007FFF?style=for-the-badge\&logo=mui)
![Axios](https://img.shields.io/badge/Axios-HTTP_Client-5A29E4?style=for-the-badge)
![React Router](https://img.shields.io/badge/React_Router-Routes-CA4245?style=for-the-badge\&logo=reactrouter)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge\&logo=vercel)

</div>

---

# 📑 Índice

* 🌐 Demonstração
* 🏛 Arquitetura do Projeto
* ⭐ Destaques do Frontend
* 📸 Preview
* ✨ Funcionalidades
* 🛠 Tecnologias Utilizadas
* 📂 Estrutura do Projeto
* ⚙️ Executando Localmente
* 🔗 Integração com Backend
* 🚀 Próximas Evoluções
* 👨‍💻 Autor

---

# 🌐 Demonstração

## 🚀 Aplicação Online

Acesse a versão publicada em produção:

🔗 https://sistema-gestao-estoque-two.vercel.app

---

# 🏛 Arquitetura do Projeto

```text
Frontend (React + Vite)
        ↓
API REST (Spring Boot)
        ↓
PostgreSQL
```

---

# 💻 Código Fonte

## Frontend

Interface web responsável pela experiência do usuário, autenticação, dashboard e telas de gestão.

🔗 https://github.com/matheus-samuel-dev/sistema-gestao-estoque

## Backend

API REST responsável pela autenticação JWT, regras de negócio, segurança e persistência de dados.

🔗 https://github.com/matheus-samuel-dev/sistema-gestao-estoque-api

---

# ⭐ Destaques do Frontend

✅ Interface moderna e responsiva

✅ Login e cadastro de usuários

✅ Recuperação de senha

✅ Dashboard com indicadores e gráficos

✅ Gestão de produtos

✅ Gestão de categorias

✅ Registro de entradas e saídas de estoque

✅ Exportação de movimentações em PDF e Excel

✅ Integração com API REST Spring Boot

✅ Deploy em produção com Vercel

---

# 📸 Preview

## 🔐 Login

![Login](./docs/login.png)

## 📊 Dashboard

![Dashboard](./docs/dashboard.png)

## 📈 Movimentações

![Movimentações](./docs/movimentacoes.png)

## 📦 Produtos

![Produtos](./docs/produtos.png)

---

# ✨ Funcionalidades

## 🔐 Autenticação

* Tela de login
* Tela de cadastro
* Recuperação de senha
* Armazenamento de token JWT
* Proteção de rotas autenticadas
* Logout do sistema

## 📊 Dashboard

* Cards com indicadores principais
* Total de produtos
* Total de categorias
* Produtos com estoque baixo
* Produtos sem estoque
* Total de movimentações
* Gráfico de entradas e saídas
* Gráfico de produtos por categoria
* Listagem das últimas movimentações

## 📦 Produtos

* Listagem de produtos
* Cadastro de novo produto
* Edição de produto
* Exclusão de produto
* Busca por produto
* Exibição de categoria e quantidade em estoque

## 🏷 Categorias

* Listagem de categorias
* Cadastro de categorias
* Edição de categorias
* Exclusão de categorias
* Organização dos produtos por categoria

## 📈 Movimentações

* Registro de entrada de estoque
* Registro de saída de estoque
* Filtros por tipo, produto e período
* Cards de resumo
* Exportação para Excel
* Exportação para PDF
* Histórico de movimentações

---

# 🛠 Tecnologias Utilizadas

## Frontend

* React
* Vite
* Material UI
* React Router
* Axios

## Recursos de Interface

* Componentes responsivos
* Cards informativos
* Tabelas
* Formulários
* Modais
* Ícones
* Feedback visual para ações do usuário

## Integrações

* API REST Spring Boot
* JWT Authentication
* Vercel Deploy

---

# 📂 Estrutura do Projeto

```text
src
├── assets
├── components
├── layouts
├── pages
├── routes
├── services
└── utils
```

## Organização principal

* `pages`: telas principais da aplicação
* `components`: componentes reutilizáveis
* `services`: comunicação com a API
* `routes`: configuração das rotas
* `layouts`: estrutura visual da aplicação
* `assets`: imagens e recursos estáticos
* `utils`: funções auxiliares

---

# ⚙️ Executando Localmente

## Pré-requisitos

Antes de iniciar, é necessário ter instalado:

* Node.js
* npm
* Backend da aplicação em execução

## Clonando o projeto

```bash
git clone https://github.com/matheus-samuel-dev/sistema-gestao-estoque.git

cd sistema-gestao-estoque
```

## Instalando dependências

```bash
npm install
```

## Configurando variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8080
```

Para ambiente de produção, a variável deve apontar para a API publicada:

```env
VITE_API_URL=https://sistema-gestao-estoque-api-production.up.railway.app
```

## Executando o frontend

```bash
npm run dev
```

A aplicação será iniciada em:

```text
http://localhost:5173
```

---

# 🔗 Integração com Backend

Este frontend consome uma API REST desenvolvida com Java Spring Boot.

## Principais endpoints utilizados

```text
POST /auth/login
POST /auth/register
POST /auth/forgot-password
POST /auth/reset-password

GET /products
POST /products
PUT /products/{id}
DELETE /products/{id}

GET /categories
POST /categories
PUT /categories/{id}
DELETE /categories/{id}

GET /stock-movements
POST /stock-movements
DELETE /stock-movements/{id}
```

---

# 🚀 Próximas Evoluções

* [ ] Melhorar responsividade das tabelas em telas muito pequenas
* [ ] Implementar tema claro/escuro
* [ ] Adicionar testes automatizados
* [ ] Melhorar experiência mobile
* [ ] Criar notificações em tempo real
* [ ] Adicionar filtros avançados no dashboard
* [ ] Implementar perfil do usuário
* [ ] Adicionar página de configurações
* [ ] Melhorar acessibilidade
* [ ] Criar onboarding para novos usuários

---

# 👨‍💻 Autor

## Matheus Samuel Baena Soares

Desenvolvedor de Software com foco em Java, Spring Boot e desenvolvimento de aplicações web.

🌐 Portfólio

https://matheus-samuel-dev.github.io/Portfolio/

💼 LinkedIn

https://www.linkedin.com/in/matheus-samuel-dev/

⭐ Se gostou do projeto, considere deixar uma estrela no repositório.
