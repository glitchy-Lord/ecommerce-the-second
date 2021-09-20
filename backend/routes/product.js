const express = require('express');

const router = express.Router();

const {
	getAllProducts,
	createProduct,
	getSingleProduct,
	updateProduct,
	deleteProduct,
} = require('../controllers/product_controllers');

router.route('/products').get(getAllProducts);

router.route('/admin/product/create').post(createProduct);

router.route('/product/:id').get(getSingleProduct);

router.route('/admin/product/:id').put(updateProduct).delete(deleteProduct);

module.exports = router;
