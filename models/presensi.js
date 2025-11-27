'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Presensi extends Model {
    static associate(models) {
      // PERBAIKAN: Tambahkan alias 'as: "user"' sesuai modul
      Presensi.belongsTo(models.User, { 
        foreignKey: 'userId',
        as: 'user' // <--- INI YANG KURANG TADI
      });
    }
  }
  
  Presensi.init({
    userId: { type: DataTypes.INTEGER, allowNull: false },
    checkIn: { type: DataTypes.DATE, allowNull: false },
    checkOut: { type: DataTypes.DATE, allowNull: true },

    // --- TAMBAHAN MODUL 9 (SUDAH BENAR) ---
    latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: true },
    longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: true }
    // --------------------------------------
  
  }, {
    sequelize,
    modelName: 'Presensi',
  });
  
  return Presensi;
};