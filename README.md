# NodePop 

NodePop is a web application where users can post ads to sell products. 
Each user can only view and manage their own products, which allows to practice authentication and permissions management in a backend with Node.js.

## Database

The database created for this project is called **'nodepop'**. If you'd like to use your own database, you can change the name in `/lib/connectMongoose.js` and `/lib/sessionManager.js`.

## Installation

Install dependencies with:

```sh
npm install
```

On first deploy you can use the next command to initialize the database:

```sh
npm run initDB
```

## Use

Start the server in development:

```sh
npm run dev
```

Start the server in production:

```sh
npm start
```

## Endpoints

### Not proptected endpoints

The user does not need to authenticate to access these enpoints:

Home

```sh
GET /
```

Login

```sh
GET /login
POST /login
```

Logout

```sh
GET /logout
```

### Protected endpoints

The user needs to authenticate to access these endpoints. If they try to access these endpoints, they will be redirected to the login page.

Create new product

```sh
GET /products/new
POST /products/new
```

Delete product

```sh
GET /products/delete/:productId
```

## Tecnologies used

- Node.js
- MongoDB
- npm
- Express.js
- nodemon
- Mongoose
- connect-mongo
- cross-env
- http-errors
- EJS
- Morgan
- express-session
- Bcrypt
- Multer
- express-validator



