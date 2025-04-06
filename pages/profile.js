import { useEffect, useState } from 'react';
import { useTonConnectUI, TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { useRouter } from 'next/router';
import { Address, fromNano } from '@ton/core';

// Çevresel değişkenlerden havuz adreslerini al
const TON_POOL_WALLET = process.env.NEXT_PUBLIC_TON_POOL_WALLET || 'EQC_POOL_WALLET_ORNEK_ADRES';

// TON adresini formatlayan yardımcı fonksiyon
const formatTonAddress = (hamAdres) => {
  try {
    const adres = Address.parseRaw(hamAdres);
    return adres.toString({ urlSafe: true, bounceable: true });
  } catch (hata) {
    console.error('TON adres formatlama hatası:', hata);
    return hamAdres;
  }
};

// TON bakiyesi sorgulama
const getTonBalance = async (adres) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_TONCENTER_API_KEY;
    const cevap = await fetch(
      `https://toncenter.com/api/v2/getAddressBalance?address=${adres}&api_key=${apiKey}`
    );
    const veri = await cevap.json();
    return veri.result ? parseFloat(fromNano(veri.result)) : 0;
  } catch (hata) {
    console.error('Bakiye sorgulama hatası:', hata);
    return 0;
  }
};

// Deposit işlemini backend'e gönder
const sendDepositRequest = async (miktar, adres) => {
  try {
    const yanit = await fetch('/api/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: miktar,
        address: adres,
      }),
    });
    return await yanit.json();
  } catch (hata) {
    console.error('Deposit gönderim hatası:', hata);
    return { success: false, message: 'İşlem sırasında hata oluştu' };
  }
};

export default function Profile() {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const router = useRouter();

  const [baglandi, setBaglandi] = useState(false);
  const [kisaAdres, setKisaAdres] = useState('');
  const [kullaniciId, setKullaniciId] = useState('');
  const [tonBakiye, setTonBakiye] = useState(0);
  const [depositMiktar, setDepositMiktar] = useState('');
  const [depositDurum, setDepositDurum] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  // Kullanıcı ID'sini localStorage'dan al veya oluştur
  useEffect(() => {
    const kayitliKullaniciId = localStorage.getItem('kullaniciId') ||
      `kullanici${Math.floor(100000 + Math.random() * 900000)}`;
    localStorage.setItem('kullaniciId', kayitliKullaniciId);
    setKullaniciId(kayitliKullaniciId);
  }, []);

  // Cüzdan bağlantısı değiştiğinde tetiklenir
  useEffect(() => {
    if (wallet?.account?.address) {
      const hamAdres = wallet.account.address;
      setBaglandi(true);
      setKisaAdres(formatTonAddress(hamAdres));
      
      // Bakiye güncelleme
      getTonBalance(hamAdres).then(bakiye => {
        setTonBakiye(bakiye);
      });
    } else {
      setBaglandi(false);
      setKisaAdres('');
    }
  }, [wallet]);

  // Deposit işlemini gerçekleştir
  const handleDeposit = async () => {
    if (!depositMiktar || isNaN(Number(depositMiktar)) || Number(depositMiktar) <= 0) {
      setDepositDurum({
        success: false,
        message: 'Lütfen geçerli bir miktar girin'
      });
      return;
    }

    if (!wallet?.account?.address) {
      setDepositDurum({
        success: false,
        message: 'Cüzdan bağlı değil'
      });
      return;
    }

    setYukleniyor(true);
    
    try {
      const sonuc = await sendDepositRequest(
        Number(depositMiktar),
        wallet.account.address
      );
      
      setDepositDurum(sonuc);
      
      if (sonuc.success) {
        setDepositMiktar('');
        // Bakiye yenile
        const guncelBakiye = await getTonBalance(wallet.account.address);
        setTonBakiye(guncelBakiye);
      }
    } catch (hata) {
      setDepositDurum({
        success: false,
        message: 'Beklenmeyen bir hata oluştu'
      });
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pt-[16.6vh]">
      {/* Başlık ve geri butonu */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => router.back()} 
          className="bg-zinc-800 text-white rounded-full px-4 py-1"
        >
          ← Geri
        </button>
        <h1 className="text-xl font-bold text-center w-full -ml-8">👤 Profil Sayfan</h1>
      </div>
      
      {/* Kullanıcı bilgileri */}
      <p><strong>Kullanıcı ID:</strong> {kullaniciId}</p>
      
      {/* Cüzdan bağlantı butonu */}
      <div className="mt-2 flex justify-end">
        <TonConnectButton />
      </div>
      
      {/* Bağlı cüzdan bilgisi */}
      {baglandi && (
        <div className="flex justify-end items-center gap-2 mt-2">
          <span className="text-xs">
            {kisaAdres} ({tonBakiye.toFixed(2)} TON)
          </span>
          <button 
            onClick={() => tonConnectUI.disconnect()} 
            className="text-red-400 text-xs"
          >
            Bağlantıyı Kes
          </button>
        </div>
      )}

      {/* Deposit formu */}
      <div className="bg-zinc-900 rounded-xl p-4 mt-4">
        <h3 className="font-semibold mb-2">Deposit Yap</h3>
        <input
          type="number"
          value={depositMiktar}
          onChange={(e) => setDepositMiktar(e.target.value)}
          className="w-full p-2 rounded text-black"
          placeholder="TON miktarı girin"
          min="0.1"
          step="0.1"
        />
        <button 
          onClick={handleDeposit} 
          disabled={yukleniyor}
          className={`bg-blue-500 text-white px-4 py-2 rounded w-full mt-2 ${
            yukleniyor ? 'opacity-50' : ''
          }`}
        >
          {yukleniyor ? 'İşleniyor...' : 'Deposit Yap'}
        </button>
        
        {/* İşlem durumu mesajı */}
        {depositDurum && (
          <p className={`mt-2 text-sm ${
            depositDurum.success ? 'text-green-400' : 'text-red-400'
          }`}>
            {depositDurum.message}
          </p>
        )}
      </div>

      {/* Hesap bilgileri */}
      <div className="bg-zinc-900 rounded-xl p-4 mt-4">
        <h3 className="font-semibold mb-2">Hesap Bilgisi</h3>
        <p><strong>TON Cüzdan Adresi:</strong> {kisaAdres || 'Bağlı değil'}</p>
        <p><strong>Bakiyeniz:</strong> {tonBakiye.toFixed(2)} TON</p>
      </div>
    </div>
  );
}