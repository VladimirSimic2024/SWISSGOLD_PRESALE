const TelegramBot = require('node-telegram-bot-api');
const { botMessageHandler, botCallbackQueryHandler } = require('./message-handler');

const token = process.env.BOT_TOKEN;
let bot = undefined

async function botStart() {
  bot = new TelegramBot(token, { polling: true });
  bot.on('message', async(msg) => await botMessageHandler(bot, msg))
  bot.on('callback_query', async(callbackQuery) => await botCallbackQueryHandler(bot, callbackQuery))
  // bot.onText(/\/start (.+)/, async (msg, match) => await botStartHandler(bot, msg, match))
}

module.exports = {
  bot,
  botStart
}