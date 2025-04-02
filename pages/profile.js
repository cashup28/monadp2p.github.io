// ✅ GÜNCELLENMİŞ /pages/profile.js (özet olarak, detay az sonra yazılabilir)
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { TonConnectButton, useTonConnectUI } from "@tonconnect/ui-react";
import BackButton from "@/components/BackButton";
import { Copy } from "lucide-react";

const Profile = () => {
  const { userId, walletAddress, monadBalance, tonBalance } = useUser();
  const [tonDepositAmount, setTonDepositAmount] = useState("");
  const [tonConnectUI] = useTonConnectUI();
  const [userMonadAddress, setUserMonadAddress] = useState("");
  const [editingMonadAddress, setEditingMonadAddress] = useState(false);
  const [newMonadAddress, setNewMonadAddress] = useState("");

  const handleMonadAddressSave = async () => {
    if (!newMonadAddress.startsWith("0x")) return alert("Geçersiz adres");
    const res = await fetch("/api/set-monad-wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, address: newMonadAddress }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || "Hata");
    setUserMonadAddress(data.monadWallet);
    setEditingMonadAddress(false);
  };

  const handleTonDeposit = async () => {
    if (!tonConnectUI.wallet?.account?.address) return alert("Cüzdan yok");
    const tx = {
      validUntil: Math.floor(Date.now() / 1000) + 600,
      messages: [
        {
          address: process.env.NEXT_PUBLIC_TON_POOL_WALLET || "UQBijqY...",
          amount: (parseFloat(tonDepositAmount) * 1e9).toString(),
        },
      ],
    };
    await tonConnectUI.sendTransaction(tx);
    alert("İşlem gönderildi");
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pt-[16.6vh] flex flex-col gap-6">
      <BackButton />
      {/* Kullanıcı Bilgileri ve Adres Alanı burada */}
    </div>
  );
};
export default Profile;