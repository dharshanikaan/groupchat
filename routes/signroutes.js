const express = require("express");
const router = express.Router();
const signloginController = require("../controllers/signlogincontroller");

router.post("/signup", signloginController.signUp);
router.post("/login", signloginController.login);

module.exports = router;
