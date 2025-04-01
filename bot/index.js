require("dotenv").config();
const { Telegraf, Scenes, session } = require("telegraf");
const stage = require("./botStage.js"); // ← .js UZANTISI MUTLAKA GEREKLİ

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// Orta katmanlar
bot.use(session());
bot.use(stage.middleware());

// Basit komutlar
bot.start((ctx) => ctx.reply("🚀 Bot başlatıldı!"));
bot.help((ctx) => ctx.reply("Komutlar: /start /help /test"));
bot.command("test", (ctx) => ctx.reply("✅ Test başarılı!"));

// Hata yakalama
bot.catch((err, ctx) => {
  console.error("❌ Hata:", err);
  ctx.reply("Bir hata oluştu!");
});

// Başlat
bot.launch();
console.log("✅ Bot aktif! Ctrl+C ile durdurabilirsin.");
