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
---

# Documentacao do Produto

## Objetivo do sistema

O Sistema de Gestao de Estoque centraliza o cadastro de produtos, categorias, fornecedores, movimentacoes, anexos e indicadores operacionais em uma aplicacao web para uso real.

## Publico-alvo

Pequenos comercios, escritorios, assistencias tecnicas, distribuidores, almoxarifados, mercados, farmacias e equipes que precisam controlar entradas, saidas e saldo de estoque sem depender de planilhas manuais.

## Casos de uso

* Cadastrar categorias, fornecedores e produtos.
* Controlar entradas, saidas, devolucoes, ajustes e transferencias.
* Acompanhar produtos com estoque baixo ou zerado.
* Importar produtos em massa por CSV/XLSX.
* Anexar notas fiscais, comprovantes e imagens.
* Configurar dados da empresa e preferencias do estoque.
* Visualizar indicadores em dashboard.

## Tecnologias utilizadas

Frontend: React, Vite, Material UI, React Router, Axios, Recharts, XLSX e jsPDF.

Backend: Java, Spring Boot, Spring Security, JWT, Spring Data JPA, PostgreSQL e Resend API.

## Como rodar localmente

Frontend:

```bash
npm install
npm run dev
```

Backend:

```bash
./mvnw spring-boot:run
```

## Como fazer deploy

* Frontend: Vercel, configurando `VITE_API_URL` com a URL da API.
* Backend: Railway, configurando PostgreSQL e variaveis de ambiente.
* Enquanto o projeto evolui, manter `JPA_DDL_AUTO=update`.

## Estrutura do banco

* `users`: usuarios.
* `categories`: categorias por usuario.
* `suppliers`: fornecedores por usuario.
* `products`: produtos, categoria, fornecedor, origem, codigos e estoque.
* `stock_movements`: entradas, saidas, origem, observacoes e usuario.
* `attachments`: arquivos vinculados a produtos ou movimentacoes.
* `password_reset_tokens`: tokens temporarios de recuperacao de senha.
* `system_settings`: configuracoes da empresa, estoque e onboarding.

## Fluxo de autenticacao JWT

1. O usuario autentica em `/auth/login`.
2. O backend valida credenciais e retorna JWT.
3. O frontend salva o token em `localStorage` ou `sessionStorage`.
4. Todas as chamadas autenticadas enviam `Authorization: Bearer <token>`.
5. Token expirado ou invalido redireciona o usuario para `/login`.

## Funcionalidade de anexos

* Endpoints: `POST /attachments/products/{id}`, `POST /attachments/movements/{id}`, `GET /attachments/products/{id}`, `GET /attachments/movements/{id}`, `GET /attachments/{id}/download` e `DELETE /attachments/{id}`.
* Formatos aceitos: PDF, JPG, JPEG, PNG e WEBP.
* Limite maximo: 5MB.
* Os anexos respeitam o usuario autenticado.

## Funcionalidade de importacao CSV/XLSX

* Disponivel na tela Produtos.
* O usuario baixa um modelo de planilha.
* O frontend le o arquivo, mostra pre-visualizacao e valida linhas.
* Linhas invalidas exibem erro antes do envio.
* O backend recebe a lista validada em `POST /products/import`.

## Funcionalidades recentes

* CRUD de fornecedores.
* Configuracoes do sistema.
* Onboarding inicial.
* Codigo automatico `PRD-001`, `PRD-002`, `PRD-003`.
* Sugestoes de produtos por categoria.
* Origens de movimentacao: Compra, Venda, Ajuste, Transferencia, Devolucao e Outro.
* Dashboard com entradas e saidas do mes.
