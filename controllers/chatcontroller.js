// controllers/chatcontroller.js
const chat = require("../models/chat");
const userModel = require("../models/user");
const groupModel = require("../models/group");
const groupMemberModel = require("../models/groupmember");

// Create a new group
exports.createGroup = async (req, res) => {
  const { name } = req.body;
  const user = req.user; // Assuming `req.user` is set with the authenticated user's info
  try {
    // Create the group
    const newGroup = await groupModel.create({ name, createdBy: user.id });

    // Add the creator as the default member of the group
    await groupMemberModel.create({ groupId: newGroup.id, userId: user.id });

    res.status(201).json({
      message: "Group created successfully",
      group: {
        id: newGroup.id,
        name: newGroup.name,
        createdBy: user.id,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all groups that a user belongs to
exports.getGroup = async (req, res) => {
  const user = req.user; // Get the authenticated user
  try {
    // Find groups where the user is a member
    const groups = await groupMemberModel.findAll({
      where: { userId: user.id },
      include: [{ model: groupModel, attributes: ["id", "name"] }],
    });

    res.status(200).json({ groups });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send a message to a group
exports.sendGroupMessage = async (req, res) => {
  const { groupId } = req.params; // Get group ID from params
  const { message } = req.body; // Get message from the request body
  const user = req.user; // Get the authenticated user
  try {
    // Create a new message in the chat table
    await chat.create({ message, userId: user.id, groupId });

    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all messages from a group
exports.getGroupMessages = async (req, res) => {
  const { groupId } = req.params; // Get group ID from params
  try {
    // Fetch all messages belonging to a specific group
    const messages = await chat.findAll({
      where: { groupId },
      include: [{ model: userModel, attributes: ["name"] }],
    });

    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a member to a group
exports.addGroupMember = async (req, res) => {
  const { groupId } = req.params; // Get group ID from params
  const { userId } = req.body; // Get user ID from request body
  try {
    // Add the new member to the group
    await groupMemberModel.create({ groupId, userId });

    res.status(201).json({ message: "Group member added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all members of a group
exports.getGroupMembers = async (req, res) => {
  const { groupId } = req.params; // Get group ID from params
  try {
    // Find all members of the group
    const members = await groupMemberModel.findAll({
      where: { groupId },
      include: [{ model: userModel, attributes: ["name"] }],
    });

    res.status(200).json({ members });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Generate an invite link for a group
exports.generateInviteLink = async (req, res) => {
  const { groupId } = req.body; // Get group ID from request body
  try {
    const group = await groupModel.findByPk(groupId); // Find the group by ID

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Only the group creator can generate an invite link
    if (group.createdBy !== req.user.id) {
      return res.status(403).json({ error: "Only the admin can create an invite link" });
    }

    const randomString = Math.random().toString(36).slice(2); // Generate a random string for the invite
    const inviteLink = `${process.env.BASE_URL}/group-invite/${randomString}/${groupId}`;

    res.json({ inviteLink });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Join a group using an invite link
exports.joinGroup = async (req, res) => {
  const { groupId } = req.params; // Get group ID from params
  try {
    const group = await groupModel.findByPk(groupId); // Find the group by ID

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Add the current user to the group
    await groupMemberModel.create({ groupId, userId: req.user.id });

    res.status(200).json({ message: "Successfully joined the group" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Leave a group
exports.leaveGroup = async (req, res) => {
  const { groupId } = req.params; // Get group ID from params
  try {
    const group = await groupModel.findByPk(groupId); // Find the group by ID

    if (group.createdBy === req.user.id) {
      return res.status(403).json({ error: "Admin cannot leave the group" });
    }

    // Remove the current user from the group
    await groupMemberModel.destroy({ where: { groupId, userId: req.user.id } });

    res.status(200).json({ message: "Successfully left the group" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a group
exports.deleteGroup = async (req, res) => {
  const { groupId } = req.params; // Get group ID from params
  try {
    const group = await groupModel.findByPk(groupId); // Find the group by ID

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Only the group creator can delete the group
    if (group.createdBy !== req.user.id) {
      return res.status(403).json({ error: "Only the admin can delete the group" });
    }

    // Delete the group and associated data
    await groupModel.destroy({ where: { id: groupId } });
    await groupMemberModel.destroy({ where: { groupId } });
    await chat.destroy({ where: { groupId } });

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
