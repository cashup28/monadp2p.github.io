import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import BackButton from '@/components/BackButton';

export default function HistoryPage() {
  const { userId } = useUser();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) return;
      const res1 = await fetch('/api/get-orders');
      const res2 = await fetch('/api/withdraw');

      const orders = await res1.json();
      const withdraws = await res2.json();

      const filtered = [
        ...orders.orders
          .filter((o) => o.userId === userId)
          .map((o) => ({
            type: 'order',
            coin: o.offerCoin,
            amount: o.offerAmount,
            status: o.status,
            id: o.id,
            time: o.timestamp,
          })),
        ...withdraws
          .filter((w) => w.userId === userId)
          .map((w) => ({
            type: 'withdraw',
            coin: w.token,
            amount: w.amount,
            status: w.status,
            id: w.id,
            time: w.createdAt,
          })),
      ];

      setHistory(filtered.sort((a, b) => new Date(b.time) - new Date(a.time)));
    };

    fetchHistory();
  }, [userId]);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <BackButton />
      <h1 className="text-xl font-bold mb-4 text-purple-400">İşlem Geçmişi</h1>

      {history.length === 0 ? (
        <p>Henüz işlem geçmişiniz yok.</p>
      ) : (
        <ul className="space-y-3">
          {history.map((item, i) => (
            <li key={i} className="border border-purple-700 rounded-lg p-3">
              <p><strong>Tür:</strong> {item.type === 'order' ? 'Takas' : 'Withdraw'}</p>
              <p><strong>Miktar:</strong> {item.amount} {item.coin}</p>
              <p><strong>Durum:</strong> {item.status}</p>
              <p className="text-sm text-gray-400">ID: {item.id}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}