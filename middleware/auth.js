const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  // Extract token from the Authorization header
    console.log('Token received:', token);  // Log the token to check if it's passed correctly

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = { id: decoded.userId, name: decoded.name };
        next();
    });
};


module.exports = authenticate;
