const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/chatcontroller');  // Correct import path
const { authenticate } = require('../middleware/auth');  // Authentication middleware

// POST route to send a chat message
router.post('/send', authenticate, sendMessage);  // Ensure sendMessage is correctly imported

// GET route to fetch chat history with user details
router.get('/history', authenticate, getMessages);  // Ensure getMessages is correctly imported

module.exports = router;
