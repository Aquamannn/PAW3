// PERBAIKAN 1: Wajib import 'User' untuk relasi
const { Presensi, User } = require("../models"); 

// =========================================================================
// FUNCTION: CHECK-IN (Dengan Geolocation)
// =========================================================================
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    // Ambil latitude & longitude dari kiriman Frontend
    const { latitude, longitude } = req.body; 

    // Cek double check-in
    const existingPresensi = await Presensi.findOne({
      where: { userId: userId, checkOut: null }
    });

    if (existingPresensi) {
      return res.status(400).json({ message: "Anda sudah check-in hari ini." });
    }

    // Simpan ke database beserta lokasinya
    await Presensi.create({
      userId: userId,
      checkIn: new Date(),
      status: 'hadir',
      latitude: latitude,   // Simpan Latitude
      longitude: longitude  // Simpan Longitude
    });

    res.status(200).json({ message: "Check-in berhasil!" });
  } catch (error) {
    res.status(500).json({ message: "Error server", error: error.message });
  }
};

// =========================================================================
// FUNCTION: CHECK-OUT
// =========================================================================
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    const presensi = await Presensi.findOne({
      where: {
        userId: userId,
        checkOut: null 
      },
      order: [['checkIn', 'DESC']]
    });

    if (!presensi) {
      return res.status(404).json({ message: "Belum check-in atau sudah check-out." });
    }

    presensi.checkOut = now;
    await presensi.save();

    res.status(200).json({ message: "Check-out berhasil" });

  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// =========================================================================
// FUNCTION: GET ALL RECORDS (Untuk Halaman Laporan)
// =========================================================================
exports.getAllRecords = async (req, res) => {
    try {
        // PERBAIKAN 2: Gunakan 'include' untuk mengambil Nama dari tabel User
        const presensiRecords = await Presensi.findAll({
            include: [{
                model: User,
                attributes: ['nama', 'email'] // Ambil nama & email user
            }]
        });
        
        res.json({
            totalRecords: presensiRecords.length,
            data: presensiRecords,
        });
    } catch (error) {
        console.error("Error getAllRecords:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data", error: error.message });
    }
};

// =========================================================================
// FUNCTION: DELETE PRESENSI
// =========================================================================
exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const presensiId = req.params.id;
    const recordToDelete = await Presensi.findByPk(presensiId);

    if (!recordToDelete) {
      return res.status(404).json({ message: "Catatan tidak ditemukan." });
    }

    // Hanya pemilik atau admin yang bisa hapus (Logic disederhanakan)
    if (recordToDelete.userId !== userId) { 
        // Note: Idealnya Admin boleh hapus punya siapa saja, tapi ini logic dasar
        // return res.status(403).json({ message: "Bukan milik Anda." });
    }

    await recordToDelete.destroy();
    res.status(200).json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Error server", error: error.message });
  }
};

// =========================================================================
// FUNCTION: UPDATE PRESENSI
// =========================================================================
exports.updatePresensi = async (req, res) => {
  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut } = req.body; // PERBAIKAN 3: Hapus 'nama' dari sini

    const recordToUpdate = await Presensi.findByPk(presensiId);

    if (!recordToUpdate) {
      return res.status(404).json({ message: "Catatan tidak ditemukan." });
    }

    recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
    recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;
    // recordToUpdate.nama = nama; <-- INI DIHAPUS KARENA KOLOMNYA SUDAH HILANG

    await recordToUpdate.save();

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: recordToUpdate,
    });
  } catch (error) {
    res.status(500).json({ message: "Error server", error: error.message });
  }
};