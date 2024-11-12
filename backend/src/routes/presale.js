const express = require("express");
const dotenv = require("dotenv");

const Presale = require("../db/model/presale");
const BoughtAmount = require("../db/model/boughtAmount");
const User = require("../db/model/user");
const Game = require("../db/model/game");
const Price = require("../db/model/tokenprice");

dotenv.config();

const router = express.Router();

const giveRewardToReferre = async (chatId, rewardAmount) => {
  let user = await User.findOne({ chatId });
  if (user) {
    user.referralReward += rewardAmount;
    await user.save();
  }
};

// Route to get tasks
router.get("/", async (req, res) => {
  try {
    const { chatId } = req.query; // Use query parameters for GET request
    let presale = await Presale.findOne({ chatId });
    let bought = await BoughtAmount.find();
    let boughtAmount = 0;
    if (bought.length > 0) boughtAmount = bought[0].boughtAmount;
    console.log('bought  = ', boughtAmount);

    if (!presale) {
      presale = new Presale({
        chatId: chatId,
        tonAmount: 0,
        tokenAmount: 0,
        price: 0.00001669,
        totalAmount: 1000000000000,
        boughtAmount: boughtAmount,
        updateDate: Date.now(),
      });
      console.log("presaleItem: ", presale);
      try {
        const savedItem = await presale.save();
        console.log("save savedItem: ", savedItem);
      } catch (error) {
        console.log("Error saving item:", error);
      }
    } else {
      await Presale.updateOne(
        { chatId },
        {
          boughtAmount: boughtAmount,
        }
      );
    }

    res.status(200).json({
      data: presale,
    });
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

// Route to post tasks
router.post("/", async (req, res) => {
  console.log("setUserInfo: ", req.body);
  const chatId = req.body.chatId;
  const price = await Price.findOne();
  const tonAmount = req.body.tonAmount;
  const tokenAmount = req.body.tokenAmount;
  let rewardAmount = 0;
  if (tonAmount * price.tonprice > 150) {
    rewardAmount = Math.round(tonAmount * price.tonprice / 150 * 50);
  }
  console.log('step1...', chatId);
  if (rewardAmount > 0)
    await giveRewardToReferre(chatId, rewardAmount);
  console.log('step2...');
  const txHash = req.body.txHash;
  let bought = await BoughtAmount.findOne();
  if (bought) {
    bought.boughtAmount += Number(tokenAmount);
    await bought.save();
  } else {
    bought = new BoughtAmount({
      boughtAmount: tokenAmount,
    });

    console.log("boughtItem: ", bought);
    try {
      const savedItem = await bought.save();
      console.log("save savedItem: ", savedItem);
    } catch (error) {
      console.log("Error saving item:", error);
    }
  }

  const fetchItem = await Presale.findOne({ chatId });
  if (fetchItem) {
    // update profile
    console.log("update presale: ");
    let txHashes = fetchItem.txHash;
    console.log('tx links = ', txHashes);
    txHashes.push(txHash);
    const _updateResult = await Presale.updateOne(
      { chatId },
      {
        chatId: chatId,
        tonAmount: Number(tonAmount) + Number(fetchItem.tonAmount),
        tokenAmount: Number(tokenAmount) + Number(fetchItem.tokenAmount),
        boughtAmount: Number(tokenAmount) + Number(fetchItem.boughtAmount),
        txHash: txHashes,
        updateDate: Date.now(),
      }
    );

    if (!_updateResult) {
      console.log("updateOne fail!", _updateResult);
      return res.send({ result: true, status: "FAIL", message: "Update Fail" });
    }

    return res.send({
      result: true,
      status: "SUCCESS",
      message: "Update Success",
    });
  } else {
    const presaleItem = new Presale({
      chatId: chatId,
      tonAmount: tonAmount,
      tokenAmount: tokenAmount,
      boughtAmount: boughtAmount,
      updateDate: Date.now(),
    });
    console.log("presaleItem: ", presaleItem);
    try {
      const savedItem = await presaleItem.save();
      console.log("save savedItem: ", savedItem);
    } catch (error) {
      console.log("Error saving item:", error);
      return res.send({
        result: false,
        status: "FAIL",
        message: "Error saving item",
      });
    }
    return res.send({
      result: true,
      status: "SUCCESS",
      message: "Create Success",
    });
  }
});

module.exports = router;
