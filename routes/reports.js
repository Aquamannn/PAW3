const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { addUserData, isAdmin } = require('../middleware/permissionMiddleware');

// Menerapkan multiple middleware (addUserData dan isAdmin) dalam bentuk array
router.get('/daily', [addUserData, isAdmin], reportController.getDailyReport);

module.exports = router;