const MINIAPP_URL = "https://tma-gold-updown.web.app"
// Button IDs
const OPTIONS = {
  MAIN: 0,

  // TRADE: 1,
  WALLET: 2,

  WALLET_WITHDRAW_ALL_TON: 21,
  WALLET_WITHDRAW_X_TON: 22,
  WALLET_EXPORT_MNEMONIC: 23,
  WALLET_IMPORT_MNEMONIC: 24,
};

function json_inlineButtonItem(web, text) {
  return {
    text: text,
    web_app: web
  };
};

function json_buttonItem(key, cmd, text) {
  return {
    text: text,
    callback_data: JSON.stringify({ k: key, c: cmd }),
  };
};

const botWelcomeMessage = async (bot) => {
  return `asfdasdf`
  
}

function botWalletMessage(address, balance) {
  return `Address:
${address}
Balance: ${balance} TON

Tap to copy the address and send TON to deposit.`;
};

function botWelcomeOptions(sessionId) {
  return [
    [
      json_inlineButtonItem({ 'url': MINIAPP_URL }, 'Play')
    ],
  ];
}

const json_walletMenu = (sessionId) => {
  return [
    [
      json_buttonItem(sessionId, OPTIONS.WALLET_WITHDRAW_ALL_TON, "Withdraw all TON"),
      json_buttonItem(sessionId, OPTIONS.WALLET_WITHDRAW_X_TON, "Withdraw X TON"),
    ],
    [
      json_buttonItem(sessionId, OPTIONS.WALLET_EXPORT_MNEMONIC, "Export Mnemonic")
    ],
    [
      json_buttonItem(sessionId, OPTIONS.WALLET_IMPORT_MNEMONIC, "Import Mnemonic")
    ],
    [
      json_buttonItem(sessionId, OPTIONS.MAIN, "<< Back")
    ]
  ];
};

function json_mainMenu(sessionId) {
  const options = [
    [
      json_inlineButtonItem({ 'url': MINIAPP_URL }, 'Trade Now')
    ],
  ];

  return options
};

function json_mnemonicMenu(sessionId) {
  const options = [
    [
      json_buttonItem(sessionId, OPTIONS.MAIN, "<< Back")
    ]
  ];

  return options
};

function getMnemonicMessage(mnemonic) {
  return `Please take a note and write down the following mnemonic:

${mnemonic}

Please do not share this mnemonic with others.`;
};

module.exports = {
  OPTIONS,
  botWelcomeMessage,
  botWelcomeOptions,
  json_walletMenu,
  botWalletMessage,
  json_mainMenu,
  json_mnemonicMenu,
  getMnemonicMessage
}