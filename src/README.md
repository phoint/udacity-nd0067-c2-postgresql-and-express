# Storefront Backend API
## Overview
This is the backend for the Storefront project, which provides an API for managing users, products, and orders. The project is built using Node.js, Express, TypeScript, and PostgreSQL. The API supports creating, reading, updating, and deleting users, products, and orders.

## Features
* User authentication and authorization.
* Managing products in the store.
* Creating and managing orders.
* Database migrations using db-migrate.

## Project Structure
udacity-nd0067-c2-postgresql-and-express/
├── .github/workflows
├── build/
├── migrations/
│   └── sqls/
│       ├── 20240803141326-user-table.js
│       ├── 20240805125211-products-table.js
│       ├── 20240805131018-orders-table.js
│       └── 20240805131236-order-products-table.js
├── node_modules/
├── spec/
│   ├── handlers/
│   ├── helpers/
│   ├── models/
│   └── support/
├── src/
│   ├── handlers/
│   │   ├── orderRoutes.ts
│   │   ├── productRoutes.ts
│   │   └── userRoutes.ts
│   ├── models/
│   │   ├── orders.ts
│   │   ├── products.ts
│   │   └── user.ts
│   ├── util/
│   │   ├── CustomError.ts
│   │   ├── verifyAuthTokenMiddleware.ts
│   │   └── database.ts
│   └── server.ts
├── .env
├── .gitignore
├── .prettierrc
├── CODEOWNERS
├── docker-compose.yml
├── database.json
├── package.json
├── LICENSE.txt
└── tsconfig.json
## Getting Started
### Prerequisites
* Node.js (v14+)
* PostgreSQL
* Docker (optional, for running PostgreSQL)
### Installation
1. Clone the repository:
```bash
git clone https://github.com/phoint/udacity-nd0067-c2-postgresql-and-expressgit
```
2. Install dependencies:
```bash
npm install
```
3. Set up the environment variables:
Create a .env file in the root of the project and configure the following variables:
```sh
POSTGRES_HOST=localhost
POSTGRES_DB=storefront
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
ENV=dev
BCRYPT_PASSWORD=your-bcrypt-password
SALT_ROUNDS=10
TOKEN_SECRET=your-token-secret
```
### Database Setup
1. Start PostgreSQL using Docker (optional):
```bash
docker-compose up -d
```
2. Run the database migrations:
```bash
npm run db-migrate --env dev up
```
3. Populate the database with sample data (optional).
### Running Application
1. Compile the Typescript code:
```bash
npm run build
```
2. Start the server
```bash
npm run start
```
3. The API should now be running at `http://localhost:3000`
## API Endpoints
Here is a summary of the main API endpoints:

#### Users
**`POST /users`**: Create a new user.
**`GET /users/:id`**: Get a user by ID.
**`GET /users`**: Get all users.
**`GET /authenticate`**: verify and get jwt token.
#### Products
**`POST /products`**: Create a new product.
**`GET /products/:id`**: Get a product by ID.
**`GET /products`**: Get all products.
**`GET /popular-product?top=[number]`**: get top popular product.

#### Orders
**`POST /orders`**: Create a new order.
**`GET /orders/:id`**: Get an order by ID.
**`GET /orders`**: Get all orders.
**`PUT /orders/:id`**: Update an order status.

## Running Tests
1. Run tests:
```bash
npm run test
```
This command will:
* Run database migrations in the test environment.
* Execute the test suite using Jasmine and SuperTest.
* Reset the test database after tests complete.
### Configuration for Jasmine and SuperTest
To configure Jasmine and SuperTest, you may use the following setup:
* jasmine-ts is used to run Jasmine tests with TypeScript support.
* SuperTest is used to test HTTP endpoints.

Example of a test case:
```typescript
import request from 'supertest';
import app from '../src/server';

describe('GET /orders/:id', () => {
  it('should return an order by ID', (done) => {
    request(app)
      .get('/orders/1')
      .auth('your-jwt-token', { type: 'bearer' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual({
          id: 1,
          userId: 1,
          status: 'completed',
          products: [{ product: '1', quantity: 3 }],
        });
        done();
      });
  });
});
```
## Additional Notes
* **Error Handling:** Custom errors are handled using CustomError.ts and middleware for catching and formatting errors in JSON.
* **Authentication:** JWT-based authentication is implemented with middleware located in `verifyAuthTokenMiddleware.ts`.
## License
This project is licensed under the MIT License - see the LICENSE.txt file for details.

## Contributing
Feel free to submit a pull request or open an issue if you find any bugs or have a suggestion for improvements.

## Contact
If you have any questions or need further clarification, feel free to contact the repository owner. 