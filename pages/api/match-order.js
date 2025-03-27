// /pages/api/match-order.js

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
  
    const { orderId, takasYapanId } = req.body;
  
    try {
      // 1. Emri getir (örnek statik veri, gerçek sistemde DB'den alınır)
      const order = {
        id: orderId,
        from: 'TON',
        fromAmount: 1.5,
        toAmount: 12,
        ownerId: '1053242',
      };
  
      // 2. Komisyon hesapla (%3)
      const komisyon = order.toAmount * 0.03;
      const kalanMiktar = order.toAmount - komisyon;
  
      // 3. Transfer işlemi simülasyonu (gerçekte burada blockchain işlemi yapılır)
      console.log(`Kullanıcı ${order.ownerId} → ${kalanMiktar} gönderildi`);
      console.log(`Komisyon (${komisyon}) sistem hesabına eklendi.`);
  
      // 4. Emir durumu güncelle (örnek log)
      console.log(`Order #${order.id} tamamlandı.`);
  
      res.status(200).json({
        message: `Takas işlemi başarılı. ${kalanMiktar} token gönderildi, %3 (${komisyon}) komisyon alındı.`
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Takas işlemi sırasında hata oluştu.' });
    }
  }
  