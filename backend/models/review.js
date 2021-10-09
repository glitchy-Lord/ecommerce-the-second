const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	name: { type: String, required: true },
	rating: { type: Number, required: true },
	comment: { type: String, required: true },
});

module.exports = mongoose.model('Review', ReviewSchema);
