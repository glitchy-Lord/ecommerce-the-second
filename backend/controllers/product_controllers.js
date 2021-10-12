const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');

//* Get all products from the DB => /api/products?keyword=apple
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
	const resPerPage = 8;
	const productCount = await Product.countDocuments();

	const apiFeatures = new APIFeatures(Product.find(), req.query)
		.search()
		.filter()
		.pagination(resPerPage);

	const products = await apiFeatures.query;

	res.status(200).json({
		success: true,
		count: products.length,
		message: 'got all products',
		productCount,
		products,
	});
});

//* Get a single product => /api/product/:id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
	// get the id from the url
	const { id } = req.params;
	let product;

	// if (id.match(/^[0-9a-fA-F]{24}$/)) {
	// Yes, it's a valid ObjectId, proceed with `findById` call.

	// search for product using id
	product = await Product.findById(id);
	// }

	if (!product) {
		return next(new ErrorHandler('Product not found', 404));
	}

	res.status(200).json({
		success: true,
		message: 'found product',
		product,
	});
});

//? ADMIN ROUTES

//* Create a new product => /api/admin/product/create
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
	req.body.user = req.user.id;

	const product = await Product.create(req.body);

	res.status(201).json({
		success: true,
		product,
	});
});

//* Update a product => /api/admin/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
	// get the id from the url
	const { id } = req.params;
	let product;

	if (id.match(/^[0-9a-fA-F]{24}$/)) {
		// Yes, it's a valid ObjectId, proceed with `findById` call.

		// search for product using id
		product = await Product.findById(id);
	}

	if (!product) {
		return next(new ErrorHandler('Product not found', 404));
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
});

//* Delete a product => /api/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
	// get the id from the url
	const { id } = req.params;
	let product;

	if (id.match(/^[0-9a-fA-F]{24}$/)) {
		// Yes, it's a valid ObjectId, proceed with `findById` call.

		// search for product using id
		product = await Product.findById(id);
	}

	if (!product) {
		return next(new ErrorHandler('Product not found', 404));
	}

	await product.remove();

	res.status(200).json({
		success: true,
		message: 'deleted product',
		product,
	});
});
