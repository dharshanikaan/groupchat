const express = require("express");
const router = express.Router();
const groupChatController = require("../controllers/groupchatcontroller");
const auth = require("../middleware/auth");

router.post("/groups", auth.authMiddleware, groupChatController.createGroup);
router.get("/groups", auth.authMiddleware, groupChatController.getGroup);
router.get("/group/messages/:groupId", auth.authMiddleware, groupChatController.getGroupMessage);
router.post("/group/message/:groupId", auth.authMiddleware, groupChatController.sendGroupMessage);
router.post("/group/member/:groupId", auth.authMiddleware, groupChatController.createGroupMember);
router.get("/group/members/:groupId", auth.authMiddleware, groupChatController.getGroupMembers);
router.post("/group/invite", auth.authMiddleware, groupChatController.inviteGroup);
router.post("/group/join/:groupId", auth.authMiddleware, groupChatController.joinGroup);
router.delete("/group/:groupId", auth.authMiddleware, groupChatController.deleteGroup);
router.delete("/group/leave/:groupId", auth.authMiddleware, groupChatController.leaveGroup);

module.exports = router;