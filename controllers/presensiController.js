// controllers/presensiController.js

const { Presensi } = require("../models"); // Import model Presensi dari Sequelize
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

// =========================================================================
// FUNCTION: CHECK-IN (POST /api/presensi/check-in)
// =========================================================================

exports.CheckIn = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    // 1. Cari data menggunakan 'findOne' dari Sequelize untuk cek duplikasi
    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (existingRecord) {
      return res
        .status(400)
        .json({ message: "Anda sudah melakukan check-in hari ini." });
    }

    // 2. Buat data baru menggunakan 'create' dari Sequelize
    const newRecord = await Presensi.create({
      userId: userId,
      nama: userName,
      checkIn: waktuSekarang,
    });

    // Data yang dikirim ke response
    const formattedData = {
      userId: newRecord.userId,
      nama: newRecord.nama,
      checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: null
    };

    console.log(`DATA TERUPDATE: Karyawan ${userName} (ID: ${userId}) melakukan check-in ke database.`);

    res.status(201).json({
      message: `Halo ${userName}, check-in Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error CheckIn:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// =========================================================================
// FUNCTION: CHECK-OUT (POST /api/presensi/check-out)
// =========================================================================

exports.CheckOut = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    // 3. Cari catatan check-in yang aktif (checkOut: null) di database
    const recordToUpdate = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
      });
    }

    // 4. Update dan simpan perubahan ke database
    recordToUpdate.checkOut = waktuSekarang;
    await recordToUpdate.save();

    // Data yang dikirim ke response
    const formattedData = {
      userId: recordToUpdate.userId,
      nama: recordToUpdate.nama,
      checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
    };

    console.log(`DATA TERUPDATE: Karyawan ${userName} (ID: ${userId}) melakukan check-out.`);

    res.json({
      message: `Selamat jalan ${userName}, check-out Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error CheckOut:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// =========================================================================
// FUNCTION: GET ALL RECORDS (GET /api/presensi) - (Fungsi Tambahan untuk Tampilan Publik)
// =========================================================================

exports.getAllRecords = async (req, res) => {
    try {
        // Mengambil semua data dari database
        const presensiRecords = await Presensi.findAll(); 
        console.log("Controller: Mengambil semua data presensi untuk tampilan publik dari database.");
        res.json({
            totalRecords: presensiRecords.length,
            data: presensiRecords,
        });
    } catch (error) {
        console.error("Error getAllRecords:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data", error: error.message });
    }
};