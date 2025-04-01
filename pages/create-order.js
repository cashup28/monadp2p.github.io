// pages/create-order.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';

export default function CreateOrder() {
  const {
    userId,
    monadBalance,
    tonBalance,
  } = useUser();
  const router = useRouter();

  const [offerCoin, setOfferCoin] = useState('TON');
  const [offerAmount, setOfferAmount] = useState('');
  const [receiveCoin, setReceiveCoin] = useState('MONAD');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      return setError('Lütfen cüzdan bağlayın.');
    }

    const available = offerCoin === 'TON' ? tonBalance : monadBalance;
    if (parseFloat(offerAmount) > available) {
      return setError(`Yeterli ${offerCoin} bakiyeniz yok.`);
    }

    const body = {
      offerCoin,
      offerAmount: parseFloat(offerAmount),
      receiveCoin,
      receiveAmount: parseFloat(receiveAmount),
      userId,
    };

    const res = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      router.push('/orders');
    } else {
      setError(data.error || 'Bir hata oluştu.');
    }
  };

  return (
    <div className="min-h-screen p-4 text-white bg-black">
      <h1 className="text-2xl font-bold mb-4 text-purple-400">Takas Emri Oluştur</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Vermek İstediğiniz Coin:</label>
          <select
            className="text-black p-2 rounded w-full"
            value={offerCoin}
            onChange={(e) => setOfferCoin(e.target.value)}
          >
            <option value="TON">TON</option>
            <option value="MONAD">MONAD</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Miktar:</label>
          <input
            type="number"
            className="text-black p-2 rounded w-full"
            value={offerAmount}
            onChange={(e) => setOfferAmount(e.target.value)}
            required
            min="0.0001"
          />
        </div>

        <div>
          <label className="block mb-1">Almak İstediğiniz Coin:</label>
          <select
            className="text-black p-2 rounded w-full"
            value={receiveCoin}
            onChange={(e) => setReceiveCoin(e.target.value)}
          >
            <option value="MONAD">MONAD</option>
            <option value="TON">TON</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Almak İstediğiniz Miktar:</label>
          <input
            type="number"
            className="text-black p-2 rounded w-full"
            value={receiveAmount}
            onChange={(e) => setReceiveAmount(e.target.value)}
            required
            min="0.0001"
          />
        </div>

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Emri Oluştur
        </button>
      </form>
    </div>
  );
}
