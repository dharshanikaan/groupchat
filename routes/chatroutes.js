// routes/chatroutes.js
const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatcontroller");
const auth = require("../middleware/auth");

// Group routes
router.post("/groups", auth.authMiddleware, chatController.createGroup);
router.get("/groups", auth.authMiddleware, chatController.getGroup);
router.get("/group/messages/:groupId", auth.authMiddleware, chatController.getGroupMessages); 
router.post("/group/message/:groupId", auth.authMiddleware, chatController.sendGroupMessage);
router.post("/group/member/:groupId", auth.authMiddleware, chatController.addGroupMember); 
router.get("/group/members/:groupId", auth.authMiddleware, chatController.getGroupMembers);
router.post("/group/invite", auth.authMiddleware, chatController.generateInviteLink); 
router.post("/group/join/:groupId", auth.authMiddleware, chatController.joinGroup);
router.delete("/group/:groupId", auth.authMiddleware, chatController.deleteGroup);
router.delete("/group/leave/:groupId", auth.authMiddleware, chatController.leaveGroup);

// Chat routes
router.post("/message", auth.authMiddleware, chatController.createChat);
router.get("/messages", auth.authMiddleware, chatController.getChat);

module.exports = router;
