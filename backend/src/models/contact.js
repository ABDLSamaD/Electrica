const mongoose = require("mongoose");

const contactScheema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    phone: Number,
    message: String,
  },
  { timeStamp: true }
);

const contact = mongoose.model("Contact", contactScheema);
module.exports = contact;
