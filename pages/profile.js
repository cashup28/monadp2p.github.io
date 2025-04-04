// pages/profile.js

import { useEffect, useState } from 'react';
import { useTonConnectUI, TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

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
    } else {
      setIsConnected(false);
      setShortAddress('');
    }
  }, [wallet]);

  const handleTonWalletSave = async () => {
    if (!wallet?.account?.address || tonWallets.length >= 3) return;
    const res = await fetch('/api/set-ton-wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, address: wallet.account.address })
    });
    const data = await res.json();
    if (data.success) setTonWallets(data.tonWallets);
  };

  const handleMonadWalletSave = async () => {
    if (!newMonadAddress || monadWallets.length >= 3) return;
    if (!newMonadAddress.startsWith('0x') || newMonadAddress.length < 20) return alert('Geçersiz MONAD adresi');
    const res = await fetch('/api/set-monad-wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, address: newMonadAddress })
    });
    const data = await res.json();
    if (data.success) {
      setMonadWallets(data.monadWallets);
      setNewMonadAddress('');
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

  const isTonWalletKnown = wallet?.account?.address && tonWallets.includes(wallet.account.address);
  const isTonWalletLimitReached = tonWallets.length >= 3;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Adres kopyalandı: ' + text);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-[16.6vh] flex flex-col gap-6">
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
        <p className="text-sm mb-2">Sadece kayıtlı TON cüzdanlarınızdan aşağıdaki adrese gönderim yapınız.</p>
        <div className="text-xs font-mono bg-black/40 p-2 rounded mb-2 truncate">{TON_POOL_WALLET}</div>
        <button onClick={() => handleCopy(TON_POOL_WALLET)} className="bg-purple-700 px-4 py-1 text-sm rounded">
          Adresi Kopyala
        </button>
      </div>

      <div className="bg-white/10 p-4 rounded-xl">
        <h2 className="text-lg font-semibold mb-3">MONAD Yatırma</h2>
        <p className="text-sm mb-2">Sadece kayıtlı MONAD cüzdanlarınızdan aşağıdaki adrese gönderim yapınız.</p>
        <div className="text-xs font-mono bg-black/40 p-2 rounded mb-2 truncate">{MONAD_POOL_WALLET}</div>
        <button onClick={() => handleCopy(MONAD_POOL_WALLET)} className="bg-purple-700 px-4 py-1 text-sm rounded">
          Adresi Kopyala
        </button>
      </div>

      <div className="bg-white/10 p-4 rounded-xl">
        <h2 className="text-lg font-semibold mb-2">TON Cüzdanlar</h2>
        {tonWallets.map((addr, idx) => (
          <div key={idx} className="text-sm font-mono cursor-pointer hover:text-purple-300" onClick={() => alert('Bu cüzdan ile işlem yapılabilir: ' + addr)}>
            {addr}
          </div>
        ))}
        {isConnected && !isTonWalletKnown && !isTonWalletLimitReached && (
          <>
            <div className="text-xs mt-2 mb-1 text-yellow-400">Yalnızca bu cüzdandan transfer yapmalısınız!</div>
            <button onClick={handleTonWalletSave} className="bg-purple-700 px-4 py-1 mt-1 rounded">
              Bağlı Cüzdanı Kaydet
            </button>
          </>
        )}
        {isConnected && !isTonWalletKnown && isTonWalletLimitReached && (
          <div className="text-xs mt-3 text-red-500">
            Maksimum 3 TON cüzdan sınırına ulaştınız. Cüzdan eklemek için kayıtlılardan birini silin.
          </div>
        )}
      </div>

      <div className="bg-white/10 p-4 rounded-xl">
        <h2 className="text-lg font-semibold mb-2">MONAD Cüzdanlar</h2>
        {monadWallets.map((addr, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm font-mono mb-1">
            <span>{addr}</span>
            <button onClick={() => handleMonadWalletDelete(addr)} className="text-red-400 text-xs">Sil</button>
          </div>
        ))}
        {monadWallets.length < 3 && (
          <div className="flex flex-col gap-2 mt-2">
            <input
              type="text"
              value={newMonadAddress}
              onChange={(e) => setNewMonadAddress(e.target.value)}
              placeholder="0x..."
              className="p-2 rounded bg-black border border-gray-700 text-white text-sm"
            />
            <button onClick={handleMonadWalletSave} className="bg-purple-700 px-4 py-1 rounded">
              Kaydet
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Link
          href="/withdraw"
          className="bg-purple-700 mt-6 px-6 py-2 rounded-xl text-white text-sm hover:bg-purple-600"
        >
          💸 Withdraw Sayfasına Git
        </Link>
      </div>
    </div>
  );
}
