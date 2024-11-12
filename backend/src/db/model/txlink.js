
const { Schema, model } = require('mongoose');

const txlinksSchema = new Schema({
    chatId: { type: String, required: true },
    txlinks: { type: [String], default: [] },
});

const TxLink = model('TxLink', txlinksSchema);

module.exports = TxLink;
