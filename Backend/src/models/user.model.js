const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    tyepe: String,
    required: [true, "username is require"],
    unique: [true, "username must be unique"],
  },

  email: {
    tyepe: String,
    required: [true, "email is require"],
  },

  password: {
    tyepe: String,
    required: [true, "password is require"],
    unique: [true, "password  must be unique"],
  },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
