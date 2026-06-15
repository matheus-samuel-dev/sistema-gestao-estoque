# Sistema de Estoque

Sistema web para controle de estoque, cadastro de produtos e categorias, registro de entradas e saídas, dashboard gerencial e histórico de movimentações.

## Tecnologias

- React
- Vite
- Material UI
- Recharts
- Axios
- Java 21
- Spring Boot
- Spring Security com JWT
- Spring Data JPA
- PostgreSQL

## Funcionalidades

- Autenticação com token JWT.
- Cadastro, edição, listagem e exclusão lógica de produtos.
- Cadastro e gerenciamento de categorias.
- Registro de entradas e saídas de estoque.
- Bloqueio de saída quando o estoque disponível é insuficiente.
- Atualização automática do saldo do produto após cada movimentação.
- Dashboard com totais, estoque baixo, produtos sem estoque, gráfico de entradas x saídas, produtos por categoria, últimas movimentações e últimos produtos cadastrados.
- Exportação de relatórios de movimentações em Excel e PDF.

## Como Rodar o Frontend

```bash
npm install
cp .env.example .env
npm run dev
```

Configure a URL da API em `.env`:

```env
VITE_API_URL=http://localhost:8080
```

## Como Rodar o Backend

O backend está na pasta:

```text
C:\Users\LENOVO\Downloads\sistemaEstoque\stock-management
```

Configure as variáveis do arquivo `.env.example` ou exporte no ambiente:

```env
DATABASE_URL=jdbc:postgresql://localhost:5432/stock_management
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
CORS_ALLOWED_ORIGINS=http://localhost:*
```

Depois rode:

```bash
./mvnw spring-boot:run
```

No Windows:

```bash
mvnw.cmd spring-boot:run
```

## Deploy

### Frontend no Vercel

1. Publique este frontend no GitHub.
2. Importe o repositório no Vercel.
3. Configure:
   - Framework: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
4. Adicione a variável:

```env
VITE_API_URL=https://url-da-sua-api.onrender.com
```

### Backend no Render

1. Publique o backend no GitHub.
2. Crie um banco PostgreSQL no Render, Neon, Supabase ou Railway.
3. Crie um Web Service apontando para o backend Spring Boot.
4. Configure:

```env
DATABASE_URL=jdbc:postgresql://host:5432/database
DATABASE_USERNAME=usuario
DATABASE_PASSWORD=senha
JPA_DDL_AUTO=update
JPA_SHOW_SQL=false
SECURITY_LOG_LEVEL=INFO
CORS_ALLOWED_ORIGINS=https://url-do-seu-frontend.vercel.app
```

5. Use:

```bash
./mvnw clean package -DskipTests
java -jar target/stock-management-0.0.1-SNAPSHOT.jar
```

## Status

Projeto em evolução para portfólio júnior, com frontend, backend, autenticação, regras de negócio e preparação para deploy.
