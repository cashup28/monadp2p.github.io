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

const getTonBalance = async (address) => {
  const apiKey = process.env.NEXT_PUBLIC_TONCENTER_API_KEY;
  const res = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${address}&api_key=${apiKey}`);
  const data = await res.json();
  if (!data.result || isNaN(data.result)) return 0;
  return parseFloat(data.result) / 1e9;
};

const getMonadBalance = async (address) => {
  const res = await fetch(`https://testnet.monad.tools/account/${address}`);
  const data = await res.json();
  return parseFloat(data.balance) / 1e18;
};

const sendWithdrawRequest = async (type, amount, address) => {
  try {
    const res = await fetch(`/api/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, amount, address }),
    });
    return await res.json();
  } catch (err) {
    console.error('Withdraw error:', err);
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
  const [monad, setMonad] = useState(0);
  const [ton, setTon] = useState(0);
  const [tonWallets, setTonWallets] = useState([]);
  const [monadWallets, setMonadWallets] = useState([]);
  const [newMonadAddress, setNewMonadAddress] = useState('');
  const [copiedText, setCopiedText] = useState('');
  const [withdrawType, setWithdrawType] = useState('TON');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawStatus, setWithdrawStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('deposit');

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(''), 1500);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const handleTonDelete = (address) => {
    const updated = tonWallets.filter((addr) => addr !== address);
    setTonWallets(updated);
    localStorage.setItem('tonWallets', JSON.stringify(updated));
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId') || `user${Math.floor(100000 + Math.random() * 900000)}`;
    localStorage.setItem('userId', storedUserId);
    setUserId(storedUserId);

    const storedTon = JSON.parse(localStorage.getItem('tonWallets') || '[]');
    const storedMonad = JSON.parse(localStorage.getItem('monadWallets') || '[]');
    setTonWallets(storedTon);
    setMonadWallets(storedMonad);
  }, []);

  useEffect(() => {
    if (wallet?.account?.address) {
      const rawAddr = wallet.account.address;
      const formattedAddr = formatTonAddress(rawAddr);
      setIsConnected(true);
      setShortAddress(formattedAddr.slice(0, 4) + '...' + formattedAddr.slice(-4));

      if (!tonWallets.includes(formattedAddr)) {
        const updated = [...tonWallets, formattedAddr].slice(-3);
        setTonWallets(updated);
        localStorage.setItem('tonWallets', JSON.stringify(updated));
      }

      getTonBalance(formattedAddr).then(setTon).catch(console.error);
    }
  }, [wallet]);

  useEffect(() => {
    if (monadWallets.length > 0) {
      getMonadBalance(monadWallets[monadWallets.length - 1]).then(setMonad).catch(console.error);
    }
  }, [monadWallets]);

  const handleMonadSave = () => {
    if (!newMonadAddress || monadWallets.includes(newMonadAddress)) return;
    const updated = [...monadWallets, newMonadAddress].slice(-3);
    setMonadWallets(updated);
    localStorage.setItem('monadWallets', JSON.stringify(updated));
    setNewMonadAddress('');
  };

  const handleMonadDelete = (address) => {
    const updated = monadWallets.filter(a => a !== address);
    setMonadWallets(updated);
    localStorage.setItem('monadWallets', JSON.stringify(updated));
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawAddress) return;
    const res = await sendWithdrawRequest(withdrawType, withdrawAmount, withdrawAddress);
    setWithdrawStatus(res);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pt-[16.6vh] relative">
      <div className="flex items-center">
        <button
          onClick={() => router.back()}
          className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-full shadow-lg"
        >
          ←
        </button>
        <h2 className="text-2xl font-bold ml-4">👤 Profil Sayfan</h2>
      </div>

      <div className="space-y-4">
        <div className="bg-zinc-900 rounded-xl p-4">
          <p><strong>User ID:</strong> {userId}</p>
          <div className="mt-2 flex items-center justify-between">
            <TonConnectButton />
            {isConnected && (
              <div className="flex items-center ml-auto">
                <span className="text-xs">{shortAddress} ({ton?.toFixed(2) ?? '...'} TON)</span>
                <button
                  onClick={() => console.log('Disconnect')} // Disconnect işlevi burada eklenebilir
                  className="text-red-400 text-xs ml-2"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl p-4">
          <h3 className="font-semibold mb-2">TON Cüzdanlar</h3>
          <ul className="space-y-1 text-xs">
            {tonWallets.map((addr, i) => (
              <li key={i} className="flex justify-between items-center">
                <span className="break-all">{addr}</span>
                <div className="flex gap-2">
                  <button onClick={() => copyToClipboard(addr)} className="text-blue-400 text-xs">📋</button>
                  <button onClick={() => handleTonDelete(addr)} className="text-red-400 text-xs">❌</button>
                  {copiedText === addr && <span className="text-green-400 text-xs">✅</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-zinc-900 rounded-xl p-4">
          <h3 className="font-semibold mb-2">MONAD Cüzdanlar</h3>
          <input
            value={newMonadAddress}
            onChange={(e) => setNewMonadAddress(e.target.value)}
            className="border rounded p-2 w-full mb-2 text-black"
            placeholder="Yeni MONAD adresi"
          />
          <button onClick={handleMonadSave} className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-2">Kaydet</button>
          <ul className="space-y-1 text-xs">
            {monadWallets.map((addr, i) => (
              <li key={i} className="flex justify-between items-center">
                <span className="break-all">{addr}</span>
                <div className="flex gap-2">
                  <button onClick={() => copyToClipboard(addr)} className="text-blue-400 text-xs">📋</button>
                  <button onClick={() => handleMonadDelete(addr)} className="text-red-400 text-xs">❌</button>
                  {copiedText === addr && <span className="text-green-400 text-xs">✅</span>}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm">Bakiyen: {monad.toFixed(3)} MONAD</p>
        </div>

        <div className="flex justify-center gap-4">
          <button onClick={() => setActiveTab('deposit')} className={`px-4 py-1 rounded-full ${activeTab === 'deposit' ? 'bg-purple-600 text-white' : 'bg-zinc-700 text-gray-300'}`}>Deposit</button>
          <button onClick={() => setActiveTab('withdraw')} className={`px-4 py-1 rounded-full ${activeTab === 'withdraw' ? 'bg-purple-600 text-white' : 'bg-zinc-700 text-gray-300'}`}>Withdraw</button>
        </div>

        {activeTab === 'deposit' && (
          <div className="bg-zinc-900 p-4 rounded-xl space-y-2">
            <h3 className="text-lg font-semibold">➕ Deposit</h3>
            <div className="flex justify-between items-center">
              <p>TON Havuz:</p>
              <button onClick={() => copyToClipboard(TON_POOL_WALLET)} className="text-blue-400 text-xs">📋</button>
            </div>
            <p className="text-xs break-all">{TON_POOL_WALLET}</p>
            <div className="flex justify-between items-center">
              <p>MONAD Havuz:</p>
              <button onClick={() => copyToClipboard(MONAD_POOL_WALLET)} className="text-blue-400 text-xs">📋</button>
            </div>
            <p className="text-xs break-all">{MONAD_POOL_WALLET}</p>
          </div>
        )}

        {activeTab === 'withdraw' && (
          <div className="bg-zinc-900 p-4 rounded-xl space-y-3">
            <h3 className="text-lg font-semibold">➖ Withdraw</h3>
            <select
              value={withdrawType}
              onChange={(e) => setWithdrawType(e.target.value)}
              className="border p-2 rounded w-full text-black"
            >
              <option value="TON">TON</option>
              <option value="MONAD">MONAD</option>
            </select>
            <input
              type="number"
              placeholder="Miktar"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="border rounded p-2 w-full text-black"
            />
            <input
              type="text"
              placeholder="Alıcı Cüzdan Adresi"
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
              className="border rounded p-2 w-full text-black"
            />
            <button
              onClick={handleWithdraw}
              className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700"
            >
              Gönder
            </button>
            {withdrawStatus && (
              <p className={withdrawStatus.success ? 'text-green-400' : 'text-red-400'}>
                {withdrawStatus.message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}