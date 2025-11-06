const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { addUserData } = require('../middleware/permissionMiddleware');

// Router-level middleware: addUserData akan dijalankan untuk semua rute di router ini
router.use(addUserData); 

router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);
// ... kode router sebelumnya
router.delete('/:id', presensiController.deletePresensi);
// ...
// Rute GET publik untuk melihat semua data di browser
router.get('/', presensiController.getAllRecords);
// ... kode router sebelumnya
router.put("/:id", presensiController.updatePresensi);
router.delete("/:id", presensiController.deletePresensi);
// ...

module.exports = router;