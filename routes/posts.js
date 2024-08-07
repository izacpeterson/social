const express = require("express");
const router = express.Router();
const db = require("../modules/db.js");
const crypt = require("../modules/crypt.js");

router.post("/new", (req, res) => {
  let postContent = req.body.postContent;

  if (req.session.user) {
    try {
      db.newPost(req.session.user, postContent);
      res.json({ success: true });
    } catch (error) {
      res.json({ success: false, reason: error });
    }
  } else {
    res.json({ success: false, reason: "not logged in" });
  }
});

router.get("/getFollowPosts", async (req, res) => {
  try {
    let posts = await db.getUserFollowedPosts(req.session.user);
    res.json({ success: true, posts: posts });
  } catch (error) {
    res.json({ success: false, reason: error });
  }
});

module.exports = router;
