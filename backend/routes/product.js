const express = require('express');

const router = express.Router();

const { getAllProducts } = require('../controllers/product_controllers');

router.route('/products').get(getAllProducts);

module.exports = router;
