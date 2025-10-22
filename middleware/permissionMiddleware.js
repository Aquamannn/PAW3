// Middleware untuk menambahkan data user dummy
exports.addUserData = (req, res, next) => {
  console.log('Middleware: Menambahkan data user dummy...');
  req.user = {
    id: 123,
    nama: 'User Karyawan', // Set default user sebagai Karyawan
    role: 'admin'
  };
  next();
};

// Middleware untuk mengecek izin admin
exports.isAdmin = (req, res, next) => {
  // Ubah role menjadi 'admin' di sini untuk testing admin
  // Misalnya: req.user.role = 'admin'; 
  
  if (req.user && req.user.role === 'admin') {
    console.log('Middleware: Izin admin diberikan.');
    next();
  } else {
    console.log('Middleware: Gagal! Pengguna bukan admin.');
    // Set response 403 Forbidden jika bukan admin
    return res.status(403).json({ message: 'Akses ditolak: Hanya untuk admin'});
  }
};