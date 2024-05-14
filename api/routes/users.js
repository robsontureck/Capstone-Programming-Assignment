const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

// Set up your routes
router.get("/usersignup", (req, res) => {
  res.render("signup"); // Render the signup.hbs template
});

router.get("/userlogin", (req, res) => {
  res.render("login"); // Render the login.hbs template
});

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(`Username: ${username}, password: ${password}`);
  User.sync()
    .then(async () => {
      const user = await User.create({ username, password: hashedPassword });
      console.log("Successfully added a new student!");
      res.json({ id: user.id, username: user.username });
    })
    .catch((error) =>
      console.log("Failed to synchronize with the database:", error)
    );
  //const user = await User.create({ username, password: hashedPassword });
  //res.json({ id: user.id, username: user.username });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1h" });
  res.json({ token });
});

module.exports = router;
