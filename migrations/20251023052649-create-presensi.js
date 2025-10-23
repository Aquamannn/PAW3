// migrations/...-create-presensi.js
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Presensis', {
      id: {
        allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
      },
      userId: { type: Sequelize.INTEGER, allowNull: false },
      nama: { type: Sequelize.STRING, allowNull: false },
      checkIn: { allowNull: false, type: Sequelize.DATE },
      checkOut: { allowNull: true, type: Sequelize.DATE }, // checkOut bisa kosong
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Presensis');
  }
};