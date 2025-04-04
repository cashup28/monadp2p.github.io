// pages/profile.js

import { useEffect, useState } from 'react';
import { useTonConnectUI, TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import BackButton from "@/components/BackButton";
import Link from 'next/link';

const TON_POOL_WALLET = process.env.NEXT_PUBLIC_TON_POOL_WALLET || 'EQC_POOL_WALLET_EXAMPLE_ADDRESS';
const MONAD_POOL_WALLET = process.env.NEXT_PUBLIC_MONAD_POOL_WALLET || '0xPOOLMONAD1234567890abcdef';

export default function Profile() {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const [isConnected, setIsConnected] = useState(false);
  const [shortAddress, setShortAddress] = useState('');
  const [userId, setUserId] = useState('');
  const [monad, setMonad] = useState(0);
  const [ton, setTon] = useState(0);

  const [tonWallets, setTonWallets] = useState([]);
  const [monadWallets, setMonadWallets] = useState([]);
  const [newMonadAddress, setNewMonadAddress] = useState('');

  useEffect(() => {
    let storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      storedUserId = 'user' + Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem('userId', storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetch('/api/get-user-balances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMonad(data.monad);
          setTon(data.ton);
        }
      });

    fetch('/api/user-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTonWallets(data.tonWallets || []);
          setMonadWallets(data.monadWallets || []);
        }
      });
  }, [userId]);

  useEffect(() => {
    if (wallet?.account?.address) {
      setIsConnected(true);
      const addr = wallet.account.address;
      setShortAddress(addr.slice(0, 4) + '...' + addr.slice(-4));
      saveTonWallet(addr);
    } else {
      setIsConnected(false);
      setShortAddress('');
    }
  }, [wallet]);

  const saveTonWallet = async (address) => {
    if (!address || tonWallets.includes(address) || tonWallets.length >= 3) return;

    if (!address.startsWith('EQ') || address.length < 48) {
      alert('Geçersiz TON mainnet adresi.');
      return;
    }

    const res = await fetch('/api/set-ton-wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, address })
    });
    const data = await res.json();
    if (data.success) {
      setTonWallets(data.tonWallets);
    } else {
      alert(data.error || 'Cüzdan kaydedilemedi.');
    }
  };

  const handleMonadWalletSave = async () => {
    if (!newMonadAddress || monadWallets.length >= 3) return;
    if (!newMonadAddress.startsWith('0x') || newMonadAddress.length !== 42) {
      alert('Geçersiz MONAD testnet adresi.');
      return;
    }
    const res = await fetch('/api/set-monad-wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, address: newMonadAddress })
    });
    const data = await res.json();
    if (data.success) {
      setMonadWallets(data.monadWallets);
      setNewMonadAddress('');
    } else {
      alert(data.error || 'Kayıt başarısız.');
    }
  };

  const handleMonadWalletDelete = async (address) => {
    const res = await fetch('/api/set-monad-wallet', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, address })
    });
    const data = await res.json();
    if (data.success) setMonadWallets(data.monadWallets);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Adres kopyalandı: ' + text);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-[20vh] flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <BackButton />
        <TonConnectButton />
      </div>

      <h1 className="text-2xl font-bold">👤 Profil</h1>

      <div className="flex justify-between bg-white/10 p-4 rounded-xl">
        <div>
          <div className="text-sm">MONAD</div>
          <div className="text-lg font-bold">{monad}</div>
        </div>
        <div>
          <div className="text-sm">TON</div>
          <div className="text-lg font-bold">{ton}</div>
        </div>
      </div>

      <div className="bg-white/10 p-4 rounded-xl">
        <h2 className="text-lg font-semibold mb-3">TON Yatırma</h2>
        <p className="text-sm mb-2">⚠️ Sadece TON mainnet cüzdanlarından aşağıdaki adrese gönderim yapınız.</p>
        <div className="text-xs font-mono bg-black/40 p-2 rounded mb-2 truncate">{TON_POOL_WALLET}</div>
        <button onClick={() => handleCopy(TON_POOL_WALLET)} className="bg-purple-700 px-4 py-1 text-sm rounded">
          Adresi Kopyala
        </button>
      </div>

      <div className="bg-white/10 p-4 rounded-xl">
        <h2 className="text-lg font-semibold mb-3">MONAD Yatırma</h2>
        <p className="text-sm mb-2">⚠️ Sadece MONAD testnet cüzdanlarınızdan aşağıdaki adrese gönderim yapınız.</p>
        <div className="text-xs font-mono bg-black/40 p-2 rounded mb-2 truncate">{MONAD_POOL_WALLET}</div>
        <button onClick={() => handleCopy(MONAD_POOL_WALLET)} className="bg-purple-700 px-4 py-1 text-sm rounded">
          Adresi Kopyala
        </button>
      </div>

      {/* Diğer UI bileşenleri aynı mantıkla devam edecek */}
    </div>
  );
}
