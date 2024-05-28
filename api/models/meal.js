const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./index");
const User = require("./user");

const Meal = sequelize.define(
  "Meal",
  {
    meal_type: {
      type: DataTypes.ENUM("Breakfast", "Lunch", "Dinner"),
      allowNull: false,
    },
    meal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    calories: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

User.hasMany(Meal, { foreignKey: "user_id" });
Meal.belongsTo(User, { foreignKey: "user_id" });

module.exports = Meal;
