const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Sign Up functionality
exports.signUp = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const user = await userModel.findOne({ where: { email } });
    if (user) {
      return res.status(422).json({ error: "User already exists" });
    }

    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password, saltRound);

    await userModel.create({ name, email, phone, password: hashedPassword });
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login functionality
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ error: err.message });
  }
};
