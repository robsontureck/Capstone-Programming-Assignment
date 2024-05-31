const express = require("express");
const Meal = require("../models/meal"); // Ensure the path is correct
const authenticateToken = require("../middleware/auth");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Meals
 *   description: API to manage meals.
 */

/**
 * @swagger
 * /api/meals/meals:
 *   get:
 *     summary: Get all meals for the authenticated user
 *     tags: [Meals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of meals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   meal_type:
 *                     type: string
 *                   meal:
 *                     type: string
 *                   calories:
 *                     type: integer
 *                   date:
 *                     type: string
 *                     format: date
 *                   user_id:
 *                     type: integer
 *       500:
 *         description: An error occurred while fetching meal entries
 */

router.get("/meals", authenticateToken, async (req, res) => {
  try {
    const meals = await Meal.findAll({ where: { user_id: req.user.id } }); // Use user_id to match the foreign key
    res.json(meals);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching meal entries." });
  }
});

/**
 * @swagger
 * /api/meals/add:
 *   post:
 *     summary: Add a new meal
 *     tags: [Meals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               meal:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               meal_type:
 *                 type: string
 *                 enum: [Breakfast, Lunch, Dinner]
 *               calories:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The meal was successfully created
 *       500:
 *         description: An error occurred while saving meal entry
 */

router.post("/add", authenticateToken, async (req, res) => {
  const { meal, date, meal_type, calories } = req.body; // Include calories
  try {
    const newMeal = await Meal.create({
      meal,
      date,
      meal_type, // Use meal_type instead of mealType
      calories, // Include calories
      user_id: req.user.id, // Use user_id to match the foreign key
    });
    res.json(newMeal);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while saving meal entry." });
  }
});

/**
 * @swagger
 * /api/meals/meals/{id}:
 *   put:
 *     summary: Update a meal entry
 *     tags: [Meals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The meal entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               meal:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               meal_type:
 *                 type: string
 *                 enum: [Breakfast, Lunch, Dinner]
 *               calories:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The meal entry was successfully updated
 *       404:
 *         description: Meal entry not found
 *       500:
 *         description: An error occurred while updating meal entry
 */
router.put("/meals/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { meal, date, meal_type, calories } = req.body; // Include calories
  try {
    const mealEntry = await Meal.findByPk(id);
    if (!mealEntry || mealEntry.user_id !== req.user.id) {
      // Use user_id to match the foreign key
      return res.status(404).json({ error: "Meal entry not found." });
    }
    mealEntry.meal = meal;
    mealEntry.date = date;
    mealEntry.meal_type = meal_type; // Use meal_type instead of mealType
    mealEntry.calories = calories; // Include calories
    await mealEntry.save();
    res.json(mealEntry);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating meal entry." });
  }
});

/**
 * @swagger
 * /api/meals/meals/{id}:
 *   delete:
 *     summary: Delete a meal entry
 *     tags: [Meals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The meal entry ID
 *     responses:
 *       200:
 *         description: The meal entry was successfully deleted
 *       404:
 *         description: Meal entry not found
 *       500:
 *         description: An error occurred while deleting meal entry
 */
router.delete("/meals/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const mealEntry = await Meal.findByPk(id);
    if (!mealEntry || mealEntry.user_id !== req.user.id) {
      // Use user_id to match the foreign key
      return res.status(404).json({ error: "Meal entry not found." });
    }
    await mealEntry.destroy();
    res.json({ message: "Meal entry deleted." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting meal entry." });
  }
});

module.exports = router;
