const express = require('express');
const errorMiddleware = require('./middlewares/errors');

const app = express();
app.use(express.json());

// import all routes
const products = require('./routes/product');

app.use('/api', products);

// Middleware to handle error
app.use(errorMiddleware);

module.exports = app;
