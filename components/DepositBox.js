// /components/DepositBox.js
import { useState } from 'react';

export default function DepositBox({ userId }) {
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('TON');
  const [status, setStatus] = useState(null);

  const handleDeposit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    // Burada gerçek sistemde bir blockchain işlemi veya admin onayı olabilir
    // Simülasyon için console log yapıyoruz
    console.log(`💸 Kullanıcı ${userId}, ${amount} ${token} yatırdı.`);
    setStatus('success');
    setAmount('');
  };

  return (
    <form onSubmit={handleDeposit} className="space-y-4 p-4 border rounded-md">
      <h2 className="text-lg font-semibold">Deposit</h2>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Yatırılacak miktar"
        className="w-full border p-2 rounded"
        required
      />

      <select
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="TON">TON</option>
        <option value="MONAD">MONAD</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >Yatır</button>

      {status === 'success' && <p className="text-green-600">✅ İşlem simüle edildi</p>}
    </form>
  );
}
