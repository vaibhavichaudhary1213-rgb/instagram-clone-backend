const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getUserProfile,
  followUser,
  unfollowUser,
  updateProfile,
  searchUsers,
  getSuggestions
} = require("../controllers/userController");

// Routes (order matters - specific before general)
router.get("/search", protect, searchUsers);
router.get("/suggestions", protect, getSuggestions);
router.get("/profile", protect, getUserProfile); // Changed from :username
router.put("/profile", protect, updateProfile);
router.post("/:id/follow", protect, followUser);
router.post("/:id/unfollow", protect, unfollowUser);

module.exports = router;