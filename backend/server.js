const app = require('./app');
const connectDatabase = require('./config/database');

const dotenv = require('dotenv');
// setting up config file
dotenv.config({ path: 'backend/config/config.env' });

// connecting to database
connectDatabase();

app.listen(process.env.PORT, () => {
	console.log(
		`Server running on port: ${process.env.PORT} IN ${process.env.NODE_ENV} mode`
	);
});
