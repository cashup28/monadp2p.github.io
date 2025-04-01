import { useEffect, useState } from 'react';
import BackButton from '@/components/BackButton';

export default function AdminWithdrawPanel() {
  const [withdrawRequests, setWithdrawRequests] = useState([]);

  useEffect(() => {
    fetch('/api/withdraw')
      .then(res => res.json())
      .then(data => setWithdrawRequests(data))
      .catch(err => console.error('API error:', err));
  }, []);

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`/api/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      });

      if (res.ok) {
        setWithdrawRequests(prev =>
          prev.map(r => r.id === id ? { ...r, status: action === 'approve' ? 'approved' : 'rejected' } : r)
        );
        console.log(`✔ ${id} ${action} edildi.`);
      }
    } catch (err) {
      console.error('İşlem hatası:', err);
    }
  };

  return (
    <div className="p-4 text-white bg-black min-h-screen">
      <BackButton />
      <h1 className="text-xl font-bold mb-4">Withdraw Talepleri</h1>
      <ul className="space-y-4">
        {withdrawRequests.map(req => (
          <li key={req.id} className="border p-4 rounded-md bg-gray-800">
            <p><b>ID:</b> {req.id}</p>
            <p><b>Kullanıcı:</b> {req.userId}</p>
            <p><b>Miktar:</b> {req.amount} {req.token}</p>
            <p><b>Adres:</b> {req.address}</p>
            <p><b>Durum:</b> {req.status}</p>

            {req.status === 'pending' && (
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleAction(req.id, 'approve')}
                  className="bg-green-500 text-white px-4 py-1 rounded"
                >Onayla</button>
                <button
                  onClick={() => handleAction(req.id, 'reject')}
                  className="bg-red-500 text-white px-4 py-1 rounded"
                >Reddet</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}