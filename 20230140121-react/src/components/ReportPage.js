import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const fetchReports = async (query = "") => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      
      const url = query 
        ? `http://localhost:3001/api/reports/daily?nama=${query}` 
        : "http://localhost:3001/api/reports/daily";

      const response = await axios.get(url, config);
      setReports(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 403) {
        setError("Akses Ditolak: Halaman ini khusus Admin.");
      } else {
        setError("Gagal mengambil data laporan.");
      }
    }
  };

  useEffect(() => {
    fetchReports();
  }, [navigate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(searchTerm);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Laporan Presensi Harian
        </h1>

        <form onSubmit={handleSearchSubmit} className="mb-6 flex space-x-2">
            <input
                type="text"
                placeholder="Cari berdasarkan nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
                type="submit"
                className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700"
            >
                Cari
            </button>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama User
                </th>
                {/* --- TAMBAHAN MODUL 10: Header Kolom Foto --- */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bukti Foto
                </th>
                {/* ------------------------------------------- */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu Check-In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu Check-Out
                </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.length > 0 ? (
                reports.map((presensi) => (
                  <tr key={presensi.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {presensi.user ? presensi.user.nama : "Nama tidak ditemukan"}
                    </td>
                    
                    {/* --- TAMBAHAN MODUL 10: Isi Kolom Foto --- */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {presensi.buktiFoto ? (
                        <a 
                          href={`http://localhost:3001/${presensi.buktiFoto}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="Klik untuk memperbesar"
                        >
                          <img 
                            src={`http://localhost:3001/${presensi.buktiFoto}`} 
                            alt="Selfie" 
                            className="h-12 w-12 rounded-full object-cover border-2 border-gray-200 hover:border-blue-500 transition-colors"
                          />
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Tidak ada foto</span>
                      )}
                    </td>
                    {/* ---------------------------------------- */}

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(presensi.checkIn).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presensi.checkOut 
                        ? new Date(presensi.checkOut).toLocaleString() 
                        : "-"}
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presensi.checkOut ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Selesai</span>
                      ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Belum Checkout</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    Belum ada data presensi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReportPage;