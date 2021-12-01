const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    bodyText: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    creationDatetime: {
        type: String,
        required: true
    },
    images: [String]
})

module.exports = mongoose.model('Blogs', blogsSchema);

