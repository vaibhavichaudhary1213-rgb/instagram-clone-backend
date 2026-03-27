const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Simple test route
router.get("/test", (req, res) => {
  res.json({ msg: "User routes working!" });
});

// Get user profile
router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;