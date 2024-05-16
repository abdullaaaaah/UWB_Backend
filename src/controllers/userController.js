// const userModal = require("../models/userModel");
// const bcrypt = require("bcrypt");
// const User = require('../models/userModel'); // Adjust the import according to your project structure

// exports.registerController = async (req, res) => {
//   try {
//     console.log("Incoming request body:", req.body);

//     // Destructure and map the incoming fields to the desired variable names
//     const {
//       'first-name': firstName,
//       'last-name': lastName,
//       'email-address': email,
//       password,
//       'date-of-birth': dateOfBirth,
//       gender
//     } = req.body;

//     // Check if any field is missing
//     if (!firstName || !lastName || !email || !password || !dateOfBirth || !gender) {
//       return res.status(400).send({
//         success: false,
//         message: "Please fill all fields",
//       });
//     }

//     // Check for existing user
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(401).send({
//         success: false,
//         message: "User already exists",
//       });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Save the new user
//     const user = new User({
//       firstname: firstName,
//       lastname: lastName,
//       email,
//       password: hashedPassword,
//       dateofbirth: dateOfBirth,
//       gender,
//     });

//     await user.save();
//     console.log("User saved successfully:", user);

//     // Respond with success message
//     return res.status(201).send({
//       success: true,
//       message: "New user created",
//       user,
//     });
//   } catch (error) {
//     console.log("Error in Register Controller", error);
//     return res.status(500).send({
//       success: false,
//       message: "An internal server error occurred.",
//     });
//   }
// };

// exports.loginController = async (req, res) => {
//   console.log(req.body);
//   try {
//     const { 'email-address': email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).send({
//         success: false,
//         message: "Please provide email and password.",
//       });
//     }
//     const user = await userModal.findOne({ email });
//     if (!user) {
//       return res.status(404).send({
//         success: false,
//         message: "Email is not registered.",
//       });
//     }
//     // Compare hashed passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).send({
//         success: false,
//         message: "Invalid email or password.",
//       });
//     }
//     return res.status(200).send({
//       success: true,
//       message: "Login successful",
//       user,
//     });
//   } catch (error) {
//     console.log("Error in login Controller", error);
//     return res.status(500).send({
//       success: false,
//       message: "An internal server error occurred.",
//     });
//   }
// };

// exports.forgetController = (req, res) => {};

const userModal = require("../models/userModel");
const bcrypt = require("bcrypt");
const User = require('../models/userModel'); // Adjust the import according to your project structure

exports.registerController = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);

    const {
      'first-name': firstName,
      'last-name': lastName,
      'email-address': email,
      password,
      'date-of-birth': dateOfBirth,
      gender
    } = req.body;

    if (!firstName || !lastName || !email || !password || !dateOfBirth || !gender) {
      return res.status(400).send({
        success: false,
        message: "Please fill all fields",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).send({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstname: firstName,
      lastname: lastName,
      email,
      password: hashedPassword,
      dateofbirth: dateOfBirth,
      gender,
    });

    await user.save();
    console.log("User saved successfully:", user);

    return res.status(201).send({
      success: true,
      message: "New user created",
      user,
    });
  } catch (error) {
    console.log("Error in Register Controller", error);
    return res.status(500).send({
      success: false,
      message: "An internal server error occurred.",
    });
  }
};

exports.loginController = async (req, res) => {
  console.log(req.body);
  try {
    const { 'email-address': email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please provide email and password.",
      });
    }
    const user = await userModal.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid email or password.",
      });
    }

    req.session.userId = user._id; // Save user ID in session

    return res.status(200).send({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.log("Error in login Controller", error);
    return res.status(500).send({
      success: false,
      message: "An internal server error occurred.",
    });
  }
};

exports.logoutController = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({
        success: false,
        message: "Failed to log out",
      });
    }
    res.clearCookie('connect.sid'); // Clear the cookie
    return res.status(200).send({
      success: true,
      message: "Logout successful",
    });
  });
};

exports.forgetController = (req, res) => {};
