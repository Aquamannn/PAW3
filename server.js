const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;
const morgan = require("morgan");

// --- TAMBAHAN PENTING: Import Database ---
const db = require("./models"); 
// -----------------------------------------

// Impor router
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
// const ruteBuku = require("./routes/books"); // Matikan dulu jika file ini error/tidak ada
const authRoutes = require("./routes/auth");

// Application-level Middleware
app.use(cors()); 
app.use(express.json()); 
app.use(morgan("dev")); 

// Custom Logger
app.use(( req , res , next ) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Root Route
app.get("/", ( req , res ) => {
  res.send("Home Page for API");
});

// Hubungkan Router
app.use('/api/auth', authRoutes);
// app.use("/api/books", ruteBuku); 
app.use("/api/presensi", presensiRoutes); 
app.use("/api/reports", reportRoutes); 


// --- BAGIAN INI DIUBAH AGAR MEMBUAT TABEL OTOMATIS ---
db.sequelize.sync({ alter: true }) // 'alter: true' menyesuaikan tabel tanpa hapus data user
  .then(() => {
    console.log("Database synced! Tabel Presensi berhasil dibuat ulang.");
    
    // Jalankan server hanya setelah database siap
    app.listen(PORT, () => {
      console.log(`Express server running at http://localhost:${PORT}/`);
    });
  })
  .catch((err) => {
    console.error("Gagal sinkronisasi database:", err);
  });
// -----------------------------------------------------