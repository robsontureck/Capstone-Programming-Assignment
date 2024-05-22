const sequelize = require("./models/index");
const User = require("./models/user");
const Meal = require("./models/meal");

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Synchronize the models
    await sequelize.sync({ force: true }); // Use { force: true } to drop and recreate tables
    console.log("Database synchronized.");

    // Optionally, add some initial data here
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
};

syncDatabase();
