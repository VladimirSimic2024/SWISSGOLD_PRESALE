const express = require('express');
const dotenv = require('dotenv');

const User = require('../db/model/user');
const Referral = require('../db/model/referral')
const { generateReferralCode } = require('../utils/basic')

dotenv.config()

const router = express.Router()
// Route to get tasks
router.get('/', async (req, res) => {
  try {
    console.log(req.query)

    const { chatId } = req.query // Use query parameters for GET request
    let referralItem = await Referral.findOne({ chatId: chatId })
    if (!referralItem) {
      const referralCode = generateReferralCode(chatId)
      referralItem = new Referral({
        chatId: chatId,
        referralCode: referralCode
      });
      console.log("referralItem: ", referralItem, chatId);
      try {
        const savedItem = await referralItem.save();
        console.log("save savedItem: ", savedItem);
      } catch (error) {
        console.log("Error saving item:", error);
      }
    }

    res.status(200).json({
      data: referralItem,
    })
  } catch (error) {
    console.error(error)
    res.status(500).end()
  }
})

module.exports = router;