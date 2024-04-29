const express = require('express');
const router = express.Router();
const multipledistanceController = require('../controllers/multipledistanceController');

router.post('/multipleDistance', multipledistanceController.handleMultipleDistance);

module.exports = router;
