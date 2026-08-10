# Library Management API

A layered REST API for managing a library's catalog, authors, members, lending workflow, returns, availability, and overdue loans.

## Architecture

HTTP routes delegate to controllers, controllers translate HTTP input and output, services enforce business rules, and repositories isolate Mongoose persistence. Validation and error middleware provide consistent responses across the API.

## Technologies

- Node.js and Express
- JavaScript
- MongoDB and Mongoose
- Mocha, Chai, and Chai HTTP

## Installation

Requirements: Node.js 18 or newer and MongoDB.

```bash
npm install
cp .env.example .env
npm start
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

## Environment

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | HTTP server port |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/library_management` | MongoDB connection URI |
| `LOAN_DURATION_DAYS` | `14` | Default lending period |
| `NODE_ENV` | `development` | Runtime environment |

Do not commit `.env`. It is excluded by `.gitignore`.

## Commands

```bash
npm start
npm run dev
npm test
```

Tests use isolated in-memory repository adapters and do not require or modify a database.

## Response format

Successful responses use `{ "success": true, "data": ... }`. Errors use `{ "success": false, "error": "Message" }`.

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET, POST | `/api/authors` | List or create authors |
| GET, PUT, DELETE | `/api/authors/:id` | Retrieve, update, or delete an author |
| GET, POST | `/api/books` | Search/list or create books |
| GET, PUT, DELETE | `/api/books/:id` | Retrieve, update, or delete a book |
| GET, POST | `/api/users` | List or create users |
| GET, PUT | `/api/users/:id` | Retrieve, update, or disable a user |
| GET, POST | `/api/loans` | List loan history or borrow a book |
| GET | `/api/loans/overdue` | List active overdue loans |
| GET | `/api/loans/:id` | Retrieve a loan |
| POST | `/api/loans/:id/return` | Return a borrowed book |
| GET | `/health` | Check application health |

Book listing supports `title`, `isbn`, `author`, and `category` query parameters. Set a user's `status` to `disabled` with `PUT /api/users/:id` to disable borrowing.

## Project structure

```text
src/
  config/          Environment and database setup
  controllers/     HTTP request and response handling
  middlewares/     Validation and centralized errors
  models/          Mongoose schemas
  repositories/    Persistence operations
  routes/          Express route definitions
  services/        Business rules
  utils/           Shared utilities
  validators/      Input validation helpers
tests/             Integration tests
```
