require('dotenv').config({ path: '../expenseapppassword/.env' });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/signroute');
const chatRoutes = require('./routes/chatroute');  
const authenticate = require('./middleware/auth');  
const { sequelize } = require('./util/database'); 
const path = require('path');
const { initializeSocket } = require('./socket/chatsocket'); 
const http = require('http');  // Import the http module

const app = express();

// Create the HTTP server
const server = http.createServer(app);  // Pass Express app to the server

app.use(cors());
app.use(bodyParser.json());  
app.use('/api/users', authRoutes);
app.use('/api/chat', chatRoutes);
app.use(express.static(path.join(__dirname, 'views')));  

// Route for the root, redirect to signup
app.get('/', (req, res) => {
    res.redirect('/signup'); // Automatically redirect to /signup
});

// Serve Sign-Up and Login HTML
app.get('/signup', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'signup.html');
    console.log('Serving signup file from:', filePath);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(`Failed to serve signup.html: ${err}`);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.get('/login', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'login.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(`Failed to serve login.html: ${err}`);
            res.status(500).send('Internal Server Error');
        }
    });
});

// Protected route for chat
app.get('/chat', authenticate, (req, res) => {
    const filePath = path.join(__dirname, 'views', 'chat.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(`Failed to serve chat.html: ${err}`);
            res.status(500).send('Internal Server Error');
        }
    });
});

// Sync the database with Sequelize
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch((err) => console.error('Error syncing database:', err));

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {  // Start the HTTP server instead of just `app.listen()`
  console.log(`Server running on port ${PORT}`);
});

// Initialize socket.io
initializeSocket(server);  // Pass the HTTP server to socket.io
