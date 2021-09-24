const express = require('express');

const router = express.Router();

const {
	getAllProducts,
	createProduct,
	getSingleProduct,
	updateProduct,
	deleteProduct,
} = require('../controllers/product_controllers');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/products').get(getAllProducts);

router
	.route('/admin/product/create')
	.post(isAuthenticatedUser, authorizeRoles('admin'), createProduct);

router.route('/product/:id').get(getSingleProduct);

router
	.route('/admin/product/:id')
	.put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
	.delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

module.exports = router;
