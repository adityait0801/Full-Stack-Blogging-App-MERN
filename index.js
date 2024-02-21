const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {connection} = require('./config/db')
const {UserModel} = require('./models/User.model')
const { blogRouter } = require('./routes/blogs.routes')
const { authentication } = require('./middlewares/authentication')


const app = express()

app.use(express.json())

app.get("/", (req, res)=> {
    res.send("This is the Base API end point");
})

app.post("/signup", async (req, res)=> {
    const {name, email, password, age, phone_number} = req.body;
    bcrypt.hash(password, 8, async (err, hash) => {
     const new_user = new UserModel ({
        name, 
        email,
        password : hash,
        age,
        phone_number
     })
     try{
    await new_user.save();
    res.send({msg :"User inserted Successfully", new_user})
     }
     catch(err)
     {
        res.status(500).send("Something went wrong");
     }
    });
})


app.post("/login", async (req,res)=> {
    const {email, password} = req.body;
    const user = await UserModel.findOne({email});
    const hashed_password = user?.password;
    
    if(!user)
    {
        res.send("Login again! Invalid Credentials")
    }

    bcrypt.compare(password, hashed_password, (err, result)=> {
        if(result)
        {
            const token = jwt.sign({user_id :user._id}, 'shhhhh');
            res.send({"message" : "login successfull", "token": token});
            
        }
        else
        {
            res.send("Login again! Invalid Credentials")
        }
    })
    
})

//When ever blogs request are coming this sends them to blogs router
app.use("/blogs", authentication, blogRouter)

app.listen(7500, async()=> {
    try
        {
        await connection;
        console.log("Connected to DB Successfully");
        }
    catch(err)
        {
            console.log("Error while connecting to DB");
            console.log(err);
        }
    console.log("listening on port 7500");
})