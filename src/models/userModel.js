
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: false },
  address: { type: String, required: false },
  gender: { type: String, required: false },
  profilePic: { type: String, required: false },
      },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
