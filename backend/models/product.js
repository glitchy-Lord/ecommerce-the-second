const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Enter a product name'],
		trim: true,
		maxLength: [100, 'Product name cannot exceed 100 characters'],
	},

	price: {
		type: Number,
		required: [true, 'Enter a price'],
		maxLength: [100, 'Product name cannot exceed 100 characters'],
		default: 0.0,
	},

	description: {
		type: String,
		required: [true, 'Enter a product description'],
		trim: true,
	},

	ratings: { type: Number, default: 0 },

	images: [
		{
			public_id: { type: String, required: true },
			url: { type: String, required: true },
		},
	],

	category: { type: String, required: [true, 'Select a product category'] },

	seller: { type: String, required: [true, 'Enter a seller name'] },

	stock: {
		type: Number,
		required: [true, 'Enter product stock'],
		maxLength: [5, 'Product stock cannot exceed 99999'],
		default: 0,
	},

	numOfReviews: { type: Number, default: 0 },

	reviews: [
		{
			name: { type: String, required: true },
			rating: { type: Number, required: true },
			comment: { type: String, required: true },
		},
	],

	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

	createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Product', ProductSchema);
