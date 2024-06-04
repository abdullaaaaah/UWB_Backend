const userModal = require("../models/userModel");
const User = require('../models/userModel'); // Adjust the import according to your project structure
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const formidable = require('formidable');
const fs = require('fs');
// Cloudinary configuration
cloudinary.config({
  cloud_name: "dcoajgeh5",
  api_key: "398428448442352",
  api_secret: "Rm7Sy0n4EWRx7MY20-i1SM2CCz0",
});

const uploadImageToCloudinary = async (filePath) => {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
      try {
          const result = await cloudinary.uploader.upload(filePath);
          return result;
      } catch (error) {
          console.error(`Attempt ${attempt + 1} failed:`, error);
          attempt++;
          if (attempt >= maxRetries) {
              throw error;
          }
      }
  }
};

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


exports.updateProfileController = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parsing error:', err);
        return res.status(500).send({
          success: false,
          message: 'An internal server error occurred.',
        });
      }

      // Convert fields from arrays to their expected types
      const email = fields.email ? fields.email[0] : null;
      const oldPassword = fields.oldPassword ? fields.oldPassword[0] : null;
      const name = fields.name ? fields.name[0] : null;
      const newPassword = fields.newPassword ? fields.newPassword[0] : null;
      const dateOfBirth = fields.dateOfBirth ? new Date(fields.dateOfBirth[0]) : null;
      const address = fields.address ? fields.address[0] : null;
      const gender = fields.gender ? fields.gender[0] : null;

      if (!email) {
        return res.status(400).send({
          success: false,
          message: 'Email is required to update profile',
        });
      }

      if (!name && !newPassword && !dateOfBirth && !address && !gender && !files.profilePic) {
        return res.status(400).send({
          success: false,
          message: 'Please provide at least one field to update',
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'User not found',
        });
      }

      const updates = {};

      // If new password is provided, validate old password
      if (newPassword) {
        if (!oldPassword) {
          return res.status(400).send({
            success: false,
            message: 'Old password is required to set a new password',
          });
        }

        // Verify the old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
          return res.status(401).send({
            success: false,
            message: 'Old password is incorrect',
          });
        }

        updates.password = await bcrypt.hash(newPassword, 10);
      }

      // Update other fields if provided
      if (name) updates.name = name;
      if (dateOfBirth) updates.dateOfBirth = dateOfBirth;
      if (address) updates.address = address;
      if (gender) updates.gender = gender;

      // Handle profile picture upload
      if (files.profilePic) {
        const result = await uploadImageToCloudinary(files.profilePic.path);

        // Remove the file from the server after uploading
        fs.unlinkSync(files.profilePic.path);

        updates.profilePic = result.secure_url;
      }

      const updatedUser = await User.findByIdAndUpdate(user._id, updates, { new: true });

      return res.status(200).send({
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser,
      });
    });
  } catch (error) {
    console.error('Error in Update Profile Controller', error);
    return res.status(500).send({
      success: false,
      message: 'An internal server error occurred.',
    });
  }
};



// exports.updateProfileController = async (req, res) => {
//   try {
//     const { email, oldPassword, name, newPassword, dateOfBirth, address, gender } = req.body;

//     if (!email) {
//       return res.status(400).send({
//         success: false,
//         message: "Email is required to update profile",
//       });
//     }

//     if (!name && !newPassword && !dateOfBirth && !address && !gender) {
//       return res.status(400).send({
//         success: false,
//         message: "Please provide at least one field to update",
//       });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).send({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const updates = {};

//     // If new password is provided, validate old password
//     if (newPassword) {
//       if (!oldPassword) {
//         return res.status(400).send({
//           success: false,
//           message: "Old password is required to set a new password",
//         });
//       }

//       // Verify the old password
//       const isMatch = await bcrypt.compare(oldPassword, user.password);
//       if (!isMatch) {
//         return res.status(401).send({
//           success: false,
//           message: "Old password is incorrect",
//         });
//       }

//       updates.password = await bcrypt.hash(newPassword, 10);
//     }

//     // Update other fields if provided
//     if (name) updates.name = name;
//     if (dateOfBirth) updates.dateOfBirth = dateOfBirth;
//     if (address) updates.address = address;
//     if (gender) updates.gender = gender;

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

exports.getProfileController = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required to get profile data",
      });
    }

    const user = await User.findOne({ email }).select('-password'); // Exclude password field

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).send({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error in Get Profile Controller", error);
    return res.status(500).send({
      success: false,
      message: "An internal server error occurred.",
    });
  }
};

