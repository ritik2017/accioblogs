const BlogsSchema = require('../Schemas/Blogs');
const constants = require('../constants');
const ObjectId = require('mongodb').ObjectId

const Blogs = class {
    title;
    bodyText;
    userId;
    creationDatetime;
    blogId;
    constructor({blogId, title, bodyText, userId, creationDatetime}) {
        this.title = title;
        this.bodyText = bodyText;
        this.userId = userId;
        this.creationDatetime = creationDatetime;
        this.blogId = blogId;
    }

    createBlog() {
        return new Promise(async (resolve, reject) => {
            this.title.trim();
            this.bodyText.trim();

            const blog = new BlogsSchema({
                title: this.title,
                bodyText: this.bodyText,
                userId: this.userId,
                creationDatetime: this.creationDatetime
            })

            try {
                const dbBlog = await blog.save();
                resolve(dbBlog);
            }
            catch(err) {
                reject(err);
            }
        })
    }

    static getBlogs({offset}) {
        return new Promise(async (resolve, reject) => {
            try {
                // const dbBlogs = await BlogsSchema.find().sort({creationDatetime: -1});

                const dbBlogs = await BlogsSchema.aggregate([
                    { $sort: { "creationDatetime": -1 } },
                    { $facet: {
                        data: [{ "$skip": parseInt(offset) }, { "$limit": constants.BLOGSLIMIT }]
                    } }
                ])
                resolve(dbBlogs);                
            }
            catch(err) {
                reject(err);
            }
        })
    }

    static myBlogs({userId, offset}) {
        return new Promise(async (resolve, reject) => {
            try {
                // const dbBlogs = await BlogsSchema.find().sort({creationDatetime: -1});

                const dbBlogs = await BlogsSchema.aggregate([
                    { $match: { userId: ObjectId(userId) } },
                    { $sort: { "creationDatetime": -1 } },
                    { $facet: {
                        data: [{ "$skip": parseInt(offset) }, { "$limit": constants.BLOGSLIMIT }]
                    } }
                ])
                resolve(dbBlogs);                
            }
            catch(err) {
                reject(err);
            }
        })
    }

    getUserIdOfBlog() {
        return new Promise(async (resolve, reject) => {
            const blogUserId = await BlogsSchema.aggregate([
                { $match: {_id: ObjectId(this.blogId)} },
                { $project: { userId: 1 } }
            ])
            resolve(blogUserId[0].userId);
        })
    }
}

module.exports = Blogs;