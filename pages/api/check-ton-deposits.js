// pages/api/check-ton-deposits.js

import axios from 'axios';

let walletDB = {
  // userId: { ton: [...], monad: [...] }
};

let balances = {
  // userId: { ton: Number, monad: Number }
};

let processedTonTxs = new Set();

const TON_POOL_WALLET = process.env.TON_POOL_WALLET || 'EQC_POOL_WALLET_EXAMPLE_ADDRESS';
const TONCENTER_API = process.env.TONCENTER_API || 'https://toncenter.com/api/v2';
const TONCENTER_KEY = process.env.TONCENTER_KEY || '';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Sadece GET isteği kabul edilir' });
  }

  try {
    const response = await axios.get(`${TONCENTER_API}/getTransactions`, {
      params: {
        address: TON_POOL_WALLET,
        limit: 10,
        to_lt: 0,
        api_key: TONCENTER_KEY
      }
    });

    const transactions = response.data.result || [];

    for (const tx of transactions) {
      const txId = tx.transaction_id?.hash;
      const fromAddress = tx.in_msg?.source;
      const amountTon = parseInt(tx.in_msg?.value || '0') / 1e9;

      if (!txId || processedTonTxs.has(txId) || !fromAddress || !amountTon) continue;

      for (const [userId, wallets] of Object.entries(walletDB)) {
        if (wallets.ton.includes(fromAddress)) {
          if (!balances[userId]) balances[userId] = { ton: 0, monad: 0 };
          balances[userId].ton += amountTon;
          processedTonTxs.add(txId);
          console.log(`💰 TON Deposit: ${amountTon} TON by ${userId}`);
        }
      }
    }

    return res.status(200).json({ success: true, message: 'TON işlemleri kontrol edildi', balances });
  } catch (error) {
    console.error('TON kontrol hatası:', error);
    return res.status(500).json({ success: false, error: 'TON işlemleri kontrolü başarısız' });
  }
}