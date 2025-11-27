import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import PresensiPage from './components/PresensiPage';
import ReportPage from './components/ReportPage'; // <--- PENTING 1: Import file ini

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/presensi" element={<PresensiPage />} />
        
        {/* --- PENTING 2: Daftarkan Rute Laporan di sini --- */}
        <Route path="/laporan" element={<ReportPage />} />
        {/* ------------------------------------------------- */}
        
      </Routes>
    </Router>
  );
}

export default App;