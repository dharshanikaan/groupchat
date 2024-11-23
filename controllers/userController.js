const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    // check user exists or not
    const user = await userModel.findOne({ where: { email } });
    if (user) {
      return res.status(422).json({ error: "User already exists" });
    }
    // hash password
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password, saltRound);

    await userModel.create({ name, email, phone, password: hashedPassword });
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};