const presensiRecords = require("../data/presensiData");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

exports.CheckIn = ( req , res ) => {
  const { id: userId, nama: userName } = req.user;
  const waktuSekarang = new Date();
  
  // Cek apakah user sudah pernah check-in dan belum check-out
  const existingRecord = presensiRecords.find(
    ( record ) => record.userId === userId && record.checkOut === null
  );

  if (existingRecord) {
    // Kasus: check-in dilakukan lebih dari 1 kali (belum check-out)
    return res
      .status(400)
      .json({ message: "Anda sudah melakukan check-in hari ini." });
  }

  const newRecord = {
    userId,
    nama: userName,
    checkIn: waktuSekarang,
    checkOut: null, // Masih null karena baru check-in
  };

  presensiRecords.push(newRecord);

  const formattedData = {
    ...newRecord,
    checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
  };

  console.log(`DATA TERUPDATE: Karyawan ${userName} (ID: ${userId}) melakukan check-in.`);
  
  // Kasus: presensi/check-in berhasil
  res.status(201).json({
    message: `Halo ${userName}, check-in Anda berhasil pada pukul ${format(
      waktuSekarang,
      "HH:mm:ss",
      { timeZone }
    )} WIB`,
    data: formattedData,
  });
};

exports.CheckOut = ( req , res ) => {
  const { id: userId, nama: userName } = req.user;
  const waktuSekarang = new Date();

  // Cari catatan check-in yang aktif (checkOut: null)
  const recordToUpdate = presensiRecords.find(
    ( record ) => record.userId === userId && record.checkOut === null
  );

  if (!recordToUpdate) {
    // Kasus: presensi/check-out jika belum melakukan check-in
    return res.status(404).json({
      message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
    });
  }

  recordToUpdate.checkOut = waktuSekarang; // Update waktu check-out

  const formattedData = {
    ...recordToUpdate,
    checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
    checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
  };

  console.log(`DATA TERUPDATE: Karyawan ${userName} (ID: ${userId}) melakukan check-out.`);
  
  // Kasus: presensi/check-out berhasil
  res.json({
    message: `Selamat jalan ${userName}, check-out Anda berhasil pada pukul ${format(
      waktuSekarang,
      "HH:mm:ss",
      { timeZone }
    )} WIB`,
    data: formattedData,
  });
};
// controllers/presensiController.js (Tambahkan di bagian akhir)

exports.getAllRecords = (req, res) => {
    console.log("Controller: Mengambil semua data presensi untuk tampilan publik.");
    res.json({
        totalRecords: presensiRecords.length,
        data: presensiRecords,
    });
};