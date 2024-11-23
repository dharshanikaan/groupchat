const groupModel = require("../models/group");
const userModel = require("../models/user");
const groupMember = require("../models/groupmember");
const chatModel = require("../models/chat");

exports.createGroup = async (req, res) => {
  const { name } = req.body;
  const user = req.user;
  try {
    const newGroup = await groupModel.create({ name, createdBy: user.id });

    // group created user is default member of the group
    await groupMember.create({ groupId: newGroup.id, userId: user.id });
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

exports.getGroup = async (req, res) => {
  const user = req.user;
  const userName = req.user.name;
  try {
    const groups = await groupMember.findAll({
      where: { userId: user.id },
      include: [{ model: groupModel, attributes: ["name"] }],
    });
    res.status(200).json({ groups, userName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createGroupMember = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.body;
  try {
    await groupMember.create({ groupId, userId });
    res.status(201).json({ message: "Group member created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get group members
exports.getGroupMembers = async (req, res) => {
  const { groupId } = req.params;
  try {
    const members = await groupMember.findAll({
      where: { groupId },
      include: [{ model: userModel, attributes: ["name"] }],
    });
    res.status(200).json({ members });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// send message to group
exports.sendGroupMessage = async (req, res) => {
  const { groupId } = req.params;
  const { message } = req.body;
  const user = req.user;
  try {
    await chat.create({ message, userId: user.id, groupId });
    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// fetch message from group
exports.getGroupMessage = async (req, res) => {
  const { groupId } = req.params;
  try {
    const messages = await chatModel.findAll({
      where: { groupId },
      include: [{ model: userModel, attributes: ["name"] }],
    });
    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.inviteGroup = async (req, res) => {
  const { groupId } = req.body;
  console.log("groupId", groupId);
  try {
    const group = await groupModel.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Only admin can generate the invite link
    if (group.createdBy !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Only the admin can create an invite link" });
    }
    const randomString = Math.random().toString(36).slice(3);
    const inviteLink = `${randomString}/${groupId}`;
    res.json({ inviteLink });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.joinGroup = async (req, res) => {
  const { groupId } = req.params;
  try {
    const group = await groupModel.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    await groupMember.create({ groupId, userId: req.user.id });
    res.status(200).json({ message: "Group joined successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete group
exports.deleteGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    const chatGroup = await groupModel.findByPk(groupId);
    if (chatGroup.createdBy !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Only the admin can delete the group" });
    }
    // Delete the group and related records
    await groupModel.destroy({ where: { id: groupId } });
    await groupMember.destroy({ where: { groupId } });
    await chatModel.destroy({ where: { groupId } });
    res.status(200).json({ message: "Group deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// leave group
exports.leaveGroup = async (req, res) => {
  const { groupId } = req.params;
  try {
    const group = await groupModel.findByPk(groupId);
    if(group.createdBy === req.user.id){
      return res.status(403).json({ error: "admin cannot leave the group" });
    }
    await groupMember.destroy({ where: { groupId, userId: req.user.id } });
    res.status(200).json({ message: "Group left successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};