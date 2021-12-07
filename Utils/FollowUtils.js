const ObjectId = require('mongodb').ObjectId;

function validateMongoUserIds(userIds) {

    userIds.forEach(userId => {
        
        if(!userId) {
            return false;
        }
    
        if(!ObjectId.isValid(userId)) {
            return false;
        }
    });

    return true;
}

module.exports = { validateMongoUserIds };