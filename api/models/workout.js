const { DataTypes } = require("sequelize");
const sequelize = require("./index");
const User = require("./user");

const Workout = sequelize.define("Workout", {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER, // Duration in minutes
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
});

User.hasMany(Workout, { foreignKey: "user_id" });
Workout.belongsTo(User, { foreignKey: "user_id" });

module.exports = Workout;
