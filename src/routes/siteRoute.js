const express = require('express');
const router = express.Router();
const multer = require('multer');
const { addSite, getSiteByName,getSiteByNameAndEmail ,getAllSitesByEmail,deleteSiteByName,deleteSiteByNameAndEmail} = require('../controllers/siteController');
const {storage} = require('../services/storage');

const upload = multer({ storage });

router.post('/sites', upload.single('image'), addSite);
router.get('/sites',getAllSitesByEmail);
router.get('/sitesDetail', getSiteByNameAndEmail);
router.get('/sites',getSiteByName);
router.delete('/sites', deleteSiteByName); // New route
router.delete('/sites', deleteSiteByNameAndEmail); // New route

module.exports = router;
