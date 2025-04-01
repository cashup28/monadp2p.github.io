import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import BackButton from '@/components/BackButton';

export default function ProcessOrderPage() {
  const router = useRouter();
  const { id } = router.query;
  const {
    userId,
    tonBalance,
    monadBalance,
    setTonBalance,
    setMonadBalance
  } = useUser();

  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const exampleOrder = {
      id,
      offerCoin: 'TON',
      offerAmount: 2,
      receiveCoin: 'MONAD',
      receiveAmount: 16,
      userId: '12345',
    };
    setOrder(exampleOrder);
  }, [id]);

  const handleAccept = async () => {
    if (!userId || !order) return;

    const available =
      order.receiveCoin === 'TON' ? tonBalance : monadBalance;

    if (available < order.receiveAmount) {
      return setMessage(`Yeterli ${order.receiveCoin} bakiyeniz yok.`);
    }

    setLoading(true);
    try {
      const res = await fetch('/api/match-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, takasYapanId: userId }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'Takas başarılı!');
      } else {
        setMessage(data.error || 'Takas işlemi başarısız.');
      }
    } catch (err) {
      setMessage('Sunucu hatası.');
    }
    setLoading(false);
  };

  if (!order) return <div className="p-4 text-white">Yükleniyor...</div>;

  return (
    <div className="p-4 text-white bg-black min-h-screen">
      <BackButton />
      <h1 className="text-xl font-bold mb-4 text-purple-400">Emri Onayla</h1>

      <div className="border p-4 rounded-lg bg-gray-800">
        <p><strong>Veren:</strong> {order.userId}</p>
        <p><strong>Verilen:</strong> {order.offerAmount} {order.offerCoin}</p>
        <p><strong>Karşılık:</strong> {order.receiveAmount} {order.receiveCoin}</p>
      </div>

      <button
        className="mt-6 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
        onClick={handleAccept}
        disabled={loading}
      >
        {loading ? 'İşlem Yapılıyor...' : 'Takas Et'}
      </button>

      {message && <p className="mt-4 text-sm text-center text-yellow-400">{message}</p>}
    </div>
  );
}