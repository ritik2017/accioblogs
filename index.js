const express = require('express');
const db = require('./db');
const constants = require('./private_constants');

const app = express();

// Sessions related Dependencies
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);

// Controllers Routes
const AuthRouter = require('./Controllers/Auth');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const store = new MongoDBSession({
    uri: constants.mongoURI,
    collection: 'tb_sessions'
})

app.use(session({
    secret: constants.SESSIONKEY,
    resave: false,
    saveUninitialized: false,
    store: store
}))

app.get('/', (req, res) => {
    res.send({
        sttaus: 200,
        message: "Welcome to home page"
    })
})

// Authentication Router
app.use('/auth', AuthRouter);

app.listen(constants.PORT, () => {
    console.log(`Listening on port ${constants.PORT}`)
})
