const express = require('express');
const router = express.Router();
const trilaterationController = require('../controllers/trilaterationController');

router.post('/trilaterate', trilaterationController.performTrilateration);

module.exports = router;
