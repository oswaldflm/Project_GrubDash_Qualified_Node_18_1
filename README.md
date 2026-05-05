# GrubDash – Node.js API
A small REST API that powers a fictional food-delivery service. It exposes
two resources, `/dishes` and `/orders`, backed by in-memory data, and is
implemented with Express middleware. Built as the Robust Server Structure
capstone project.

- [API reference](#api-reference)
  - [Dishes](#dishes)
  - [Orders](#orders)

## Tech stack
  - **Runtime:** Node.js ≥ 18
  - **Framework:** Express 4
  - **Testing:** Jest + Supertest
  - **Other:** `cors`, `cross-conf-env`

## Getting started
```bash
# install dependencies
npm install
# start the API (default port 5000)
npm start
# start with auto-reload on file changes
npm run start:dev
```
The API will be available at `http://localhost:5000`. If you are using Mac and the port is busy can use `http://localhost:5001`


## Scripts
| Script             | What it does                                |
| ------------------ | ------------------------------------------- |
| `npm start`        | Run the server with Node                    |
| `npm run start:dev`| Run the server with `nodemon`               |
| `npm test`         | Run the Jest test suite                     |
| `npm run test:watch` | Run tests in watch mode                   |
---

## Project structure
```
.
├── src/
│   ├── app.js                  # Express app: middleware + routers
│   ├── server.js               # HTTP server entry point
│   │
│   ├── data/
│   │   ├── dishes-data.js      # In-memory dishes seed
│   │   └── orders-data.js      # In-memory orders seed
│   │
│   ├── dishes/
│   │   ├── dishes.controller.js  # CRUD handlers + validators
│   │   └── dishes.router.js      # Express router for /dishes
│   │
│   ├── orders/
│   │   ├── orders.controller.js  # CRUD handlers + validators
│   │   └── orders.router.js      # Express router for /orders
│   │
│   ├── errors/
│   │   ├── errorHandler.js     # Final error-handling middleware
│   │   ├── methodNotAllowed.js # 405 for unsupported methods
│   │   └── notFound.js         # 404 for unknown routes
│   │
│   └── utils/
│       └── nextId.js           # ID generator for new records
│
├── test/
│   ├── dishes-router.test.js   # /dishes route tests
│   └── orders-router.test.js   # /orders route tests
│
├── package.json
└── readme
```

## API reference Routes


### Dishes
| Method | Path           | Description                |
| ------ | -------------- | -------------------------- |
| GET    | `/dishes`      | List all dishes            |
| POST   | `/dishes`      | Create a new dish          |
| GET    | `/dishes/:id`  | Read a single dish         |
| PUT    | `/dishes/:id`  | Update an existing dish    |


### Orders
| Method | Path             | Description                            |
| ------ | ---------------- | -------------------------------------- |
| GET    | `/orders`        | List all orders                        |
| POST   | `/orders`        | Create a new order                     |
| GET    | `/orders/:id`    | Read a single order                    |
| PUT    | `/orders/:id`    | Update an existing order               |
| DELETE | `/orders/:id`    | Delete an order (only when `pending`)  |
