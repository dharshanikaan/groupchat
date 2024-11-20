const { Server } = require('socket.io');
let io;  // Declare io object

// Function to initialize socket.io
const initializeSocket = (server) => {
    io = new Server(server);  // Attach socket.io to the server

    // Handle client connection
    io.on('connection', (socket) => {
        console.log('A user connected');

        // Handle incoming messages from clients
        socket.on('chat-message', (messageData) => {
            // Broadcast chat message to all clients
            io.emit('chat-message', messageData);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};

module.exports = { io, initializeSocket };
