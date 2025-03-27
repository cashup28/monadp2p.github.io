// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-purple-500 mb-4">Monad P2P Mini App</h1>
      <p className="mb-6">Hoş geldiniz! Aşağıdaki bağlantılarla uygulamayı kullanmaya başlayabilirsiniz:</p>

      <ul className="space-y-3">
        <li><Link href="/profile" className="text-yellow-400 underline">Profil</Link></li>
        <li><Link href="/orders" className="text-yellow-400 underline">Takas Emirleri</Link></li>
        <li><Link href="/create" className="text-yellow-400 underline">Yeni Emir Oluştur</Link></li>
        <li><Link href="/history" className="text-yellow-400 underline">Geçmiş İşlemler</Link></li>
        <li><Link href="/admin" className="text-yellow-400 underline">Admin Panel</Link></li>
      </ul>
    </div>
  );
}