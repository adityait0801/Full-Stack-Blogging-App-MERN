const express = require('express')
const {connection} = require('./config/db')

const app = express()

app.use(express.json())

app.get("/", (req, res)=> {
    res.send("This is the Base API end point");
})

app.post("/signup", (req, res)=> {
    const {name, email, password, age, phone_number} = req.body;
    console.log(req.body);
})

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