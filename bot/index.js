require('dotenv').config();
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Merhaba! MonadP2P botuna hoş geldiniz.');
});

// Mini App Başlatma Butonu
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

bot.launch().then(() => {
  console.log("✅ MonadP2P Bot is running...");
});
