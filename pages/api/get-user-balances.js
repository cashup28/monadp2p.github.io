// pages/api/get-user-balances.js

// Mock veri: userId -> bakiye eşleşmesi
const userBalances = {
  user123456: { monad: 100, ton: 5 },
  user654321: { monad: 250, ton: 12.5 },
};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Sadece POST isteği desteklenir' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, error: 'userId eksik' });
  }

  const balances = userBalances[userId] || { monad: 0, ton: 0 };

  return res.status(200).json({ success: true, ...balances });
}