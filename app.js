require('dotenv').config({ path: '../expenseapppassword/.env' }); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/signroute');  // Import authentication routes
const authenticate = require('./middleware/auth');  // Import authentication middleware
const { sequelize } = require('./util/database');  // Sequelize database connection
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());  // Parse incoming JSON requests

// Serve Static Files (for HTML forms)
app.use(express.static(path.join(__dirname, 'views')));  // Serve HTML from views folder

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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
