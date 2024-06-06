const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {storage} = require('../services/storage');
const multer = require('multer');


const upload = multer({ storage });

router.post('/signup', userController.registerController);
router.post('/login', userController.loginController);
router.post('/logout', userController.logoutController);
router.post('/updateprofile', upload.single('upload'), userController.updateProfileController);
router.get('/getProfile', userController.getProfileController);

module.exports = router;
