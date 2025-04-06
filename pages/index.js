import { useEffect, useState } from 'react';
import { useTonConnectUI, TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { Address, toNano, fromNano } from '@ton/core';

const TON_TO_MONAD_RATE = 8;  // 1 TON = 8 MONAD

export default function Profile() {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState(Math.floor(1000 + Math.random() * 9000));  // 4 haneli user ID
  const [tonBalance, setTonBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [monadAddress, setMonadAddress] = useState('');
  const [buyStatus, setBuyStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Cüzdan bağlantısını kontrol et
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

    const monadAmount = parseFloat(depositAmount) * TON_TO_MONAD_RATE;

    // 1 TON = 8 MONAD dönüşüm oranı

    setLoading(true);

    try {
      // TON gönderimi başlatma
      const tx = await wallet.sendTransaction({
        to: process.env.TON_POOL_WALLET,  // Ton havuz adresi
        amount: toNano(depositAmount),    // Transfer miktarı
        data: '',  // Gerekli veri, buraya smart contract işlemleri eklenebilir
      });

      // MONAD adresine ödeme gönderme işlemi
      const result = await sendMonadToAddress(monadAddress, monadAmount);  // Bu fonksiyon işlemi gerçekleştirecek
      setBuyStatus(`Ton: ${depositAmount} gönderildi, Monad adresine ${monadAmount.toFixed(2)} MONAD gönderilecek.`);
      
    } catch (error) {
      setBuyStatus('İşlem sırasında hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const sendMonadToAddress = async (address, amount) => {
    // Burada Monad işlemi yapılacak. Örnek olarak bir API'ye istek gönderilecektir.
    try {
      const response = await fetch('/api/send-monad', {
        method: 'POST',
        body: JSON.stringify({ address, amount }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (data.success) {
        return data;
      } else {
        throw new Error('MONAD transferi başarısız');
      }
    } catch (error) {
      console.error('MONAD gönderim hatası:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pt-[20vh]">
      <div className="flex justify-center mb-4">
        <h1 className="text-xl font-bold">👤 Profil Sayfan</h1>
      </div>

      <div className="mb-4">
        <p className="font-bold">Kullanıcı ID: {userId}</p>
      </div>

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

      <div className="bg-zinc-900 rounded-xl p-4">
        <h3 className="font-semibold mb-2">Hesap Bilgisi</h3>
        <p><strong>Bakiyeniz:</strong> {tonBalance.toFixed(2)} TON</p>
      </div>

      <div className="mt-2 flex justify-end">
        <TonConnectButton />
      </div>
    </div>
  );
}