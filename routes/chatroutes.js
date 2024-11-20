const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/chatcontroller');
const authenticate = require('../middleware/auth');

router.post('/send', authenticate, sendMessage);  // Ensure sendMessage is protected
router.get('/history', authenticate, getMessages);  // Ensure getMessages is protected

module.exports = router;
