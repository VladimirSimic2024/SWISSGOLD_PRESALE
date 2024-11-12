const dotenv = require('dotenv');
dotenv.config();

exports.config = {
    testMode: process.env.TEST_MODE === 'true', 
    port: {
        https: 4301, 
        wss: 4302, 
    }, 
    network: (process.env.TEST_MODE === 'true') ? 'testnet' : 'mainnet', 
    tokenprice: 0.01,
    mininvestment: 100,
    
    PROGRAM_ID: (process.env.TEST_MODE === 'true') 
        ? 'EQB5d_3CmgZiv3rBN-sgyrvT1n3idzCdF2NX2134gcX0CdcM'    // Testnet
        : 'EQDcTg8IR7T77Fh6H2_l7wWNCEuGVyDehSlasb0ZMQg1z1Tp',   // Mainnet
};