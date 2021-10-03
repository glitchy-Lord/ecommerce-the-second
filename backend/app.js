const express = require('express');
const errorMiddleware = require('./middlewares/errors');

const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());

app.use(cookieParser());

// import all routes
const products = require('./routes/product');
const users = require('./routes/user');
const order = require('./routes/order');

app.use('/api', products);
app.use('/api', users);
app.use('/api', order);

// Middleware to handle error
app.use(errorMiddleware);

module.exports = app;
