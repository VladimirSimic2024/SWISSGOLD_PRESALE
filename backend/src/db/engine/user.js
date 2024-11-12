
const fs = require('fs').promises;
const path = require('path');

const User = require('../model/user');

const getReferralList = async (req, resp) => {
    const query = req.body;
    console.log('referral - query:', query);

    try {
        let referrals = await User.find({ referral: query.referral });
        if (!referrals) {
          console.error('referral error: Non-existent referral');
          return resp.status(400).json({ error: "Non-existent referral" });
        }

        return resp.status(200).json({
            avatarUrl: user.avatar,
            mimetype: avatar.mimetype,
            size: avatar.size
          });
      } catch (err) {
        console.error('unfollowUser error:', err);
        return resp.status(400).json({ error: err.message });
      }
}

const getPassedSeconds = async (start, end) => {
  const difference = end - start; // Difference in milliseconds
  return Math.floor(difference / 1000); // Convert to seconds
};

module.exports = {
    getReferralList,
    getPassedSeconds,
};
