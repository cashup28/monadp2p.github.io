import { useState } from 'react';

export default function WithdrawForm({ userId }) {
  const [token, setToken] = useState('TON'); // Default olarak TON
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, token, amount, address })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Talep oluşturuldu. ID: ${data.id}`);
        setAmount('');
        setAddress('');
      } else {
        setMessage(`❌ Hata: ${data.error}`);
      }
    } catch (err) {
      setMessage('❌ Sunucu hatası!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 p-4 rounded-lg shadow-md max-w-md mx-auto mt-4">
      <h2 className="text-xl font-bold text-white mb-4">Withdraw Talebi</h2>

      <label className="block mb-2 text-sm text-white">Token</label>
      <select
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="w-full p-2 rounded bg-gray-800 text-white mb-4"
      >
        <option value="TON">TON</option>
        <option value="MONAD">MONAD</option>
      </select>

      <label className="block mb-2 text-sm text-white">Miktar</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        className="w-full p-2 rounded bg-gray-800 text-white mb-4"
      />

      <label className="block mb-2 text-sm text-white">Hedef Adres</label>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
        className="w-full p-2 rounded bg-gray-800 text-white mb-4"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
      >
        {loading ? 'Gönderiliyor...' : 'Withdraw Talebi Gönder'}
      </button>

      {message && (
        <div className="mt-4 text-sm text-white bg-gray-800 p-2 rounded">
          {message}
        </div>
      )}
    </form>
  );
}
