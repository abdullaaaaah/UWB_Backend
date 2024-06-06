const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');
// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  const upload = multer({ storage });

router.post('/signup', userController.registerController);
router.post('/login', userController.loginController);
router.post('/logout', userController.logoutController);
router.post('/updateprofile', upload.single('profilePic'), userController.updateProfileController);
router.get('/getProfile', userController.getProfileController);
module.exports = router;
