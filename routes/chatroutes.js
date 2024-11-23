const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatcontroller");
const auth = require("../middleware/auth");

router.post("/message", auth.authMiddleware, chatController.createChat);
router.get("/messages", auth.authMiddleware, chatController.getChat);

module.exports = router;