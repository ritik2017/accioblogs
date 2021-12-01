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

    const offset = req.query.offset || 0;

    try {
        const dbBlogs = await Blogs.getBlogs({offset});

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

BlogsRouter.get('/my-blogs/:userId/:offset', async (req, res) => {

    const userId = req.params.userId;
    const offset = req.params.offset || 0;

    console.log(userId, offset);

    try {
        const dbBlogs = await Blogs.myBlogs({userId, offset});

        return res.send({
            status: 200,
            message: "Successful",
            data: dbBlogs
        })
    }
    catch(err) {
        return res.send({
            status: 400,
            message: "Internal error occured",
            error: err
        })
    }
})

BlogsRouter.post('/edit-blog', async (req, res) => {

    const { title, bodyText } = req.body.data;
    const blogId = req.body.blogId;
    const userId = req.body.userId; // req.session.user.userId

    // User is allowed to edit this blog - If he has created the blog
    // Check the creationDatetime is within 30 mins
    // Update the blog in db

    try {
        
        const blog = new Blogs({blogId});
        const blogUserId = await blog.getUserIdOfBlog();

        console.log(blogUserId, "  ", userId);

        if(blogUserId != userId) {
            return res.send({
                status: 404,
                message: "Not allowed to edit",
                error: "Blog belong to some other user"
            })
        }

        return res.send({
            status: 200,
            message: "Edit Successful",
            data: {}
        })

    }
    catch(err) {
        res.send({
            status: "400",
            message: "Failed to edit the blog",
            error: err
        })
    }
})

module.exports = BlogsRouter;