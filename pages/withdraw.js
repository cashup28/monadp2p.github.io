// pages/withdraw.js

import { useState, useEffect } from 'react';
import BackButton from '@/components/BackButton';

export default function Withdraw() {
  const [userId, setUserId] = useState('');
  const [coin, setCoin] = useState('ton');
  const [amount, setAmount] = useState('');
  const [targetAddress, setTargetAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    if (storedId) setUserId(storedId);
  }, []);

  const handleWithdraw = async () => {
    if (!amount || !targetAddress) return alert('Lütfen tüm alanları doldurun.');
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, coin, amount, targetAddress })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ success: false, error: 'Sunucu hatası' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-[16.6vh] flex flex-col gap-6">
      <BackButton />
      <h1 className="text-2xl font-bold">💸 Withdraw</h1>

      <div className="flex gap-4">
        <button
          className={`px-4 py-2 rounded ${coin === 'ton' ? 'bg-purple-700' : 'bg-gray-700'}`}
          onClick={() => setCoin('ton')}
        >TON</button>
        <button
          className={`px-4 py-2 rounded ${coin === 'monad' ? 'bg-purple-700' : 'bg-gray-700'}`}
          onClick={() => setCoin('monad')}
        >MONAD</button>
      </div>

      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Miktar"
        className="p-2 bg-black border border-gray-700 rounded"
      />
      <input
        type="text"
        value={targetAddress}
        onChange={(e) => setTargetAddress(e.target.value)}
        placeholder="Hedef Cüzdan Adresi"
        className="p-2 bg-black border border-gray-700 rounded"
      />

      <button
        onClick={handleWithdraw}
        className="bg-green-600 py-2 rounded text-white disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Gönderiliyor...' : 'Gönder'}
      </button>

      {result && (
        <div className={`text-sm mt-4 ${result.success ? 'text-green-400' : 'text-red-400'}`}>
          {result.success ? 'Transfer başarılı!' : result.error || 'Hata oluştu'}
        </div>
      )}
    </div>
  );
}