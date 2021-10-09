const express = require('express');

const router = express.Router();

const {
	createReview,
	updateReview,
	deleteReview,
	getAllReviews,
} = require('../controllers/review_controllers');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/product/:id/review').post(isAuthenticatedUser, createReview);

router
	.route('/product/:id/review/:reviewId')
	.put(isAuthenticatedUser, updateReview)
	.delete(isAuthenticatedUser, deleteReview);

router.route('/product/:id/reviews').get(getAllReviews);

module.exports = router;
