// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     firstname: {
//       type: String,
//       required: [true, "First Name is required"],
//     },
//     lastname: {
//       type: String,
//       required: [true, "Last Name is required"],
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//     },
//     dateofbirth: {
//       type: Date,
//       required: [true, "Date of birth is required"],
//     },
//     gender: {
//       type: String,
//       required: [true, "Gender is required"],
//     },
//     trackdata: [
//       {
//         type: mongoose.Types.ObjectId,
//         ref: "TrackingData",
//       },
//     ],
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", userSchema);

// module.exports = User;
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
