let botState = {}

const STATES = {
  IDLE: 0,
  WITHDRAW: 1,
  IMPORT_WALLET: 2,
};

function setBotState(chatId, state) {
  botState[chatId] = state
}

function getBotState(chatId) {
  return botState[chatId]
}

module.exports = {
  setBotState,
  getBotState,
  STATES
}