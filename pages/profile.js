// /pages/profile.js
import dynamic from "next/dynamic";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { TonConnectButton } from "@tonconnect/ui-react";
import WithdrawForm from "@/components/WithdrawForm";

const Profile = () => {
  const {
    userId,
    walletAddress,
    monadBalance,
    tonBalance,
    monadWallet,
    disconnectWallet
  } = useUser();

  const [selectedDepositType, setSelectedDepositType] = useState("ton");

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-6">
      <h1 className="text-3xl font-bold text-purple-400 mb-6 text-center">Kullanıcı Profil Sayfası</h1>

      {/* Kullanıcı Bilgileri */}
      <div className="bg-gray-800 rounded-2xl p-5 shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-3 text-purple-300">Cüzdan Bilgileri</h2>
        <p className="mb-2"><strong>Profil ID:</strong> #{userId}</p>
        <p className="mb-2"><strong>Wallet:</strong> {walletAddress || "Henüz bağlı değil"}</p>
        <TonConnectButton className="mt-2" />
      </div>

      {/* Bakiyeler */}
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

      {/* Deposit Türü Seçimi */}
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

      {/* Deposit Bilgileri */}
      {selectedDepositType === "ton" ? (
        <div className="bg-gray-900 p-4 rounded-xl mb-6">
          <h2 className="text-lg font-bold mb-2">TON Deposit</h2>
          <p className="text-gray-400 text-sm">
            TON yatırmak için yukarıdan cüzdanınızı bağlayın. Gönderim işlemi sonrası sistem otomatik tanıyacaktır.
          </p>
        </div>
      ) : (
        <div className="bg-gray-900 p-4 rounded-xl mb-6">
          <h2 className="text-lg font-bold mb-2">MONAD Deposit Adresi</h2>
          <p className="text-purple-400 break-all font-mono">{monadWallet || "Cüzdan oluşturuluyor..."}</p>
          <p className="text-sm text-gray-500 mt-1">Bu adres yalnızca sizin için oluşturulmuştur.</p>
        </div>
      )}

      {/* Withdraw Form */}
      <WithdrawForm userId={userId} />

      {/* Disconnect */}
      <div className="text-center mt-8">
        <button onClick={disconnectWallet} className="text-red-400 underline text-sm">
          Disconnect Wallet
        </button>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Profile), { ssr: false });