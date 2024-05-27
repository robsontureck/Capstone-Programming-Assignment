const express = require("express");
const router = express.Router();
const Workout = require("../models/workout");
const authenticateToken = require("../middleware/auth");

router.post("/workouts", authenticateToken, async (req, res) => {
  const { type, duration, date } = req.body;
  try {
    const workout = await Workout.create({
      type,
      duration,
      date,
      user_id: req.user.id,
    });
    res.json(workout);
  } catch (error) {
    console.error("Failed to create workout:", error);
    res
      .status(500)
      .json({ error: "An error occurred while saving workout entry." });
  }
});

router.get("/workouts", authenticateToken, async (req, res) => {
  try {
    const workouts = await Workout.findAll({ where: { user_id: req.user.id } });
    res.json(workouts);
  } catch (error) {
    console.error("Failed to get workout:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching workout entries." });
  }
});

router.put("/workouts/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { type, duration, date } = req.body;
  try {
    const workout = await Workout.findByPk(id);
    if (!workout || workout.userId !== req.user.id) {
      return res.status(404).json({ error: "Workout entry not found." });
    }
    workout.type = type;
    workout.duration = duration;
    workout.date = date;
    await workout.save();
    res.json(workout);
  } catch (error) {
    console.error("Failed to edit workout:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating workout entry." });
  }
});

router.delete("/workouts/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const workout = await Workout.findByPk(id);
    if (!workout || workout.userId !== req.user.id) {
      return res.status(404).json({ error: "Workout entry not found." });
    }
    await workout.destroy();
    res.json({ message: "Workout entry deleted." });
  } catch (error) {
    console.error("Failed to delete workout:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting workout entry." });
  }
});

module.exports = router;
