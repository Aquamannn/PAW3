const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
// PERBAIKAN 1: Import 'authenticateToken', bukan 'addUserData'
const { authenticateToken } = require('../middleware/permissionMiddleware');

// PERBAIKAN 2: Gunakan middleware token ini untuk memproteksi route presensi
// Middleware ini akan memastikan req.user terisi data dari token
router.use(authenticateToken); 

// PERBAIKAN 3: Sesuaikan nama fungsi controller (checkIn & checkOut huruf kecil)
// sesuai dengan yang kita buat di presensiController.js sebelumnya
router.post('/check-in', presensiController.checkIn);
router.post('/check-out', presensiController.checkOut);

// Route lainnya
router.get('/', presensiController.getAllRecords); // Ini sekarang terproteksi token juga
router.put("/:id", presensiController.updatePresensi);
router.delete("/:id", presensiController.deletePresensi);

module.exports = router;