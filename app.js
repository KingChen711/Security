//jshint esversion:6
require("dotenv").config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const md5 = require('md5');




const app = express();




app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");




mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });




const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);




app.get("/", (req, res) => {
  res.render("home");
})




app.get("/login", (req, res) => {
  res.render("login");
})




app.get("/register", (req, res) => {
  res.render("register");
})



app.post("/login", (req, res) => {
  User.findOne({ email: req.body.username }, (err, foundUser) => {
    if (err) console.log(err);
    else {
      if (foundUser) {
        if (foundUser.password === md5(req.body.password))
          res.render("secrets");
      }
    }
  })
})





app.post("/register", (req, res) => {
  User.findOne({ email: req.body.username }, (err, foundUser) => {
    if (err) console.log(err);
    else if (foundUser) res.send("This email has already been registered.");
    else {
      const newAccount = new User({
        email: req.body.username,
        password: md5(req.body.password)
      });

      newAccount.save();
      res.render("secrets");
    }
  })
})




app.listen(3000, () => {
  console.log("listening on port 3000");
})





