//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mogoose = require("mongoose");
const encrypt = require("mongoose-encryption");
mogoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});

app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

const userSchema = new mogoose.Schema({
    email : String,
    password : String
});
const User = new  mogoose.model("user", userSchema);


userSchema.plugin(encrypt, {secret: process.env.SECRET});

app.get("/", (req, res)=>{
    res.render("home.ejs");
})

app.get("/login", (req, res)=>{
    res.render("login.ejs");
})

app.get("/register", (req, res)=>{
    res.render("register.ejs");
})

app.listen(3000, ()=>{
    console.log("Server started at port 3000");
})

app.post("/register", (req, res)=>{
    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    });
    newUser.save((err)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets.ejs");
        }
       
    });
})

app.post("/login", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email :username}, (err, data)=>{
        if(err){
            console.log(err);
        }
        else{
            if(data){
                if(data.password === password){
                    res.render("secrets.ejs");
                }
            }
        }
    })

})