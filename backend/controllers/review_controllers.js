const Product = require('../models/product');
const Review = require('../models/review');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

//* Create review => /api/product/:id/review
exports.createReview = catchAsyncErrors(async (req, res, next) => {
	const { rating, comment } = req.body;

	const product = await Product.findById(req.params.id).populate(
		'reviews',
		'rating user'
	);

	if (!product) {
		return next(new ErrorHandler('Product not found', 404));
	}

	const isReviewed = product.reviews.find(
		(review) => review.user.toString() === req.user.id.toString()
	);

	if (isReviewed) {
		return next(
			new ErrorHandler('You have already reviewed this product', 400)
		);
	}

	const review = {
		user: req.user.id,
		name: req.user.name,
		rating: Number(rating),
		comment,
	};
	const newReview = await Review.create(review);

	product.reviews.push(newReview);
	product.numOfReviews = product.reviews.length;
	product.ratings =
		product.reviews.reduce((acc, review) => review.rating + acc, 0) /
		product.reviews.length;

	await product.save({ validateBeforeSave: false });

	res.status(200).json({
		success: true,
		message: 'Successfully added your review',
		review: newReview,
	});
});

//* Update Review => /api/product/:id/review/:reviewId
exports.updateReview = catchAsyncErrors(async (req, res, next) => {
	const { id, reviewId } = req.params;
	const { rating, comment } = req.body;

	const product = await Product.findById(id).populate('reviews', 'user');

	if (!product) {
		return next(new ErrorHandler('Product not found', 404));
	}

	const review = await Review.findById(reviewId);

	const isReviewed = product.reviews.find(
		(review) => review.user.toString() === req.user.id.toString()
	);

	if (!review || !isReviewed) {
		return next(new ErrorHandler('Review not found', 404));
	}

	product.ratings =
		(product.ratings * product.numOfReviews - review.rating + rating) /
		product.numOfReviews;

	review.rating = Number(rating);
	review.comment = comment;

	await product.save({ validateBeforeSave: false });
	await review.save();

	res.status(200).json({
		success: true,
		message: 'Review successfully updated',
		product,
		review,
	});
});

//* Get all reviews for a product => /api/product/:id/reviews
exports.getAllReviews = catchAsyncErrors(async (req, res, next) => {
	const product = await Product.findById(req.params.id).populate(
		'reviews',
		'name rating comment'
	);

	if (!product) {
		return next(new ErrorHandler('Product not found', 404));
	}

	if (product.reviews.length === 0) {
		return next(new ErrorHandler('Product not reviewed yet', 400));
	}

	res.status(200).json({
		success: true,
		message: 'Got all reviews',
		review: product.reviews,
	});
});

//* Delete Review => /api/product/:id/review/:reviewId
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
	const { id, reviewId } = req.params;

	const product = await Product.findById(id).populate('reviews', 'user');

	if (!product) {
		return next(new ErrorHandler('Product not found', 404));
	}

	const review = await Review.findById(reviewId);

	const isReviewed = product.reviews.find(
		(review) => review.user.toString() === req.user.id.toString()
	);

	if (!review || !isReviewed) {
		return next(new ErrorHandler('Review not found', 404));
	}

	const changes = {
		ratings: product.ratings,
		numOfReviews: product.numOfReviews,
	};

	if (product.numOfReviews === 1) {
		changes.ratings = null;
	} else {
		changes.ratings =
			(product.ratings * product.numOfReviews - review.rating) /
			(product.numOfReviews - 1);
	}
	changes.numOfReviews -= 1;

	if (review && isReviewed) {
		await Product.findByIdAndUpdate(id, {
			...changes,
			$pull: { reviews: reviewId },
		});
		await Review.findByIdAndDelete(reviewId);
	}

	res.status(200).json({
		success: true,
		message: 'Review successfully deleted',
	});
});
