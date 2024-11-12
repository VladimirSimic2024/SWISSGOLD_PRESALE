
const { Schema, model } = require('mongoose');

const PresaleSchema = new Schema({
    chatId: { type: String, default: "" },
    tokenAmount: { type: Number, default: 0 },
    tonAmount: { type: Number, default: 0 },
    price: {type: Number, default:0.00001669 },
    txHash: {type: [String], default: []},
    totalAmount: { type: Number, default: 1000000000000},
    boughtAmount: { type: Number, default:0 },
    updateDate: { type: Date, required: true },
});

const Presale = model('Presale', PresaleSchema);

module.exports = Presale;
