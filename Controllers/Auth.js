const express = require('express');
const AuthRouter = express.Router();
const validator = require('validator');
const User = require('../Models/User');

function cleanUpAndValidate({email, username, phoneNumber, password}) {

    try {
        if(!validator.isEmail(email)) {
            throw "Invalid Email";
        }   

        if(username.length < 3) {
            throw "Username too short";
        }

        if(username.length > 30) {
            throw "Username too long";
        }

        if(phoneNumber && phoneNumber.length !== 10) {
            throw "Phone number not valid";
        }

        if(password && password < 6) {
            throw "Password too short";
        }

        if(password && !validator.isAlphanumeric(password)) {
            throw "Password should contain alphabet and numbers";
        }

        return {
            valid: true
        };
    }
    catch(err) {
        return {
            valid: false,
            error: err
        };
    }
}


AuthRouter.post('/register', async (req, res) => {

    const { email, username, password, name, phoneNumber, profilePic } = req.body;

    // Validate data
    const validData = cleanUpAndValidate({email, username, phoneNumber, password});

    if(!validData.valid) {
        return res.send({
            status: 400,
            message: "Invalid Data",
            error: validData.error
        });
    }

    // Validate if user is already registered

    const userAlreadyExists = await User.verifyUsernameAndEmailExists({username, email});

    if(userAlreadyExists.db_error) {
        return res.send({
            status: 401,
            message: "Database error",
            error: userAlreadyExists.error
        })
    }

    if(userAlreadyExists.valid) {
        return res.send({
            status: 400,
            message: "User already exists",
            error: userAlreadyExists.error
        })
    }

    // Save the data in db

    const user = new User( { email, username, password, name, phoneNumber, profilePic } );

    try {
        const dbUser = await user.registerUser();

        return res.send({
            status: 200,
            message: "Registration Successfull",
            data: dbUser
        })
    }
    catch(err) {
        return res.send({
            status: 401,
            message: "Internal error",
            error: err
        })
    }
})

AuthRouter.post('/login', (req, res) => {

})

module.exports = AuthRouter;