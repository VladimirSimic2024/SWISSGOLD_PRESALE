
const jwt = require('jsonwebtoken');

const keys = require('../keys');
const { User } = require('../');
const { createWallet } = require('./wallet');


const register = async (req, resp) => {
    const query = req.body;
    console.log('register - query:', query);

    try {
        const chatid = query.chatid;

        // check user
        let user = await User.findOne({ chatid });
        if (user) {
            console.log(`User with chatid ${chatid} already exists`);
            return resp.json({
                success: true, 
                userId: user._id
            });
        }

        user = new User({
            chatid: query.chatid, 
            telegramId: query.telegramId, 
            username: query.username,
            referral: query.referral,
            avatar: query.avatar
        });
        await user.save();

        return resp.json({
            success: true, 
            userId: user._id
        });
    } catch (err) {
        console.error('register error:', err.message);
        return resp.json({
            success: false, 
            error: err.message
        });
    }
};

const login = async (req, resp) => {
    const query = req.body;
    console.log('login - query:', query);

    try {
        const chatid = query.chatid;

        // check user
        let user = await User.findOne({ chatid });
        if (!user) {
            console.error(`failed to find user with chatid ${chatid}`);
            return resp.json({
                success: false, 
                error: `failed to find user with chatid ${chatid}`
            });
        }
        
        user.loginAt = Date.now();
        user.status = true;
        await user.save();

        // Create JWT Payload
        const payload = {
            userId: user._id, 
            username: user.username, 
            avatar: user.avatar
        };

        // Sign JWT Token
        jwt.sign(
            payload, 
            keys.JWT_SECKEY, 
            { expiresIn: '24h' }, 
            (err, token) => {
                return resp.json({
                    success: true, 
                    token: 'Bearer ' + token
                });
            }
        );
    } catch (err) {
        console.error('login error:', err);
        return resp.json({
            success: false, 
            error: err.message
        });
    }
};


module.exports = { 
    register, 
    login 
};
