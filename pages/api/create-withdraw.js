// /pages/api/create-withdraw.js
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Sadece POST isteği kabul edilir.' });
  }

  const { userId, amount, token, address } = req.body;

  if (!userId || !amount || !token || !address) {
    return res.status(400).json({ error: 'Eksik bilgi gönderildi.' });
  }

  const data = await readWithdraws();
  const newWithdraw = {
    id: uuidv4(),
    userId,
    amount,
    token,
    address,
    status: 'pending'
  };

  data.push(newWithdraw);
  await writeWithdraws(data);

  return res.status(200).json({ success: true, id: newWithdraw.id });
}
