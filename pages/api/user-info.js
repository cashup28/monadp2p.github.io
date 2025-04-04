export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Sadece POST desteklenir' })
  }

  const { userId, wallet } = req.body
  if (!userId || !wallet) {
    return res.status(400).json({ error: 'Eksik parametre' })
  }

  try {
    const monadRes = await fetch(`https://testnet-explorer.monad.network/api/v1/balance/${wallet}`)
    const monadData = await monadRes.json()
    const monadBalance = monadData?.balance ?? '0.00'

    const tonRes = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${wallet}&api_key=${process.env.TONCENTER_API_KEY}`)
    const tonData = await tonRes.json()
    const tonBalance = tonData?.result ? (Number(tonData.result) / 1e9).toFixed(4) : '0.00'

    res.status(200).json({ userId, monadBalance, tonBalance })
  } catch (err) {
    console.error('Hata:', err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
}