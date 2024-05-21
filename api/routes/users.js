const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

// Set up your routes
router.get("/usersignup", (req, res) => {
  res.render("signup"); // Render the signup.hbs template
});

router.get("/userlogin", (req, res) => {
  res.render("login"); // Render the login.hbs template
});

/*router.post("/signup", async (req, res) => {
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
});*/

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Username: ${username}, password: ${password}`);

    await User.sync();
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = await User.create({ username, password: hashedPassword });
    const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    console.log("Successfully added a new user!");
    res.json({ id: user.id, username: user.username, token });
  } catch (error) {
    console.error("Failed to synchronize with the database:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/info", authenticateToken, async (req, res) => {
  const { name, age, weight, calories } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    user.name = name;
    user.age = age;
    user.weight = weight;
    user.calories = calories;
    await user.save();
    res.json({ message: "User information saved successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while saving user information." });
  }
});

// Route to get user information, protected by authentication
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["name", "age", "weight", "calories"],
    });
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching user information." });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

module.exports = router;
