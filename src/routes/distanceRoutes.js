const express = require('express');
const router = express.Router();
const distanceController = require('../controllers/distanceController');

router.post('/distance', distanceController.handleDistance);

module.exports = router;
