import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { TonConnectButton, useTonConnectUI } from "@tonconnect/ui-react";
import WithdrawForm from "@/components/WithdrawForm";
import BackButton from "@/components/BackButton";

const Profile = () => {
  const {
    userId,
    walletAddress,
    monadBalance,
    tonBalance,
    monadWallet,
    setMonadWallet,
    disconnectWallet
  } = useUser();

  const [selectedDepositType, setSelectedDepositType] = useState("ton");
  const [tonDepositAmount, setTonDepositAmount] = useState('');
  const [tonConnectUI] = useTonConnectUI();

  useEffect(() => {
    if (!monadWallet && userId) {
      fetch('/api/create-monad-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      .then(res => res.json())
      .then(data => {
        setMonadWallet(data.monadWallet);
      })
      .catch(err => console.error(err));
    }
  }, [userId]);

  async function handleTonDeposit(amount) {
    if (!walletAddress) {
      alert("Önce cüzdanınızı bağlayın!");
      return;
    }

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 300,
      messages: [{
        address: 'UQBijqYGL8mZ8NeBvmmcNpu1mGdj0yAu3wcsr0p2FmsNaT-A',
        amount: (parseFloat(amount) * 1e9).toString()
      }]
    };

    try {
      await tonConnectUI.sendTransaction(transaction);
      console.log('Deposit başarılı!');
      // Bakiyeyi backend'de güncelle
    } catch (error) {
      console.error('Deposit hata:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-6">
      <BackButton />
      <h1 className="text-3xl font-bold text-purple-400 mb-6 text-center">Kullanıcı Profil Sayfası</h1>

      <div className="bg-gray-800 rounded-2xl p-5 shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-3 text-purple-300">Cüzdan Bilgileri</h2>
        <p className="mb-2"><strong>Profil ID:</strong> #{userId}</p>
        <p className="mb-2"><strong>Wallet:</strong> {walletAddress || "Henüz bağlı değil"}</p>
        <TonConnectButton className="mt-2" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 rounded-xl p-4 shadow-md text-center">
          <p className="text-sm text-gray-300">TON Bakiyesi</p>
          <p className="text-xl font-bold text-green-400">{tonBalance}</p>
        </div>
        <div className="bg-gray-700 rounded-xl p-4 shadow-md text-center">
          <p className="text-sm text-gray-300">MONAD Bakiyesi</p>
          <p className="text-xl font-bold text-indigo-400">{monadBalance}</p>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-xl mb-6">
        <h2 className="text-lg font-bold mb-2">Deposit Türü Seç</h2>
        <select
          value={selectedDepositType}
          onChange={(e) => setSelectedDepositType(e.target.value)}
          className="bg-gray-900 text-white border border-gray-600 px-4 py-2 rounded w-full"
        >
          <option value="ton">TON Deposit</option>
          <option value="monad">MONAD Deposit</option>
        </select>
      </div>

      {selectedDepositType === "ton" ? (
        <div className="bg-gray-900 p-4 rounded-xl mb-6">
          <h2 className="text-lg font-bold mb-2">TON Deposit</h2>
          <input
            type="number"
            value={tonDepositAmount}
            onChange={(e) => setTonDepositAmount(e.target.value)}
            placeholder="TON miktarı"
            className="w-full p-2 rounded text-black my-2"
          />
          <button
            onClick={() => handleTonDeposit(tonDepositAmount)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Deposit Yap
          </button>
        </div>
      ) : (
        <div className="bg-gray-900 p-4 rounded-xl mb-6">
          <h2 className="text-lg font-bold mb-2">MONAD Deposit Adresi</h2>
          <p className="text-purple-400 break-all font-mono">{monadWallet || "Cüzdan oluşturuluyor..."}</p>
          <p className="text-sm text-gray-500 mt-1">Bu adres yalnızca sizin için oluşturulmuştur.</p>
        </div>
      )}

      <WithdrawForm userId={userId} />

      <div className="text-center mt-8">
        <button onClick={disconnectWallet} className="text-red-400 underline text-sm">
          Disconnect Wallet
        </button>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
