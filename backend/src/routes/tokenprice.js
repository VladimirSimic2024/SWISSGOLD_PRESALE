const express = require('express');
const dotenv = require('dotenv');
const axios = require("axios");

const Price = require('../db/model/tokenprice');

dotenv.config()

const router = express.Router()
// Route to get tasks
router.get('/', async (req, res) => {
  try {
    // console.log(req.query)

    let tonprice = await Price.find()
    res.status(200).json({
      data: tonprice[0].tonprice,
    })
  } catch (error) {
    console.error(error)
    res.status(500).end()
  }
})

// Function to get the Toncoin price
const getTonPrice = async () => {
  // Define the API URL
  const url = "https://tonapi.io/v2/rates?tokens=ton&currencies=usd";
  
  try {
    // Make a GET request using axios
    const response = await axios.get(url);
    // Extract the Toncoin price from the response
    const tonprice = response.data.rates.TON.prices.USD;
    // console.log(`The current price of Toncoin in USD is: ${tonprice}`);
    const fetchItem = await Price.findOne();
    if (fetchItem) {
      const _updateResult = await Price.updateOne(
        { },
        {
          tonprice: tonprice,
        }
      );
    } else {
      const priceItem = new Price({
        tonprice: tonprice,
      });
      console.log("priceItem: ", priceItem);
      try {
        const savedItem = await priceItem.save();
        console.log("save savedItem: ", savedItem);
      } catch (error) {
        console.log("Error saving item:", error);
      }
    }
    
  } catch (error) {
    console.error("Error fetching the Toncoin price:", error);
  }
};

setInterval(getTonPrice, 60000);

module.exports = router;