const express = require("express");
const {
  registerController,
  loginController,
  forgetController,
} = require("../controllers/userController");

const route = express.Router();

//Create User || POST

route.post("/signup", registerController);

//Login || POST

route.post("/login", loginController);

//Forgotten password || put

route.put("/forget", forgetController);

module.exports = route;