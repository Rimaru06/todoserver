const express = require("express")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose");
require('dotenv').config();


const checkEmail = require("./middleware/checkemail");
const connectToMongo = require("./db")

connectToMongo();
const app = express()
app.use(express.json())


const PORT = process.env.PORT || 5000
const jwtPassword = process.env.jwtPassword || ""


const signInUpSchema = mongoose.model("signData", {
    name: String,
    username: String,
    password: String,
    email: String
})
const todoSchema = mongoose.model("todoData", {
    id: String,
    name: String,
    task: String

})
async function isexist(req, res, next) {
    const email = req.body.email;
    try {
        const data = await signInUpSchema.findOne({ email: email });
        if (data) {
            throw new Error("Email already exists");
        }
        else {
            next();
        }
    } catch (error) {
        res.status(409).send({ error: error.message })
    }
}
// Route 1 = signup authentication not required
app.post('/signup', checkEmail, isexist, (req, res) => {
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const userdetail = new signInUpSchema({
        name: name,
        username: username,
        password: password,
        email: email
    })
    userdetail.save();
    res.status(200).json({
        "message": "your account is  successfully created"
    })
})

// Route 2 : signIn authentication required
app.post('/signin', checkEmail,async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const data = await signInUpSchema.findOne({email : email})
    if (data)
    {
        var token = jwt.sign({ email: email } , jwtPassword);
        res.json({
            token
        })
    }
    else
    {
        res.status(403).json({"msg" : "user does not exits"})
    }

})

app.post("/addtask" , (req,res)=>{
    const auth = req.headers.authorization;
    const id = req.body.id;
    const name = req.body.name;
    const task = req.body.task;
    try {
        const decoded  = jwt.verify(auth, jwtPassword)
        const taskdetail = new todoSchema({
            id : id,
            name : name,
            task : task
        })
        taskdetail.save();
        res.status(200).json({
            "message": "task is succesfully added"
        })

    } catch (error) {
        return res.status(403).json({
            "message" : "authorization failed",
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
