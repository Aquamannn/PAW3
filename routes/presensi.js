const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
// Import middleware token
const { authenticateToken } = require('../middleware/permissionMiddleware');

// 1. Pasang satpam (Token) untuk semua route di bawah ini
router.use(authenticateToken); 

// 2. ROUTE CHECK-IN (YANG BENAR)
// Urutannya: Cek Token -> Proses Upload Gambar -> Masuk ke Controller
router.post('/check-in', 
    presensiController.upload.single('image'), // <--- WAJIB ADA INI
    presensiController.checkIn
);

// 3. Route Lainnya
router.post('/check-out', presensiController.checkOut);
router.get('/', presensiController.getAllRecords);
router.put("/:id", presensiController.updatePresensi);
router.delete("/:id", presensiController.deletePresensi);

module.exports = router;