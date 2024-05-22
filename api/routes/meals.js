const express = require("express");
const Meal = require("../models/meal"); // Ensure the path is correct
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Meals route is working!");
});

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
