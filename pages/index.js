// pages/index.js
import Link from 'next/link';
import BackButton from "@/components/BackButton";

export default function Home() {
  return (
      <BackButton />

    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-6" className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-purple-500 mb-4">Monad P2P Mini App</h1>
      <p className="mb-6">Hoş geldiniz! Aşağıdaki bağlantılarla uygulamayı kullanmaya başlayabilirsiniz:</p>
      <ul className="space-y-3">
        <li><Link href="/profile" className="text-purple-400 hover:underline">Profil</Link></li>
        <li><Link href="/orders" className="text-purple-400 hover:underline">Takas Emirleri</Link></li>
        <li><Link href="/create-order" className="text-purple-400 hover:underline">Yeni Emir Oluştur</Link></li>
        <li><Link href="/history" className="text-purple-400 hover:underline">Geçmiş İşlemler</Link></li>
        <li><Link href="/admin" className="text-purple-400 hover:underline">Admin Panel</Link></li>
      </ul>
    </div>
  );
}