import Head from 'next/head';

export default function Orders() {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <h2 className="text-2xl font-bold text-purple-500 mb-4">Açık Emirler</h2>
  
        <div className="bg-purple-900 p-4 rounded-xl mb-2">
          <p>5 TON → 40 MONAD</p>
          <div className="flex gap-2 mt-2">
            <button className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg">İptal Et</button>
            <button className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-lg">Düzenle</button>
          </div>
        </div>
  
        <h3 className="text-xl font-semibold mt-6 mb-2">Geçmiş İşlemler</h3>
        <div className="text-sm">
          <p>Deposit – 20 MONAD – Başarılı – ID: TX8347</p>
          <p>Withdraw – 5 TON – Bekliyor – ID: TX8348</p>
        </div>
      </div>
    );
  }
