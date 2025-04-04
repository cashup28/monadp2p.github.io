// pages/api/check-monad-deposits.js

export const config = {
  schedule: '*/1 * * * *'
};

import axios from 'axios';

let walletDB = {
  // userId: { ton: [...], monad: [...] }
};

let balances = {
  // userId: { ton: Number, monad: Number }
};

let processedMonadTxs = new Set();

const MONAD_POOL_WALLET = process.env.MONAD_POOL_WALLET || '0xPOOLMONAD1234567890abcdef';
const MONAD_EXPLORER_API = process.env.MONAD_EXPLORER_API || 'https://monad.blockscout.com/api';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Sadece GET isteği kabul edilir' });
  }

  try {
    const monadRes = await axios.get(`${MONAD_EXPLORER_API}?module=account&action=txlist&address=${MONAD_POOL_WALLET}`);
    const monadTxs = monadRes.data.result || [];

    for (const tx of monadTxs) {
      const txHash = tx.hash;
      const from = tx.from?.toLowerCase();
      const value = parseFloat(tx.value) / 1e18;

      if (!txHash || processedMonadTxs.has(txHash) || !from || !value) continue;

      for (const [userId, wallets] of Object.entries(walletDB)) {
        if (wallets.monad.map(a => a.toLowerCase()).includes(from)) {
          if (!balances[userId]) balances[userId] = { ton: 0, monad: 0 };
          balances[userId].monad += value;
          processedMonadTxs.add(txHash);
          console.log(`💰 MONAD Deposit: ${value} MONAD by ${userId}`);
        }
      }
    }

    return res.status(200).json({ success: true, message: 'MONAD işlemleri kontrol edildi', balances });
  } catch (error) {
    console.error('MONAD kontrol hatası:', error);
    return res.status(500).json({ success: false, error: 'MONAD işlemleri kontrolü başarısız' });
  }
}