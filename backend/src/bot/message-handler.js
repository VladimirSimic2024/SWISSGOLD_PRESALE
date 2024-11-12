const { botWelcomeMessage, OPTIONS, json_walletMenu, botWalletMessage, botWelcomeOptions, json_mainMenu, json_mnemonicMenu, getMnemonicMessage } = require("./message-data");
const User = require('../db/model/user');
const Referral = require('../db/model/referral');
const {decodeReferralCode} = require('../utils/basic');

async function botMessageHandler(bot, msg) {
  console.log(`[DM] bot message: `, msg)
  const chatId = msg.chat.id;
  let referralCode = ""; // Extract the referral code if available
  
  if (msg.text.split(" ").length > 1) {
    referralCode = msg.text.split(" ")[1];
    console.log('code = ', referralCode);
    referralCode = referralCode.slice(3);
  }
  else
    referralCode = "";
  let photoUrl;

  // Check if the user already exists
  let user = await User.findOne({ chatId: chatId });
  let referral;
  let referrerdId = "";
  console.log('user = ', user);
  if (!user) {
    console.log('user2...', chatId, referralCode);
    if (referralCode.length > 0) {
      // referral = await Referral.findOne({ referralCode: referralCode});
      referrerdId = decodeReferralCode(referralCode);
    }

    console.log('referred ID = ', referrerdId);
    // Get the user's profile photos
    const photos = await bot.getUserProfilePhotos(chatId, { limit: 1 });
    console.log('photos = ', photos);
    if (photos.total_count > 0) {
      const fileId = photos.photos[0][0].file_id; // Get the file ID of the first photo
      const file = await bot.getFile(fileId); // Get the file from Telegram
      photoUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`; // URL to download the photo
      
      console.log('Photo url = ', photoUrl);
    } else {
    }

    user = new User({
      chatId: chatId,
      referredBy: referrerdId || null, // Store who referred this user
      avatar: photoUrl,
    });
    console.log('User info = ', user);
    await user.save();
  
    // bot.sendMessage(chatId, 'Welcome to the bot! Thanks for joining.');
  } else {
    console.log('user1 = ', user);
    // bot.sendMessage(chatId, 'You are already registered.');
  }

  // command handler
  if (msg.entities) {
    msg.entities.forEach(entity => {
      if (entity.type !== 'bot_command')
        return

      const command = msg.text.slice(entity.offset, entity.offset + entity.length)
      console.log(`[DM](botMessageHandler) command =`, command)
      switch (command) {
        case '/start':
          botCmdHandlerStart(bot, chatId)
          break;

        default:
          break;
      }
    });
  }
}

async function botCallbackQueryHandler(bot, callbackQuery) {
  // console.log(`[DM](botCallbackQueryHandler) cmd =`, cmd)

}

async function botCmdHandlerStart(bot, chatId) {
  const keyboard = {
    inline_keyboard: botWelcomeOptions(chatId),
    resize_keyboard: true,
    one_time_keyboard: true,
    force_reply: true
  };
  const messageText = `<b>🚀SwissGold Bot – Your Gateway to SGOLD Presale!</b>
Get SGOLD at its lowest price during the limited-time presale! Predict gold prices, earn rewards, and track your progress all in one place. Stay ahead with notifications on exclusive offers and referral bonuses. <b>Don’t miss out—join now and boost your earnings!⌛💰</b>`;
  const imageUrl = 'https://green-tragic-peafowl-28.mypinata.cloud/ipfs/QmcyK8w7Wf7MAgnnUXbTK7H1TeGNdEGDVkQUXFx4WSxhfg';
  await bot.sendPhoto(chatId, imageUrl, {
    caption: messageText,
    reply_markup: keyboard,
    parse_mode: 'HTML'
  });
  // await bot.sendMessage(chatId, await botWelcomeMessage(bot), {
  //   reply_markup: keyboard,
  //   disable_web_page_preview: true,
  //   parse_mode: 'HTML'
  // })
}

module.exports = {
  botMessageHandler,
  botCallbackQueryHandler,
}