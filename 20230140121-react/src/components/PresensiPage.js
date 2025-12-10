import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { jwtDecode } from "jwt-decode";
import Webcam from 'react-webcam';

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
  
  // State untuk Jam Digital
  const [currentTime, setCurrentTime] = useState(new Date());

  // State Kamera
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);

  const getToken = () => localStorage.getItem("token");

  // --- 1. EFEK JAM DIGITAL BERJALAN ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Jam: 14:05:30 WIB
  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { 
        hour: '2-digit', minute: '2-digit', second: '2-digit' 
    }).replace('.', ':') + " WIB";
  };

  // Format Tanggal: Rabu, 10 Desember 2025
  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  useEffect(() => {
    const token = getToken();
    if (token) {
        try { const decoded = jwtDecode(token); setUser(decoded); } 
        catch (e) {}
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => {
            setMsgType("error");
            setMessage("Gagal mendapatkan lokasi GPS: " + err.message);
        }
      );
    } else {
        setMessage("Browser tidak mendukung Geolocation.");
    }
  }, []);

  const handleCheckIn = async () => {
    setMessage(""); setMsgType("");
    
    if (!coords || !image) {
      setMsgType("error");
      setMessage("⚠️ Wajib ambil Selfie & aktifkan GPS!");
      return;
    }

    try {
      const blob = await (await fetch(image)).blob();
      const formData = new FormData();
      formData.append('latitude', coords.lat);
      formData.append('longitude', coords.lng);
      formData.append('image', blob, 'selfie.jpg');

      const config = { 
        headers: { 
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'multipart/form-data'
        } 
      };
      
      const response = await axios.post("http://localhost:3001/api/presensi/check-in", formData, config);
      
      setMsgType("success");
      setMessage(response.data.message || `Halo ${user.nama}, Absen Masuk Berhasil!`);
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
        setMessage(response.data.message || "Hati-hati di jalan, Check-out berhasil!");
    } catch (err) {
        setMsgType("error");
        setMessage("Gagal Check-out");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-10">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        
        {/* --- HEADER CARD (Sapaan & Waktu) --- */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-col md:flex-row justify-between items-center border-l-4 border-blue-600">
            <div className="mb-4 md:mb-0">
                <h1 className="text-3xl font-bold text-gray-800">Halo, {user.nama || 'User'}! 👋</h1>
                <p className="text-gray-500 mt-1">Siap untuk produktif hari ini?</p>
            </div>
            <div className="text-right bg-blue-50 px-6 py-3 rounded-xl border border-blue-100">
                <div className="text-3xl font-mono font-bold text-blue-700 tracking-wider">
                    {formatTime(currentTime)}
                </div>
                <div className="text-sm text-gray-500 font-medium mt-1">
                    {formatDate(currentTime)}
                </div>
            </div>
        </div>

        {/* --- MAIN GRID CONTENT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* KOLOM KIRI (2/3): Kamera & Peta */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* 1. Card Kamera */}
                <div className="bg-white p-5 rounded-2xl shadow-md transition-all hover:shadow-xl">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h3 className="font-bold text-gray-700 text-lg flex items-center">
                            📸 Kamera Selfie
                        </h3>
                        {image && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Foto Terambil</span>}
                    </div>

                    <div className="relative rounded-xl overflow-hidden bg-black h-[400px] w-full flex justify-center items-center shadow-inner group">
                        {image ? (
                            <img src={image} alt="Selfie" className="h-full w-full object-cover" />
                        ) : (
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="h-full w-full object-cover"
                            />
                        )}
                        
                        {/* Overlay Tombol Kamera */}
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
                            {!image ? (
                                <button onClick={capture} className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
                                    AMBIL FOTO
                                </button>
                            ) : (
                                <button onClick={() => setImage(null)} className="bg-gray-800/80 backdrop-blur-sm text-white px-6 py-2 rounded-full font-medium hover:bg-gray-900 transition-colors flex items-center gap-2">
                                    🔄 Foto Ulang
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Card Peta */}
                <div className="bg-white p-5 rounded-2xl shadow-md">
                     <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h3 className="font-bold text-gray-700 text-lg">📍 Lokasi Anda</h3>
                        {coords ? (
                            <span className="text-xs text-gray-400 font-mono">
                                {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                            </span>
                        ) : (
                            <span className="text-xs text-red-400 animate-pulse">Mencari GPS...</span>
                        )}
                    </div>
                    
                    <div className="h-[250px] rounded-xl overflow-hidden shadow-inner border border-gray-200">
                        {coords ? (
                            <MapContainer center={[coords.lat, coords.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={[coords.lat, coords.lng]}>
                                    <Popup>Posisi Presensi Anda</Popup>
                                </Marker>
                            </MapContainer>
                        ) : (
                            <div className="h-full bg-gray-100 flex items-center justify-center text-gray-400 flex-col">
                                <svg className="w-10 h-10 mb-2 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Sedang memuat peta...
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* KOLOM KANAN (1/3): Kontrol & Status */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-24 border-t-8 border-blue-500">
                    <h3 className="font-bold text-xl text-gray-800 mb-6 text-center">
                        Panel Kontrol
                    </h3>

                    {/* Pesan Status */}
                    {message && (
                        <div className={`p-4 mb-6 rounded-xl text-center shadow-sm animate-fade-in-down border ${
                            msgType === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                            <p className="font-bold text-lg mb-1">{msgType === 'success' ? 'Berhasil!' : 'Gagal!'}</p>
                            <p className="text-sm">{message}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <button 
                            onClick={handleCheckIn} 
                            disabled={!image || !coords}
                            className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transform transition-all duration-200 flex items-center justify-center gap-3
                                ${(!image || !coords) 
                                    ? 'bg-gray-300 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:-translate-y-1 hover:shadow-green-500/30'}
                            `}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            CHECK-IN MASUK
                        </button>

                        <button 
                            onClick={handleCheckOut} 
                            className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl shadow-lg hover:from-red-600 hover:to-red-700 hover:-translate-y-1 hover:shadow-red-500/30 transform transition-all duration-200 flex items-center justify-center gap-3"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            CHECK-OUT PULANG
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-400">Pastikan wajah terlihat jelas & lokasi akurat.</p>
                    </div>

                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

export default PresensiPage;