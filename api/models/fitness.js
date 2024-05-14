const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./index");
const User = require("./user");

const Fitness = sequelize.define(
  "Fitness",
  {
    workout: { type: DataTypes.STRING },
    meal: { type: DataTypes.STRING },
    date: { type: DataTypes.DATE },
    userId: { type: DataTypes.INTEGER, references: { model: User, key: "id" } },
  },
  { timestamps: false }
);

User.hasMany(Fitness);
Fitness.belongsTo(User);

module.exports = Fitness;
