
const { Schema, model } = require('mongoose');

const walletSchema = new Schema({
    chatId: { type: String, default: "" },
    address: { type: String, default: "" },
    privatekey: { type: String, default: "" }
});

const Wallet = model('Wallet', walletSchema);

module.exports = Wallet;
