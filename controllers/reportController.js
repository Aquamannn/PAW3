const { Presensi } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama } = req.query; // Ambil parameter 'nama'
    let options = { where: {} };

    if (nama) { // Jika parameter 'nama' ada
      options.where.nama = {
        [Op.like]: `%${nama}%`, // Filter berdasarkan nama (like)
      };
    }

    const records = await Presensi.findAll(options);

    res.json({
      reportDate: new Date().toLocaleDateString(),
      data: records,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil laporan", error: error.message });
  }
};