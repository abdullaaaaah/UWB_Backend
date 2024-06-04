const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.registerController);
router.post('/login', userController.loginController);
router.post('/logout', userController.logoutController);
router.post('/updateprofile', userController.updateProfileController);
router.get('/getProfile', userController.getProfileController);
module.exports = router;
