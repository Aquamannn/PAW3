// routes/books.js
const express = require('express');
const router = express.Router();

// Contoh rute dummy agar server tidak error
router.get('/', (req, res) => {
    res.json({ message: "Books API is running!" });
});

module.exports = router;