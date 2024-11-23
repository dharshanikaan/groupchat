const jwt = require("jsonwebtoken");
const User = require("../models/user");
const dotenv = require("dotenv");
dotenv.config();

// Middleware for HTTP requests (authMiddleware)
exports.authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.header("Authorization");

    // Check if token is provided
    if (!token) {
      return res.status(401).json({ error: "Authorization token is missing" });
    }

    // Verify token and decode payload
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists in the database
    const userExists = await User.findByPk(payload.userId);

    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach user info to request object
    req.user = {
      id: userExists.id,
      name: userExists.name,
    };

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Handle any errors (e.g., token is invalid, expired)
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Middleware for WebSocket connections (socketMiddleware)
exports.socketMiddleware = async (socket, next) => {
  try {
    // Get token from the connection handshake headers
    const token = socket.handshake.headers.authorization;

    // Check if token is provided
    if (!token) {
      return next(new Error("Authorization token is missing"));
    }

    // Verify token and decode payload
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists in the database
    const userExists = await User.findByPk(payload.userId);

    if (!userExists) {
      return next(new Error("User not found"));
    }

    // Attach user info to the socket object
    socket.user = {
      id: userExists.id,
      name: userExists.name,
    };

    // Proceed to the next middleware or connection handler
    next();
  } catch (err) {
    // Handle any errors (e.g., token is invalid, expired)
    console.error(err);
    next(new Error("Authentication error"));
  }
};
