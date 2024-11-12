
const dotenv = require('dotenv');
dotenv.config();

console.log(process.env.DB_URI)

exports.url = (process.env.TEST_MODE === 'true') 
    ? `${process.env.DB_URI}_test` 
    : process.env.DB_URI;
