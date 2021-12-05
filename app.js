require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");

app.use(express.json());
app.use(cookieParser())

const User = require("./model/user");

// all the router
app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

// ------------------------------------------------register route--------------------------------------------------

// this is for registering the user:
// get all the information
// heck mandatory fields
// already registered
// take care of the password
// generate token or send success message.

app.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!(first_name, last_name, email, password)) {
      res.status(400).send("All the fields are required");
    }

    const existinguser = await User.findOne({ email });

    if (existinguser) {
      res.status(400).send("user alreay registered");
    }

    const Encpassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: Encpassword,
    });
    // token creation:

    token = jwt.sign({ user_id: user._id }, process.env.SECRET, {
      expiresIn: "2h",
    });

    user.token = token;
    // update or not

    // TODO: handel password situation
    user.password = undefined;
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
});

// ------------------------------------------------login route--------------------------------------------------

// get all the information
// check mandatory fileds
// user user form database
// compare and verify password
// give token other information to the user
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("fileds is missing");
    }

    const user = await User.findOne({ email });

    // if(!user){
    //   res.status(400).send("you are not register to the site")
    // }

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ user_id: user._id, email }, process.env.SECRET, {
        expiresIn: "2h",
      });

      user.token = token;
      user.password = undefined;
      // res.status(200).json(user);

      // if you want ot send the cookie
      const options = {
        expires: new Date(Date.now() + 30 * 1000),
        httpOnly: true,
      };

      res.status(200).cookie('token', token, options).json({
        suceess:true,
        token,
        user
      })
    }

    res.status(400).send("email or password is incorrect");
  } catch (error) {
    console.log(error);
  }
});
// ------------------------------------------------------------------------------------------------------------
app.get("/dashboard", auth, (req, res) => {
  res.send("Welcome to the dashboard");
});

module.exports = app;
