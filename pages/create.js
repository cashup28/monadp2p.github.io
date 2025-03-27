// /pages/create.js
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useTonConnectUI } from '@tonconnect/ui-react';

export default function Create() {
  const [tonConnectUI] = useTonConnectUI();
  const [wallet, setWallet] = useState(null);
  const [fromToken, setFromToken] = useState('TON');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [monadBalance, setMonadBalance] = useState(298);
  const [tonBalance, setTonBalance] = useState(3.2);

  useEffect(() => {
    const connectedWallet = tonConnectUI.connectedWallet;
    if (connectedWallet) setWallet(connectedWallet);
  }, [tonConnectUI]);

  const handleCreateOrder = () => {
    if (!wallet) return alert('Cüzdan bağlı değil.');
    if (!fromAmount || !toAmount) return alert('Lütfen tüm alanları doldurun.');

    const amount = parseFloat(fromAmount);
    const hasBalance =
      fromToken === 'TON' ? amount <= tonBalance : amount <= monadBalance;

    if (!hasBalance) return alert(`Yetersiz ${fromToken} bakiyesi.`);

    // Gerçek sistemde: Emir backend'e gönderilir ve bakiye kilitlenir
    alert(`Takas emri oluşturuldu:
${fromAmount} ${fromToken} → ${toAmount} ${fromToken === 'TON' ? 'MONAD' : 'TON'}`);
  };

  return (
    <>
      <Head>
        <title>Create Order</title>
        <link href="/tailwind.css" rel="stylesheet" />
      </Head>
      <main className="min-h-screen bg-black text-white p-4">
        <h1 className="text-2xl font-bold mb-4">📥 Takas Emri Oluştur</h1>

        <div className="bg-gray-800 p-4 rounded-xl space-y-4">
          <div>
            <label className="block mb-1">Hangi token ile takas yapacaksınız?</label>
            <select
              className="w-full p-2 rounded text-black"
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
            >
              <option value="TON">TON → MONAD</option>
              <option value="MONAD">MONAD → TON</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Göndereceğiniz miktar ({fromToken}):</label>
            <input
              type="number"
              className="w-full p-2 rounded text-black"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Almak istediğiniz miktar ({fromToken === 'TON' ? 'MONAD' : 'TON'}):</label>
            <input
              type="number"
              className="w-full p-2 rounded text-black"
              value={toAmount}
              onChange={(e) => setToAmount(e.target.value)}
            />
          </div>

          <button
            onClick={handleCreateOrder}
            className="bg-purple-600 w-full py-2 rounded font-semibold hover:bg-purple-700"
          >
            Emri Oluştur
          </button>
        </div>
      </main>
    </>
  );
}
