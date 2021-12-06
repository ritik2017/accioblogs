const express = require('express');
const FollowRouter = express.Router();
const ObjectId = require('mongodb').ObjectId;

const { followUser, followingUserId, followingUsers } = require('../Models/Follow');

FollowRouter.post('/follow-user', async (req, res) => {

    const followingUserId = req.body.followingUserId;
    const followerUserId = req.body.followerUserId; // req.session.user.userId

    if(!followingUserId || !followerUserId) {
        return res.send({
            status: 401,
            message: "Invalid data",
            error: "Missing follower or following"
        })
    }

    if(!ObjectId.isValid(followingUserId) || !ObjectId.isValid(followerUserId)) {
        return res.send({
            status: 401,
            message: "Invalid data",
            error: "Invalid mongo object id"
        })
    }

    try {
        const followDb = await followUser({followingUserId, followerUserId});

        return res.send({
            status: 200,
            message: "Follow Successful",
            data: followDb
        })
    }
    catch(err) {
        return res.send({
            status: 400,
            message: "Follow Unsuccessful",
            error: err
        })
    }
})

FollowRouter.post('/following', async (req, res) => {

    const followerUserId = req.body.followerUserId; // req.session.user.userId

    try {
        const followingDb = await followingUsers({ followerUserId });

        res.send({
            status: 200,
            message: "Successfull",
            data: followingDb
        })
    }
    catch(err) {
        res.send({
            status: 400,
            message: "Could not get following",
            error: err
        })
    }
})

module.exports = FollowRouter;