const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API to manage users.
 */

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Username already exists
 *       500:
 *         description: Internal server error
 */

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

/**
 * @swagger
 * /api/users/info:
 *   post:
 *     summary: Save user information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               weight:
 *                 type: float
 *               calories:
 *                 type: float
 *     responses:
 *       200:
 *         description: User information saved successfully
 *       500:
 *         description: An error occurred while saving user information
 */
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

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get user information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 weight:
 *                   type: float
 *                 calories:
 *                   type: float
 *       500:
 *         description: An error occurred while fetching user information
 */
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

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
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

/**
 * @swagger
 * /api/users/info:
 *   put:
 *     summary: Update user information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               weight:
 *                 type: float
 *               calories:
 *                 type: float
 *     responses:
 *       200:
 *         description: User information updated successfully
 *       400:
 *         description: Invalid input values
 *       404:
 *         description: User not found
 *       500:
 *         description: An error occurred during the update
 */
router.put("/info", authenticateToken, async (req, res) => {
  const { name, age, weight, calories } = req.body;

  // Basic validation
  if (!name || age <= 0 || weight <= 0 || calories < 0) {
    return res.status(400).json({ message: "Invalid input values" });
  }

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.age = age;
    user.weight = weight;
    user.calories = calories;
    await user.save();

    res.json({ message: "User information updated successfully." });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({ error: "An error occurred during the update." });
  }
});

module.exports = router;
