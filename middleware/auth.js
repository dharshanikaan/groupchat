const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const dotenv = require("dotenv");
dotenv.config();

exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ error: "Authorization token is missing" });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userExits = await User.findByPk(payload.userId);

    if (!userExits) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = {
      id: userExits.id,
      name: userExits.name,
    };
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.socketMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.headers.authorization; 

    if (!token) {
      return next(new Error("Authorization token is missing"));
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const userExists = await User.findByPk(payload.userId);

    if (!userExists) {
      return next(new Error("User not found"));
    }

    socket.user = {
      id: userExists.id,
      name: userExists.name
    }
    next(); 
  } catch (err) {
    next(new Error("Authentication error")); // Pass error to Socket.io
  }
};