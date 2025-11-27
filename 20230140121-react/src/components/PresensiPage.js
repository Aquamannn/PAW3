import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { jwtDecode } from "jwt-decode"; // Pastikan import ini ada

// --- FIX ICON LEAFLET ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function PresensiPage() {
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState(""); // 'success' atau 'error'
  const [coords, setCoords] = useState(null);
  const [user, setUser] = useState({ nama: "Pengguna" });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Ambil Token
  const getToken = () => localStorage.getItem("token");

  // 1. JAM DIGITAL (Real-time Clock)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. AMBIL NAMA USER DARI TOKEN & LOKASI
  useEffect(() => {
    // Decode Token untuk ambil nama
    const token = getToken();
    if (token) {
        try {
            const decoded = jwtDecode(token);
            setUser(decoded);
        } catch (e) { console.error("Token invalid"); }
    }

    // Ambil Lokasi
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          setMsgType("error");
          setMessage("Gagal mendapatkan lokasi: " + err.message);
        }
      );
    } else {
        setMsgType("error");
        setMessage("Geolocation tidak didukung browser ini.");
    }
  }, []);

  // Format Jam: HH:mm:ss
  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Format Tanggal: Senin, 20 November 2025
  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleCheckIn = async () => {
    setMessage(""); setMsgType("");
    
    if (!coords) {
      setMsgType("error");
      setMessage("Lokasi belum ditemukan. Tunggu sebentar atau izinkan akses lokasi.");
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${getToken()}` } };
      
      const response = await axios.post("http://localhost:3001/api/presensi/check-in", {
        latitude: coords.lat,
        longitude: coords.lng
      }, config);
      
      setMsgType("success");
      // Backend kamu sudah mengembalikan pesan "Halo [Nama], check-in berhasil..."
      // Kita pakai pesan itu, atau buat sendiri agar lebih custom
      setMessage(response.data.message || `Halo ${user.nama}, Check-in Berhasil pada ${formatTime(new Date())}!`);
    } catch (err) {
      setMsgType("error");
      setMessage(err.response ? err.response.data.message : "Check-in gagal");
    }
  };

  const handleCheckOut = async () => {
    setMessage(""); setMsgType("");
    try {
      const config = { headers: { Authorization: `Bearer ${getToken()}` } };
      const response = await axios.post("http://localhost:3001/api/presensi/check-out", {}, config);
      
      setMsgType("success");
      setMessage(response.data.message || `Sampai Jumpa ${user.nama}, Check-out Berhasil!`);
    } catch (err) {
      setMsgType("error");
      setMessage(err.response ? err.response.data.message : "Check-out gagal");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        
        {/* HEADER: Sapaan & Jam */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
                <h1 className="text-2xl font-bold text-gray-800">Halo, {user.nama || 'User'}! 👋</h1>
                <p className="text-gray-500">Jangan lupa absen hari ini ya.</p>
            </div>
            <div className="text-center md:text-right">
                <div className="text-4xl font-mono font-bold text-blue-600 tracking-wider">
                    {formatTime(currentTime)}
                </div>
                <div className="text-sm text-gray-400 font-medium">
                    {formatDate(currentTime)}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* KOLOM KIRI: Peta (Lebih Besar) */}
            <div className="lg:col-span-2">
                <div className="bg-white p-2 rounded-2xl shadow-lg h-full">
                    {coords ? (
                        <MapContainer 
                            center={[coords.lat, coords.lng]} 
                            zoom={16} 
                            style={{ height: '500px', width: '100%', borderRadius: '12px' }} // PETA GEDE
                            scrollWheelZoom={false}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; OpenStreetMap'
                            />
                            <Marker position={[coords.lat, coords.lng]}>
                                <Popup>
                                    <div className="text-center">
                                        <b>Posisi Kamu</b><br/>
                                        {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                                    </div>
                                </Popup>
                            </Marker>
                        </MapContainer>
                    ) : (
                        <div className="h-[500px] bg-gray-100 rounded-xl flex flex-col items-center justify-center animate-pulse">
                            <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            <span className="text-gray-500 font-medium">Sedang melacak satelit GPS...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* KOLOM KANAN: Tombol & Status */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-full justify-center">
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-6 text-center border-b pb-4">
                        Panel Kontrol
                    </h3>

                    {/* Pesan Status (Animasi Masuk) */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-xl text-center shadow-sm transition-all duration-300 transform scale-100 ${
                            msgType === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                            <p className="font-bold text-lg">
                                {msgType === 'success' ? 'Sukses!' : 'Oops!'}
                            </p>
                            <p>{message}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <button 
                            onClick={handleCheckIn} 
                            className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:from-green-600 hover:to-green-700 transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                            CHECK-IN SEKARANG
                        </button>

                        <button 
                            onClick={handleCheckOut} 
                            className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl shadow-lg hover:from-red-600 hover:to-red-700 transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            CHECK-OUT PULANG
                        </button>
                    </div>

                    <div className="mt-8 text-center text-xs text-gray-400">
                        Lokasi Anda: {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : '-'}
                    </div>

                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

export default PresensiPage;