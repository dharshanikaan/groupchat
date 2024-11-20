const express = require('express');
const { signup, login, getUserStatus } = require('../controllers/signlogincontroller');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signup); // Route to sign up users
router.post('/login', login); // Route for user login
router.get('/status', authenticateToken, getUserStatus); // Route to check user status (protected)

module.exports = router;
