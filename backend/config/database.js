const mongoose = require('mongoose');

const connectDatabase = () => {
	mongoose
		.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			// useCreateIndex: true,
		})
		.then((con) => {
			console.log(`MongoDB connected to Host: ${con.connection.host}`);
		});
};

module.exports = connectDatabase;
