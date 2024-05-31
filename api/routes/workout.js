const express = require("express");
const router = express.Router();
const Workout = require("../models/workout");
const authenticateToken = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Workouts
 *   description: API to manage workouts.
 */
/**
 * @swagger
 * /api/workouts/workouts:
 *   get:
 *     summary: Get all workouts for the authenticated user
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of workouts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   type:
 *                     type: string
 *                   duration:
 *                     type: integer
 *                   date:
 *                     type: string
 *                     format: date
 *                   user_id:
 *                     type: integer
 *       500:
 *         description: An error occurred while fetching workout entries
 */
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
/**
 * @swagger
 * /api/workouts/workouts:
 *   post:
 *     summary: Add a new workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               duration:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: The workout was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 type:
 *                   type: string
 *                 duration:
 *                   type: integer
 *                 date:
 *                   type: string
 *                 user_id:
 *                   type: integer
 *       500:
 *         description: An error occurred while saving workout entry
 */
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

/**
 * @swagger
 * /api/workouts/workouts/{id}:
 *   put:
 *     summary: Update a workout entry
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The workout entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               duration:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: The workout entry was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 type:
 *                   type: string
 *                 duration:
 *                   type: integer
 *                 date:
 *                   type: string
 *                 user_id:
 *                   type: integer
 *       404:
 *         description: Workout entry not found
 *       500:
 *         description: An error occurred while updating workout entry
 */
router.put("/workouts/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { type, duration, date } = req.body;
  console.log(
    `Updating with type: ${type}, duration: ${duration}, date: ${date}`
  );
  try {
    const workout = await Workout.findByPk(id);
    if (!workout || workout.user_id !== req.user.id) {
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

/**
 * @swagger
 * /api/workouts/workouts/{id}:
 *   delete:
 *     summary: Delete a workout entry
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The workout entry ID
 *     responses:
 *       200:
 *         description: The workout entry was successfully deleted
 *       404:
 *         description: Workout entry not found
 *       500:
 *         description: An error occurred while deleting workout entry
 */
router.delete("/workouts/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  console.log("Received ID for deletion:", id); // Log received ID
  try {
    const workout = await Workout.findByPk(id);
    console.log("Workout found:", workout); // Log found workout
    if (!workout || workout.user_id !== req.user.id) {
      console.log(
        `Access denied or not found. Workout: ${workout}, User ID: ${req.user.id}`
      ); // Detailed log for failing condition
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
