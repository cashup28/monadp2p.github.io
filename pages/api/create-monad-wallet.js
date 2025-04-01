import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'monad_wallets.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.body;

  const wallet = ethers.Wallet.createRandom();

  let wallets = [];
  if (fs.existsSync(filePath)) {
    wallets = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  wallets.push({
    userId,
    monadWallet: wallet.address,
    privateKey: wallet.privateKey, // backend’de güvende tut!
  });

  fs.writeFileSync(filePath, JSON.stringify(wallets, null, 2));

  return res.status(200).json({ monadWallet: wallet.address });
}
