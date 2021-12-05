const mongoose = require("mongoose");

const MONGODB = process.env.MONGODB_URL
require("dotenv").config();


exports.connect = () =>{
mongoose.connect(MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
      console.log("DB connects succesfully")
  )
  .catch((error) => {
    console.log("error in a DB");
    console.log(error);
    process.exit(1)
  });}
