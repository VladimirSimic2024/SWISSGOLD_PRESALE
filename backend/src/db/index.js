const mongoose = require('mongoose');

const dbConfig = require('./config');
const Game = require('./model/game');
const Presale = require('./model/presale');
const User = require('./model/user');
const Wallet = require('./model/wallet');

const connect = async () => {
    const dbUri = dbConfig.url;
    console.log('dbUri:', dbUri);

    mongoose
        .connect(dbUri)
        .then(() => {
            console.log("😊 Connected to MongoDB...");
        })
        .catch((err) => {
            console.error("😫 Could not connect to MongoDB...", err);
        });
};

module.exports = {
    connect,
    Game,
    Presale,
    User,
    Wallet
};
