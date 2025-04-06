import { useEffect, useState } from 'react';
import { useTonConnectUI, TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { useRouter } from 'next/router';
import { Address, fromNano } from '@ton/core';

const TON_POOL_WALLET = process.env.NEXT_PUBLIC_TON_POOL_WALLET || 'EQC_POOL_WALLET_ORNEK_ADRES';

const formatTonAddress = (rawAddress) => {
  try {
    const address = Address.parseRaw(rawAddress);
    return address.toString({ urlSafe: true, bounceable: true });
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
  const [userId, setUserId] = useState('');
  const [tonBalance, setTonBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositStatus, setDepositStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId') || `user${Math.floor(100000 + Math.random() * 900000)}`;
    localStorage.setItem('userId', storedUserId);
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (wallet?.account?.address) {
      const rawAddr = wallet.account.address;
      setIsConnected(true);
      setShortAddress(formatTonAddress(rawAddr));

      // Update TON balance
      getTonBalance(rawAddr).then(setTonBalance);
    }
  }, [wallet]);

  const handleDeposit = async () => {
    if (!depositAmount || isNaN(Number(depositAmount)) || Number(depositAmount) <= 0) {
      setDepositStatus({
        success: false,
        message: 'Lütfen geçerli bir miktar girin'
      });
      return;
    }

    if (!wallet?.account?.address) {
      setDepositStatus({
        success: false,
        message: 'Cüzdan bağlı değil'
      });
      return;
    }

    setLoading(true);

    try {
      const result = await sendDepositRequest(Number(depositAmount), wallet.account.address);
      setDepositStatus(result);
      
      if (result.success) {
        setDepositAmount('');
        const updatedBalance = await getTonBalance(wallet.account.address);
        setTonBalance(updatedBalance);
      }
    } catch (error) {
      setDepositStatus({
        success: false,
        message: 'Beklenmeyen bir hata oluştu'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pt-[16.6vh]">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => router.back()} className="bg-zinc-800 text-white rounded-full px-4 py-1">← Geri</button>
        <h1 className="text-xl font-bold text-center w-full -ml-8">👤 Profil Sayfan</h1>
      </div>
      <p><strong>Kullanıcı ID:</strong> {userId}</p>

      <div className="mt-2 flex justify-end">
        <TonConnectButton />
      </div>

      {isConnected && (
        <div className="flex justify-end items-center gap-2 mt-2">
          <span className="text-xs">{shortAddress} ({tonBalance.toFixed(2)} TON)</span>
          <button onClick={() => tonConnectUI.disconnect()} className="text-red-400 text-xs">Bağlantıyı Kes</button>
        </div>
      )}

      <div className="bg-zinc-900 rounded-xl p-4 mt-4">
        <h3 className="font-semibold mb-2">Deposit Yap</h3>
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          className="w-full p-2 rounded text-black"
          placeholder="TON miktarı girin"
          min="0.1"
          step="0.1"
        />
        <button 
          onClick={handleDeposit} 
          disabled={loading}
          className={`bg-blue-500 text-white px-4 py-2 rounded w-full mt-2 ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? 'İşleniyor...' : 'Deposit Yap'}
        </button>
        
        {depositStatus && (
          <p className={`mt-2 text-sm ${depositStatus.success ? 'text-green-400' : 'text-red-400'}`}>
            {depositStatus.message}
          </p>
        )}
      </div>

      <div className="bg-zinc-900 rounded-xl p-4 mt-4">
        <h3 className="font-semibold mb-2">Hesap Bilgisi</h3>
        <p><strong>TON Cüzdan Adresi:</strong> {shortAddress || 'Bağlı değil'}</p>
        <p><strong>Bakiyeniz:</strong> {tonBalance.toFixed(2)} TON</p>
      </div>
    </div>
  );
}