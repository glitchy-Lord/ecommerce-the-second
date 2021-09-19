const Product = require('../models/product');

module.exports = {
	// Get all products from the DB
	async getAllProducts(req, res, next) {
		const products = await Product.find();

		res.status(200).json({
			success: true,
			count: products.length,
			message: 'got all products',
			products,
		});
	},

	// Get a single product
	async getSingleProduct(req, res, next) {
		// get the id from the url
		const { id } = req.params;
		let product;

		if (id.match(/^[0-9a-fA-F]{24}$/)) {
			// Yes, it's a valid ObjectId, proceed with `findById` call.

			// search for product using id
			product = await Product.findById(id);
		}

		if (!product) {
			res.status(404).json({
				success: false,
				message: 'product not found',
			});
		}

		// console.log(product);

		res.status(200).json({
			success: true,
			message: 'found product',
			product,
		});
	},

	// Create a new product
	async createProduct(req, res, next) {
		const product = await Product.create(req.body);

		res.status(201).json({
			success: true,
			product,
		});
	},

	// Update a product
	async updateProduct(req, res, next) {
		// get the id from the url
		const { id } = req.params;
		let product;

		if (id.match(/^[0-9a-fA-F]{24}$/)) {
			// Yes, it's a valid ObjectId, proceed with `findById` call.

			// search for product using id
			product = await Product.findById(id);
		}

		if (!product) {
			res.status(404).json({
				success: false,
				message: 'product not found',
			});
		}

		product = await Product.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
			useFindAndModify: false,
		});

		res.status(200).json({
			success: true,
			message: 'updated product',
			product,
		});
	},

	// Delete a product
	async deleteProduct(req, res, next) {
		// get the id from the url
		const { id } = req.params;
		let product;

		if (id.match(/^[0-9a-fA-F]{24}$/)) {
			// Yes, it's a valid ObjectId, proceed with `findById` call.

			// search for product using id
			product = await Product.findById(id);
		}

		if (!product) {
			res.status(404).json({
				success: false,
				message: 'product not found',
			});
		}

		await product.remove();

		res.status(200).json({
			success: true,
			message: 'deleted product',
			product,
		});
	},
};
