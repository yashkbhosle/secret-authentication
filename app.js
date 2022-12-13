//jshint esversion:6
require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email:String,
    password:String
})

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});
const User = new mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
    res.render("home");
})

app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/register",(req,res)=>{
    res.render("register");
})

app.post("/register",(req,res)=>{
    const userData = new User({
        email:req.body.username,
        password:req.body.password
    })
    userData.save((err)=>{
        if(!err){
            res.render("secrets");
        }
    });
    
})

app.post("/login",(req,res)=>{
    
    User.findOne({email:req.body.username},(err,found)=>{
        if(err){
            console.log(err);
        } else{
            if(found){
                if(found.password === req.body.password){
                    res.render("secrets");
                } else{
                    res.send("User not found or invalid password, please try to login again")
                }
            }
        }
    })
})
app.get("/logout",(req,res)=>{
    res.redirect("/");
})

app.listen(3000);