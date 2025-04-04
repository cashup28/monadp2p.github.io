// bot.js (ANA BOT DOSYASI)
require("dotenv").config();
const { Telegraf, Scenes, session } = require("telegraf");
const stage = require("./botStage");

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// Sahne desteği
bot.use(session());
bot.use(stage.middleware());

// /start komutu
bot.start((ctx) => ctx.reply("🤖 Monad Bot'a hoş geldin! /example yazabilirsin"));

bot.command("example", (ctx) => ctx.scene.enter("example"));

// Botu çalıştır
bot.launch();
console.log("✅ Bot başlatıldı.");
