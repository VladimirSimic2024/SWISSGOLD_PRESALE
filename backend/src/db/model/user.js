
const { Schema, model } = require('mongoose');


const userSchema = new Schema({
    chatId: { type: String, default: '' },
    telegramId: { type: String, default: '' },
    wallet: { type: String, default: ''},
    referredBy: { type: String, default: '' },
    referralReward: { type: Number, default: 0},

    avatar: { type: String, default: null },
    loginAt: { type: Date, default: null },
    status: { type: Boolean, default: false }, // ACTIVE/INACTIVE
});

const User = model('User', userSchema);

module.exports = User;
