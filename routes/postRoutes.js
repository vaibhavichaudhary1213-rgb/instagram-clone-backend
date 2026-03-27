const express = require("express");
const router = express.Router();

// Temporary route to test
router.get("/test", (req, res) => {
  res.json({ msg: "Post routes working" });
});

module.exports = router;