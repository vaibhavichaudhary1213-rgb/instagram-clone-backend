const User = require("../models/User");
const Post = require("../models/Post");

// @desc    Get user profile by username
// @route   GET /api/users/:username
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user) // Use logged-in user
      .select("-password");
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Follow a user
// @route   POST /api/users/:id/follow
// @access  Private
exports.followUser = async (req, res) => {
  try {
    if (req.params.id === req.user) {
      return res.status(400).json({ msg: "You cannot follow yourself" });
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (userToFollow.followers.includes(req.user)) {
      return res.status(400).json({ msg: "Already following" });
    }

    // Add to followers/following
    userToFollow.followers.push(req.user);
    currentUser.following.push(req.params.id);

    await userToFollow.save();
    await currentUser.save();

    res.json({ 
      msg: "Followed successfully",
      following: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Unfollow a user
// @route   POST /api/users/:id/unfollow
// @access  Private
exports.unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    userToUnfollow.followers.pull(req.user);
    currentUser.following.pull(req.params.id);

    await userToUnfollow.save();
    await currentUser.save();

    res.json({ 
      msg: "Unfollowed successfully",
      following: false
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { bio, website, fullName, isPrivate } = req.body;
    const user = await User.findById(req.user);

    if (fullName) user.fullName = fullName;
    if (bio !== undefined) user.bio = bio;
    if (website !== undefined) user.website = website;
    if (isPrivate !== undefined) user.isPrivate = isPrivate;

    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      bio: user.bio,
      profilePicture: user.profilePicture,
      website: user.website,
      isPrivate: user.isPrivate
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Search users
// @route   GET /api/users/search?q=query
// @access  Private
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ msg: "Search query required" });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { fullName: { $regex: q, $options: "i" } }
      ]
    })
    .select("username fullName profilePicture")
    .limit(20);

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Get user suggestions
// @route   GET /api/users/suggestions
// @access  Private
exports.getSuggestions = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user);
    
    // Find users not followed and not self
    const suggestions = await User.find({
      _id: { 
        $ne: req.user,
        $nin: currentUser.following 
      }
    })
    .select("username fullName profilePicture")
    .limit(10);

    res.json(suggestions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};