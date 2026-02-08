# Orders Service

A small, production-style REST API built with **NestJS** and **PostgreSQL** using **TypeORM**.
It’s designed as a portfolio project to showcase clean project structure, validation, Dockerized local setup, and automated tests.

## Tech Stack
- NestJS (Node.js)
- PostgreSQL
- TypeORM
- Docker + docker-compose
- Jest (unit tests)

## Features
- Users: minimal CRUD (create + read)
- Orders: CRUD operations
- Get orders by user
- Update order status
- Soft delete for orders
- DTO validation and consistent error handling

## Run with Docker

### 1) Environment variables
Create a `.env` file in the project root (or copy from `.env.example` if present).

Required variables:
```env
PORT=<app_port>
NODE_ENV=development

DB_HOST=<postgres_host>
DB_PORT=<postgres_port>
DB_USERNAME=<postgres_user>
DB_PASSWORD=<postgres_password>
DB_NAME=<postgres_db_name>
```

### 2) Build & start
```bash
docker compose up --build
```

### 3) Stop
```bash
docker compose down
```

## Tests

### Run unit tests
```bash
npm run test -- src/users/users.service.spec.ts
npm run test -- src/orders/orders.service.spec.ts
```

## Postman

A Postman collection is included in this repository.

### Import
1. Open Postman
2. Import the collection file from the project (e.g. `postman/Orders.postman_collection.json`)

### Environment
Create an environment and set:
- `BASE_URL=http://localhost:3000`

Then run the requests from the collection.
