async function openMenu(bot, chatId, menuTitle, jsonButtons) {
  const keyboard = {
    inline_keyboard: jsonButtons,
    resize_keyboard: true,
    one_time_keyboard: true,
    force_reply: true
  };

  try {
    await bot.sendMessage(chatId, menuTitle, {
      reply_markup: keyboard,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    });
  } catch (err) {
    console.error('openMenu', err);
  }
};

async function switchMenuWithTitle(bot, chatId, messageId, title, json_buttons) {
  const keyboard = {
    inline_keyboard: json_buttons,
    resize_keyboard: true,
    one_time_keyboard: true,
    force_reply: true
  };

  try {
    await bot.editMessageText(title, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: keyboard,
      disable_web_page_preview: true,
      parse_mode: 'HTML'
    });
  } catch (err) {
    console.error('[switchMenuWithTitle]', err.message);
  }
};

async function sendReplyMessage(bot, chatid, message) {
  try {
    let data = {
      parse_mode: 'HTML',
      disable_forward: true,
      disable_web_page_preview: true,
      reply_markup: { force_reply: true }
    };

    await bot.sendMessage(chatid, message, data);
  } catch (err) {
    console.error('sendReplyMessage', err);
    return false;
  }

  return true;
};

module.exports = {
  openMenu,
  switchMenuWithTitle,
  sendReplyMessage
}