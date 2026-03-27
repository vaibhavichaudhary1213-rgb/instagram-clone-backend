const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: "" },
  bio: { type: String, default: "" },
}, { timestamps: true });

// Add these to your userSchema
profilePicture: {
  type: String,
  default: "https://res.cloudinary.com/demo/image/upload/v1/default-avatar.png",
},
coverPicture: {
  type: String,
  default: "",
},
bio: {
  type: String,
  maxlength: 150,
  default: "",
},
followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
postsCount: {
  type: Number,
  default: 0,
},
isPrivate: {
  type: Boolean,
  default: false,
},
isVerified: {
  type: Boolean,
  default: false,
},
website: {
  type: String,
  trim: true,
},

module.exports = mongoose.model("User", userSchema);
