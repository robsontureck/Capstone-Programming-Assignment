const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("fitness_tracker", "root", "admin", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error: " + err));

module.exports = sequelize;
