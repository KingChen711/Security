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




const secretSchema = new mongoose.Schema({
  content: String,
})

const Secret = mongoose.model("Secret", secretSchema);




const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  secrets: [secretSchema]
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




app.get("/:username/secrets", (req, res) => {
  res.render("secrets", { username: req.params.username });
})




app.post("/login", (req, res) => {
  User.findOne({ email: req.body.username }, (err, foundUser) => {
    if (err) console.log(err);
    else {
      if (foundUser) {
        if (foundUser.password === md5(req.body.password))
          res.redirect(`/${req.body.username}/secrets`);
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
        password: md5(req.body.password),
        secrets: [],
      });

      newAccount.save();
      res.redirect(`/${req.body.username}/secrets`);
    }
  })
})




app.route("/:username/submit")

  .get((req, res) => {
    res.render("submit", { username: req.params.username })
  })

  .post((req, res) => {
    const newSecret = new Secret({
      content: req.body.secret
    })
    User.findOne({ email: req.params.username }, (err, foundUser) => {
      if (err) console.log(err);
      else {
        foundUser.secrets.push(newSecret);
        foundUser.save();
      }
    })
    res.redirect(`/${req.params.username}/secrets`)
  })




app.get("/logout", (req, res) => {
  res.redirect("/");
})




app.listen(3000, () => {
  console.log("listening on port 3000");
})





