const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./index");

const User = sequelize.define(
  "User",
  {
    username: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    age: { type: DataTypes.INTEGER },
    weight: { type: DataTypes.FLOAT },
    calories: { type: DataTypes.FLOAT },
  },
  { timestamps: false }
);

module.exports = User;
