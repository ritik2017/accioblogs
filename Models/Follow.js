const FollowSchema = require('../Schemas/Follow');

function followUser({ followingUserId, followerUserId }) {
    return new Promise(async (resolve, reject) => {
        const follow = new FollowSchema({
            followingUserId,
            followerUserId
        })

        try {
            const followDb = await follow.save();

            resolve(followDb);
        }
        catch(err) {
            reject(err);
        }
    })
}   

function followingUsers({ followerUserId }) {
    return new Promise(async (resolve, reject) => {

        try {
            const following = await FollowSchema.find({ followerUserId });

            resolve(following);
        }
        catch(err) {
            reject(err);
        }
    })
}

module.exports = { followUser, followingUsers };