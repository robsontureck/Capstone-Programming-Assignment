"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "name", { type: Sequelize.STRING });
    await queryInterface.addColumn("Users", "age", { type: Sequelize.INTEGER });
    await queryInterface.addColumn("Users", "weight", {
      type: Sequelize.FLOAT,
    });
    await queryInterface.addColumn("Users", "calories", {
      type: Sequelize.FLOAT,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "name");
    await queryInterface.removeColumn("Users", "age");
    await queryInterface.removeColumn("Users", "weight");
    await queryInterface.removeColumn("Users", "calories");
  },
};
