
const { Schema, model } = require('mongoose');

const priceSchema = new Schema({
    tonprice: { type: Number, default: 5.4 },
    goldprice: { type: Number, default: 0 }
});

const Price = model('Price', priceSchema);

module.exports = Price;
