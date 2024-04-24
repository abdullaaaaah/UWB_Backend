const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

router.post('/dataupload', dataController.handleData);

module.exports = router;
