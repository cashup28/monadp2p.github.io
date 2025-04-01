// pages/api/create-order.js
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DB_PATH = path.join(process.cwd(), 'database.json');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Sadece POST isteği kabul edilir.' });
  }

  try {
    const { userId, offerCoin, offerAmount, receiveCoin, receiveAmount } = req.body;

    if (!userId || !offerCoin || !receiveCoin || !offerAmount || !receiveAmount) {
      return res.status(400).json({ error: 'Eksik veri gönderildi.' });
    }

    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

    const user = db.users.find((u) => u.id === userId);
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });

    // 1️⃣ Kullanıcının yeterli bakiyesi var mı?
    if (offerCoin === 'TON' && user.balance.ton < offerAmount) {
      return res.status(400).json({ error: 'Yetersiz TON bakiyesi.' });
    }
    if (offerCoin === 'MONAD' && user.balance.monad < offerAmount) {
      return res.status(400).json({ error: 'Yetersiz MONAD bakiyesi.' });
    }

    // 2️⃣ Miktarı kilitle (bakiyeden düş, kilitliye ekle)
    if (offerCoin === 'TON') {
      user.balance.ton -= offerAmount;
      user.locked.ton += offerAmount;
    } else {
      user.balance.monad -= offerAmount;
      user.locked.monad += offerAmount;
    }

    // 3️⃣ Yeni emir oluştur
    const newOrder = {
      id: uuidv4(),
      userId,
      offerCoin,
      offerAmount,
      receiveCoin,
      receiveAmount,
      timestamp: Date.now(),
      status: 'open',
    };

    db.orders.push(newOrder);

    // 4️⃣ Veritabanını güncelle
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

    return res.status(200).json({ success: true, order: newOrder });
  } catch (err) {
    console.error('Hata:', err);
    return res.status(500).json({ error: 'Sunucu hatası.' });
  }
}
