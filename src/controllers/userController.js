const userModal = require("../models/userModel");
const bcrypt = require("bcrypt");
const User = require('../models/userModel'); // Adjust the import according to your project structure

exports.registerController = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);

    const {
      name,
     email,
      password,
    } = req.body;

    if (!name || !email || !password) {
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
      name,
      email,
      password: hashedPassword,
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
    const { email, password } = req.body;
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

// exports.updateProfileController = async (req, res) => {
//   try {
//     const { email, oldPassword, name, newPassword } = req.body;

//     if (!email || !oldPassword) {
//       return res.status(400).send({
//         success: false,
//         message: "Email and old password are required to update profile",
//       });
//     }

//     if (!name && !newPassword) {
//       return res.status(400).send({
//         success: false,
//         message: "Please provide a name or new password to update",
//       });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).send({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Verify the old password
//     const isMatch = await bcrypt.compare(oldPassword, user.password);
//     if (!isMatch) {
//       return res.status(401).send({
//         success: false,
//         message: "Old password is incorrect",
//       });
//     }

//     const updates = {};
//     if (name) updates.name = name;
//     if (newPassword) updates.password = await bcrypt.hash(newPassword, 10);

//     const updatedUser = await User.findByIdAndUpdate(user._id, updates, { new: true });

//     return res.status(200).send({
//       success: true,
//       message: "Profile updated successfully",
//       user: updatedUser,
//     });
//   } catch (error) {
//     console.log("Error in Update Profile Controller", error);
//     return res.status(500).send({
//       success: false,
//       message: "An internal server error occurred.",
//     });
//   }
// };

exports.updateProfileController = async (req, res) => {
  try {
    const { email, oldPassword, name, newPassword, dateOfBirth, address, gender } = req.body;

    if (!email || !oldPassword) {
      return res.status(400).send({
        success: false,
        message: "Email and old password are required to update profile",
      });
    }

    if (!name && !newPassword && !dateOfBirth && !address && !gender) {
      return res.status(400).send({
        success: false,
        message: "Please provide at least one field to update",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Verify the old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const updates = {};
    if (name) updates.name = name;
    if (newPassword) updates.password = await bcrypt.hash(newPassword, 10);
    if (dateOfBirth) updates.dateOfBirth = dateOfBirth;
    if (address) updates.address = address;
    if (gender) updates.gender = gender;

    const updatedUser = await User.findByIdAndUpdate(user._id, updates, { new: true });

    return res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error in Update Profile Controller", error);
    return res.status(500).send({
      success: false,
      message: "An internal server error occurred.",
    });
  }
};
