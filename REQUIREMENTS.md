# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index: '/products' [GET]
- Show: 'products/:id' [GET]
- Create: '/products' [POST]
    - header:
        authorization: jwt token
    - body: 
        ```
        {
            "name": string,
            "price": number,
            "category": string,
        }
        ```
- [OPTIONAL] Top 5 most popular products
    - route: '/popular-product?top=5'
    - param: top: number

#### Users
- Index: '/users' [GET]
    - header:
        authorization: jwt token
- Show: '/users/:id' [GET]
    - header:
        authorization: jwt token
- Create: '/users' [POST]
    - header:
        authorization: jwt token
    - body:
        ```
        {
            "username": string,
            "firstName": string, [optional]
            "lastName": string, [optional]
            "password": string,
        }
        ```
- Authenticate: '/authenticate' [POST]
    - body:
        ```
        {
            "username": string,
            "password": string,
        }
        ```
#### Orders
- Current Order by user (args: user id)[token required]
    - route: '/orders/users/:userId [GET]
    - header:
        authorization: jwt token
- [OPTIONAL] Completed Orders by user (args: user id)[token required]
    - route: '/orders/users/:userId?status='completed' [GET]
    - header:
        authorization: jwt token
    - param: status: string ['completed' or 'active']
- Complete order
    - route: '/orders/:id [PUT]
    - header:
        authorization: jwt token
    - body:
        {
            "status": string [active or completed]
        }

## Postgre Database Tables
### Product
Table: products (
    id: bigint SERIAL PRIMARY KEY,
    name: varchar(100),
    price: integer
)

### User
Table: users (
    id: bigint SERIAL PRIMARY KEY,
    username: varchar(100),
    first_name: varchar(100),
    last_name: varchar(100),
    password_digest: varchar(100)
)

### Order
Table: orders (
    id: bigint SERIAL PRIMARY KEY,
    user_id: integer [foreign key to users table],
    status: varchar(50),
)

### Products In Order
Table: order_products (
    id SERIAL PRIMARY KEY,
    quantity integer,
    order_id bigint [foreign key to orders table],
    product_id bigint [foreign key to products table]
);

## Data Shapes
#### Product
- id
- name
- price

#### User
- id
- firstName
- lastName
- password

#### Orders
- id
- list of product in order
    - id of each product
    - quantity of each product
- user_id
- status of order (active or complete)

