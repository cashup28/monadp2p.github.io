import { useEffect, useState } from 'react';
import { useTonConnectUI, TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { useRouter } from 'next/router';
import { Address, fromNano } from '@ton/core';

const TON_POOL_WALLET = process.env.NEXT_PUBLIC_TON_POOL_WALLET || 'EQC_POOL_WALLET_ORNEK_ADRES';

const formatTonAddress = (rawAddress) => {
  try {
    const address = Address.parseRaw(rawAddress);
    return address.toString({ urlSafe: true, bounceable: true }).slice(0, 6) + '...' + rawAddress.slice(-4);
  } catch (e) {
    console.error('TON adres formatlama hatası:', e);
    return rawAddress;
  }
};

const getTonBalance = async (address) => {
  const apiKey = process.env.NEXT_PUBLIC_TONCENTER_API_KEY;
  const res = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${address}&api_key=${apiKey}`);
  const data = await res.json();
  return data.result ? parseFloat(fromNano(data.result)) : 0;
};

const sendDepositRequest = async (amount, address) => {
  try {
    const res = await fetch('/api/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, address })
    });
    return await res.json();
  } catch (err) {
    console.error('Deposit gönderim hatası:', err);
    return { success: false, message: 'İşlem sırasında hata oluştu' };
  }
};

export default function Profile() {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const router = useRouter();

  const [isConnected, setIsConnected] = useState(false);
  const [shortAddress, setShortAddress] = useState('');
  const [userId, setUserId] = useState('919006');
  const [tonBalance, setTonBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState('0.1');
  const [depositStatus, setDepositStatus] = useState({ success: false, message: 'İşlem sırasında hata oluştu' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (wallet?.account?.address) {
      const rawAddr = wallet.account.address;
      setIsConnected(true);
      setShortAddress(formatTonAddress(rawAddr)); // Kısaltılmış adresi göster
      
      // Bakiyeyi sabit 0.00 olarak ayarla
      setTonBalance(0);
    }
  }, [wallet]);

  const handleDeposit = async () => {
    setLoading(true);
    try {
      // Deposit işlemi
      const response = await sendDepositRequest(Number(depositAmount), wallet.account.address);

      // İşlem başarılıysa
      if (response.success) {
        setDepositStatus({ success: true, message: 'Deposit işlemi başarılı!' });
      } else {
        setDepositStatus({ success: false, message: response.message || 'Deposit işlemi başarısız' });
      }
    } catch (error) {
      setDepositStatus({ success: false, message: 'İşlem sırasında hata oluştu' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => router.back()} className="bg-zinc-800 text-white rounded-full px-4 py-1">← Geri</button>
        <h1 className="text-xl font-bold text-center w-full -ml-8">👤 Profil Sayfan</h1>
      </div>
      
      <div className="mb-6">
        <p className="font-bold">Kullanıcı ID: {userId}</p>
        <p className="text-sm">{shortAddress || 'Bağlı değil'}</p>
      </div>

      <div className="bg-zinc-900 rounded-xl p-4 mb-4">
        <h3 className="font-semibold mb-2">Deposit Yap</h3>
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          className="w-full p-2 rounded text-black mb-2"
          placeholder="TON miktarı girin"
          min="0.1"
          step="0.1"
        />
        <button 
          onClick={handleDeposit} 
          disabled={loading}
          className={`bg-blue-500 text-white px-4 py-2 rounded w-full ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? 'İşleniyor...' : 'Deposit Yap'}
        </button>
        
        <p className={`mt-2 text-sm ${depositStatus.success ? 'text-green-400' : 'text-red-400'}`}>
          {depositStatus.message}
        </p>
      </div>

      <div className="bg-zinc-900 rounded-xl p-4">
        <h3 className="font-semibold mb-2">Hesap Bilgisi</h3>
        <p className="text-sm"><strong>Bakiyeniz:</strong> {tonBalance.toFixed(2)} TON</p>
      </div>
    </div>
  );
}