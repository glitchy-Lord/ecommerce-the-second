const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Enter your name'],
		maxLength: [30, 'Name cannot exceed 30 characters'],
	},
	email: {
		type: String,
		required: [true, 'Enter your email'],
		unique: true,
		validate: [validator.isEmail, 'Enter a valid email address'],
	},
	password: {
		type: String,
		required: [true, 'Enter your password'],
		minLength: [6, 'Password must be longer than 6 characters'],
		select: false,
	},
	avatar: {
		public_id: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
	},
	role: {
		type: String,
		default: 'user',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
});

//* Encrypting password before saving user
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', userSchema);
