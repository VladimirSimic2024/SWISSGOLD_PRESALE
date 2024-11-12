const express = require("express");
const dotenv = require("dotenv");

const Game = require("../db/model/game");
const User = require("../db/model/user");
const Price = require("../db/model/tokenprice");
const getPassedSeconds = require("../db/engine/user");
const { getGoldPrice } = require("../utils/basic");

dotenv.config();

const predictionTime = 60;
const pointInterval = 50;
const router = express.Router();

const updatePredictionGame = async () => {
  let runnings = await Game.find({ running: true });
  console.log('Running = ', runnings);
  let i;
  const runningNum = runnings.length;
  for (i = 0; i < runningNum; i++) {
    const ithRun = runnings[i];
    const chatId = ithRun.chatId;
    let game = await Game.findOne({ chatId: chatId });
    let running = true;
    let goldprice = game.goldPrice;
    let result = game.result;
    let passed = 0;
    let point = game.point;
    if (game) {
      passed = Number(game.passed) + 1;
      if (passed == predictionTime) {
        goldprice = await getGoldPrice();
        running = false;
        if (game.upDown == true) result = goldprice > game.goldPrice ? true : false;
        else result = goldprice > game.goldPrice ? false : true;
        if (result == true) point += pointInterval;
      } else if (passed > predictionTime) passed = predictionTime;

      const _updateResult = await Game.updateOne(
        { chatId },
        {
          chatId: chatId,
          point: point,
          passed: passed,
          running: running,
          result: result,
        }
      );

      if (!_updateResult) {
        console.log("updateOne fail!", _updateResult);
      }
    }
  }
};

const giveRewardToReferre = async (chatId) => {
  let user = await User.findOne({ chatId });
  let referredBy;
  if (user) {
    console.log("user.....", user);
    referredBy = user.referredBy;
    let game;
    if (referredBy) {
      game = await Game.findOne({ chatId: referredBy });
      if (game) game.point += 1;
      else {
        game = new Game({
          chatId: referredBy,
          point: 1,
        });
        console.log("Game Item: ", game);
        try {
          const savedItem = await game.save();
          console.log("save savedItem: ", savedItem);
        } catch (error) {
          console.log("Error saving item:", error);
        }
      }
      await game.save();
    }
  }
};

// Route to get tasks
router.get("/", async (req, res) => {
  try {
    const { chatId } = req.query; // Use query parameters for GET request
    let game = await Game.findOne({ chatId });
    if (!game) {
      console.log("Game start...");
      game = new Game({
        chatId: chatId,
        point: 0,
        energy: 10,
      });
      console.log("gameItem: ", game);
      try {
        const savedItem = await game.save();
        console.log("save savedItem: ", savedItem);
      } catch (error) {
        console.log("Error saving item:", error);
      }
    }

    res.status(200).json({
      data: game,
    });
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

// Route to post tasks
router.post("/", async (req, res) => {
  console.log("setGameInfo: ", req.body);
  const chatId = req.body.chatId;
  let point = 0;
  let energy = 0;
  let chargeTime = req.body.chargeTime;
  let goldPrice = 0;
  console.log("Gold Price = ", goldPrice);
  let upDown = req.body.upDown;
  let passed = req.body.passed;
  let running = req.body.running;
  console.log('Set Running = ', running);
  let result = false;
  if (req.body.point) point = req.body.point;
  if (req.body.energy) energy = req.body.energy;

  if (running == true) {
    goldPrice = await getGoldPrice();
  }

  if (point > 0) {
    giveRewardToReferre(chatId);
  }

  const fetchItem = await Game.findOne({ chatId });
  if (fetchItem) {
    // update profile
    console.log("update user Game: ");
    const _updateResult = await Game.updateOne(
      { chatId },
      {
        chatId: chatId,
        point: Number(point) + Number(fetchItem.point),
        energy: energy,
        chargeTime: chargeTime,
        goldPrice: goldPrice,
        upDown: upDown,
        passed: passed,
        running: running,
        result: false,
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
    const gameItem = new Game({
      chatId: chatId,
      point: point,
      energy: energy,
      chargeTime: chargeTime,
      goldPrice: goldPrice,
      upDown: upDown,
      passed: passed,
      running: running,
      result: false,
    });
    console.log("Game Item: ", gameItem);
    try {
      const savedItem = await gameItem.save();
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

setInterval(updatePredictionGame, 1000);

module.exports = router;
