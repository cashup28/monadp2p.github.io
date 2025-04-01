/* components/WithdrawForm.js */
import { useState } from 'react';

const WithdrawForm = ({ onWithdraw }) => {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !address) return;
    onWithdraw({ amount, address });
    setAmount('');
    setAddress('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        placeholder="Miktar"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 rounded bg-gray-800 text-white"
      />
      <input
        type="text"
        placeholder="Cüzdan adresi"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full p-2 rounded bg-gray-800 text-white"
      />
      <button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded"
      >
        Çekim Talebi Oluştur
      </button>
    </form>
  );
};

export default WithdrawForm;