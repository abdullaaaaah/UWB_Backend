const express = require('express');
const router = express.Router();
const multer = require('multer');
const { addSite, getSiteById, getSiteByName } = require('../controllers/siteController');

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

router.post('/sites', upload.single('image'), addSite);
router.get('/sites/:id', getSiteById);
router.get('/sites/:name', getSiteByName);

module.exports = router;
