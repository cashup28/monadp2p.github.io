import { useEffect, useState } from 'react';
import { useTonConnectUI, TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { useRouter } from 'next/router';
import { Address } from '@ton/core';

const TON_POOL_WALLET = process.env.NEXT_PUBLIC_TON_POOL_WALLET || 'EQC_POOL_WALLET_EXAMPLE_ADDRESS';
const MONAD_POOL_WALLET = process.env.NEXT_PUBLIC_MONAD_POOL_WALLET || '0xPOOLMONAD1234567890abcdef';

const formatTonAddress = (rawAddress) => {
  try {
    const address = Address.parseRaw(rawAddress);
    return address.toString({ urlSafe: true, bounceable: true });
  } catch (e) {
    console.error('TON adres format hatası:', e);
    return rawAddress;
  }
};

const shortenAddress = (addr) => addr?.slice(0, 4) + '...' + addr?.slice(-4);

const getTonBalance = async (address) => {
  const apiKey = process.env.NEXT_PUBLIC_TONCENTER_API_KEY;
  const res = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${address}&api_key=${apiKey}`);
  const data = await res.json();
  return data.result ? parseFloat(data.result) / 1e9 : 0;
};

const sendDepositRequest = async (amount, address) => {
  try {
    const res = await fetch('/api/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, address }),
    });
    return await res.json();
  } catch (err) {
    console.error('Deposit hatası:', err);
    return { success: false, message: 'İşlem başarısız' };
  }
};

export default function Profile() {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const router = useRouter();

  const [isConnected, setIsConnected] = useState(false);
  const [shortAddress, setShortAddress] = useState('');
  const [userId, setUserId] = useState('');
  const [ton, setTon] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositStatus, setDepositStatus] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId') || `user${Math.floor(100000 + Math.random() * 900000)}`;
    localStorage.setItem('userId', storedUserId);
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (wallet?.account?.address) {
      const rawAddr = wallet.account.address;
      setIsConnected(true);
      setShortAddress(shortenAddress(formatTonAddress(rawAddr)));
      getTonBalance(rawAddr).then(setTon);
    }
  }, [wallet]);

  const handleDeposit = async () => {
    if (depositAmount && wallet?.account?.address) {
      const result = await sendDepositRequest(depositAmount, wallet.account.address);
      setDepositStatus(result);
      if (result.success) {
        setDepositAmount('');
      }
    } else {
      alert('Lütfen geçerli bir miktar girin.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pt-[16.6vh]">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => router.back()} className="bg-zinc-800 text-white rounded-full px-4 py-1">← Geri</button>
        <h1 className="text-xl font-bold text-center w-full -ml-8">👤 Profil Sayfan</h1>
      </div>

      <p><strong>User ID:</strong> {userId}</p>
      
      <div className="mt-2 flex justify-end">
        <TonConnectButton />
      </div>
      
      {isConnected && (
        <div className="flex justify-end items-center gap-2 mt-2">
          <span className="text-xs">{shortAddress} ({ton.toFixed(2)} TON)</span>
          <button onClick={() => tonConnectUI.disconnect()} className="text-red-400 text-xs">Bağlantıyı Kes</button>
        </div>
      )}

      {/* Deposit Input */}
      <div className="bg-zinc-900 rounded-xl p-4 mt-4">
        <h3 className="font-semibold mb-2">Deposit Yap</h3>
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          className="w-full p-2 rounded text-black"
          placeholder="Deposit Miktarı"
        />
        <button onClick={handleDeposit} className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-2">
          Deposit
        </button>
        {depositStatus && (
          <p className={`mt-2 text-sm ${depositStatus.success ? 'text-green-400' : 'text-red-400'}`}>
            {depositStatus.message || (depositStatus.success ? 'Deposit başarılı!' : 'Deposit başarısız.')}
          </p>
        )}
      </div>

      {/* Deposit History */}
      <div className="bg-zinc-900 rounded-xl p-4 mt-4">
        <h3 className="font-semibold mb-2">Hesap Bilgisi</h3>
        <p><strong>TON Cüzdan Adresi:</strong> {shortAddress}</p>
        <p><strong>Bakiyeniz:</strong> {ton.toFixed(2)} TON</p>
      </div>
    </div>
  );
}