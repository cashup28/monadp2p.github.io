import { useEffect, useState } from 'react';
import { useTonConnectUI, TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { Address, fromNano, toNano } from '@ton/core';

const MONAD_POOL_WALLET = process.env.NEXT_PUBLIC_MONAD_POOL_WALLET || '0xPOOLMONAD1234567890abcdef';
const TON_POOL_WALLET = process.env.NEXT_PUBLIC_TON_POOL_WALLET || 'EQC_POOL_WALLET_ORNEK_ADRES';
const TON_TO_MONAD_RATIO = 8; // 1 TON = 8 MONAD

const getTonBalance = async (address) => {
  const apiKey = process.env.NEXT_PUBLIC_TONCENTER_API_KEY;
  const res = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${address}&api_key=${apiKey}`);
  const data = await res.json();
  return data.result ? parseFloat(fromNano(data.result)) : 0;
};

const sendTransaction = async (amount, address) => {
  // Bu kısım backend işlem gerektirir. Burada sadece örnek veriyorum.
  // Transfer işlemleri backend'den yapılacak.
  return {
    success: true,
    message: `Ton: ${amount} gönderildi, Monad adresine ${amount * TON_TO_MONAD_RATIO} MONAD gönderilecek`
  };
};

export default function Profile() {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState('919006');
  const [tonBalance, setTonBalance] = useState(0);
  const [tonAmount, setTonAmount] = useState('');
  const [monadAddress, setMonadAddress] = useState('');
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (wallet?.account?.address) {
      const rawAddr = wallet.account.address;
      setIsConnected(true);

      getTonBalance(rawAddr).then((balance) => {
        setTonBalance(balance);
      });
    }
  }, [wallet]);

  const handleBuy = async () => {
    if (!tonAmount || isNaN(tonAmount) || Number(tonAmount) <= 0) {
      setTransactionStatus({ success: false, message: 'Lütfen geçerli bir TON miktarı girin.' });
      return;
    }

    if (!monadAddress) {
      setTransactionStatus({ success: false, message: 'Lütfen bir MONAD adresi girin.' });
      return;
    }

    setLoading(true);
    try {
      // Buy işlemi
      const result = await sendTransaction(tonAmount, monadAddress);
      setTransactionStatus(result);
      if (result.success) {
        setTonAmount('');
        setMonadAddress('');
      }
    } catch (error) {
      setTransactionStatus({ success: false, message: 'İşlem sırasında hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => tonConnectUI.disconnect()} className="bg-zinc-800 text-white rounded-full px-4 py-1">
          ← Geri
        </button>
        <h1 className="text-xl font-bold text-center w-full -ml-8">👤 Profil Sayfan</h1>
      </div>
      <p><strong>Kullanıcı ID:</strong> {userId}</p>
      <div className="mt-2 flex justify-end">
        <TonConnectButton />
      </div>
      {isConnected && (
        <div className="flex justify-end items-center gap-2 mt-2">
          <span className="text-xs">{wallet.account?.address}</span>
          <button onClick={() => tonConnectUI.disconnect()} className="text-red-400 text-xs">Bağlantıyı Kes</button>
        </div>
      )}

      <div className="bg-zinc-900 rounded-xl p-4 mt-4">
        <h3 className="font-semibold mb-2">TON Miktarı</h3>
        <input
          type="number"
          value={tonAmount}
          onChange={(e) => setTonAmount(e.target.value)}
          className="w-full p-2 rounded text-black mb-2"
          placeholder="Almak istediğiniz TON miktarını girin"
          min="0.1"
          step="0.1"
        />
        <h4 className="font-semibold mb-2">MONAD Adresi</h4>
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

        {transactionStatus && (
          <p className={`mt-2 text-sm ${transactionStatus.success ? 'text-green-400' : 'text-red-400'}`}>
            {transactionStatus.message}
          </p>
        )}
      </div>

      <div className="bg-zinc-900 rounded-xl p-4 mt-4">
        <h3 className="font-semibold mb-2">Hesap Bilgisi</h3>
        <p><strong>Bakiyeniz:</strong> {tonBalance.toFixed(2)} TON</p>
      </div>
    </div>
  );
}