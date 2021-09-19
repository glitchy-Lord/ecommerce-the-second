const express = require('express');

const router = express.Router();

const productController = require('../controllers/product_controllers');

router.route('/products').get(productController.getAllProducts);

router.route('/admin/product/create').post(productController.createProduct);

router.route('/product/:id').get(productController.getSingleProduct);

router
	.route('/admin/product/:id')
	.put(productController.updateProduct)
	.delete(productController.deleteProduct);

module.exports = router;
