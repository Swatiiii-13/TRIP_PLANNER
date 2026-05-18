const express = require('express');
const router = express.Router();
const { getTransportOptions } = require('../controllers/transportController');

router.get('/:destination', getTransportOptions);

module.exports = router;
