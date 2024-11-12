
const crypto = require('crypto');
const axios = require('axios');

const generateSHA = (str) => {
    const hash = crypto.createHash("md5");
    const digest = hash.update(str, "utf-8").digest();
    return digest.toString("hex");
};

const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const generateReferralCode = (chatid) => {

  const result = encodeURIComponent(btoa(chatid))
  return result
}

const decodeReferralCode = (code) => {
  try {
      return atob(decodeURIComponent(code))
  } catch (err) {
      return ''
  }  
}

const getGoldPrice = async () => {
  const url = "https://www.goldapi.io/api/XAU/USD";
  const headers = {
    "x-access-token": process.env.goldPriceApiKey
  };

  const response = await axios.get(url, { headers });
  return Number(response.data.price);
};

module.exports = { 
  generateSHA, 
  sleep,
  generateReferralCode,
  decodeReferralCode,
  getGoldPrice,
};
