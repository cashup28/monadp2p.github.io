// pages/api/withdraw.js

import { TonClient, WalletContractV4 } from 'ton';
import { mnemonicToWalletKey } from 'ton-crypto';
import { ethers } from 'ethers';

let balances = {
  // userId: { ton: Number, monad: Number }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Sadece POST desteklenir' });
  }

  const { userId, coin, amount, targetAddress } = req.body;
  const value = parseFloat(amount);

  if (!userId || !coin || !value || !targetAddress) {
    return res.status(400).json({ success: false, error: 'Eksik bilgi' });
  }

  if (!balances[userId] || balances[userId][coin] < value) {
    return res.status(400).json({ success: false, error: 'Yetersiz bakiye' });
  }

  try {
    if (coin === 'ton') {
      const client = new TonClient({ endpoint: 'https://toncenter.com/api/v2/jsonRPC' });
      const key = await mnemonicToWalletKey(process.env.TON_MNEMONIC.split(' '));
      const wallet = WalletContractV4.create({ workchain: 0, publicKey: key.publicKey });
      const contract = client.open(wallet);

      const seqno = await contract.getSeqno();
      await contract.sendTransfer({
        secretKey: key.secretKey,
        seqno,
        messages: [
          {
            to: targetAddress,
            value: value.toFixed(9).toString(),
            bounce: false,
          },
        ],
      });
    } else if (coin === 'monad') {
      const provider = new ethers.JsonRpcProvider(process.env.MONAD_RPC_URL);
      const wallet = new ethers.Wallet(process.env.MONAD_PRIVATE_KEY, provider);

      const tx = await wallet.sendTransaction({
        to: targetAddress,
        value: ethers.parseEther(value.toString())
      });
      await tx.wait();
    } else {
      return res.status(400).json({ success: false, error: 'Geçersiz coin türü' });
    }

    balances[userId][coin] -= value;
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Withdraw error:', err);
    return res.status(500).json({ success: false, error: 'Transfer başarısız' });
  }
}
