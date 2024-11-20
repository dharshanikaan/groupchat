// controllers/chatController.js
const { models } = require('../util/database');  // Import the models
const { io } = require('../socket/chatsocket');  // Import Socket.io instance

// Controller to handle sending a message
const sendMessage = async (req, res) => {
    const { message } = req.body;
    const userId = req.user.id;  // Assuming user is authenticated and ID is available in req.user

    // Validate message
    if (!message || message.trim() === '') {
        return res.status(400).json({ message: 'Message cannot be empty' });
    }

    try {
        // Save the message to the database
        const newMessage = await models.Message.create({
            user_id: userId,
            message: message
        });

        // Create message data to broadcast (include user info if needed)
        const messageData = {
            id: newMessage.id,
            user_id: userId,
            message: newMessage.message,
            created_at: newMessage.created_at,
            user_name: req.user.name  // Assuming user name is part of the user object
        };

        // Broadcast chat message to all connected clients via Socket.io
        io.emit('chat-message', messageData);

        // Send success response
        return res.status(201).json({
            message: 'Message sent successfully',
            data: newMessage
        });
    } catch (error) {
        console.error('Error saving message:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller to fetch all messages with user details
const getMessages = async (req, res) => {
    try {
        const messages = await models.Message.findAll({
            include: {
                model: models.User,
                as: 'user', // Alias defined in the model
                attributes: ['id', 'name'] // Fetching only user ID and name
            },
            order: [['created_at', 'ASC']]  // Order messages by creation time
        });
        return res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ message: 'Failed to fetch messages' });
    }
};

module.exports = {
    sendMessage,
    getMessages
};
