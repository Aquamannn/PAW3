const jwt = require("jsonwebtoken");

// GANTI BAGIAN INI:
// Pastikan string ini SAMA PERSIS dengan yang ada di authController.js nanti
const JWT_SECRET = 'TNT_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN';

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (token == null) {
    return res.status(401).json({ message: "Akses ditolak. Token tidak disediakan." });
  }

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid atau kedaluwarsa." });
    }
    req.user = userPayload; // Simpan data user (id, nama, role) ke request
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Akses ditolak. Hanya untuk admin." });
  }
};