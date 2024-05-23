const express = require('express');
const router = express.Router();
const multer = require('multer');
const { addSite, getSiteByName,getSiteByNameAndEmail ,getAllSitesByEmail,deleteSiteByName,deleteSiteByNameAndEmail} = require('../controllers/siteController');

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
router.get('/sites',getAllSitesByEmail);
router.get('/sitesDetail', getSiteByName);
router.get('/sites',getSiteByNameAndEmail);
router.delete('/sites', deleteSiteByName); // New route
router.delete('/sites', deleteSiteByNameAndEmail); // New route

module.exports = router;
