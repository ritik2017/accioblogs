const express = require('express');
const BlogsRouter = express.Router();
const Blogs = require('../Models/Blogs');
const User = require('../Models/User');

BlogsRouter.post('/create-blog', async (req, res) => {
    const userId = req.body.userId;
    let title = req.body.title;
    let bodyText = req.body.bodyText; 
    const creationDatetime = new Date();

    if(!userId) {
        return res.send({
            status: 401,
            message: "Invalid userId"
        })
    }

    if(!title || !bodyText || typeof(title) != "string" || typeof(bodyText) != "string") {
        return res.send({
            status: 401,
            message: "Invalid data"
        })
    }

    if(title.length > 50) {
        return res.send({
            status: 401,
            message: "Title too long"
        })
    }

    if(bodyText.length > 1000) {
        return res.send({
            status: 401,
            message: "Blog too long"
        })
    }

    try {
        await User.verifyUserId({userId});
    }
    catch(err) {
        return res.send({
            status: 402,
            message: "Error Occured",
            error: err
        })
    }

    const blog = new Blogs({title, bodyText, userId, creationDatetime});
    
    try {
        const dbBlog = await blog.createBlog();
        return res.send({
            status: 200,
            message: "Blog Created Successfully",
            data: dbBlog 
        })
    }
    catch(err) {
        return res.send({
            status: 400,
            message: "Error Occured",
            error: err
        })
    }
})

BlogsRouter.get('/get-blogs', async (req, res) => {
    try {
        const dbBlogs = await Blogs.getBlogs();

        res.send({
            status: 200,
            message: "Successful",
            data: dbBlogs
        })
    }
    catch(err) {
        res.send({
            status: 401,
            message: "Error Occured",
            error: err
        })
    }
})

module.exports = BlogsRouter;