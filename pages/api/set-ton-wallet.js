// pages/api/set-ton-wallet.js

let tonWalletsDB = {}; // { userId: [addr1, addr2, ...] }

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Yalnızca POST isteği kabul edilir' });
  }

  const { userId, address } = req.body;

  if (!userId || !address) {
    return res.status(400).json({ success: false, error: 'Eksik veri: userId veya address' });
  }

  // Başka kullanıcıya ait mi?
  for (const [id, list] of Object.entries(tonWalletsDB)) {
    if (list.includes(address) && id !== userId) {
      return res.status(409).json({ success: false, error: 'Bu TON adresi başka kullanıcıya ait' });
    }
  }

  if (!tonWalletsDB[userId]) {
    tonWalletsDB[userId] = [];
  }

  // Eğer zaten varsa ekleme
  if (tonWalletsDB[userId].includes(address)) {
    return res.status(200).json({ success: true, tonWallets: tonWalletsDB[userId] });
  }

  // Maksimum 3 cüzdan sınırı
  if (tonWalletsDB[userId].length >= 3) {
    return res.status(400).json({ success: false, error: 'Maksimum 3 TON cüzdan kaydedilebilir' });
  }

  tonWalletsDB[userId].push(address);

  return res.status(200).json({ success: true, tonWallets: tonWalletsDB[userId] });
}
