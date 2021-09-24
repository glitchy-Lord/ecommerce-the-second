const express = require('express');
const errorMiddleware = require('./middlewares/errors');

const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());

app.use(cookieParser());

// import all routes
const products = require('./routes/product');
const users = require('./routes/user');

app.use('/api', products);
app.use('/api', users);

// Middleware to handle error
app.use(errorMiddleware);

module.exports = app;
