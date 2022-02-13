
require("dotenv").config({debug:true});


const express =require ("express");
const ejs =require ("ejs");
const bodyParser =require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
const mongoose =require("mongoose");
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});
const encrypt = require("mongoose-encryption");
//creating object with mongoose Schema class
const userSchema = new mongoose.Schema({
  email:   String,
  password : String
});
// accessing secret  key
console.log(process.env.API_KEY);

userSchema.plugin( encrypt, { secret:process.env.SECRET, encryptedFields:["password"] });

const User = mongoose.model("User",userSchema);

app.get("/",function(req,res){

  res.render("home");
});

app.get("/login",function(req,res){

  res.render("login");
});
app.get("/register",function(req,res){

  res.render("register");
});
app.post("/register",function(req,res){
    const newUser = new User({
      email    : req.body.username,
      password : req.body.password
    });
    newUser.save(function(err){
      if(!err){
         res.render("secrets");
      }else{
        console.log(err);
      }
    });
});
app.post("/login",function(req,res){

  User.findOne(
    {email:req.body.username},
    function(err,foundUser){
      if(err){
        console.log(err);
      }else{
        if(foundUser){
          if(foundUser.password===req.body.password){
            res.render("secrets");
          }else{
            console.log(err);
          }

        }

      }
    }


   )
});










app.listen(3000,function(req,res){

  console.log("Successfulyy server is running on port 3000");
})
