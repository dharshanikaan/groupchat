const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // check user exists or not
        const user = await userModel.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // compare password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        // generate token
        const token = jwt.sign({ userId: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1d" });
        return res.status(200).json({message: "Login successful", token});
    } catch (err) {
        console.log("err", err);
        return res.status(500).json({ error: err.message });
    }
}