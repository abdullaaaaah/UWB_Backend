const express = require('express');
const router = express.Router();
const multitrilaterationController = require('../controllers/multitriController.js');

router.post('/multitrilaterate', multitrilaterationController.performTrilateration);

module.exports = router;
