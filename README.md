# Product Catalog – Full-Stack CRUD Assessment

A full-stack CRUD application for managing a product catalog.

- **Frontend:** Angular + Angular Material
- **Backend:** NestJS (REST API)
- **ORM:** Prisma 7
- **Database:** PostgreSQL

## Features

**Frontend**
- Products overview table with server-side pagination and a price filter (min / max)
- Product details page
- Create, edit and delete products
- Form validation with error messages
- Snackbar feedback after saving a product
- Loading, error (with Retry) and empty states on the list page
- Client-side routing: `/products`, `/products/new`, `/products/:id`, `/products/:id/edit`

**Backend**
- RESTful API covering all CRUD operations
- Data persisted in PostgreSQL through Prisma
- Request validation (`class-validator`) with clear 400 responses
- 404 responses for missing records

## Project structure

```
.
├── backend/              NestJS API
│   ├── prisma/           Prisma schema, migrations and seed script
│   └── src/
│       ├── prisma/       PrismaService / PrismaModule
│       └── products/     Controller, service and DTOs
└── frontend/             Angular app
    └── src/app/products/ List, details and form components, API service
```

The frontend and backend are two independent applications that communicate over HTTP. The Angular app only knows the API URL; it has no access to the database.

## Prerequisites

- Node.js (LTS, developed with v22) and npm
- PostgreSQL running locally (developed with Postgres.app)
- Git

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/VankoLoop/MDO-Challenge.git
cd MDO-Challenge
```

### 2. Create the database

Open a SQL shell (for example `psql postgres`) and run the following, choosing your own password:

```sql
CREATE DATABASE product_catalog;
CREATE USER catalog_user WITH PASSWORD 'choose-a-password';
ALTER DATABASE product_catalog OWNER TO catalog_user;
ALTER USER catalog_user CREATEDB;
```

### 3. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and put your credentials in `DATABASE_URL`:

```
DATABASE_URL="postgresql://catalog_user:choose-a-password@localhost:5432/product_catalog?schema=public"
```

Then apply the migrations, generate the Prisma client, and (optionally) load sample data:

```bash
npx prisma migrate deploy
npx prisma generate
npm run seed          # optional: inserts 12 sample products
```

Start the API:

```bash
npm run start:dev
```

The API runs on `http://localhost:3000`.

> `npx prisma generate` must be run after every fresh clone and after every change to `schema.prisma`. The generated client (`src/generated/`) is not committed.

### 4. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
npm start
```

The app runs on `http://localhost:4200` and expects the API at `http://localhost:3000`.

## Environment variables

| Variable | Where | Description |
|---|---|---|
| `DATABASE_URL` | `backend/.env` | PostgreSQL connection string |
| `PORT` | `backend/.env` (optional) | API port, defaults to `3000` |

`backend/.env.example` shows the expected format. `.env` is git-ignored.

## API reference

Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/products` | Paginated list. Query params: `page` (default 1), `limit` (default 10), `minPrice`, `maxPrice` |
| `GET` | `/products/:id` | One product, or 404 if it doesn't exist |
| `POST` | `/products` | Create a product |
| `PATCH` | `/products/:id` | Update one or more fields |
| `DELETE` | `/products/:id` | Delete a product |

`GET /products` returns:

```json
{
  "data": [{ "id": 1, "name": "Keyboard", "description": null, "price": 49.9, "stock": 10 }],
  "total": 12,
  "page": 1,
  "limit": 10
}
```

`total` is the number of products matching the filter (before pagination), which the paginator uses.

### Product fields and validation

| Field | Type | Rules |
|---|---|---|
| `name` | string | required, not empty |
| `description` | string | optional |
| `price` | number | required, greater than 0, at most 2 decimals |
| `stock` | integer | required, 0 or more |

Invalid payloads return `400 Bad Request` with a list of messages. Unknown properties are stripped.

## Data model

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Float
  stock       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Trying it out

With both servers running, open `http://localhost:4200` and:

1. Browse the list and change the page size / page.
2. Filter by min and/or max price, and clear the filter.
3. Open a product, edit it, and delete it.
4. Create a product with invalid values (empty name, price 0) to see the validation messages.
5. Stop the backend and reload the list to see the error state and Retry button.

You can also call the API directly:

```bash
curl "http://localhost:3000/products?page=1&limit=5&minPrice=20"
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Keyboard","price":49.9,"stock":10}'
curl -i http://localhost:3000/products/999   # 404
```

## Design decisions and trade-offs

- **Two separate apps.** Angular is a browser-only framework and NestJS is a backend-only framework, so the repository holds one project for each. This keeps frontend and backend concerns separated.
- **Server-side pagination and filtering.** The browser only holds one page of data, so filtering in the frontend would only affect the current page and give wrong totals. The price filter and pagination are executed in the database query, and `total` reflects the filtered count.
- **Validation on both sides.** The Angular form validates for fast feedback, and the API validates independently because it can be called without the UI.
- **Prisma 7 with a driver adapter.** `PrismaService` extends `PrismaClient` and connects through `@prisma/adapter-pg`.

