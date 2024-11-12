
const fs = require('fs').promises;
const path = require('path');

const Referral = require('../model/referral');
const User = require('../model/user');

const getReferral = async (referrerId) => {
  console.log('referral - query:', referrerId);

  try {
    let referral = await User.findOne({ chatId: referrerId });
    if (!referral) {
      console.error('referral error: Non-existent referral');
    }

    return referral;
  } catch (err) {
    console.error('unfollowUser error:', err);
  }
}

const setReferral = async (referralUser, newReferralUser) => {
  console.log("setUserInfo: ", req.body);
  const telegramId = referralUser.telegramId

  const fetchItem = await Referral.findOne({ telegramId })
  if (fetchItem) {
    // update profile
    console.log("update referral: ");
    let referralList = fetchItem.referralList;
    referralList.push(newReferralUser);
    const _updateResult = await Referral.updateOne({ telegramId }, {
      telegramId: telegramId,
      referralList: referralList,
    });

    if (!_updateResult) {
      console.log("updateOne fail!", _updateResult);
      return res.send({ result: true, status: "FAIL", message: "Update Fail" });
    }

    return res.send({ result: true, status: "SUCCESS", message: "Update Success" });
  } else {
    const referralItem = new Referral({
      telegramId: telegramId,
      referralList: newReferralUser,
    })
    console.log("Referral Item: ", referralItem);
    try {
      const savedItem = await referralItem.save();
      console.log("save savedItem: ", savedItem);

    } catch (error) {
      console.log('Error saving item:', error);
      return res.send({ result: false, status: "FAIL", message: "Error saving item" });
    }
    return res.send({ result: true, status: "SUCCESS", message: "Create Success" });
  }
}

module.exports = {
  getReferral,
  setReferral,
};
