const { models } = require('../util/database');
const { io } = require('../socket/chatsocket');  // Make sure io is properly initialized

// Send message controller
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

// Get messages (fetch new messages based on last received message)
const getMessages = async (req, res) => {
    const { lastMessageId } = req.query; // Get the last message ID from the query params
    let messages = [];

    try {
        // If no lastMessageId is provided, get all messages
        if (!lastMessageId) {
            messages = await models.Message.findAll({
                include: {
                    model: models.User,
                    as: 'user',
                    attributes: ['id', 'name']
                },
                order: [['created_at', 'ASC']]
            });
        } else {
            // Fetch only messages newer than the lastMessageId
            messages = await models.Message.findAll({
                where: {
                    id: {
                        [Sequelize.Op.gt]: lastMessageId  // Sequelize operator to fetch messages greater than lastMessageId
                    }
                },
                include: {
                    model: models.User,
                    as: 'user',
                    attributes: ['id', 'name']
                },
                order: [['created_at', 'ASC']]
            });
        }

        return res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ message: 'Failed to fetch messages' });
    }
};

module.exports = { sendMessage, getMessages };
