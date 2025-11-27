import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Navbar from './Navbar'; // <-- PENTING: Import Navbar di sini

function DashboardPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Cek apakah ada token saat halaman dimuat
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Jika tidak ada token, tendang ke login
    } else {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Token invalid", error);
        navigate('/login');
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 1. TAMPILKAN NAVBAR DI SINI */}
      <Navbar />

      <div className="container mx-auto py-10 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Dashboard Utama
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Selamat Datang, <span className="font-bold text-blue-600">{user ? user.nama : 'Pengguna'}</span>!
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-blue-700">
              Silakan gunakan <strong>Menu di Atas (Navbar)</strong> untuk mengakses fitur:
            </p>
            <ul className="list-disc list-inside mt-2 text-blue-800">
              <li><strong>Presensi:</strong> Untuk melakukan Check-In dan Check-Out.</li>
              <li><strong>Laporan:</strong> (Khusus Admin) Untuk melihat rekap kehadiran.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;