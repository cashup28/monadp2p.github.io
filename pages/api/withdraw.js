// /pages/api/withdraw.js
import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'withdraws.json');

async function readWithdraws() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeWithdraws(data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function sendTelegramLog(message) {
  const botToken = process.env.BOT_TOKEN;
  const chatId = process.env.ADMIN_CHAT_ID;
  if (!botToken || !chatId) return;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message })
  });
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const data = await readWithdraws();
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { id, action } = req.body;
    const data = await readWithdraws();
    const index = data.findIndex(w => w.id === id);

    if (index === -1) return res.status(404).json({ error: 'İşlem bulunamadı.' });

    if (action === 'approve') {
      data[index].status = 'approved';
    } else if (action === 'reject') {
      data[index].status = 'rejected';
    } else {
      return res.status(400).json({ error: 'Geçersiz işlem türü.' });
    }

    await writeWithdraws(data);

    const logMsg = `🔔 Admin: Kullanıcı ${data[index].userId} (${data[index].amount} ${data[index].token}) için '${action}' işlemi yaptı.\nHedef: ${data[index].address}`;
    await sendTelegramLog(logMsg);

    return res.status(200).json({ success: true, id, status: data[index].status });
  }

  return res.status(405).json({ error: 'Yalnızca GET ve POST izinlidir.' });
}