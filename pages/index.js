// pages/index.js (final sürüm, mockup uyumlu, deploya hazır)

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [userId, setUserId] = useState('');
  const [monadBalance, setMonadBalance] = useState(null);
  const [tonBalance, setTonBalance] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    if (storedId) setUserId(storedId);

    const monad = JSON.parse(localStorage.getItem('monadWallets') || '[]');
    const ton = JSON.parse(localStorage.getItem('tonWallets') || '[]');

    if (monad.length > 0) {
      fetch(`https://testnet.monad.tools/account/${monad[monad.length - 1]}`)
        .then((res) => res.json())
        .then((data) => setMonadBalance(parseFloat(data.balance) / 1e18))
        .catch(() => setMonadBalance(0));
    }

    if (ton.length > 0 && ton[ton.length - 1]) {
      fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${ton[ton.length - 1]}&api_key=${process.env.NEXT_PUBLIC_TONCENTER_API_KEY}`)
        .then((res) => res.json())
        .then((data) => setTonBalance(parseFloat(data.result) / 1e9))
        .catch(() => setTonBalance(0));
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center justify-start">
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-full shadow-lg z-50"
      >
        ← Geri
      </button>

      <div className="mt-[16.6vh] w-full max-w-md space-y-4">
        <div className="flex justify-between items-center px-4">
          <p className="text-xs text-gray-400">USER ID</p>
          <p className="text-xs text-gray-400">MONAD</p>
          <p className="text-xs text-gray-400">TON</p>
        </div>

        <div className="grid grid-cols-3 gap-2 px-4">
          <div className="bg-zinc-900 rounded-xl p-3 text-center">
            <p className="font-bold text-lg">{userId}</p>
          </div>
          <div className="bg-zinc-900 rounded-xl p-3 text-center">
            <p className="font-bold text-lg">{monadBalance !== null ? monadBalance.toFixed(2) : '...'}</p>
          </div>
          <div className="bg-zinc-900 rounded-xl p-3 text-center">
            <p className="font-bold text-lg">{tonBalance !== null ? tonBalance.toFixed(2) : '...'}</p>
          </div>
        </div>

        <div className="flex justify-center my-6">
          <img src="/mascot.png" alt="Monad Mascot" className="h-40 w-40 object-contain" />
        </div>

        <div className="grid grid-cols-2 gap-4 px-2">
          <a href="/trade" className="bg-purple-600 text-white rounded-xl p-4 text-center font-semibold">TAKAS YAP</a>
          <a href="/orders" className="bg-purple-600 text-white rounded-xl p-4 text-center font-semibold">EMİRLERİM</a>
          <a href="/history" className="bg-purple-600 text-white rounded-xl p-4 text-center font-semibold">GEÇMİŞ</a>
          <a href="/profile" className="bg-purple-600 text-white rounded-xl p-4 text-center font-semibold">PROFİL</a>
          <a href="/refer" className="bg-purple-600 text-white rounded-xl p-4 text-center font-semibold">REFERANS</a>
          <a href="/support" className="bg-purple-600 text-white rounded-xl p-4 text-center font-semibold">DESTEK</a>
        </div>
      </div>
    </div>
  );
}
