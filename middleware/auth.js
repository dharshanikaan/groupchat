// middleware/authenticate.js
const jwt = require('jsonwebtoken');

// Middleware to authenticate the user using JWT
const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  // Extract token from "Authorization" header

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.userId = decoded.userId;  // Attach user ID to request object
        next();  // Proceed to the next middleware or route handler
    });
};

module.exports = authenticate;
