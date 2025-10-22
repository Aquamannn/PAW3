const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;
const morgan = require("morgan");

// Impor router
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const ruteBuku = require("./routes/books"); // Rute dari modul sebelumnya (asumsi ada)

// Application-level Middleware (Third-party)
app.use(cors()); // Mengizinkan CORS (Cross-Origin Resource Sharing)
app.use(express.json()); // Built-in: parsing body JSON
// app.use(helmet()); // Middleware keamanan (tidak diaktifkan di sini untuk kesederhanaan, tapi bagus untuk digunakan)
app.use(morgan("dev")); // Third-party: logging HTTP requests

// Application-level Middleware (Custom)
app.use(( req , res , next ) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Root Route
app.get("/", ( req , res ) => {
  res.send("Home Page for API");
});

// Hubungkan Router dengan base path
app.use("/api/books", ruteBuku); // Rute lama
app.use("/api/presensi", presensiRoutes); // Rute Presensi
app.use("/api/reports", reportRoutes); // Rute Laporan

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});