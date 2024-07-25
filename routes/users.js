const express = require("express");
const router = express.Router();

// Define a simple route
router.get("/", (req, res) => {
  res.json({ users: [] });
});

// Define a route with a parameter
router.get("/:userId", (req, res) => {
  res.send({ userID: req.params.userId });
});

module.exports = router;
