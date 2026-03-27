const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const User = require("../models/User");

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
