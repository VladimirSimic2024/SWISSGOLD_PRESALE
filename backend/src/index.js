const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');

const { connect } = require('./db');
const { botStart } = require('./bot');

const routesApi = require('./routes/app.route')
const user = require('./routes/user')
const presale = require('./routes/presale')
const game = require('./routes/game')
const referral = require('./routes/referral')
const tokenprice = require('./routes/tokenprice')

const app = express();

dotenv.config();

app.use(cors({origin: '*'}));
app.use(express.json());
app.use(fileUpload({ createParentPath: true }));

// app.use('/api', routesApi);
app.use('/api/game', game);
app.use('/api/user', user);
app.use('/api/presale', presale);
app.use('/api/referral', referral);
app.use('/api/price', tokenprice);


const port = 2102;
app.listen(port, async () => {
    console.log(`Server is running on PORT ${port}`);
    await connect();
    await botStart();
});


