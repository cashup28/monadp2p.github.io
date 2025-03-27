// 📁 Örnek: /pages/profile.js (veya başka bir sayfa)

import React from 'react';

export default function Profile() {
  return (
    <div className="min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">Profil Sayfası</h1>

      {/* Sayfa içeriği buraya */}

      {/* 🔙 Geri Dön Butonu */}
      <button
        onClick={() => window.location.href = '/'}
        className="mt-6 px-4 py-2 bg-purple-700 text-white rounded-xl shadow hover:bg-purple-800"
      >
        ⬅️ Anasayfaya Dön
      </button>
    </div>
  );
}
