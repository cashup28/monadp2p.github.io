// ✅ /pages/api/withdraw-monad.js
import { ethers } from "ethers";
const provider = new ethers.JsonRpcProvider(process.env.MONAD_RPC);
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Sadece POST" });
  const { toAddress, amount } = req.body;
  if (!toAddress || !amount) return res.status(400).json({ error: "Eksik bilgi" });

  try {
    const signer = new ethers.Wallet(process.env.MONAD_PRIVATE_KEY, provider);
    const tx = await signer.sendTransaction({
      to: toAddress,
      value: ethers.parseUnits(amount.toString(), 18),
    });
    await tx.wait();
    return res.status(200).json({ success: true, txHash: tx.hash });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}