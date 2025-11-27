const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
// PERBAIKAN: Import 'authenticateToken' bukan 'addUserData'
const { authenticateToken, isAdmin } = require('../middleware/permissionMiddleware');

// Gunakan authenticateToken untuk memastikan user login, lalu isAdmin untuk memastikan dia admin
router.get('/daily', [authenticateToken, isAdmin], reportController.getDailyReport);

module.exports = router;