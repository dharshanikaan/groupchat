const express = require('express');
const router = express.Router();
const { signUp } = require('../controllers/userController');  // Import the signUp controller

// Define the POST route for signup
router.post('/signup', signUp);

module.exports = router;
