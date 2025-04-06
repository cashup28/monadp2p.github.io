import { useEffect, useState } from 'react';
import { useTonConnectUI, TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { useRouter } from 'next/router';

const TON_TO_MONAD_RATE = 8;  // 1 TON = 8 MONAD

export default function Profile() {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const router = useRouter();

  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState('user883121');
  const [tonBalance, setTonBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [monadAddress, setMonadAddress] = useState('');
  const [buyStatus, setBuyStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Kullanıcı ID setup'ı
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId') || `user${Math.floor(100000 + Math.random() * 900000)}`;
    localStorage.setItem('userId', storedUserId);
    setUserId(storedUserId);
  }, []);

  // Cüzdan bağlantısını kontrol et ve bakiye al
  useEffect(() => {
    if (wallet?.account?.address) {
      setIsConnected(true);
      setTonBalance(0); // Sabit olarak 0 TON
    } else {
      setIsConnected(false);
    }
  }, [wallet]);

  const handleBuy = async () => {
    if (!depositAmount || !monadAddress) {
      setBuyStatus('Lütfen geçerli bir TON miktarı ve MONAD adresi girin.');
      return;
    }
    
    // 1 TON = 8 MONAD dönüşüm oranı
    const monadAmount = parseFloat(depositAmount) * TON_TO_MONAD_RATE;

    setLoading(true);

    // TON gönderimi ve MONAD adresine gönderilmesi işlemi simülasyonu
    setTimeout(() => {
      setBuyStatus(`Ton: ${depositAmount} gönderildi, Monad adresine ${monadAmount.toFixed(2)} MONAD gönderilecek.`);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pt-[20vh]">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => router.back()} className="bg-zinc-800 text-white rounded-full px-4 py-1">← Geri</button>
        <h1 className="text-xl font-bold text-center w-full -ml-8">👤 Profil Sayfan</h1>
      </div>

      <div className="mb-4">
        <p className="font-bold">Kullanıcı ID: {userId}</p>
      </div>

      {/* TON Miktarı ve MONAD Adresi giriş alanları */}
      <div className="bg-zinc-900 rounded-xl p-4 mb-4">
        <h3 className="font-semibold mb-2">TON Miktarı</h3>
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          className="w-full p-2 rounded text-black mb-2"
          placeholder="Almak istediğiniz TON miktarını girin"
          min="0.1"
          step="0.1"
        />
        <h3 className="font-semibold mb-2">MONAD Adresi</h3>
        <input
          type="text"
          value={monadAddress}
          onChange={(e) => setMonadAddress(e.target.value)}
          className="w-full p-2 rounded text-black mb-2"
          placeholder="MONAD adresinizi girin"
        />
        <button
          onClick={handleBuy}
          disabled={loading}
          className={`bg-blue-500 text-white px-4 py-2 rounded w-full ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? 'İşleniyor...' : 'Buy'}
        </button>

        {buyStatus && (
          <p className={`mt-2 text-sm ${buyStatus.includes('gönderilecek') ? 'text-green-400' : 'text-red-400'}`}>
            {buyStatus}
          </p>
        )}
      </div>

      {/* Hesap bilgisi */}
      <div className="bg-zinc-900 rounded-xl p-4">
        <h3 className="font-semibold mb-2">Hesap Bilgisi</h3>
        <p><strong>Bakiyeniz:</strong> {tonBalance.toFixed(2)} TON</p>
      </div>

      {/* TonConnect Bağlantısı */}
      <div className="mt-2 flex justify-end">
        <TonConnectButton />
      </div>
    </div>
  );
}