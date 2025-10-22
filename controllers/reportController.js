const presensiRecords = require("../data/presensiData");

exports.getDailyReport = ( req , res ) => {
  console.log("Controller: Mengambil data laporan harian dari array...");
  
  // Kasus: reports/daily berhasil (hanya admin yang bisa akses)
  res.json({
    reportDate: new Date().toLocaleDateString(),
    data: presensiRecords, // Menampilkan semua data presensi
  });
};