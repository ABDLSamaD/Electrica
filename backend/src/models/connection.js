const mongoose = require("mongoose");
require("dotenv").config();

const mongooseConnection = async () => {
  try {
    mongoose
      .connect(process.env.MONGO_URL)
      .then(() => {
        console.log("Connect Database");
      })
      .catch((err) => {
        console.log(err.message + "not connect");
      });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = mongooseConnection;
