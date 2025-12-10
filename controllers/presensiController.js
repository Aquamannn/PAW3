const { Presensi, User } = require("../models");
// --- TAMBAHAN MODUL 10: Import Multer & Path ---
const multer = require('multer');
const path = require('path');

// =========================================================================
// KONFIGURASI UPLOAD FOTO (MULTER) - MODUL 10
// =========================================================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Simpan di folder 'uploads'
    },
    filename: (req, file, cb) => {
        // Format nama file: userId-timestamp.extensi
        // Contoh: 1-1709889999.jpg
        cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Filter agar hanya menerima gambar
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
    }
};

// Export middleware upload ini untuk dipakai di Router
exports.upload = multer({ storage: storage, fileFilter: fileFilter });

// =========================================================================
// FUNCTION: CHECK-IN (Geolocation + Selfie)
// =========================================================================
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.body; 
    
    // --- TAMBAHAN MODUL 10: Ambil Path Foto ---
    // Jika ada file diupload, ambil path-nya. Jika tidak, null.
    const buktiFoto = req.file ? req.file.path : null;

    const existingPresensi = await Presensi.findOne({
      where: { userId: userId, checkOut: null }
    });

    if (existingPresensi) {
      return res.status(400).json({ message: "Anda sudah check-in hari ini." });
    }

    await Presensi.create({
      userId: userId,
      checkIn: new Date(),
      latitude: latitude,
      longitude: longitude,
      // --- TAMBAHAN MODUL 10: Simpan Path Foto ke Database ---
      buktiFoto: buktiFoto 
    });

    res.status(200).json({ message: "Check-in berhasil (Lokasi & Foto tercatat)!" });
  } catch (error) {
    console.error(error);
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
      where: { userId: userId, checkOut: null },
      order: [['checkIn', 'DESC']]
    });

    if (!presensi) {
      return res.status(404).json({ message: "Belum check-in." });
    }

    presensi.checkOut = now;
    await presensi.save();

    res.status(200).json({ message: "Check-out berhasil" });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

// =========================================================================
// FUNCTION: GET ALL RECORDS (Laporan)
// =========================================================================
exports.getAllRecords = async (req, res) => {
    try {
        const records = await Presensi.findAll({
            // Pastikan pakai 'as: user' agar frontend bisa baca nama
            include: [{ 
                model: User, 
                as: 'user', 
                attributes: ['nama', 'email'] 
            }],
            order: [['checkIn', 'DESC']]
        });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: "Gagal ambil data", error: error.message });
    }
};

// ... (Fungsi deletePresensi dan updatePresensi bisa dibiarkan sama seperti sebelumnya) ...
exports.deletePresensi = async (req, res) => {
    // Kode delete sama seperti sebelumnya
    try {
        const { id } = req.params;
        await Presensi.destroy({ where: { id } });
        res.status(200).json({ message: "Data dihapus" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updatePresensi = async (req, res) => {
    // Kode update sama seperti sebelumnya
};