import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Tambah Link untuk navigasi ke login

function RegisterPage() {
  // State untuk menyimpan input pengguna
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    role: 'mahasiswa' // Default role
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle perubahan input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Mengirim data ke backend sesuai instruksi tugas
      await axios.post('http://localhost:3001/api/auth/register', formData);
      
      // Jika sukses, arahkan ke halaman login
      alert('Registrasi Berhasil! Silakan Login.');
      navigate('/login');
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Registrasi gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Register Akun
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Nama */}
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama Lengkap:</label>
            <input
              id="nama"
              type="text"
              value={formData.nama}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Input Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Input Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Input Role (Select Option) */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role:</label>
            <select
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="mahasiswa">Mahasiswa</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Tombol Register */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 transition duration-200"
          >
            Daftar Sekarang
          </button>
        </form>

        {/* Link ke Login */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Sudah punya akun? <Link to="/login" className="text-blue-600 hover:underline">Login disini</Link>
        </p>

        {error && (
          <p className="text-red-600 text-sm mt-4 text-center bg-red-100 p-2 rounded">{error}</p>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;