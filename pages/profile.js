// /pages/profile.js
import { useEffect, useState } from 'react';
import { useTonConnectUI, TonConnectButton } from "@tonconnect/ui-react";
import { v4 as uuidv4 } from 'uuid';

export default function Profile() {
  const [tonConnectUI] = useTonConnectUI();
  const connected = tonConnectUI.connected;
  const userAddress = tonConnectUI.account?.address;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!connected || !userAddress) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: userAddress })
        });
        const data = await res.json();
        if (data?.profile) setProfile(data.profile);
      } catch (err) {
        console.error("Profil yüklenemedi", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [connected, userAddress]);

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Profil</h1>

      {!connected && (
        <div>
          <p className="mb-4">Cüzdanınızı bağlayarak profil oluşturabilirsiniz.</p>
          <TonConnectButton />
        </div>
      )}

      {connected && loading && <p>Yükleniyor...</p>}

      {connected && !loading && profile && (
        <div className="bg-zinc-800 p-4 rounded-xl shadow-xl">
          <p><strong>Profil ID:</strong> {profile.id}</p>
          <p><strong>TON Cüzdanı:</strong> {profile.address}</p>
          <p><strong>MONAD Bakiyesi:</strong> {profile.monadBalance} MONAD</p>
          <p><strong>TON Bakiyesi:</strong> {profile.tonBalance} TON</p>
        </div>
      )}
    </div>
  );
}
