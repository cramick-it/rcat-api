require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
// const cookieSession = require('cookie-session');
var cors = require('cors');

const app = express();

// const { cookieMaxAge } = require('./config/cookie');

const corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// // Cookies
// app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(cookieSession({
//     name    : process.env.COOKIE_NAME,
//     secret  : process.env.COOKIE_SECRET,
//     maxAge  : 1000 * 60 * 480,
//     httpOnly: true,
//     secure  : false,
//     sameSite: 'Lax',
//     domain  : process.env.COOKIE_DOMAIN,
// }));

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerDefinition =  {
    // Like the one described here: https://swagger.io/specification/#infoObject
    info: {
        title: 'RSong Asset Management API',
        version: '1.0.0',
        description: 'Test Express API with autogenerated swagger doc',
    },
    basePath: '/'
};
const swaggerOptions = {
    swaggerDefinition: swaggerDefinition,
    // List of files to be processes. You can also set globs './routes/*.js'
    apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
const swaggerUi = require('swagger-ui-express');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));




///////////////////////////
// Routes
///////////////////////////
const {
    homeRouter,
    statusRouter,
    loginRouter,
    usersRouter,
    kycRouter,
    songsRouter,
    testRouter
} = require('./routes');

app.use('/', homeRouter);
app.use('/status', statusRouter);
app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/kyc', kycRouter);
app.use('/songs', songsRouter);
app.use('/test', testRouter);

//////////////////////////////////////////
// Connecting to database
//////////////////////////////////////////
if (process.env.TEST !== 'true') {
    console.log('Trying to connect to mongo db ...');
    mongoose.connect(process.env.MONGODB_URI).catch(console.error);
    mongoose.connection
        .once('open', () => console.log('Connected to mongodb successfully!'))
        .on('error', (err) => console.error('Connection error:', err));
} else {
    console.log('In test mode not running mongo db ...');
}

module.exports = app;
