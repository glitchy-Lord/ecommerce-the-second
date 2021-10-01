const User = require('../models/user');
const crypto = require('crypto');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwt');
const sendEmail = require('../utils/sendEmail');

//* Register a user => /api/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
	const { name, email, password } = req.body;

	const user = await User.create({
		name,
		email,
		password,
		avatar: {
			public_id: 'avatars/kccvibpsuiusmwfepb3m',
			url: 'https://res.cloudinary.com/shopit/image/upload/v1606305757/avatars/kccvibpsuiusmwfepb3m.png',
		},
	});

	// const token = user.getJWT();

	// res.status(201).json({
	// 	success: true,
	// 	message: 'User successfully registered',
	// 	token,
	// 	// user,
	// });

	sendToken(user, 201, res);
});

//* Login user => /api/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
	const { email, password } = req.body;

	//* Checks if email and password is entered by user
	if (!email || !password) {
		return next(new ErrorHandler('Enter email & password', 400));
	}

	//* Finding user in DB
	const user = await User.findOne({ email }).select('+password');

	if (!user) {
		return next(new ErrorHandler('Invalid email or password', 401));
	}

	//* Comparing password
	const isPasswordCorrect = await user.comparePassword(password);

	if (!isPasswordCorrect) {
		return next(new ErrorHandler('Invalid email or password', 401));
	}

	// const token = user.getJWT();

	// res.status(200).json({
	// 	success: true,
	// 	message: 'User successfully logged in',
	// 	token,
	// });

	sendToken(user, 200, res);
});

//* Logout user => /api/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
	res.cookie('token', null, {
		expires: new Date(Date.now()),
		httpOnly: true,
	});

	res.status(200).json({
		success: true,
		message: 'User successfully logged out',
	});
});

//* Forgot password => /api/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(new ErrorHandler('Invalid email or password', 401));
	}

	//* Get reset token
	const resetToken = user.getResetPasswordToken();

	await user.save({ validateBeforeSave: false });

	//* create reset password url
	const resetUrl = `${req.protocol}://${req.get(
		'host'
	)}/api/password/reset/${resetToken}`;

	const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;

	try {
		await sendEmail({
			email: user.email,
			subject: 'eCommerce Password Recovery',
			message,
		});

		res.status(200).json({
			success: true,
			message: `Email sent to: ${user.email}`,
		});
	} catch (error) {
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save({ validateBeforeSave: false });

		return next(new ErrorHandler(error.message, 500));
	}
});

//* Forgot Password => /api/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
	//* Hash url token to compare
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	});

	if (!user) {
		return next(
			new ErrorHandler(
				'Password reset token is invalid or has been expired',
				400
			)
		);
	}

	if (req.body.password !== req.body.confirmPassword) {
		return next(new ErrorHandler('Password does not match', 400));
	}

	//* Setup new password
	user.password = req.body.password;

	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;

	await user.save();

	sendToken(user, 200, res);
});

//* Update/Change password => /api/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.user.id).select('+password');

	//* Check previous password
	const isMatched = await user.comparePassword(req.body.oldPassword);

	if (!isMatched) {
		return next(new ErrorHandler('Old Password is incorrect', 400));
	}

	//* update password
	user.password = req.body.password;

	//* save changes
	await user.save();

	sendToken(user, 200, res);
});

//* Get currently logged in user details => /api/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({
		success: true,
		user,
	});
});

//* Update user profile => /api/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
	const newUserData = {
		name: req.body.name,
		email: req.body.email,
	};

	// todo update profile avatar

	const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});

	res.status(200).json({
		success: true,
		user,
	});
});

//? Admin Routes

//* Get all users => /api/admin/users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
	const users = await User.find();

	const userCount = await User.countDocuments();

	res.status(200).json({
		success: true,
		message: 'got all user',
		count: users.length,
		userCount,
		users,
	});
});

//* Get user details => /api/admin/user/:id
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(new ErrorHandler('User not found', 404));
	}

	res.status(200).json({
		success: true,
		message: 'Found user',
		user,
	});
});

//* Update user profile => /api/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
	const newUserData = {
		name: req.body.name,
		email: req.body.email,
		role: req.body.role,
	};

	// todo update profile avatar

	const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});

	res.status(200).json({
		success: true,
		user,
	});
});

//* Delete user => /api/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(new ErrorHandler('User not found', 404));
	}

	// todo Remove avatar from cloudinary

	await user.remove();

	res.status(200).json({
		success: true,
		message: 'Deleted user',
	});
});
