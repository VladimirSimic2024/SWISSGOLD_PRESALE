
const { Schema, model } = require('mongoose');

const gameSchema = new Schema({
    chatId: { type: String, required: true },

    point: { type: Number, default: 0},
    energy: { type: Number, default: 30 },
    chargeTime: { type: Number, default: 0 },
    goldPrice: { type: Number, default: 0 }, // ACTIVE/INACTIVE
    upDown: { type: Boolean, default: true },
    passed: { type: Number, default: 0 },
    running: { type: Boolean, default: false },
    result: { type: Boolean, default: false },
});

const Game = model('Game', gameSchema);

module.exports = Game;
