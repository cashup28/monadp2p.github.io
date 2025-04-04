// pages/api/set-monad-wallet.js

let monadWalletsDB = {}; // { userId: [addr1, addr2, ...] }

export default function handler(req, res) {
  const { method } = req;
  const { userId, address } = req.body;

  if (!userId || !address) {
    return res.status(400).json({ success: false, error: 'Eksik veri' });
  }

  if (!address.startsWith('0x') || address.length !== 42) {
    return res.status(400).json({ success: false, error: 'Geçersiz MONAD adresi' });
  }

  if (!monadWalletsDB[userId]) {
    monadWalletsDB[userId] = [];
  }

  if (method === 'POST') {
    for (const [uid, list] of Object.entries(monadWalletsDB)) {
      if (list.includes(address) && uid !== userId) {
        return res.status(409).json({ success: false, error: 'Bu adres başka kullanıcıya ait' });
      }
    }

    if (monadWalletsDB[userId].includes(address)) {
      return res.status(200).json({ success: true, monadWallets: monadWalletsDB[userId] });
    }

    if (monadWalletsDB[userId].length >= 3) {
      return res.status(400).json({ success: false, error: 'Maksimum 3 MONAD cüzdan eklenebilir' });
    }

    monadWalletsDB[userId].push(address);
    return res.status(200).json({ success: true, monadWallets: monadWalletsDB[userId] });
  }

  if (method === 'DELETE') {
    monadWalletsDB[userId] = monadWalletsDB[userId].filter((a) => a !== address);
    return res.status(200).json({ success: true, monadWallets: monadWalletsDB[userId] });
  }

  return res.status(405).json({ success: false, error: 'Geçersiz istek tipi' });
}
