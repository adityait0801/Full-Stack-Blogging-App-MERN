// inbuilt middleware - express.router()

const { Router } = require('express')
const { BlogModel } = require('../models/Blog.model')
const { UserModel } = require('../models/User.model')

const blogRouter = Router()

blogRouter.get("/", async (req, res)=> {
    const blogs = await BlogModel.find();
    res.send({blogs : blogs});
})

blogRouter.post("/create", async (req, res)=> {
    const { title, description } = req.body;
    const author_id = req.user_id
    const user = await UserModel.findOne({_id:author_id})
    const new_blog = new BlogModel ({
        title, 
        description,
        author_name : user.name,
        author_email : user.email 
    })
    await new_blog.save();
    res.send("Blog Created");
})

//using email
// blogRouter.put("/edit/:blogID", async (req, res)=> {
//     const blogID = req.params.blogID; // to get the id from url
//     const payload = req.body; // to get the updated thing from user

//     const user_id = req.user_id;
//     const user = await UserModel.findOne({user_id})
//     const user_email = user.email

//     const blog = await BlogModel.findOne({blogID})
//     const blog_author_email = blog.author_email

//     if(user_email!==blog_author_email)
//     {
//         res.send("You are not Authorized to Change in this Blog")
//     }
//     else
//     {
//     await BlogModel.findByIdAndUpdate(blogID, payload);
//     res.send(`Blog ${blogID} updated`)
//     }
//     res.send("Blog Updated");
// })

//using id
blogRouter.put("/edit/:blogID", async (req, res)=> {
    const blogID = req.params.blogID; // to get the id from url
    const payload = req.body; // to get the updated thing from user

    const user_id = req.user_id;

    const blog = await BlogModel.findOne({_id : blogID})
    const blog_author_id = blog._id

    if(user_id!==blog_author_id)
    {
        res.send("You are not Authorized to Change in this Blog")
    }
    else
    {
    await BlogModel.findByIdAndUpdate(blogID, payload);
    res.send(`Blog ${blogID} updated`)
    }
    res.send("Blog Updated");
})

blogRouter.delete("/delete/:blogID", async (req, res)=> {
    const blogID = req.params.blogID; // to get the id from url
    const payload = req.body; // to get the updated thing from user

    const user_id = req.user_id;
    const user = await UserModel.findOne({user_id})
    const user_email = user.email

    const blog = await BlogModel.findOne({blogID})
    const blog_author_email = blog.author_email

    if(user_email!==blog_author_email)
    {
        res.send("You are not Authorized to Delete this Blog")
    }
    else
    {
    await BlogModel.findByIdAndDelete(blogID);
    res.send(`Blog ${blogID} deleted`)
    }
    res.send("Blog Deleted");
})

module.exports = { blogRouter }