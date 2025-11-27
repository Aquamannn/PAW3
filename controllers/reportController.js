const { Presensi, User } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama } = req.query;

    let queryOptions = {
      include: [
        {
          model: User,
          as: 'user', // <--- PENTING: Tambahan dari kode Asdos (sesuai Model)
          attributes: ['nama', 'email'], 
          where: nama ? { nama: { [Op.like]: `%${nama}%` } } : undefined
        }
      ],
      order: [['checkIn', 'DESC']] // <--- PENTING: Tambahan dari kode Kamu (biar urut)
    };

    const records = await Presensi.findAll(queryOptions);

    // Kirim Array langsung agar cocok dengan Frontend React kamu
    res.json(records);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil laporan", error: error.message });
  }
};