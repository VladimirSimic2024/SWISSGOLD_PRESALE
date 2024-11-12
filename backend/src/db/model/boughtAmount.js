
const { Schema, model } = require('mongoose');

const boughtSchema = new Schema({
    boughtAmount: {type : Number, default: 0},
});

const BoughtAmount = model('BoughtAmount', boughtSchema);

module.exports = BoughtAmount;
