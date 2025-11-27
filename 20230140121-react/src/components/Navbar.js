import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // Library pembaca token

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (e) { console.log("Token error"); }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <div className="font-bold">Sistem Presensi</div>
      <div className="space-x-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/presensi">Presensi</Link>
        {/* Menu Khusus Admin [cite: 139] */}
        {user && user.role === 'admin' && <Link to="/laporan" className="text-yellow-300">Laporan</Link>}
        <button onClick={logout} className="bg-red-500 px-2 rounded">Logout</button>
      </div>
    </nav>
  );
}
export default Navbar;