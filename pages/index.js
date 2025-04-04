// pages/index.js

import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const socketRef = useRef(null);
  const [lastTrade, setLastTrade] = useState(null);
  const [userId, setUserId] = useState('');
  const [monad, setMonad] = useState(0);
  const [ton, setTon] = useState(0);

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    const storedMonad = localStorage.getItem('monadBalance');
    const storedTon = localStorage.getItem('tonBalance');
    if (storedId) setUserId(storedId);
    if (storedMonad) setMonad(parseFloat(storedMonad));
    if (storedTon) setTon(parseFloat(storedTon));
  }, []);

  useEffect(() => {
    const initSocket = async () => {
      await fetch('/api/socket');
      if (socketRef.current) socketRef.current.disconnect();
      socketRef.current = io({ path: '/api/socket' });
      socketRef.current.on('newTrade', (data) => {
        setLastTrade(`@${data.user} ${data.amount} ${data.from} → ${data.to} takası yaptı`);
      });
    };
    initSocket();
    return () => socketRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-[20vh] flex flex-col items-center">
      <div className="w-full text-center mb-4 animate-pulse text-sm text-purple-400">
        {lastTrade || 'Canlı işlemler bekleniyor...'}
      </div>

      <div className="w-full flex justify-center gap-2 mb-6">
        <div className="bg-white/10 rounded-xl p-3 flex-1 text-center">
          <div className="text-xs">USER ID</div>
          <div className="text-lg font-bold">{userId || 'Yükleniyor'}</div>
        </div>
        <div className="bg-white/10 rounded-xl p-3 flex-1 text-center">
          <div className="flex justify-center items-center gap-1 text-xs">
            <Image src="/monad-logo.png" alt="Monad" width={16} height={16} /> MONAD
          </div>
          <div className="text-lg font-bold">{monad}</div>
        </div>
        <div className="bg-white/10 rounded-xl p-3 flex-1 text-center">
          <div className="flex justify-center items-center gap-1 text-xs">
            <Image src="/ton-logo.png" alt="TON" width={16} height={16} /> TON
          </div>
          <div className="text-lg font-bold">{ton}</div>
        </div>
      </div>

      <div className="mb-6">
        <Image src="/mascot.png" alt="Logo" width={160} height={160} />
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        <NavButton href="/swap" label="Takas Yap" />
        <NavButton href="/orders" label="Emirlerim" />
        <NavButton href="/history" label="İşlem Geçmişi" />
        <NavButton href="/profile" label="Profil" />
        <NavButton href="/refer" label="Referans" />
        <NavButton href="/support" label="Destek" />
      </div>
    </div>
  );
}

function NavButton({ href, label }) {
  return (
    <Link href={href} className="bg-purple-600/60 hover:bg-purple-600 rounded-2xl py-3 text-center shadow-md">
      {label}
    </Link>
  );
}