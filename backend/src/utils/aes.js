
const { AES, enc } = require("crypto-js");
const dotenv = require('dotenv');
dotenv.config();


// Encryption function
const encrypt = (text) => {
    const key = process.env.AES_KEY;
    const encrypted = AES.encrypt(text, key).toString();
    return encrypted;
}

// Decryption function
const decrypt = (encryptedText) => {
    const key = process.env.AES_KEY;
    const decrypted = AES.decrypt(encryptedText, key).toString(enc.Utf8);
    return decrypted;
};


module.exports = { encrypt, decrypt };
