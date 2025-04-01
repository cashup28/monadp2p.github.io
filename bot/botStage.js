const { Scenes } = require("telegraf");

const exampleScene = new Scenes.BaseScene("example");

exampleScene.enter((ctx) => ctx.reply("Sahneye hoş geldin!"));
exampleScene.on("text", (ctx) => ctx.reply("Yazdığın: " + ctx.message.text));

const stage = new Scenes.Stage([exampleScene]);

module.exports = stage;

