const Product = require('../models/product');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

const products = require('../data/products.json');

// setting up config file
dotenv.config({ path: 'backend/config/config.env' });

// connecting to database
connectDatabase();

async function seedProducts() {
	try {
		await Product.deleteMany();
		console.log('cleared the database');

		await Product.insertMany(products);
		console.log('seeded the database');

		process.exit();
	} catch (error) {
		console.log(error.message);
		process.exit();
	}
}

seedProducts();
