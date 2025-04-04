// pages/api/set-ton-wallet.js

let userWallets = {}; // Bu örnek dosya bazlı saklama için. Prod ortamda veritabanı kullanılmalı.

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Yalnızca POST isteği kabul edilir' });
  }

  const { userId, tonWallet } = req.body;

  if (!userId || !tonWallet) {
    return res.status(400).json({ success: false, error: 'Eksik veri: userId veya tonWallet yok' });
  }

  // Aynı adres başka kullanıcıya atanmış mı kontrolü (basit versiyon)
  for (const [id, addr] of Object.entries(userWallets)) {
    if (addr === tonWallet && id !== userId) {
      return res.status(409).json({ success: false, error: 'Bu TON adresi başka kullanıcıya ait' });
    }
  }

  // Kayıt işlemi
  userWallets[userId] = tonWallet;

  return res.status(200).json({ success: true, tonWallet });
}
