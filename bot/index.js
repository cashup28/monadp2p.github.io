require('dotenv').config(); // .env dosyasını yükle

console.log("Token:", process.env.BOT_TOKEN); // Token doğrulama

const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

// Komut: /start → Hoş geldin + Mini App bağlantısı
bot.start((ctx) => {
  ctx.reply('Merhaba! MonadP2P botuna hoş geldiniz. 👋');
});

// Komut: /start → inline butonla Mini App açma
bot.command('start', (ctx) => {
  ctx.reply('MonadP2P Mini App’i başlatmak için aşağıdaki butona tıklayın 👇', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '📱 Uygulamayı Başlat',
            web_app: { url: 'https://monadp2p-github-io-ac.vercel.app/' }
          }
        ]
      ]
    }
  });
});

// Botu başlat
console.log("🚀 Bot başlatılıyor...");
bot.launch()
  .then(() => {
    console.log("✅ MonadP2P Bot is running...");
  })
  .catch((err) => {
    console.error("❌ Bot başlatılamadı:", err);
  });
