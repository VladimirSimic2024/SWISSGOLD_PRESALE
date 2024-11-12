
const { Schema, model } = require('mongoose');

const referralSchema = new Schema({
    chatId: { type: String, default: "" },
    referralCode: { type: String, default: ""},
});

const Referral = model('Referral', referralSchema);

module.exports = Referral;
