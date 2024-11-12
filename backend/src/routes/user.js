const express = require('express');
const dotenv = require('dotenv');

const User = require('../db/model/user');

dotenv.config()

const router = express.Router()
// Route to get tasks
router.get('/', async (req, res) => {
  try {
    console.log(req.query)

    const { chatId } = req.query // Use query parameters for GET request
    let user = await User.findOne({ chatId })

    res.status(200).json({
      data: user,
    })
  } catch (error) {
    console.error(error)
    res.status(500).end()
  }
})

router.get('/referrals', async (req, res) => {
  try {
    console.log(req.query)

    const { referredBy } = req.query // Use query parameters for GET request
    let user = await User.find({ referredBy })

    res.status(200).json({
      data: user,
    })
  } catch (error) {
    console.error(error)
    res.status(500).end()
  }
})

// Route to post tasks
router.post('/', async (req, res) => {
  console.log("setUserInfo: ", req.body);
  const chatId = req.body.chatId
  const referredBy = req.body.referraled

  const fetchItem = await User.findOne({ chatId })
  if (fetchItem) {
    // update profile
    console.log("update user profile: ");
    const _updateResult = await User.updateOne({ chatId }, {
      chatId: chatId,
      referredBy: referredBy,
    });

    if (!_updateResult) {
      console.log("updateOne fail!", _updateResult);
      return res.send({ result: true, status: "FAIL", message: "Update Fail" });
    }

    return res.send({ result: true, status: "SUCCESS", message: "Update Success" });
  } else {
    const userItem = new User({
      telegramId: telegramId,
      chatId: chatId,
      referredBy: referredBy,
    })
    console.log("User Item: ", userItem);
    try {
      const savedItem = await userItem.save();
      console.log("save savedItem: ", savedItem);
    } catch (error) {
      console.log('Error saving item:', error);
      return res.send({ result: false, status: "FAIL", message: "Error saving item" });
    }
    return res.send({ result: true, status: "SUCCESS", message: "Create Success" });
  }
})

router.post('/wallet', async (req, res) => {
  console.log("setUserInfo: ", req.body);
  const chatId = req.body.chatId
  const wallet = req.body.wallet
  
  const fetchItem = await User.findOne({ chatId })
  if (fetchItem) {
    // update profile
    console.log("update user profile: ");
    const _updateResult = await User.updateOne({ chatId }, {
      chatId: chatId,
      wallet: wallet,
    });

    if (!_updateResult) {
      console.log("updateOne fail!", _updateResult);
      return res.send({ result: true, status: "FAIL", message: "Update Fail" });
    }

    return res.send({ result: true, status: "SUCCESS", message: "Update Success" });
  } else {
    const userItem = new User({
      chatId: chatId,
      wallet: wallet,
    })
    console.log("User Item: ", userItem);
    try {
      const savedItem = await userItem.save();
      console.log("save savedItem: ", savedItem);
    } catch (error) {
      console.log('Error saving item:', error);
      return res.send({ result: false, status: "FAIL", message: "Error saving item" });
    }
    return res.send({ result: true, status: "SUCCESS", message: "Create Success" });
  }
})

router.post('/acceptterms', async (req, res) => {
  console.log("setUserInfo: ", req.body);
  const chatId = req.body.chatId
  const status = req.body.status
  
  const fetchItem = await User.findOne({ chatId })
  if (fetchItem) {
    // update profile
    console.log("update user profile: ");
    const _updateResult = await User.updateOne({ chatId }, {
      chatId: chatId,
      status: status,
    });

    if (!_updateResult) {
      console.log("updateOne fail!", _updateResult);
      return res.send({ result: true, status: "FAIL", message: "Update Fail" });
    }

    return res.send({ result: true, status: "SUCCESS", message: "Update Success" });
  } else {
    const userItem = new User({
      chatId: chatId,
      status: status,
    })
    console.log("User Item: ", userItem);
    try {
      const savedItem = await userItem.save();
      console.log("save savedItem: ", savedItem);
    } catch (error) {
      console.log('Error saving item:', error);
      return res.send({ result: false, status: "FAIL", message: "Error saving item" });
    }
    return res.send({ result: true, status: "SUCCESS", message: "Create Success" });
  }
})

module.exports = router;