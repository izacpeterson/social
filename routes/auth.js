const express = require("express");
const router = express.Router();
const db = require("../modules/db.js");
const crypt = require("../modules/crypt.js");

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  let doesUserExist = await db.checkIfUserExists(username);

  if (!doesUserExist) {
    let hashedPassword = crypt.hashPassword(password);
    db.createUser(username, hashedPassword);
    console.log("user created");
    res.json({ success: true, reason: null });
  } else {
    res.json({ success: false, reason: "user exists" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  let hashedPassword = crypt.hashPassword(password);
  try {
    let doesPasswordMatch = await db.checkPassword(username, hashedPassword);
    if (doesPasswordMatch) {
      req.session.user = doesPasswordMatch.user.id;
      res.json({
        success: true,
        reason: "pw match",
      });
    } else {
      res.json({ success: false, reason: "pw incorrect" });
    }
  } catch (error) {
    res.json({ success: false, reason: error });
  }
});

router.get("/currentUser", (req, res) => {
  if (req.session.user) {
    res.json({ success: true, user: req.session.user });
  } else {
    res.json({ success: false, reason: "no signed in user" });
  }
});

// Define a route with a parameter
router.get("/", (req, res) => {
  res.send({ msg: "Hello" });
});

module.exports = router;
