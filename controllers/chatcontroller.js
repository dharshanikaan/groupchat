const chat = require("../models/chatModel");
const userModel = require("../models/userModel");
// create message
exports.createChat = async (req, res) => { 
    const userId = req.user;
    const { message } = req.body;
    try {
        await chat.create({ message, userId });
        res.status(201).json({ message: "Message sent successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// get message
exports.getChat = async (req, res) => { 
    const user = req.user;
    try {
        const messages = await chat.findAll({
            where: { userId: user.id },
            include: [{ model: userModel, attributes: ["name"] }],
        });
        res.status(200).json({ messages });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}