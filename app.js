require('dotenv').config({ path: '../expenseapppassword/.env' }); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/signroute'); // Authentication routes
const { sequelize } = require('./util/database'); // Database connection
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());  // Parse incoming JSON requests

// Serve Static Files (for HTML forms)
app.use(express.static(path.join(__dirname, 'views')));  // Serve HTML from views folder

// Routes
app.use('/api/auth', authRoutes);  // API routes for signup and login

// Serve the signup page
const signupPath = path.join(__dirname, 'views', 'signup.html');
console.log("Signup page path:", signupPath);  // This will log the full path to the console

app.get('/signup', (req, res) => {
  res.sendFile(signupPath);  // Render signup.html
});
// Serve the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));  // Render login.html
});

// Serve the chat page
app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'chat.html'));  // Render chat.html
});

// Sync database
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch((err) => console.error('Error syncing database:', err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
