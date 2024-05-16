const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.post('/signup', userController.registerController);
router.post('/login', userController.loginController);
router.post('/logout', userController.logoutController);

module.exports = router;
