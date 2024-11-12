const express = require("express");
const dotenv = require("dotenv");

const TxLink = require("../db/model/presale");
const User = require("../db/model/user");

dotenv.config();

const router = express.Router();

// Route to get tasks
router.get("/", async (req, res) => {
  try {
    const { chatId } = req.query; // Use query parameters for GET request
    
    let txlinks = await TxLink.findOne({ chatId });
    res.status(200).json({
      data: txlinks,
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
  const txlink = req.body.txlink;
  
  const fetchItem = await TxLink.findOne({ chatId });
  if (fetchItem) {
    // update profile
    console.log("update txlinks: ", fetchItem);
    let txlinks = fetchItem.txlink;
    txlinks.push(txlink);
    const _updateResult = await TxLink.updateOne(
      { chatId },
      {
        chatId: chatId,
        txlink: txlinks,
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
    const txlinkItem = new TxLink({
      chatId: chatId,
      txlink: txlink
    });
    console.log("presaleItem: ", txlinkItem);
    try {
      const savedItem = await txlinkItem.save();
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
