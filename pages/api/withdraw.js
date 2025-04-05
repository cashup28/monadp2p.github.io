// pages/api/withdraw.js (Final - gerçek transfer, canlı deploya hazır)

const axios = require('axios');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Yalnızca POST isteği destekleniyor' });
  }

  const { type, amount, address } = req.body;
  if (!type || !amount || !address) {
    return res.status(400).json({ success: false, message: 'Tüm alanlar zorunludur' });
  }

  try {
    if (type === 'TON') {
      const TON_API = process.env.TONCENTER_API;
      const TON_WALLET = process.env.TON_SENDER;
      const TON_PRIVATE = process.env.TON_PRIVATE_KEY;

      const response = await axios.post(`${TON_API}/sendTransaction`, {
        from: TON_WALLET,
        to: address,
        amount: parseFloat(amount) * 1e9,
        privateKey: TON_PRIVATE,
      });

      if (response.data && response.data.txid) {
        return res.status(200).json({ success: true, message: 'TON transferi başarılı', txid: response.data.txid });
      } else {
        return res.status(500).json({ success: false, message: 'TON transferi başarısız' });
      }
    } else if (type === 'MONAD') {
      const MONAD_RPC = process.env.MONAD_RPC;
      const MONAD_FROM = process.env.MONAD_SENDER;
      const wei = (parseFloat(amount) * 1e18).toString(16);

      const tx = {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_sendTransaction',
        params: [
          {
            from: MONAD_FROM,
            to: address,
            value: '0x' + wei,
            gas: '0x5208',
          },
        ],
      };

      const response = await axios.post(MONAD_RPC, tx);

      if (response.data && response.data.result) {
        return res.status(200).json({ success: true, message: 'MONAD transferi başarılı', txid: response.data.result });
      } else {
        return res.status(500).json({ success: false, message: 'MONAD transferi başarısız' });
      }
    } else {
      return res.status(400).json({ success: false, message: 'Geçersiz coin türü' });
    }
  } catch (error) {
    console.error('Withdraw error:', error);
    return res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
}
