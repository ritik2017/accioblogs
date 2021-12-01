const BlogsSchema = require('../Schemas/Blogs');

const Blogs = class {
    title;
    bodyText;
    userId;
    creationDatetime;
    constructor({title, bodyText, userId, creationDatetime}) {
        this.title = title;
        this.bodyText = bodyText;
        this.userId = userId;
        this.creationDatetime = creationDatetime;
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

    static getBlogs() {
        return new Promise(async (resolve, reject) => {
            try {
                const dbBlogs = await BlogsSchema.find().sort({creationDatetime: -1});
                resolve(dbBlogs);                
            }
            catch(err) {
                reject(err);
            }
        })
    }
}

module.exports = Blogs;