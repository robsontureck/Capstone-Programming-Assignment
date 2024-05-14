const express = require("express");
const Fitness = require("../models/fitness");
const router = express.Router();
const authenticateToken = require("../middleware/auth");

router.use(authenticateToken);

router.get("/", async (req, res) => {
  const fitness = await Fitness.findAll({ where: { userId: req.user.id } });
  res.json(fitness);
});

router.post("/", async (req, res) => {
  const { workout, meal, date } = req.body;
  const fitness = await Fitness.create({
    workout,
    meal,
    date,
    userId: req.user.id,
  });
  res.json(fitness);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { workout, meal, date } = req.body;
  const fitness = await Fitness.update(
    { workout, meal, date },
    { where: { id, userId: req.user.id } }
  );
  res.json(fitness);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Fitness.destroy({ where: { id, userId: req.user.id } });
  res.json({ message: "Fitness entry deleted" });
});

module.exports = router;
