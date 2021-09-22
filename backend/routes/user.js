const express = require('express');

const router = express.Router();

const { registerUser } = require('../controllers/user_controllers');

router.route('/register').post(registerUser);

module.exports = router;
