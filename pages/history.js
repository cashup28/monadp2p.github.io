// /pages/history.js
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Örnek veriler (gerçek sistemde backend'den alınacak)
    setHistory([
      { id: 'TX12345', type: 'Withdraw', token: 'MONAD', amount: 20, status: 'Tamamlandı', date: '2025-03-25' },
      { id: 'TX12346', type: 'Deposit', token: 'TON', amount: 5.5, status: 'Tamamlandı', date: '2025-03-24' },
      { id: 'ORD789', type: 'Order', token: 'TON → MONAD', amount: 1.2, status: 'Bekliyor', date: '2025-03-26' },
      { id: 'ORD790', type: 'Order', token: 'MONAD → TON', amount: 15, status: 'Tamamlandı', date: '2025-03-23' },
    ]);
  }, []);

  return (
    <>
      <Head>
        <title>İşlem Geçmişi</title>
        <link href="/tailwind.css" rel="stylesheet" />
      </Head>
      <main className="min-h-screen bg-black text-white p-4">
        <h1 className="text-2xl font-bold mb-4">📜 İşlem Geçmişi</h1>

        <div className="space-y-3">
          {history.map((item) => (
            <div key={item.id} className="border border-gray-600 p-3 rounded">
              <p><b>ID:</b> {item.id}</p>
              <p><b>Tür:</b> {item.type}</p>
              <p><b>Miktar:</b> {item.amount} {item.token}</p>
              <p><b>Durum:</b> <span className={item.status === 'Tamamlandı' ? 'text-green-400' : 'text-yellow-400'}>{item.status}</span></p>
              <p><b>Tarih:</b> {item.date}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
