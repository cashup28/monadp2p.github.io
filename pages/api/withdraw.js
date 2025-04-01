import fs from 'fs';
import path from 'path';
import { sendTelegramLog } from './utils/telegram';

const filePath = path.join(process.cwd(), 'data', 'withdraws.json');

function readWithdraws() {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeWithdraws(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    const data = readWithdraws();
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { id, action, userId, token, amount, address } = req.body;
    const data = readWithdraws();

    // 🔐 Admin işlemleri (onay/reddet)
    if (id && action) {
      const index = data.findIndex(w => w.id === id);
      if (index === -1) return res.status(404).json({ error: 'İşlem bulunamadı.' });

      if (action === 'approve') {
        data[index].status = 'approved';
      } else if (action === 'reject') {
        data[index].status = 'rejected';
      } else {
        return res.status(400).json({ error: 'Geçersiz işlem türü.' });
      }

      writeWithdraws(data);

      const logMsg = `🔔 Admin: Kullanıcı ${data[index].userId} (${data[index].amount} ${data[index].token}) için '${action}' işlemi yaptı.\nHedef: ${data[index].address}`;
      sendTelegramLog(logMsg);

      return res.status(200).json({ success: true, id, status: data[index].status });
    }

    // ✅ Kullanıcı withdraw talebi oluşturuyor
    if (userId && token && amount && address) {
      const newWithdraw = {
        id: Date.now().toString(),
        userId,
        token,
        amount,
        address,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      data.push(newWithdraw);
      writeWithdraws(data);

      const userLog = `📥 Yeni Withdraw Talebi\n👤 Kullanıcı: ${userId}\n💰 ${amount} ${token}\n🎯 Adres: ${address}`;
      sendTelegramLog(userLog);

      return res.status(200).json({ success: true, id: newWithdraw.id });
    }

    return res.status(400).json({ error: 'Eksik bilgi gönderildi.' });
  }

  return res.status(405).json({ error: 'Yalnızca GET ve POST destekleniyor.' });
}
