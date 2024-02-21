const { BlogModel } = require("../models/Blog.model");
const jwt = require('jsonwebtoken')


const authentication = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]

    if(!token)
    {
        res.send("Please Login again");
    }
    else
    {
        jwt.verify(token, 'shhhhh', async(err, decoded)=> {
            if(err)
            {
                res.send("Invalid Credential! ")
            }
            else
            {
                const user_id = decoded.user_id;
                // const user = await BlogModel.findOne({user_id})
                 req.user_id = user_id; //here we will have info about the user
                next();
            }
        })
    }
}

module.exports = { authentication }