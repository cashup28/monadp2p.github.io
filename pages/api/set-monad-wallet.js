// pages/api/set-monad-wallet.js

let monadWallets = {}; // Bu veriyi bir veritabanında saklayabilirsin!

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Sadece POST" });

  const { userId, address } = req.body;

  if (!userId || !address.startsWith("0x")) return res.status(400).json({ error: "Geçersiz" });

  // Eğer kullanıcı zaten bu adresi eklediyse hata ver
  const exists = Object.entries(monadWallets).find(
    ([key, val]) => val.toLowerCase() === address.toLowerCase() && key !== userId
  );
  if (exists) return res.status(409).json({ error: "Adres başka kullanıcıya ait" });

  // Eğer adres geçerli ise, cüzdanı kaydet
  monadWallets[userId] = address;
  return res.status(200).json({ success: true, monadWallet: address });
}
