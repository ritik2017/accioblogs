const express = require('express');
const db = require('./db');
const constants = require('./private_constants');

const app = express();

// Sessions related Dependencies
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);

// Controllers Routes
const AuthRouter = require('./Controllers/Auth');
const BlogsRouter = require('./Controllers/Blogs');
const FollowRouter = require('./Controllers/Follow');

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

// Blogs Router
app.use('/blogs', BlogsRouter);

// Follow Router
app.use('/follow', FollowRouter);

app.listen(constants.PORT, () => {
    console.log(`Listening on port ${constants.PORT}`)
})


/**
 * let obj = {
 *     "name": "Ritik",
 *     "birthDetails": {
 *          "dob"
 *      }
 *      "education" {
 *          "college"    
 *      }
 * }
 * 
 * {
 *      ...obj.birthDetails
 *      ...obj.education
 *      "name": obj.name,
 *
 * }
 * 
 * {
 *      "name"
 *      "dob"
 *      "college"
 * }
 * 
 * Object.keys(obj).forEach(key => {
 *      console.log(key);
 * })
 * 
 * [1, [1,2,3], [4,5,[6,2]], [], []]
 * 
 */

// // 1, 1, 2, 3, 4, 5, 6, 2
// function traverseArray(arr, ind) {
//     if(ind === arr.length) 
//         return; 
//     if(typeof(arr[ind]) == "number") {
//         console.log(arr[ind]);
//         traverseArray(arr, ind+1);
//         return;
//     }

//     traverseArray(arr[ind], 0); // 1,2,3
//     traverseArray(arr, ind+1);
// }

// traverseArray(arr, 0);