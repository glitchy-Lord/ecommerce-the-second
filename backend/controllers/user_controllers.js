const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwt');

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
