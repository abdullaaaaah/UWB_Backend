const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');
const {storage} = require('../services/storage');


const upload = multer({ storage });

router.post('/signup', userController.registerController);
router.post('/login', userController.loginController);
router.post('/logout', userController.logoutController);
router.post('/updateprofile', upload.single('profilePic'), userController.updateProfileController);
router.get('/getProfile', userController.getProfileController);
module.exports = router;
