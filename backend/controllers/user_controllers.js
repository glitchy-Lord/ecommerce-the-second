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
