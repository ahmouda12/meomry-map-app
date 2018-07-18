const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  facebookID: String,
  googleID: String
});

userSchema.set('timestamps', true);

const User = mongoose.model("User", userSchema);

module.exports = User;