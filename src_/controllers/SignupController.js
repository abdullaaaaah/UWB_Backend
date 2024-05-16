const { storeUser } = require('../services/mongodbService');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const signupController = {};

signupController.signup = async (req, res) => {
  // Validate the received data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password, dob, gender } = req.body;

  try {
    // Check if the email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create a new user instance
    user = new User({
      firstName,
      lastName,
      email,
      password,
      dob,
      gender
    });

    // Save the user to MongoDB
    await storeUser(user);

    // Respond with a success message
    return res.status(200).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Error signing up:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = signupController;
