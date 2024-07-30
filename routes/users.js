const express = require("express");
const router = express.Router();
const db = require("../modules/db.js");

// Define a simple route
router.get("/", (req, res) => {
  res.json({ users: [] });
});

// Define a route with a parameter
router.get("/:userId", async (req, res) => {
  let user = await db.getUserInfo(req.params.userId);
  res.send({ user: user });
});

module.exports = router;
